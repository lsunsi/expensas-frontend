<script lang="ts">
    import { goto } from "$app/navigation";
    import { Person, postSessionAsk } from "../../client";
    import Button from "@smui/button";
    import Paper, { Title as PaperTitle } from "@smui/paper";
    import { snack } from "../../stores";

    async function handleClick(who: Person) {
        try {
            await postSessionAsk(who);
            snack.push("🇧🇴 OIEEE");
            await goto("/espera");
        } catch (e) {
            snack.push("😵‍💫 Ah pronto, bugou");
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
