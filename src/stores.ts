import { writable } from "svelte/store";

function createSnack() {
    const { subscribe, update } = writable<string[]>([]);

    return {
        subscribe,
        push: (item: string) => update((a) => [...a, item]),
        pop: (): string | undefined => {
            let popped;
            update(([a, ...b]) => {
                popped = a;
                return b;
            });
            return popped;
        },
    };
}

export const snack = createSnack();
