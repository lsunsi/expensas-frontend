import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = ({ locals }) => {
    if (!locals.ask && !locals.ses) {
        throw redirect(302, "/quem");
    } else if (locals.ask && !locals.ses) {
        throw redirect(302, "/espera");
    } else if (locals.ses && !locals.ask) {
        throw redirect(302, "/resumao");
    }

    throw redirect(302, "/caroco");
};
