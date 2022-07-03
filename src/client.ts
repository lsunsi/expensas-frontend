import { z } from "zod";

const URL = "http://localhost:3000";

export type Person = z.infer<typeof Person>;
export const Person = z.enum(["Ale", "Lu"]);

export type Split = z.infer<typeof Split>;
export const Split = z.enum(["Proportional", "Arbitrary", "Evenly"]);

export type Label = z.infer<typeof Label>;
export const Label = z.enum([
    'Market',
    'Delivery',
    'Transport',
    'Leisure',
    'Water',
    'Internet',
    'Gas',
    'Housing',
    'Electricity',
    'Furnitance',
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

export type SessionState = z.infer<typeof SessionState>;
export const SessionState = z.enum(["Confirmable", "Convertable", "Converted", "Refused", "Stale"]);

export async function getSessionState(): Promise<SessionState> {
    return decode200json(
        await fetch(`${URL}/session/state`, { credentials: "include", method: "GET" }),
        SessionState.parse
    );
}

export type Expense = z.infer<typeof Expense>;
const Expense = z.object({
    id: z.number(),
    creator: Person,
    payer: Person,
    split: Split,
    label: Label,
    detail: z.string().nullable(),
    date: z.string(),
    paid: z.number(),
    owed: z.number(),
    confirmed_at: z.string().nullable(),
    refused_at: z.string().nullable(),
    created_at: z.string(),
});

export async function getExpenseList(): Promise<Expense[]> {
    return decode200json(
        await fetch(`${URL}/expense/list`, { credentials: "include", method: "GET" }),
        Expense.array().parse
    );
}

export async function postExpenseSubmit(
    payer: Person,
    split: Split,
    paid: number,
    owed: number | null,
    label: Label,
    detail: string | null,
    date: string,
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
