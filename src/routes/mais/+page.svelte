<script lang="ts">
    import { goto } from "$app/navigation";
    import Button from "@smui/button";
    import { Person, Label, postExpenseSubmit, Split } from "../../client";
    import Select, { Option } from "@smui/select";
    import Textfield from "@smui/textfield";
    import FormField from "@smui/form-field";
    import Layout from "../../components/layout.svelte";
    import { formatLabel, formatPerson, formatSplit } from "../../format";

    let payer: Person | null = null;
    let split: Split | null = null;
    let paid: number | null = null;
    let owed: number | null = null;
    let label: Label | null = null;
    let detail: string | null = null;
    let date: string | null = new Date().toISOString().slice(0, 10);

    async function handleSubmit() {
        if (paid === null || payer === null || split === null || date === null || label === null) {
            return;
        }
        try {
            if (split === "Arbitrary" && owed !== null) {
                await postExpenseSubmit(
                    payer,
                    "Arbitrary",
                    Math.trunc(paid * 100),
                    Math.trunc(owed * 100),
                    label,
                    detail,
                    date
                );
            } else {
                await postExpenseSubmit(
                    payer,
                    split,
                    Math.trunc(paid * 100),
                    null,
                    label,
                    detail,
                    date
                );
            }

            await goto("/resumao");
        } catch (e) {
            await goto("/caroco");
        }
    }
</script>

<svelte:head>
    <title>gastei pra nóis</title>
</svelte:head>

<Layout tab={null}>
    <form on:submit|preventDefault={handleSubmit}>
        <FormField style="width: 100%">
            <Select style="width: 100%" bind:value={payer} label="Pagante">
                {#each Person.options as person}
                    <Option value={person}>{formatPerson(person)}</Option>
                {/each}
            </Select>
        </FormField>

        <FormField style="width: 100%">
            <Textfield style="width: 100%;" label="Data" type="date" bind:value={date} />
        </FormField>

        <FormField style="width: 100%">
            <Select style="width: 100%" bind:value={split} label="Divisão">
                {#each Split.options as split}
                    <Option value={split}>{formatSplit(split)}</Option>
                {/each}
            </Select>
        </FormField>

        <FormField style="width: 100%">
            <Select style="width: 100%" bind:value={label} label="Etiqueta">
                {#each Label.options as label}
                    <Option value={label}>{formatLabel(label)}</Option>
                {/each}
            </Select>
        </FormField>

        <FormField style="width: 100%">
            <Textfield style="width: 100%" label="Detalhe" type="text" bind:value={detail} />
        </FormField>

        <FormField style="width: 100%">
            <Textfield
                style="width: 100%"
                label="Valor Pago"
                type="number"
                input$min="1"
                input$max="9999"
                input$step="0.01"
                bind:value={paid}
            />
        </FormField>

        {#if split === "Arbitrary"}
            <FormField style="width: 100%">
                <Textfield
                    style="width: 100%"
                    label="Valor Devido"
                    type="number"
                    input$min="1"
                    input$max={paid}
                    input$step="0.01"
                    bind:value={owed}
                />
            </FormField>
        {/if}

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
