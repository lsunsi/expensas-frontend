<script lang="ts">
    import type { SnackbarComponentDev } from "@smui/snackbar";
    import Snackbar, { Label } from "@smui/snackbar";
    import { snack } from "../stores";
    import { onMount } from "svelte";

    let snackbar: SnackbarComponentDev;
    let labelText: string | undefined;
    let running = false;

    onMount(() => {
        snack.subscribe(() => {
            if (!running) {
                running = true;
                stepSnackbar();
            }
        });
    });

    function stepSnackbar() {
        snackbar && snackbar.close();
        labelText = snack.pop();

        if (labelText !== undefined) {
            snackbar && snackbar.open();
            setTimeout(stepSnackbar, 3141);
        } else {
            running = false;
        }
    }
</script>

<slot />

<Snackbar bind:this={snackbar} {labelText} timeoutMs={-1}>
    <Label />
</Snackbar>
