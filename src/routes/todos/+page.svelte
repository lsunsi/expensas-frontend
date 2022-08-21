<script lang="ts">
    import type { PageData } from "./$types";
    import { goto } from "$app/navigation";
    import {
        postExpenseConfirm,
        postExpenseRefuse,
        getList,
        ListItemKind,
        postTransferConfirm,
        postTransferRefuse,
    } from "../../client";
    import { Meta } from "@smui/list";
    import Layout from "../../components/layout.svelte";
    import Button from "@smui/button";
    import { formatCents, formatPerson, formatLabel, formatSplit, formatMonth } from "../../format";
    import Accordion, { Panel, Header, Content } from "@smui-extra/accordion";

    export let data: PageData;
    $: list = data.list;

    const opens: { [n: number]: boolean } = {};

    const setFirstMonthOpen = () => {
        opens[list.months[0].n] = true;
    };

    $: if (list.pendings.length === 0 && list.months.length > 0) {
        setFirstMonthOpen();
    }

    async function reload() {
        list = await getList(fetch);
    }

    async function confirmExpense(id: number) {
        try {
            await postExpenseConfirm(id);
            await reload();
        } catch {
            await goto("/caroco");
        }
    }

    async function refuseExpense(id: number) {
        try {
            await postExpenseRefuse(id);
            await reload();
        } catch {
            await goto("/caroco");
        }
    }

    async function confirmTransfer(id: number) {
        try {
            await postTransferConfirm(id);
            await reload();
        } catch {
            await goto("/caroco");
        }
    }

    async function refuseTransfer(id: number) {
        try {
            await postTransferRefuse(id);
            await reload();
        } catch {
            await goto("/caroco");
        }
    }

    async function refresh() {
        try {
            await reload();
        } catch (e) {
            await goto("/caroco");
        }
    }
</script>

<svelte:head>
    <title>os custo tudo</title>
</svelte:head>

<Layout tab="list" on:refresh={refresh} refreshable>
    {#if list.pendings.length > 0}
        <Accordion style="margin: 8px">
            {#each list.pendings as e}
                <Panel variant="outlined" color="primary">
                    {#if e.t === ListItemKind.enum.Expense}
                        <Header>
                            <span class="header">
                                <span>{formatLabel(e.c.label)}</span>
                                <Meta class="material-icons">
                                    {#if e.c.yours}
                                        hourglass_empty
                                    {:else}
                                        priority_high
                                    {/if}
                                </Meta>
                                <span>{formatCents(e.c.spent)}</span>
                            </span>
                        </Header>
                        <Content>
                            <div class="pending-content">
                                <div class="pending-text">
                                    <div>total de {formatCents(e.c.paid)}</div>
                                    <div>pago por {formatPerson(e.c.payer)}</div>
                                    <div>no dia {e.c.date.toLocaleDateString()}</div>
                                    <div>em divisão {formatSplit(e.c.split)}</div>
                                    {#if e.c.detail !== null}
                                        <div>detalhes: {e.c.detail}</div>
                                    {/if}
                                </div>

                                {#if !e.c.yours}
                                    <div class="pending-actions">
                                        <Button
                                            on:click={() => refuseExpense(e.c.id)}
                                            variant="outlined"
                                        >
                                            Nope
                                        </Button>
                                        <Button
                                            on:click={() => confirmExpense(e.c.id)}
                                            variant="unelevated"
                                        >
                                            Ok!
                                        </Button>
                                    </div>
                                {/if}
                            </div>
                        </Content>
                    {:else if e.t === ListItemKind.enum.Transfer}
                        <Header>
                            <span class="header">
                                <span>Transferência</span>
                                <Meta class="material-icons">
                                    {#if e.c.yours}
                                        hourglass_empty
                                    {:else}
                                        priority_high
                                    {/if}
                                </Meta>
                                <span>{formatCents(e.c.amount)}</span>
                            </span>
                        </Header>
                        <Content>
                            <div class="pending-content">
                                <div class="pending-text">
                                    {#if e.c.yours}você enviou{:else}você recebeu{/if}
                                    <span>no dia {e.c.date.toLocaleDateString()}</span>
                                </div>

                                {#if !e.c.yours}
                                    <div class="pending-actions">
                                        <Button
                                            on:click={() => refuseTransfer(e.c.id)}
                                            variant="outlined"
                                        >
                                            Nope
                                        </Button>
                                        <Button
                                            on:click={() => confirmTransfer(e.c.id)}
                                            variant="unelevated"
                                        >
                                            Ok!
                                        </Button>
                                    </div>
                                {/if}
                            </div>
                        </Content>
                    {/if}
                </Panel>
            {/each}
        </Accordion>
    {/if}

    <Accordion>
        {#each list.months as m}
            <Panel bind:open={opens[m.n]}>
                <Header>
                    <span class="header">
                        <span class="month">{formatMonth(m.n)}</span>

                        {#if !opens[m.n]}
                            {formatCents(m.spent)}
                        {/if}
                    </span>
                </Header>

                <Content style="padding: 0">
                    <Accordion>
                        {#each m.items as i}
                            {#if i.t === ListItemKind.enum.Expense}
                                <Panel>
                                    <Header>
                                        <span class="header" class:header-refused={i.c.refused}>
                                            <span>{formatLabel(i.c.label)}</span>
                                            <span>{formatCents(i.c.spent)}</span>
                                        </span>
                                    </Header>
                                    <Content>
                                        <div>total de {formatCents(i.c.paid)}</div>
                                        <div>pago por {formatPerson(i.c.payer)}</div>
                                        <div>no dia {i.c.date.toLocaleDateString()}</div>
                                        <div>em divisão {formatSplit(i.c.split)}</div>
                                        {#if i.c.detail !== null}
                                            <div>detalhes: {i.c.detail}</div>
                                        {/if}
                                    </Content>
                                </Panel>
                            {:else if i.t === ListItemKind.enum.Transfer}
                                <Panel>
                                    <Header>
                                        <span class="header" class:header-refused={i.c.refused}>
                                            <span>Transferência</span>
                                            <Meta class="material-icons">
                                                {#if i.c.yours}north_east{:else}south_west{/if}
                                            </Meta>
                                        </span>
                                    </Header>
                                    <Content>
                                        <div class="transfer-content">
                                            <div>
                                                {#if i.c.yours}você enviou{:else}você recebeu{/if}
                                                <span>no dia {i.c.date.toLocaleDateString()}</span>
                                            </div>
                                            <span>{formatCents(i.c.amount)}</span>
                                        </div>
                                    </Content>
                                </Panel>
                            {/if}
                        {/each}
                    </Accordion>
                </Content>
            </Panel>
        {/each}
    </Accordion>
</Layout>

<style>
    .month {
        text-transform: capitalize;
    }

    .header {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .header-refused {
        text-decoration: line-through;
    }

    .pending-content {
        display: flex;
        flex-direction: row;
    }

    .pending-text {
        flex-grow: 1;
    }

    .pending-actions {
        display: flex;
        flex-direction: column;
        row-gap: 10px;
    }

    .transfer-content {
        display: flex;
        justify-content: space-between;
    }
</style>
