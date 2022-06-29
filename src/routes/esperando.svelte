<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import {
        getSessionState,
        postSessionCancel,
        postSessionConvert,
        SessionState,
    } from "../client";

    let refused = false;
    let stale = false;
    let done = false;

    async function pollSessionState() {
        if (stale || done) {
            return;
        }

        try {
            const state = await getSessionState();

            if (state == SessionState.enum.Stale || state == SessionState.enum.Converted) {
                stale = true;
            } else if (state == SessionState.enum.Refused) {
                refused = true;
            } else if (state == SessionState.enum.Convertable) {
                done = true;

                await postSessionConvert();
                await goto("/dashboard");
            }
        } catch (e) {
            console.log(e);
            await goto("/caroco");
        }
    }

    async function handleCancel() {
        done = true;

        try {
            await postSessionCancel();
            await goto("/quemvemla");
        } catch (e) {
            await goto("/caroco");
        }
    }

    async function handleBack() {
        done = true;

        await postSessionCancel();
        await goto("/quemvemla");
    }

    onMount(() => {
        const interval = setInterval(pollSessionState, 1000);
        return () => clearInterval(interval);
    });
</script>

<div>
    <h1>Expensas</h1>

    {#if refused}
        <p>Te negaram do outro lado.</p>
        <button on:click|once={handleBack}>Foi mal</button>
    {:else if stale}
        <p>Já era essa tentativa. RIP</p>
        <button on:click|once={handleBack}>Ok...</button>
    {:else}
        <p>Pede pra te aprovarem aí</p>
        <button on:click|once={handleCancel}>Desisto</button>
    {/if}
</div>
