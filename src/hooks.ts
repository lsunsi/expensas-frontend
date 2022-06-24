import type { GetSession } from "@sveltejs/kit";

export const getSession: GetSession = (event) => {
    const cookie = event.request.headers.get("cookie");
    let keys = (cookie || "").split(";").map((c) => c.split("=")[0]);
    return { ask: keys.includes("ask"), ses: keys.includes("ses") };
};
