import type { Label, Split, Person } from "./client";

const currency = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
});

export function formatCents(cents: number): string {
    return currency.format(cents / 100);
}

export function formatPerson(person: Person): string {
    switch (person) {
        case "Ale":
            return "Alê";
        case "Lu":
            return "Lu";
    }
}

export function formatSplit(split: Split): string {
    switch (split) {
        case "Proportional":
            return "Proporcional";
        case "Arbitrary":
            return "Arbitrária";
        case "Evenly":
            return "Igualitária";
    }
}

export function formatLabel(label: Label): string {
    switch (label) {
        case "Market":
            return "Mercado";
        case "Delivery":
            return "Delivery";
        case "Transport":
            return "Transporte";
        case "Leisure":
            return "Lazer";
        case "Water":
            return "Conta de água";
        case "Internet":
            return "Conta de internet";
        case "Gas":
            return "Refil do gás";
        case "Housing":
            return "Aluguel";
        case "Electricity":
            return "Conta de luz";
        case "Furnitance":
            return "Coisas da casa";
    }
}

export function formatMonth(n: number): string {
    switch (n) {
        case 1:
            return "Janeiro";
        case 2:
            return "Fevereiro";
        case 3:
            return "Março";
        case 4:
            return "Abril";
        case 5:
            return "Maio";
        case 6:
            return "Junho";
        case 7:
            return "Julho";
        case 8:
            return "Agosto";
        case 9:
            return "Setembro";
        case 10:
            return "Outubro";
        case 11:
            return "Novembro";
        case 12:
            return "Dezembro";
        default:
            throw "Bad month";
    }
}
