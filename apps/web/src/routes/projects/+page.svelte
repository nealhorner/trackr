<script lang="ts">
  import { createQuery } from "@tanstack/svelte-query";

  type ProjectRow = { id: number; name: string };

  const projectsQuery = createQuery<Array<ProjectRow>>({
    queryKey: ["projects"],
    queryFn: async () => {
      const r = await fetch("/api/v1/projects", { credentials: "include" });
      if (!r.ok) throw new Error("Failed to load projects");
      const j = (await r.json()) as {
        data: { projects: Array<ProjectRow> };
      };
      return j.data.projects;
    },
  });
</script>

<h1>Projects</h1>

{#if $projectsQuery.isPending}
  <p>Loading…</p>
{:else if $projectsQuery.isError}
  <p role="alert">Error: {$projectsQuery.error.message}</p>
{:else}
  <ul class="list">
    {#each $projectsQuery.data ?? [] as p}
      <li><a href="/projects/{p.id}">{p.name}</a></li>
    {/each}
  </ul>
{/if}

<style>
  .list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .list a {
    color: #2563eb;
    text-decoration: none;
  }
  .list a:hover {
    text-decoration: underline;
  }
</style>
