<script lang="ts">
  import { QueryClientProvider } from "@tanstack/svelte-query";
  import { page } from "$app/stores";
  import { shellStateFromPath } from "$lib/shell";

  let { data, children } = $props();
  const shell = $derived(shellStateFromPath($page.url.pathname));

  const nav = [
    { href: "/", label: "Home" },
    { href: "/projects", label: "Projects" },
    { href: "/settings", label: "Settings" },
  ];
</script>

<QueryClientProvider client={data.queryClient}>
  <div class="app">
    <aside class="sidebar">
      <h2>Trackr</h2>
      {#each nav as item}
        <a href={item.href} class:active={$page.url.pathname === item.href}>{item.label}</a>
      {/each}
    </aside>

    <main class="main">
      <header class="topbar">
        <div>
          <h1>{shell.contextTitle}</h1>
          <nav class="tabs">
            {#each shell.tabs as tab}
              <a href={tab.href} class:active={$page.url.pathname === tab.href}>
                {tab.label}
              </a>
            {/each}
          </nav>
        </div>
      </header>

      <section class="content">
        {@render children()}
      </section>
    </main>
  </div>
</QueryClientProvider>

<style>
  :global(body) {
    margin: 0;
    font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
    background: #f8fafc;
    color: #0f172a;
  }
  .app {
    display: grid;
    grid-template-columns: 220px 1fr;
    min-height: 100vh;
  }
  .sidebar {
    border-right: 1px solid #e2e8f0;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    background: #fff;
  }
  .sidebar a {
    padding: 8px 10px;
    border-radius: 8px;
    text-decoration: none;
    color: #334155;
  }
  .sidebar a.active,
  .tabs a.active {
    background: #dbeafe;
    color: #1d4ed8;
  }
  .main {
    display: flex;
    flex-direction: column;
  }
  .topbar {
    border-bottom: 1px solid #e2e8f0;
    background: #fff;
    padding: 16px 20px;
  }
  .topbar h1 {
    margin: 0 0 10px;
    font-size: 20px;
  }
  .tabs {
    display: flex;
    gap: 8px;
  }
  .tabs a {
    color: #475569;
    text-decoration: none;
    border-radius: 8px;
    padding: 6px 10px;
  }
  .content {
    padding: 20px;
  }
</style>
