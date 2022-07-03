<script lang="ts">
    import { goto } from "$app/navigation";
    import { Person, postSessionAsk } from "../client";
    import Button from "@smui/button";
    import Paper, { Title as PaperTitle } from "@smui/paper";

    async function handleClick(who: Person) {
        try {
            await postSessionAsk(who);
            await goto("/espera");
        } catch (e) {
            await goto("/caroco");
        }
    }
</script>

<Paper variant="unelevated">
    <PaperTitle>
        <p>Quem vem lá?</p>
    </PaperTitle>

    <Button on:click|once={() => handleClick(Person.enum.Ale)}>Alê</Button>
    <Button on:click|once={() => handleClick(Person.enum.Lu)}>Lu</Button>
</Paper>
