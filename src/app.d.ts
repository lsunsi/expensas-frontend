/// <reference types="@sveltejs/kit" />

declare namespace App {
    interface Locals {
        readonly ask: bool;
        readonly ses: bool;
    }
}
