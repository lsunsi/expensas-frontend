<script lang="ts">
    import type { PageData } from "./$types";
    import Layout from "../../components/layout.svelte";
    import Paper, { Title } from "@smui/paper";
    import { formatCents } from "../../format";
    import Card, { Actions, Content } from "@smui/card";
    import Button, { Label } from "@smui/button";
    import { goto } from "$app/navigation";
    import Fab, { Icon } from "@smui/fab";
    import Tooltip, { Wrapper } from "@smui/tooltip";
    import { postSessionConfirm, postSessionRefuse, type Summary } from "../../client";

    export let data: PageData;

    let summary: Summary = data.summary;
    let confirmable: number | null = data.confirmable;

    let launch = false;

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
</script>

<svelte:head>
    <title>resumão dos custo</title>
</svelte:head>

<Layout tab="home">
    <div class="container">
        <div class="paper">
            <Paper variant="unelevated">
                <Title>Olá {{ Lu: "Lucas", Ale: "Alê" }[summary.me]}!</Title>

                {#if confirmable}
                    <div class="card">
                        <Card padded>
                            <Content>
                                <div class="mdc-typography--overline">Knock knock</div>
                                <span class="mdc-typography--body1">Alguém pediu acesso ao app</span
                                >
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
                                    Faltam {summary.pending_you} itens pra você avaliar
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
                                {#if summary.owed_definitely > 0}
                                    Te devem {formatCents(summary.owed_definitely)} atualmente
                                    <div class="mdc-typography--body2">
                                        {#if summary.owed_maybe > 0}
                                            mais {formatCents(summary.owed_maybe)} provavelmente
                                        {:else if summary.owed_maybe < 0}
                                            menos {formatCents(-summary.owed_maybe)} provavelmente
                                        {/if}
                                    </div>
                                {:else if summary.owed_definitely < 0}
                                    Você deve {formatCents(-summary.owed_definitely)} atualmente
                                    <div class="mdc-typography--body2">
                                        {#if summary.owed_maybe > 0}
                                            menos {formatCents(summary.owed_maybe)} provavelmente
                                        {:else if summary.owed_maybe < 0}
                                            mais {formatCents(-summary.owed_maybe)} provavelmente
                                        {/if}
                                    </div>
                                {:else}
                                    Ninguém deve ninguém
                                    <div class="mdc-typography--body2">
                                        {#if summary.owed_maybe > 0}
                                            mas vão te dever {formatCents(summary.owed_maybe)} provavelmente
                                        {:else if summary.owed_maybe < 0}
                                            mas você vai dever {formatCents(-summary.owed_maybe)} provavelmente
                                        {/if}
                                    </div>
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
                                    Você lançou {summary.pending_other} itens que não foram avaliados
                                    ainda
                                </span>
                            </Content>
                        </Card>
                    </div>
                {/if}
            </Paper>
        </div>

        <div class="add">
            <Wrapper>
                <Fab color="primary" href="/gastei" exited={!launch}>
                    <Icon class="material-icons">shopping_bag</Icon>
                </Fab>
                <Tooltip xPos="start" yPos="above">gasto</Tooltip>
            </Wrapper>

            <Wrapper>
                <Fab color="primary" on:click={() => (launch = true)} mini exited={launch}>
                    <Icon class="material-icons">add</Icon>
                </Fab>
                <Tooltip xPos="start" yPos="above">Lançar</Tooltip>
            </Wrapper>

            <Wrapper>
                <Fab color="primary" href="/transferi" exited={!launch}>
                    <Icon class="material-icons">payments</Icon>
                </Fab>
                <Tooltip xPos="start" yPos="above">transferência</Tooltip>
            </Wrapper>
        </div>
    </div>
</Layout>

<style>
    .container {
        height: 100%;
        position: relative;
    }

    .paper {
        overflow: scroll;
        height: 100%;
    }

    .card {
        padding-top: 32px;
    }

    .add {
        text-align: center;
        padding-bottom: 16px;
        position: absolute;
        bottom: 0;
        right: 0;
        left: 0;
    }
</style>
