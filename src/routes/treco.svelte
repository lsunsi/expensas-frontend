<script>
    import Layout from "../components/layout.svelte";
    import List, { Item, Graphic, Text } from "@smui/list";
    import { postSessionDrop } from "../client";
    import { goto } from "$app/navigation";

    async function handleLeave() {
        try {
            await postSessionDrop();
            await goto("/quem");
        } catch (e) {
            await goto("/caroco");
        }
    }
</script>

<svelte:head>
    <title>mais treco</title>
</svelte:head>

<Layout tab="misc">
    <List>
        <Item on:click={handleLeave}>
            <Graphic class="material-icons">logout</Graphic>
            <Text>Sair</Text>
        </Item>
    </List>
</Layout>
