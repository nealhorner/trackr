<script lang="ts">
  import type { PageData } from "./$types";

  export let data: PageData;
</script>

<h1>Board</h1>
<p class="back">
  <a href="/projects/{data.board.projectId}">← Project</a>
</p>

<div class="columns">
  {#each data.board.columns as col}
    <section class="column">
      <h2>{col.name}</h2>
      <ul>
        {#each data.tickets.filter((t) => t.boardColumnId === col.id) as t}
          <li>
            <a href="/projects/{data.board.projectId}/tickets/{t.id}">{t.title}</a>
          </li>
        {/each}
      </ul>
    </section>
  {/each}
</div>

<style>
  .back {
    margin-bottom: 1rem;
  }
  .back a {
    color: #2563eb;
    text-decoration: none;
  }
  .columns {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    align-items: flex-start;
  }
  .column {
    min-width: 200px;
    background: #f9fafb;
    border-radius: 8px;
    padding: 12px;
    border: 1px solid #e5e7eb;
  }
  .column h2 {
    font-size: 0.875rem;
    margin: 0 0 8px;
    color: #374151;
  }
  .column ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .column a {
    color: #111827;
    text-decoration: none;
    font-size: 0.875rem;
  }
  .column a:hover {
    text-decoration: underline;
  }
</style>
