<script lang="ts">
    import { goto } from "$app/navigation";
    import ExpenseForm from "../components/expense-form.svelte";
    import { onMount } from "svelte";
    import {
        getSessionConfirmable,
        postSessionRefuse,
        postSessionConfirm,
        postSessionDrop,
    } from "../client";
    import Button from "@smui/button";

    let confirmable: number | null;
    let dropped = false;

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

    async function handleDrop() {
        try {
            dropped = true;
            await postSessionDrop();
            await goto("/quemvemla");
        } catch (e) {
            await goto("/caroco");
        }
    }

    onMount(() => {
        const interval = setInterval(pollConfirmable, 1000);
        return () => clearInterval(interval);
    });
</script>

<div>
    <h1>Expensas</h1>

    {#if confirmable}
        <Button on:click|once={handleConfirm}>Cola aí</Button>
        <Button on:click|once={handleRefuse}>Sai fora</Button>
    {/if}
    <Button on:click|once={handleDrop}>VwlFlw</Button>

    <ExpenseForm />
</div>
