<script lang="ts">
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import {
        getSessionState,
        postSessionCancel,
        postSessionConvert,
        SessionState,
    } from "../../client";
    import CircularProgress from "@smui/circular-progress";
    import Button from "@smui/button";
    import { snack } from "../../stores";

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
                snack.push("🎂 Bem-vindoa!");
                await goto("/resumao");
            }
        } catch (e) {
            console.log(e);
            snack.push("😵‍💫 Ah pronto, bugou");
        }
    }

    async function handleCancel() {
        done = true;

        try {
            await postSessionCancel();
            snack.push("🎂 Blz, não queria mesmo");
            await goto("/quem");
        } catch (e) {
            snack.push("😵‍💫 Ah pronto, bugou");
        }
    }

    async function handleBack() {
        done = true;

        await postSessionCancel();
        snack.push("🎂 Blz, não queria mesmo");
        await goto("/quem");
    }

    onMount(() => {
        const interval = setInterval(pollSessionState, 1000);
        return () => clearInterval(interval);
    });
</script>

{#if refused}
    <p>Te negaram do outro lado.</p>
    <Button on:click|once={handleBack}>Foi mal</Button>
{:else if stale}
    <p>Já era essa tentativa. RIP</p>
    <Button on:click|once={handleBack}>Ok...</Button>
{:else}
    <p>Pede pra te aprovarem aí</p>
    <Button on:click|once={handleCancel}>Desisto</Button>
    <div style="display: flex; justify-content: center">
        <CircularProgress style="height: 32px; width: 32px;" indeterminate />
    </div>
{/if}
