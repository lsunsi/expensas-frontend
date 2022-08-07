<script lang="ts" context="module">
    import { getExpenseList } from "../client";
    import type { Load } from "./__types/todos";

    export const load: Load = async ({ fetch }) => {
        try {
            const expenses = await getExpenseList(fetch);
            return { status: 200, props: { expenses } };
        } catch (e) {
            return { status: 302, redirect: "/caroco" };
        }
    };
</script>

<script lang="ts">
    import { goto } from "$app/navigation";
    import { postExpenseConfirm, postExpenseRefuse } from "../client";
    import { Group, Meta, Subheader } from "@smui/list";
    import Layout from "../components/layout.svelte";
    import type { Expense } from "../client";
    import Button from "@smui/button";
    import { formatCents, formatPerson, formatLabel, formatSplit } from "../format";
    import Accordion, { Panel, Header, Content } from "@smui-extra/accordion";

    export let expenses: Expense[];

    const isPending = (e: Expense) => e.refused_at === null && e.confirmed_at === null;

    $: pending = expenses.filter(isPending);

    $: groups = expenses
        .reverse()
        .filter((e) => !isPending(e))
        .reduce<[string, Expense[]][]>(([g, ...gs], e) => {
            const month = e.date.toLocaleString("pt-BR", { month: "long" });

            if (g === undefined) {
                return [[month, [e]]];
            } else if (g[0] === month) {
                return [[month, [...g[1], e]], ...gs];
            } else {
                return [[month, [e]], g, ...gs];
            }
        }, []);

    async function reload() {
        const a = await getExpenseList(fetch);
        expenses = a;
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
        {#if pending.length > 0}
            <Group>
                <Subheader>Pendentes</Subheader>

                {#each pending as e}
                    <Panel variant="outlined" color="primary">
                        <Header>
                            <span class="header">
                                <span>{formatLabel(e.label)}</span>
                                <Meta class="material-icons">
                                    {#if e.yours}
                                        hourglass_empty
                                    {:else}
                                        priority_high
                                    {/if}
                                </Meta>
                                <span>{formatCents(e.owed)}</span>
                            </span>
                        </Header>
                        <Content>
                            <div class="pending-content">
                                <div class="pending-text">
                                    <div>total de {formatCents(e.paid)}</div>
                                    <div>pago por {formatPerson(e.payer)}</div>
                                    <div>no dia {e.date.toLocaleDateString()}</div>
                                    <div>em divisão {formatSplit(e.split)}</div>
                                    {#if e.detail !== null}
                                        <div>detalhes: {e.detail}</div>
                                    {/if}
                                </div>

                                {#if !e.yours}
                                    <div class="pending-actions">
                                        <Button on:click={() => refuse(e.id)} variant="outlined">
                                            Nope
                                        </Button>
                                        <Button on:click={() => confirm(e.id)} variant="unelevated">
                                            Ok!
                                        </Button>
                                    </div>
                                {/if}
                            </div>
                        </Content>
                    </Panel>
                {/each}
            </Group>
        {/if}

        {#each groups as [month, group]}
            <Group>
                <Subheader><span class="month">{month}</span></Subheader>

                {#each group as e}
                    <Panel>
                        <Header>
                            <span class="header" class:header-refused={e.refused_at !== null}>
                                <span>{formatLabel(e.label)}</span>
                                <span>{formatCents(e.owed)}</span>
                            </span>
                        </Header>
                        <Content>
                            <div>total de {formatCents(e.paid)}</div>
                            <div>pago por {formatPerson(e.payer)}</div>
                            <div>no dia {e.date.toLocaleDateString()}</div>
                            <div>em divisão {formatSplit(e.split)}</div>
                            {#if e.detail !== null}
                                <div>detalhes: {e.detail}</div>
                            {/if}
                        </Content>
                    </Panel>
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
