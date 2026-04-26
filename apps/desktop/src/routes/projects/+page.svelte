<script lang="ts">
  import { createQuery } from "@tanstack/svelte-query";
  import { apiFetch } from "$lib/api";

  const projectsQuery = createQuery(() => ({
    queryKey: ["projects"],
    queryFn: () =>
      apiFetch<{ projects: Array<{ id: number; name: string }> }>("/api/v1/projects"),
  }));
</script>

<h2>Projects</h2>
{#if $projectsQuery.isPending}
  <p>Loading…</p>
{:else if $projectsQuery.isError}
  <p role="alert">{$projectsQuery.error.message}</p>
{:else}
  <ul>
    {#each $projectsQuery.data.projects as p}
      <li><a href={`/projects/${p.id}`}>{p.name}</a></li>
    {/each}
  </ul>
{/if}
