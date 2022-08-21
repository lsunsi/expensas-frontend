<script lang="ts">
    import type { PageData } from "./$types";
    import { goto } from "$app/navigation";
    import { postExpenseConfirm, postExpenseRefuse, getList, ListItemKind } from "../../client";
    import { Group, Meta, Subheader } from "@smui/list";
    import Layout from "../../components/layout.svelte";
    import Button from "@smui/button";
    import { formatCents, formatPerson, formatLabel, formatSplit, formatMonth } from "../../format";
    import Accordion, { Panel, Header, Content } from "@smui-extra/accordion";

    export let data: PageData;
    $: list = data.list;

    async function reload() {
        list = await getList(fetch);
    }

    async function confirm(id: number) {
        try {
            await postExpenseConfirm(id);
            await reload();
        } catch {
            await goto("/caroco");
        }
    }

    async function refuse(id: number) {
        try {
            await postExpenseRefuse(id);
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
    <Accordion>
        {#if list.pendings.length > 0}
            <Group>
                <Subheader>Pendentes</Subheader>

                {#each list.pendings as e}
                    {#if e.t === ListItemKind.enum.Expense}
                        <Panel variant="outlined" color="primary">
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
                                                on:click={() => refuse(e.c.id)}
                                                variant="outlined"
                                            >
                                                Nope
                                            </Button>
                                            <Button
                                                on:click={() => confirm(e.c.id)}
                                                variant="unelevated"
                                            >
                                                Ok!
                                            </Button>
                                        </div>
                                    {/if}
                                </div>
                            </Content>
                        </Panel>
                    {/if}
                {/each}
            </Group>
        {/if}

        {#each list.months as m}
            <Group>
                <Subheader>
                    <span class="header">
                        <span class="month">{formatMonth(m.n)}</span>
                        {formatCents(m.spent)}
                    </span>
                </Subheader>

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
                    {/if}
                {/each}
            </Group>
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
</style>
