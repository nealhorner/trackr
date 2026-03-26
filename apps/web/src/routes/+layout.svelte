<script lang="ts">
  import { setContext } from "svelte";

  import { createShellState } from "$lib/shell";

  const shell = createShellState();

  setContext("shell", shell);
</script>

<div class="app-shell">
  <header class="top-nav">
    <div class="title-and-tabs">
      <div class="context-title">{$shell.contextTitle}</div>
      <nav class="context-tabs">
        {#each $shell.tabs as tab}
          <a class="tab" href={tab.href}>{tab.label}</a>
        {/each}
      </nav>
    </div>

    <div class="global-search">
      <input
        type="search"
        placeholder="Search organizations, projects, tickets..."
        aria-label="Global search"
      />
    </div>
  </header>

  <div class="body">
    <aside class="left-nav">
      <div class="tenant-name">Tenant Name</div>
      <nav class="nav-sections">
        <a href="/">Home</a>
        <a href="/your-work">Your Work</a>
        <a href="/organizations">Organizations</a>
        <a href="/projects">Projects</a>
        <a href="/analytics">Analytics</a>
        <a href="/settings">Settings</a>
        <a href="/favorites">Favorites</a>
      </nav>
    </aside>

    <main class="content">
      <slot />
    </main>
  </div>
</div>

<style>
  .app-shell {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  .top-nav {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 12px 16px;
    border-bottom: 1px solid #e5e7eb;
    gap: 16px;
  }
  .title-and-tabs {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .context-title {
    font-weight: 700;
    font-size: 1.125rem;
  }
  .context-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .tab {
    padding: 6px 10px;
    border-radius: 6px;
    text-decoration: none;
    color: #374151;
    border: 1px solid transparent;
  }
  .tab:hover {
    background: #f3f4f6;
  }
  .global-search input {
    min-width: min(320px, 80vw);
    padding: 8px 10px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
  }
  .body {
    display: flex;
    flex: 1;
    min-height: 0;
  }
  .left-nav {
    width: 240px;
    flex-shrink: 0;
    padding: 12px;
    border-right: 1px solid #e5e7eb;
  }
  .tenant-name {
    font-weight: 700;
    margin-bottom: 12px;
  }
  .nav-sections {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .nav-sections a {
    color: #111827;
    text-decoration: none;
  }
  .nav-sections a:hover {
    text-decoration: underline;
  }
  .content {
    flex: 1;
    padding: 16px;
    overflow: auto;
  }
</style>
