<script lang="ts">
  import type { PageData } from "./$types";

  export let data: PageData;
</script>

<h1>{data.project.name}</h1>
<p class="meta">Project #{data.project.id}</p>
<nav class="links">
  <a href="/projects/{data.project.id}/board">Board</a>
</nav>

<style>
  .meta {
    color: #6b7280;
    font-size: 0.875rem;
  }
  .links {
    margin-top: 1rem;
  }
  .links a {
    color: #2563eb;
    text-decoration: none;
  }
  .links a:hover {
    text-decoration: underline;
  }
</style>
