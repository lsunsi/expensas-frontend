import { getExpenseList } from "../../client";
import type { PageLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: PageLoad = async ({ fetch }) => {
    try {
        return { expenses: await getExpenseList(fetch) };
    } catch (e) {
        throw redirect(302, "/caroco");
    }
};
