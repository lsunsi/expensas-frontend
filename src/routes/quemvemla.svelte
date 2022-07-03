<script lang="ts">
    import { goto } from "$app/navigation";
    import { Person, postSessionAsk } from "../client";
    import TopAppBar, { Row, Section, Title, AutoAdjust } from "@smui/top-app-bar";
    import type { TopAppBarComponentDev } from "@smui/top-app-bar";
    import Button from "@smui/button";
    import Paper, { Subtitle, Content, Title as PaperTitle } from "@smui/paper";

    let topAppBar: TopAppBarComponentDev;

    async function handleClick(who: Person) {
        try {
            await postSessionAsk(who);
            await goto("/esperando");
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
    </Row>
</TopAppBar>
<AutoAdjust {topAppBar}>
    <Paper variant="unelevated">
        <PaperTitle>
            <p>Quem vem lá?</p>
        </PaperTitle>
    </Paper>

    <Button on:click|once={() => handleClick(Person.enum.Ale)}>Alê</Button>
    <Button on:click|once={() => handleClick(Person.enum.Lu)}>Lu</Button>
</AutoAdjust>
