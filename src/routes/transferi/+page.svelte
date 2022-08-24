<script lang="ts">
    import { goto } from "$app/navigation";
    import Button from "@smui/button";
    import { postTransferSubmit } from "../../client";
    import Textfield from "@smui/textfield";
    import FormField from "@smui/form-field";
    import Layout from "../../components/layout.svelte";
    import { snack } from "../../stores";

    let amount: number | null = null;
    let date: string = new Date().toISOString().slice(0, 10);

    async function handleSubmit() {
        if (amount === null) {
            return;
        }
        try {
            await postTransferSubmit(Math.trunc(amount * 100), date);
            snack.push("💌 Transferência registrada!");
            await goto("/resumao");
        } catch (e) {
            snack.push("😵‍💫 Ah pronto, bugou");
        }
    }
</script>

<svelte:head>
    <title>transferi</title>
</svelte:head>

<Layout tab={null}>
    <form on:submit|preventDefault={handleSubmit}>
        <FormField style="width: 100%">
            <Textfield style="width: 100%;" label="Data" type="date" bind:value={date} />
        </FormField>

        <FormField style="width: 100%">
            <Textfield
                style="width: 100%"
                label="Valor Transferido"
                type="number"
                input$min="1"
                input$max="9999"
                input$step="0.01"
                bind:value={amount}
            />
        </FormField>

        <Button variant="raised" type="submit">Vai</Button>
    </form>
</Layout>

<style>
    form {
        display: flex;
        flex-direction: column;
        align-items: center;
        row-gap: 20px;
        max-width: 80%;
        margin: auto;
    }
</style>
