<script lang="ts" context="module">
    import type { Load } from "@sveltejs/kit";

    export const load: Load = ({ session }) => {
        if (!session.ask && !session.ses) {
            return { status: 302, redirect: "/quemvemla" };
        } else if (session.ask && !session.ses) {
            return { status: 302, redirect: "/esperando" };
        } else if (session.ses && !session.ask) {
            return { status: 302, redirect: "/dashboard" };
        }

        return { status: 302, redirect: "/caroco" };
    };
</script>
