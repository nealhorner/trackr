<script lang="ts">
  import { createQuery } from "@tanstack/svelte-query";
  import { page } from "$app/stores";
  import { apiFetch } from "$lib/api";

  const projectId = $derived(Number($page.params.id));
  const boardQuery = createQuery(() => ({
    queryKey: ["board", projectId],
    queryFn: () =>
      apiFetch<{
        board: { columns: Array<{ id: number; key: string; name: string }> };
        tickets: Array<{ id: number; title: string; boardColumnId: number | null }>;
      }>(`/api/v1/projects/${projectId}/board`),
  }));
</script>

<h2>Board</h2>

{#if $boardQuery.isPending}
  <p>Loading…</p>
{:else if $boardQuery.isError}
  <p role="alert">{$boardQuery.error.message}</p>
{:else}
  <div class="cols">
    {#each $boardQuery.data.board.columns as col}
      <section>
        <h3>{col.name}</h3>
        <ul>
          {#each $boardQuery.data.tickets.filter((t) => t.boardColumnId === col.id) as t}
            <li>{t.title}</li>
          {/each}
        </ul>
      </section>
    {/each}
  </div>
{/if}

<style>
  .cols {
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  section {
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 10px;
  }
</style>
