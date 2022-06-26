<script lang="ts">
    import { goto } from "$app/navigation";
    import { Person, postSessionAsk } from "../client";

    async function handleClick(who: Person) {
        try {
            await postSessionAsk(who);
            await goto("/esperando");
        } catch (e) {
            await goto("/caroco");
        }
    }
</script>

<div class="container">
    <h1>Expensas</h1>

    <p>Quem vem lá?</p>

    <button on:click|once={() => handleClick(Person.enum.Ale)}>Alê</button>
    <button on:click|once={() => handleClick(Person.enum.Lu)}>Lu</button>
</div>
