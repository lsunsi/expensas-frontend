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

    const opensMonth: { [n: number]: boolean } = {};
    const opensExpenses: { [n: number]: boolean } = {};
    const opensTransfers: { [n: number]: boolean } = {};

    const setFirstMonthOpen = () => {
        opensMonth[list.months[0].n] = true;
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
</script>

<svelte:head>
    <title>os custo tudo</title>
</svelte:head>

<Layout tab="list">
    {#if list.pendings.length > 0}
        <Accordion style="margin: 8px">
            {#each list.pendings as e}
                <Panel variant="outlined" color="primary">
                    {#if e.t === ListItemKind.enum.Expense}
                        <Header>
                            <span class="flex-row-space-between">
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
                            <span class="flex-row-space-between">
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
            <Panel bind:open={opensMonth[m.n]}>
                <Header>
                    <span class="flex-row-space-between">
                        <span class="month">{formatMonth(m.n)}</span>

                        {#if !opensMonth[m.n]}
                            {formatCents(m.spent)}
                        {/if}
                    </span>
                </Header>

                <Content style="padding: 0">
                    <Accordion>
                        {#each m.items as i}
                            {#if i.t === ListItemKind.enum.Expense}
                                <Panel
                                    bind:open={opensExpenses[i.c.id]}
                                    color={opensExpenses[i.c.id] ? "primary" : ""}
                                >
                                    <Header>
                                        <span
                                            class="flex-row-space-between"
                                            class:header-refused={i.c.refused}
                                        >
                                            <span>
                                                {#if opensExpenses[i.c.id] && i.c.detail}
                                                    {i.c.detail}
                                                {:else}
                                                    {formatLabel(i.c.label)}
                                                {/if}
                                            </span>
                                            <span>{formatCents(i.c.spent)}</span>
                                        </span>
                                    </Header>
                                    <Content>
                                        <div class="flex-row-space-between">
                                            <div>
                                                <div>pago por {formatPerson(i.c.payer)}</div>
                                                <div>{i.c.date.toLocaleDateString()}</div>
                                            </div>
                                            <div style="text-align: right">
                                                <div>{formatCents(i.c.paid)}</div>
                                                <div>{formatSplit(i.c.split)}</div>
                                            </div>
                                        </div>
                                    </Content>
                                </Panel>
                            {:else if i.t === ListItemKind.enum.Transfer}
                                <Panel
                                    bind:open={opensTransfers[i.c.id]}
                                    color={opensTransfers[i.c.id] ? "primary" : ""}
                                >
                                    <Header>
                                        <span
                                            class="flex-row-space-between"
                                            class:header-refused={i.c.refused}
                                        >
                                            <span>Transferência</span>
                                            <Meta class="material-icons">
                                                {#if i.c.yours}north_east{:else}south_west{/if}
                                            </Meta>
                                        </span>
                                    </Header>
                                    <Content>
                                        <div class="flex-row-space-between">
                                            <div>
                                                <div>
                                                    {#if i.c.yours}você enviou{:else}você recebeu{/if}
                                                </div>
                                                <div>{i.c.date.toLocaleDateString()}</div>
                                            </div>
                                            <div>{formatCents(i.c.amount)}</div>
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

    .flex-row-space-between {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
</style>
