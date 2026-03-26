<script lang="ts">
  // Phase 0 scaffold: the real router/context wiring will be added in Phase 1.
  export let data: unknown;

  let contextTitle = "Home";
  let tabs: string[] = ["Overview", "Recent"];
</script>

<div class="app-shell">
  <header class="top-nav">
    <div class="title-and-tabs">
      <div class="context-title">{contextTitle}</div>
      <nav class="context-tabs">
        {#each tabs as tab}
          <button class="tab" type="button">{tab}</button>
        {/each}
      </nav>
    </div>

    <div class="global-search">
      <input placeholder="Search organizations, projects, tickets..." />
    </div>
  </header>

  <div class="body">
    <aside class="left-nav">
      <div class="tenant-name">Tenant Name</div>

      <nav class="nav-sections">
        <button type="button">Home</button>
        <button type="button">Your Work</button>
        <button type="button">Organizations</button>
        <button type="button">Projects</button>
        <button type="button">Analytics</button>
        <button type="button">Settings</button>
        <button type="button">Favorites</button>
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
    height: 100%;
  }
  .top-nav {
    display: flex;
    justify-content: space-between;
    padding: 12px 16px;
    border-bottom: 1px solid #e5e7eb;
  }
  .title-and-tabs {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .context-title {
    font-weight: 700;
  }
  .context-tabs {
    display: flex;
    gap: 8px;
  }
  .global-search input {
    min-width: 320px;
    padding: 8px 10px;
  }
  .body {
    display: flex;
    flex: 1;
  }
  .left-nav {
    width: 240px;
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
  .content {
    flex: 1;
    padding: 16px;
  }
</style>

