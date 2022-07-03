<script lang="ts">
    import { goto } from "$app/navigation";
    import IconButton from "@smui/icon-button";
    import { getExpenseList, postExpenseConfirm, postExpenseRefuse } from "../client";
    import Fab, { Icon } from "@smui/fab";
    import CircularProgress from "@smui/circular-progress";
    import List, { Item, Meta, Text, PrimaryText, SecondaryText } from "@smui/list";
    import Layout from "../components/layout.svelte";

    let items = getExpenseList();
    let selected: number | null = null;

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

    function handleConfirm(id: number) {
        return async () => {
            try {
                await postExpenseConfirm(id);
            } catch (e) {
                await goto("/caroco");
            }
        };
    }

    function handleRefuse(id: number) {
        return async () => {
            try {
                await postExpenseRefuse(id);
            } catch (e) {
                await goto("/caroco");
            }
        };
    }
</script>

<Layout tab="list">
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
                            <IconButton class="material-icons" on:click={handleRefuse(item.id)}
                                >close</IconButton
                            >
                            <IconButton class="material-icons" on:click={handleConfirm(item.id)}
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

    <div style="float: right">
        <Fab color="primary" on:click={handleAdd}>
            <Icon class="material-icons">add</Icon>
        </Fab>
    </div>
</Layout>
