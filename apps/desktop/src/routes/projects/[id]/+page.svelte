<script lang="ts">
  import { createQuery } from "@tanstack/svelte-query";
  import { page } from "$app/stores";
  import { apiFetch } from "$lib/api";

  const projectId = $derived(Number($page.params.id));
  const projectQuery = createQuery(() => ({
    queryKey: ["project", projectId],
    queryFn: () =>
      apiFetch<{ project: { id: number; name: string } }>(`/api/v1/projects/${projectId}`),
  }));
  const ticketsQuery = createQuery(() => ({
    queryKey: ["tickets", projectId],
    queryFn: () =>
      apiFetch<{ tickets: Array<{ id: number; title: string; status: string }> }>(
        `/api/v1/projects/${projectId}/tickets`,
      ),
  }));
</script>

{#if $projectQuery.isPending || $ticketsQuery.isPending}
  <p>Loading…</p>
{:else if $projectQuery.isError}
  <p role="alert">{$projectQuery.error.message}</p>
{:else}
  <h2>{$projectQuery.data.project.name}</h2>
  <p><a href={`/projects/${projectId}/board`}>Open board</a></p>
  <h3>Tickets</h3>
  <ul>
    {#each $ticketsQuery.data?.tickets ?? [] as t}
      <li>
        <a href={`/projects/${projectId}/tickets/${t.id}`}>{t.title}</a>
        ({t.status})
      </li>
    {/each}
  </ul>
{/if}
