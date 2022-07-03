<script lang="ts">
    import { goto } from "$app/navigation";
    import IconButton from "@smui/icon-button";
    import { onMount } from "svelte";
    import {
        getSessionConfirmable,
        postSessionRefuse,
        postSessionConfirm,
        postSessionDrop,
    } from "../client";
    import Button from "@smui/button";
    import TopAppBar, { Row, Section, Title, AutoAdjust } from "@smui/top-app-bar";
    import type { TopAppBarComponentDev } from "@smui/top-app-bar";
    import { Person, postExpenseSubmit, Split } from "../client";
    import Select, { Option } from "@smui/select";
    import Textfield from "@smui/textfield";
    import FormField from "@smui/form-field";

    let topAppBar: TopAppBarComponentDev;
    let payer: Person | null = null;
    let split: Split | null = null;
    let paid: number | null = null;
    let owed: number | null = null;

    async function handleBack() {
        try {
            await goto("/dashboard");
        } catch (e) {
            await goto("/caroco");
        }
    }

    async function handleSubmit() {
        if (paid === null || payer === null || split === null) {
            return;
        }
        try {
            if (split === "Arbitrary" && owed !== null) {
                await postExpenseSubmit(payer, "Arbitrary", paid * 100, owed * 100);
            } else {
                await postExpenseSubmit(payer, split, paid * 100, null);
            }

            await goto("/dashboard");
        } catch (e) {
            await goto("/caroco");
        }
    }
</script>

<TopAppBar bind:this={topAppBar} variant="short">
    <Row>
        <Section>
            <Title>Expensas</Title>
        </Section>
        <Section align="end">
            <IconButton class="material-icons" on:click|once={handleBack}>arrow_back</IconButton>
        </Section>
    </Row>
</TopAppBar>
<AutoAdjust {topAppBar}>
    <form on:submit|preventDefault={handleSubmit}>
        <FormField>
            <Select bind:value={payer} label="Pagante">
                {#each Person.options as person}
                    <Option value={person}>{person}</Option>
                {/each}
            </Select>
        </FormField>

        <FormField>
            <Select bind:value={split} label="Divisão">
                {#each Split.options as split}
                    <Option value={split}>{split}</Option>
                {/each}
            </Select>
        </FormField>

        <FormField>
            <Textfield
                label="Valor Pago"
                type="number"
                min="1"
                max="1000"
                step="0.01"
                bind:value={paid}
            />
        </FormField>

        {#if split === "Arbitrary"}
            <FormField>
                <Textfield
                    label="Valor Devido"
                    type="number"
                    min="1"
                    max="1000"
                    step="0.01"
                    bind:value={owed}
                />
            </FormField>
        {/if}

        <Button variant="raised" type="submit">Vai</Button>
    </form>
</AutoAdjust>
