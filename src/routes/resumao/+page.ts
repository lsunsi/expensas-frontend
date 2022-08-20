import { getSummary, getSessionConfirmable } from "../../client";
import type { PageLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: PageLoad = async ({ fetch }) => {
    try {
        const summary = await getSummary(fetch);
        const confirmable = await getSessionConfirmable(fetch);
        return { summary, confirmable };
    } catch (e) {
        return redirect(302, "/caroco");
    }
};
