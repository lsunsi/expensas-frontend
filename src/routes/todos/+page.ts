import { getList, Label } from "../../client";
import type { PageLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: PageLoad = async ({ fetch, url }) => {
    const labels: Label[] = [];

    for (const raw of (url.searchParams.get("labels") || "").split("-")) {
        try {
            labels.push(Label.parse(raw));
        } catch (e) {}
    }

    try {
        const list = await getList(fetch, labels.length === 0 ? null : labels);
        return { labels, list };
    } catch (e) {
        console.error(e);
        throw redirect(302, "/caroco");
    }
};
