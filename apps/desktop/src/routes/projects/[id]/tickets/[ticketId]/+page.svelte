<script lang="ts">
  import { createQuery } from "@tanstack/svelte-query";
  import { page } from "$app/stores";
  import { apiFetch } from "$lib/api";

  const ticketId = $derived(Number($page.params.ticketId));
  const ticketQuery = createQuery(() => ({
    queryKey: ["ticket", ticketId],
    queryFn: () =>
      apiFetch<{ ticket: { title: string; descriptionMarkdown: string | null } }>(
        `/api/v1/tickets/${ticketId}`,
      ),
  }));
  const commentsQuery = createQuery(() => ({
    queryKey: ["comments", ticketId],
    queryFn: () =>
      apiFetch<{ comments: Array<{ id: number; body: string }> }>(
        `/api/v1/tickets/${ticketId}/comments`,
      ),
  }));
</script>

{#if $ticketQuery.isPending || $commentsQuery.isPending}
  <p>Loading…</p>
{:else if $ticketQuery.isError}
  <p role="alert">{$ticketQuery.error.message}</p>
{:else}
  <h2>{$ticketQuery.data.ticket.title}</h2>
  <p>{$ticketQuery.data.ticket.descriptionMarkdown ?? "No description"}</p>
  <h3>Comments</h3>
  <ul>
    {#each $commentsQuery.data?.comments ?? [] as c}
      <li>{c.body}</li>
    {/each}
  </ul>
{/if}
