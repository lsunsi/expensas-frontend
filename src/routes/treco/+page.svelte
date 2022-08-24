<script lang="ts">
    import Layout from "../../components/layout.svelte";
    import List, { Item, Graphic, Text } from "@smui/list";
    import { postSessionDrop } from "../../client";
    import { goto } from "$app/navigation";
    import { snack } from "../../stores";

    async function handleLeave() {
        try {
            await postSessionDrop();
            snack.push("🚬 Adeus!");
            await goto("/quem");
        } catch (e) {
            snack.push("😵‍💫 Ah pronto, bugou");
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
