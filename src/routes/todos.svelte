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
    import IconButton from "@smui/icon-button";
    import { postExpenseConfirm, postExpenseRefuse } from "../client";
    import Fab, { Icon } from "@smui/fab";
    import List, { Item, Meta, Text, PrimaryText, SecondaryText } from "@smui/list";
    import Layout from "../components/layout.svelte";
    import type { Expense } from "../client";

    export let expenses: Expense[];
    let selected: number | null = null;

    async function handleAdd() {
        try {
            await goto("/mais");
        } catch {
            await goto("/caroco");
        }
    }

    function handleItemSelect(id: number) {
        selected = selected === id ? null : id;
    }

    async function handleConfirm(id: number) {
        try {
            await postExpenseConfirm(id);
        } catch {
            await goto("/caroco");
        }
    }

    async function handleRefuse(id: number) {
        try {
            await postExpenseRefuse(id);
        } catch {
            await goto("/caroco");
        }
    }
</script>

<svelte:head>
    <title>os custo tudo</title>
</svelte:head>

<Layout tab="list">
    <List threeLine>
        {#each expenses as e}
            <Item on:SMUI:action={() => handleItemSelect(e.id)}>
                <Text>
                    <PrimaryText>{e.owed / 100}</PrimaryText>
                    <SecondaryText>total de {e.paid / 100}</SecondaryText>
                    <SecondaryText>pago por {e.payer}</SecondaryText>
                </Text>
                {#if selected === e.id}
                    <Meta>
                        <IconButton class="material-icons" on:click={() => handleRefuse(e.id)}
                            >close</IconButton
                        >
                        <IconButton class="material-icons" on:click={() => handleConfirm(e.id)}
                            >done</IconButton
                        >
                    </Meta>
                {:else if e.confirmed_at === null && e.refused_at === null}
                    <Meta class="material-icons">pending</Meta>
                {/if}
            </Item>
        {/each}
    </List>

    <div style="float: right">
        <Fab color="primary" on:click={handleAdd}>
            <Icon class="material-icons">add</Icon>
        </Fab>
    </div>
</Layout>
