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
    import Tooltip, { Wrapper } from "@smui/tooltip";
    import { goto } from "$app/navigation";
    import { postExpenseConfirm, postExpenseRefuse } from "../client";
    import List, {
        Group,
        Item,
        Meta,
        Text,
        PrimaryText,
        Subheader,
        SecondaryText,
    } from "@smui/list";
    import Layout from "../components/layout.svelte";
    import type { Expense } from "../client";
    import Button from "@smui/button";
    import { formatCents, formatPerson, formatLabel } from "../format";

    export let expenses: Expense[];

    $: pending = expenses.filter((e) => e.confirmed_at === null && e.refused_at === null);
    $: finished = expenses.filter((e) => e.confirmed_at !== null || e.refused_at !== null);

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
    {#if pending.length > 0}
        <Group>
            <Subheader>Pendentes</Subheader>
            <List threeLine nonInteractive>
                {#each pending as e}
                    <Wrapper>
                        <Item>
                            <Text>
                                <PrimaryText>{formatCents(e.owed)}</PrimaryText>
                                <SecondaryText>total de {formatCents(e.paid)}</SecondaryText>
                                <SecondaryText>pago por {formatPerson(e.payer)}</SecondaryText>
                            </Text>

                            {#if e.yours}
                                <Meta class="material-icons">hourglass_empty</Meta>
                            {:else}
                                <Meta>
                                    <Button on:click={() => refuse(e.id)} variant="outlined">
                                        Nope
                                    </Button>
                                    <Button on:click={() => confirm(e.id)} variant="unelevated">
                                        Ok!
                                    </Button>
                                </Meta>
                            {/if}
                        </Item>
                        {#if e.yours}
                            <Tooltip xPos="center">
                                Esperando a aceitação terceira.<br />
                                Acelera a pessoa lá
                            </Tooltip>
                        {/if}
                    </Wrapper>
                {/each}
            </List>
        </Group>
    {/if}
    {#if finished.length > 0}
        <Group>
            {#if pending.length > 0}
                <Subheader>Finalizados</Subheader>
            {/if}
            <List threeLine nonInteractive>
                {#each finished as e}
                    <Wrapper>
                        <Item>
                            <Text>
                                <span class:finished-text={e.refused_at !== null}>
                                    <PrimaryText>{formatCents(e.owed)}</PrimaryText>
                                    <SecondaryText>{formatCents(e.paid)} total</SecondaryText>
                                    <SecondaryText>{e.payer} pagou</SecondaryText>
                                </span>
                            </Text>
                            <Meta>{formatLabel(e.label)}</Meta>
                        </Item>
                        {#if e.detail !== null}
                            <Tooltip xPos="center">{e.detail}</Tooltip>
                        {/if}
                    </Wrapper>
                {/each}
            </List>
        </Group>
    {/if}
</Layout>

<style>
    .finished-text {
        text-decoration: line-through;
    }
</style>
