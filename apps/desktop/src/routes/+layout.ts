import { QueryClient } from "@tanstack/svelte-query";

export const ssr = false;

const queryClient = new QueryClient();

export function load() {
  return { queryClient };
}
