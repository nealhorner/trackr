<script lang="ts">
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";

  import { apiBaseUrl, getDesktopConfig, setDesktopConfig } from "$lib/api";

  let cfg = $state<Awaited<ReturnType<typeof getDesktopConfig>> | null>(null);
  let remoteUrl = $state("http://127.0.0.1:3000");
  let err = $state("");
  let busy = $state(false);

  onMount(async () => {
    cfg = await getDesktopConfig();
  });

  async function chooseLocal() {
    err = "";
    busy = true;
    try {
      await setDesktopConfig({
        version: 1,
        mode: "local",
        remoteBaseUrl: null,
        localDisplayName: null,
      });
      cfg = await getDesktopConfig();
      await apiBaseUrl();
    } catch (e) {
      err = e instanceof Error ? e.message : "Failed to start local API";
    } finally {
      busy = false;
    }
  }

  async function chooseRemote() {
    err = "";
    busy = true;
    try {
      await setDesktopConfig({
        version: 1,
        mode: "remote",
        remoteBaseUrl: remoteUrl.trim(),
        localDisplayName: null,
      });
      cfg = await getDesktopConfig();
      await goto("/connect");
    } catch (e) {
      err = e instanceof Error ? e.message : "Could not save remote settings";
    } finally {
      busy = false;
    }
  }
</script>

{#if cfg?.mode === "unset"}
  <div class="pick">
    <h1>Welcome to Trackr</h1>
    <p class="lead">Choose how this desktop app should connect before you continue.</p>

    <section class="card">
      <h2>Local (offline)</h2>
      <p>Data stays on this device in SQLite. No sign-in.</p>
      <button type="button" class="primary" disabled={busy} onclick={() => chooseLocal()}>
        Continue locally
      </button>
    </section>

    <section class="card">
      <h2>Remote server</h2>
      <p>Connect to your self-hosted Trackr API (HTTPS recommended in production).</p>
      <label>
        Server URL
        <input type="url" bind:value={remoteUrl} placeholder="https://trackr.example.com" />
      </label>
      <button type="button" class="primary" disabled={busy} onclick={() => chooseRemote()}>
        Use remote server
      </button>
    </section>

    {#if err}
      <p class="error" role="alert">{err}</p>
    {/if}
  </div>
{:else}
  <h2>Desktop</h2>
  {#if cfg?.mode === "local"}
    <p>
      Your workspace label is <strong>{cfg.localDisplayName ?? "local"}</strong>. Data is stored
      locally on this machine in a SQLite database.
    </p>
  {:else}
    <p>
      Connected to <strong>{cfg?.remoteBaseUrl ?? ""}</strong>. Use Projects after you sign in from
      the remote connect screen if prompted.
    </p>
  {/if}
  <p>Use Projects to create and track work.</p>
{/if}

<style>
  .pick {
    max-width: 520px;
    margin: 3rem auto;
    padding: 1.5rem;
  }
  h1 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }
  .lead {
    color: #64748b;
    margin-bottom: 1.5rem;
  }
  .card {
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 16px;
    background: #fff;
  }
  .card h2 {
    margin: 0 0 8px;
    font-size: 1.1rem;
  }
  .card p {
    margin: 0 0 12px;
    color: #475569;
    font-size: 0.9rem;
  }
  label {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 0.875rem;
    margin-bottom: 12px;
  }
  input {
    padding: 8px 10px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
  }
  .primary {
    padding: 10px 14px;
    border-radius: 8px;
    border: none;
    background: #0f172a;
    color: #fff;
    cursor: pointer;
  }
  .primary:disabled {
    opacity: 0.6;
  }
  .error {
    color: #b91c1c;
    margin-top: 12px;
  }
</style>
