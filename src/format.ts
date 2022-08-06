import type { Label, Split } from "./client";

const currency = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
});

export function formatCents(cents: number): string {
    return currency.format(cents / 100);
}

export function translateLabel(label: Label): string {
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
            return "Conta de agua";
        case "Internet":
            return "Conta de internet";
        case "Gas":
            return "Refill do gás";
        case "Housing":
            return "Aluguel";
        case "Electricity":
            return "Conta de luz";
        case "Furnitance":
            return "Coisas da casa";
    }
}

export function translateSplit(split: Split): string {
    switch (split) {
        case "Proportional":
            return "Proporcional";
        case "Arbitrary":
            return "Arbitrária";
        case "Evenly":
            return "Igualitária";
    }
}
