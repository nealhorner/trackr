<script lang="ts">
  import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
  import { onMount } from "svelte";
  import { setContext } from "svelte";

  import { afterNavigate, goto } from "$app/navigation";
  import { page } from "$app/stores";

  import { createShellState } from "$lib/shell";

  const queryClient = new QueryClient();
  const shell = createShellState();
  setContext("shell", shell);

  const bare = ["/login", "/setup"];
  $: isBare = bare.includes($page.url.pathname);

  let tenantLabel = "Trackr";

  type PublicConfigPayload = {
    data: { tenantName?: string | null; setupComplete: boolean };
  };

  const defaultPublicConfig: PublicConfigPayload = {
    data: { setupComplete: false },
  };

  async function fetchPublicConfig(): Promise<PublicConfigPayload> {
    try {
      const r = await fetch("/api/v1/public-config", {
        credentials: "include",
      });
      if (!r.ok) {
        console.error(
          "[layout] public-config request failed",
          r.status,
          r.statusText,
        );
        return defaultPublicConfig;
      }
      const j = (await r.json()) as PublicConfigPayload;
      if (!j?.data || typeof j.data.setupComplete !== "boolean") {
        console.error("[layout] public-config invalid shape", j);
        return defaultPublicConfig;
      }
      return j;
    } catch (e) {
      console.error("[layout] public-config fetch error", e);
      return defaultPublicConfig;
    }
  }

  async function loadTenantName() {
    const j = await fetchPublicConfig();
    if (j.data.setupComplete && j.data.tenantName) {
      tenantLabel = j.data.tenantName;
    }
  }

  async function guard(pathname: string) {
    if (typeof window === "undefined") return;
    if (pathname === "/login") return;

    if (pathname === "/setup") {
      const d = (await fetchPublicConfig()).data;
      if (d.setupComplete) await goto("/");
      return;
    }

    const d = (await fetchPublicConfig()).data;
    if (!d.setupComplete) {
      await goto("/setup");
      return;
    }

    const me = await fetch("/api/v1/me", { credentials: "include" });
    if (me.status === 401) {
      await goto("/login");
    }
  }

  onMount(() => {
    void loadTenantName();
    void guard($page.url.pathname);
  });

  afterNavigate(() => {
    void loadTenantName();
    void guard($page.url.pathname);
  });

  async function signOut() {
    await fetch("/api/auth/sign-out", {
      method: "POST",
      credentials: "include",
    });
    await goto("/login");
  }
</script>

<QueryClientProvider client={queryClient}>
  {#if isBare}
    <slot />
  {:else}
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
          <button class="sign-out-btn" type="button" onclick={() => signOut()}>
            Sign out
          </button>
        </div>
      </header>

      <div class="body">
        <aside class="left-nav">
          <div class="tenant-name">{tenantLabel}</div>
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
  {/if}
</QueryClientProvider>

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
  .global-search {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .global-search input {
    min-width: min(320px, 80vw);
    padding: 8px 10px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
  }
  .sign-out-btn {
    padding: 8px 12px;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
    background: #fff;
    cursor: pointer;
  }
  .sign-out-btn:hover {
    background: #f3f4f6;
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
