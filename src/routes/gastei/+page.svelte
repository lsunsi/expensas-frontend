<script lang="ts">
    import { goto } from "$app/navigation";
    import Button from "@smui/button";
    import { Person, Label, postExpenseSubmit, Split, getExpenseSplitrecc } from "../../client";
    import Select, { Option } from "@smui/select";
    import Textfield from "@smui/textfield";
    import FormField from "@smui/form-field";
    import Layout from "../../components/layout.svelte";
    import { formatLabel, formatPerson } from "../../format";
    import { snack } from "../../stores";

    let date: string = new Date().toISOString().slice(0, 10);
    let payer: Person | undefined = undefined;
    let label: Label | undefined = undefined;
    let split: Split | undefined = undefined;
    let detail: string | null = null;
    let paid: number | null = null;
    let owed: number | null = null;

    $: if (payer !== undefined && label != undefined) {
        trySplitrecc(payer, label);
    }

    async function trySplitrecc(payer: Person, label: Label) {
        if (split === undefined) {
            try {
                const recc = await getExpenseSplitrecc(payer, label);
                console.log(recc);

                if (recc !== null) {
                    split = recc;
                }
            } catch (e) {
                console.log(e);
            }
        }
    }

    async function handleSubmit() {
        if (paid === null || payer === undefined || split === undefined || label === undefined) {
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

            snack.push("💌 Gasto registrado!");
            await goto("/resumao");
        } catch (e) {
            snack.push("😵‍💫 Ah pronto, bugou");
        }
    }
</script>

<svelte:head>
    <title>gastemos</title>
</svelte:head>

<Layout tab={null}>
    <form on:submit|preventDefault={handleSubmit}>
        <FormField style="width: 100%">
            <Textfield style="width: 100%;" label="Data" type="date" bind:value={date} />
        </FormField>

        <FormField style="width: 100%">
            <Select style="width: 100%" bind:value={payer} label="Pagante">
                {#each Person.options as person}
                    <Option value={person}>{formatPerson(person)}</Option>
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
            <Select style="width: 100%" bind:value={split} label="Divisão">
                <Option value={Split.enum.Proportional3to2}>Proporcional</Option>
                <Option value={Split.enum.Arbitrary}>Arbitrária</Option>
                <Option value={Split.enum.Evenly}>Igualitária</Option>
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
