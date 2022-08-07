<script lang="ts">
    import TopAppBar, { Row, Section, Title } from "@smui/top-app-bar";
    import { createEventDispatcher } from "svelte";
    import IconButton from "@smui/icon-button";
    import Tab, { Icon } from "@smui/tab";
    import TabBar from "@smui/tab-bar";
    import Button from "@smui/button";

    const dispatch = createEventDispatcher();

    type Name = "home" | "list" | "misc";

    let tabs: { name: Name; icon: string; path: string }[] = [
        { name: "home", icon: "home", path: "/resumao" },
        { name: "list", icon: "list", path: "/todos" },
        { name: "misc", icon: "more_horiz", path: "/treco" },
    ];

    export let tab: Name | null;
    $: active = tabs.find((t) => t.name === tab);

    export let refreshable = false;
</script>

<div class="container">
    <TopAppBar variant="static">
        <Row>
            <Section>
                <Title>Expensas</Title>
            </Section>
            {#if refreshable}
                <Section align="end">
                    <IconButton class="material-icons" on:click={() => dispatch("refresh")}>
                        refresh
                    </IconButton>
                </Section>
            {/if}
        </Row>
    </TopAppBar>

    <div class="slot">
        <slot />
    </div>

    <TabBar {tabs} let:tab {active}>
        <Tab {tab} href={tab.path}>
            <Icon class="material-icons">{tab.icon}</Icon>
        </Tab>
    </TabBar>
</div>

<style>
    .container {
        height: 100%;
        display: flex;
        flex-direction: column;
    }

    .slot {
        flex-grow: 1;
        overflow: scroll;
    }
</style>
