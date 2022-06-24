import { z } from "zod";

const URL = "http://localhost:3000";

export enum Person {
    Ale = "Ale",
    Lu = "Lu",
}

export type SessionState = z.infer<typeof SessionState>;
export const SessionState = z.enum(["Confirmable", "Convertable", "Converted", "Refused", "Stale"]);

// Routes

export async function postSessionAsk(who: Person) {
    decode200(
        await fetch(`${URL}/session/ask/${who}`, {
            credentials: "include",
            method: "POST",
        })
    );
}

export async function postSessionCancel() {
    decode200(
        await fetch(`${URL}/session/cancel`, {
            credentials: "include",
            method: "POST",
        })
    );
}

export async function postSessionDrop() {
    decode200(
        await fetch(`${URL}/session/drop`, {
            credentials: "include",
            method: "POST",
        })
    );
}

export async function postSessionConfirm(id: number) {
    decode200(
        await fetch(`${URL}/session/confirm/${id}`, {
            credentials: "include",
            method: "POST",
        })
    );
}

export async function postSessionRefuse(id: number) {
    decode200(
        await fetch(`${URL}/session/refuse/${id}`, {
            credentials: "include",
            method: "POST",
        })
    );
}

export async function postSessionConvert() {
    decode200(
        await fetch("http://localhost:3000/session/convert", {
            credentials: "include",
            method: "POST",
        })
    );
}

export async function getSessionConfirmable(): Promise<number | null> {
    return decode200json(
        await fetch(`${URL}/session/confirmable`, { credentials: "include", method: "GET" }),
        z.number().nullable().parse
    );
}

export async function getSessionState(): Promise<SessionState> {
    return decode200json(
        await fetch(`${URL}/session/state`, { credentials: "include", method: "GET" }),
        SessionState.parse
    );
}

// Helpers

function decode200(response: Response) {
    if (response.status != 200) {
        throw `bad status: ${response.status}`;
    }
}

async function decode200json<T>(response: Response, decoder: (_: any) => T): Promise<T> {
    decode200(response);
    return decoder(await response.json());
}
