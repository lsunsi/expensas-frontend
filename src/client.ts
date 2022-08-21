import type { LoadEvent } from "@sveltejs/kit";
import { z } from "zod";

const URL = import.meta.env.VITE_SERVER_URL;

const date = z.preprocess((s: any) => new Date(s), z.date());

export type Person = z.infer<typeof Person>;
export const Person = z.enum(["Ale", "Lu"]);

export type Split = z.infer<typeof Split>;
export const Split = z.enum(["Proportional", "Arbitrary", "Evenly"]);

export type Label = z.infer<typeof Label>;
export const Label = z.enum([
    "Market",
    "Delivery",
    "Transport",
    "Leisure",
    "Water",
    "Internet",
    "Gas",
    "Housing",
    "Electricity",
    "Furnitance",
]);

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
        await fetch(`${URL}/session/convert`, {
            credentials: "include",
            method: "POST",
        })
    );
}

export async function getSessionConfirmable(fetch: LoadEvent["fetch"]): Promise<number | null> {
    return decode200json(
        await fetch(`${URL}/session/confirmable`, { credentials: "include", method: "GET" }),
        z.number().nullable().parse
    );
}

export type SessionState = z.infer<typeof SessionState>;
export const SessionState = z.enum(["Confirmable", "Convertable", "Converted", "Refused", "Stale"]);

export async function getSessionState(): Promise<SessionState> {
    return decode200json(
        await fetch(`${URL}/session/state`, { credentials: "include", method: "GET" }),
        SessionState.parse
    );
}

export async function postExpenseSubmit(
    payer: Person,
    split: Split,
    paid: number,
    owed: number | null,
    label: Label,
    detail: string | null,
    date: string
) {
    const body = JSON.stringify({ payer, split, paid, owed, label, detail, date });
    const headers = { "Content-Type": "application/json", Accept: "application/json" };

    return decode200(
        await fetch(`${URL}/expense/submit`, {
            credentials: "include",
            method: "POST",
            headers,
            body,
        })
    );
}

export async function postExpenseConfirm(id: number) {
    return decode200(
        await fetch(`${URL}/expense/confirm/${id}`, { credentials: "include", method: "POST" })
    );
}

export async function postExpenseRefuse(id: number) {
    return decode200(
        await fetch(`${URL}/expense/refuse/${id}`, { credentials: "include", method: "POST" })
    );
}

export async function postTransferSubmit(amount: number, date: string) {
    const body = JSON.stringify({ amount, date });
    const headers = { "Content-Type": "application/json", Accept: "application/json" };

    return decode200(
        await fetch(`${URL}/transfer/submit`, {
            credentials: "include",
            method: "POST",
            headers,
            body,
        })
    );
}

export async function postTransferConfirm(id: number) {
    return decode200(
        await fetch(`${URL}/transfer/confirm/${id}`, { credentials: "include", method: "POST" })
    );
}

export async function postTransferRefuse(id: number) {
    return decode200(
        await fetch(`${URL}/transfer/refuse/${id}`, { credentials: "include", method: "POST" })
    );
}

export type Summary = z.infer<typeof Summary>;
const Summary = z.object({
    me: Person,
    owed_maybe: z.number(),
    owed_definitely: z.number(),
    pending_you: z.number(),
    pending_other: z.number(),
});

export async function getSummary(fetch: LoadEvent["fetch"]): Promise<Summary> {
    return decode200json(
        await fetch(`${URL}/summary`, { credentials: "include", method: "GET" }),
        Summary.parse
    );
}

export type ListExpense = z.infer<typeof ListExpense>;
const ListExpense = z.object({
    id: z.number(),
    yours: z.boolean(),
    payer: Person,
    split: Split,
    label: Label,
    detail: z.string().nullable(),
    date: date,
    paid: z.number(),
    spent: z.number(),
    confirmed: z.boolean(),
    refused: z.boolean(),
});

export type ListTransfer = z.infer<typeof ListTransfer>;
const ListTransfer = z.object({
    id: z.number(),
    yours: z.boolean(),
    date: date,
    amount: z.number(),
    confirmed: z.boolean(),
    refused: z.boolean(),
});

export type ListItemKind = z.infer<typeof ListItemKind>;
export const ListItemKind = z.enum(["Expense", "Transfer"]);

export type ListItem = z.infer<typeof ListItem>;
const ListItem = z.discriminatedUnion("t", [
    z.object({ t: z.literal(ListItemKind.enum.Expense), c: ListExpense }),
    z.object({ t: z.literal(ListItemKind.enum.Transfer), c: ListTransfer }),
]);

export type ListMonth = z.infer<typeof ListMonth>;
const ListMonth = z.object({
    n: z.number(),
    spent: z.number(),
    items: ListItem.array(),
});

export type ListResponse = z.infer<typeof ListResponse>;
const ListResponse = z.object({
    pendings: ListItem.array(),
    months: ListMonth.array(),
});

export async function getList(fetch: LoadEvent["fetch"]): Promise<ListResponse> {
    return decode200json(
        await fetch(`${URL}/list`, { credentials: "include", method: "GET" }),
        ListResponse.parse
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
