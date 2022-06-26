<script lang="ts">
    import { Person, postExpenseSubmit, Split } from "../client";

    let payer: Person = "Ale";
    let split: Split = "Evenly";
    let paid = 1;
    let owed = 1;

    async function handleSubmit() {
        const o = split == "Arbitrary" ? owed * 100 : null;

        try {
            await postExpenseSubmit(payer, split, paid * 100, o);
        } catch (e) {}
    }
</script>

<form on:submit|preventDefault={handleSubmit}>
    <fieldset>
        <label for="payer">Pagante</label>
        <select id="payer" bind:value={payer}>
            <option>Ale</option>
            <option>Lu</option>
        </select>

        <label for="split">Divisão</label>
        <select id="split" bind:value={split}>
            <option value="Evenly">Igualmente</option>
            <option value="Proportional">Proporcional</option>
            <option value="Arbitrary">Arbitrário</option>
        </select>

        <label for="paid">Valor Pago</label>
        <input id="paid" type="number" min="1" max="1000" step="0.01" bind:value={paid} />

        {#if split == "Arbitrary"}
            <label for="owed">Valor Devido</label>
            <input id="owed" type="number" min="1" max="1000" step="0.01" bind:value={owed} />
        {/if}

        <input class="button-primary" type="submit" value="Send" />
    </fieldset>
</form>
