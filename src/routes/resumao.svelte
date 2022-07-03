<script lang="ts" context="module">
    import { getSummary } from "../client";
    import type { Load } from "./__types/resumao";

    export const load: Load = async ({ fetch }) => {
        try {
            const summary = await getSummary(fetch);
            return { status: 200, props: { summary } };
        } catch (e) {
            return { status: 302, redirect: "/caroco" };
        }
    };
</script>

<script lang="ts">
    import Layout from "../components/layout.svelte";
    import Paper, { Title } from "@smui/paper";
    import { formatCents } from "../format";
    import Card, { Actions, Content } from "@smui/card";
    import Button, { Label } from "@smui/button";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import {
        getSessionConfirmable,
        postSessionConfirm,
        postSessionRefuse,
        type Summary,
    } from "../client";

    export let summary: Summary;

    let confirmable: number | null;

    function pollConfirmable() {
        getSessionConfirmable()
            .then((c) => (confirmable = c))
            .catch(() => goto("/caroco"));
    }

    function handleConfirm() {
        confirmable &&
            postSessionConfirm(confirmable)
                .then(() => (confirmable = null))
                .catch(() => goto("/caroco"));
    }

    function handleRefuse() {
        confirmable &&
            postSessionRefuse(confirmable)
                .then(() => (confirmable = null))
                .catch(() => goto("/caroco"));
    }

    onMount(() => {
        const interval = setInterval(pollConfirmable, 1000);
        return () => clearInterval(interval);
    });
</script>

<svelte:head>
    <title>resumão dos custo</title>
</svelte:head>

<Layout tab="home">
    <Paper variant="unelevated">
        <Title>Olá {{ Lu: "Lucas", Ale: "Alê" }[summary.me]}!</Title>

        {#if confirmable}
            <div class="card">
                <Card padded>
                    <Content>
                        <div class="mdc-typography--overline">Knock knock</div>
                        <span class="mdc-typography--body1">Alguém pediu acesso ao app</span>
                    </Content>

                    <Actions>
                        <Button on:click={handleRefuse}>
                            <Label>Nope</Label>
                        </Button>
                        <Button on:click={handleConfirm}>
                            <Label>Chega mais</Label>
                        </Button>
                    </Actions>
                </Card>
            </div>
        {/if}

        {#if summary.pending_you}
            <div class="card">
                <Card padded>
                    <Content>
                        <div class="mdc-typography--overline">Novos gastos</div>
                        <span class="mdc-typography--body1">
                            Faltam {summary.pending_you} gastos pra você avaliar
                        </span>
                    </Content>

                    <Actions fullBleed>
                        <Button on:click={() => goto("/todos")}>
                            <Label>Ver lista</Label>
                            <i class="material-icons" aria-hidden="true">arrow_forward</i>
                        </Button>
                    </Actions>
                </Card>
            </div>
        {/if}

        <div class="card">
            <Card variant="outlined" padded>
                <Content>
                    <div class="mdc-typography--overline">Estado de devimento</div>
                    <span class="mdc-typography--body1">
                        {#if summary.owed > 0}
                            Você é devido {formatCents(summary.owed)} atualmente
                        {:else if summary.owed < 0}
                            Você deve {formatCents(-summary.owed)} atualmente
                        {:else}
                            Ninguém deve ninguém
                        {/if}
                    </span>
                </Content>
            </Card>
        </div>

        {#if summary.pending_other}
            <div class="card">
                <Card variant="outlined" padded>
                    <Content>
                        <div class="mdc-typography--overline">Gastos pendentes</div>
                        <span class="mdc-typography--body1">
                            Você lançou {summary.pending_other} gastos que não foram avaliados ainda
                        </span>
                    </Content>
                </Card>
            </div>
        {/if}
    </Paper>
</Layout>

<style>
    .card {
        padding-top: 32px;
    }
</style>
