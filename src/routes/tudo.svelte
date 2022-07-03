<script lang="ts">
    import { goto } from "$app/navigation";
    import IconButton from "@smui/icon-button";
    import { onMount } from "svelte";
    import {
        getSessionConfirmable,
        postSessionRefuse,
        postSessionConfirm,
        getExpenseList,
        postExpenseConfirm,
        postExpenseRefuse,
    } from "../client";
    import Button from "@smui/button";
    import Fab, { Icon } from "@smui/fab";
    import CircularProgress from "@smui/circular-progress";
    import List, { Item, Meta, Text, PrimaryText, SecondaryText } from "@smui/list";
    import Layout from "../components/layout.svelte";

    let confirmable: number | null;
    let dropped = false;
    let items = getExpenseList();
    let selected: number | null = null;

    async function pollConfirmable() {
        if (!dropped) {
            try {
                confirmable = await getSessionConfirmable();
            } catch (e) {
                await goto("/caroco");
            }
        }
    }

    async function handleConfirm() {
        if (confirmable) {
            try {
                await postSessionConfirm(confirmable);
            } catch (e) {
                await goto("/caroco");
            }
        }
    }

    async function handleRefuse() {
        if (confirmable) {
            try {
                await postSessionRefuse(confirmable);
            } catch (e) {
                await goto("/caroco");
            }
        }
    }

    async function handleAdd() {
        try {
            await goto("/mais");
        } catch (e) {
            await goto("/caroco");
        }
    }

    function handleItemSelect(id: number) {
        return () => (selected = selected === id ? null : id);
    }

    function handleItemConfirm(id: number) {
        return async () => {
            try {
                await postExpenseConfirm(id);
            } catch (e) {
                await goto("/caroco");
            }
        };
    }

    function handleItemRefuse(id: number) {
        return async () => {
            try {
                await postExpenseRefuse(id);
            } catch (e) {
                await goto("/caroco");
            }
        };
    }

    onMount(() => {
        const interval = setInterval(pollConfirmable, 1000);
        return () => clearInterval(interval);
    });
</script>

<Layout tab="list">
    <div>
        {#if confirmable}
            <Button on:click|once={handleConfirm}>Cola aí</Button>
            <Button on:click|once={handleRefuse}>Sai fora</Button>
        {/if}
    </div>

    {#await items}
        <div style="display: flex; justify-content: center">
            <CircularProgress style="height: 32px; width: 32px;" indeterminate />
        </div>
    {:then items}
        <List threeLine>
            {#each items as item}
                <Item on:SMUI:action={handleItemSelect(item.id)}>
                    <Text>
                        <PrimaryText>{item.owed / 100}</PrimaryText>
                        <SecondaryText>total de {item.paid / 100}</SecondaryText>
                        <SecondaryText>pago por {item.payer}</SecondaryText>
                    </Text>
                    {#if selected === item.id}
                        <Meta>
                            <IconButton class="material-icons" on:click={handleItemRefuse(item.id)}
                                >close</IconButton
                            >
                            <IconButton class="material-icons" on:click={handleItemConfirm(item.id)}
                                >done</IconButton
                            >
                        </Meta>
                    {:else if item.confirmed_at === null && item.refused_at === null}
                        <Meta class="material-icons">pending</Meta>
                    {/if}
                </Item>
            {/each}
        </List>
    {:catch}
        {@debug items}
    {/await}

    <div style="display: flex; justify-content: end;">
        <Fab color="primary" on:click={handleAdd}>
            <Icon class="material-icons">add</Icon>
        </Fab>
    </div>
</Layout>
