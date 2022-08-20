import type { Handle } from "@sveltejs/kit";

export const handle: Handle = ({ event, resolve }) => {
    const cookie = event.request.headers.get("cookie");
    const keys = (cookie || "").split(";").map((c) => c.split("=")[0]);
    event.locals = { ask: keys.includes("ask"), ses: keys.includes("ses") };
    return resolve(event);
};
