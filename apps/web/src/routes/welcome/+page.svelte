<script lang="ts">
  import { onMount } from "svelte";

  import { goto } from "$app/navigation";

  let isAdmin = false;

  onMount(async () => {
    const r = await fetch("/api/v1/me", { credentials: "include" });
    if (!r.ok) {
      await goto("/login");
      return;
    }
    const j = (await r.json()) as {
      data: { user: { isTenantAdmin: boolean } };
    };
    isAdmin = j.data.user.isTenantAdmin;
  });
</script>

<div class="wrap">
  <h1>Welcome</h1>
  <p>You are signed in. Finish any quick steps below, then go to the app.</p>

  {#if isAdmin}
    <section class="card" aria-label="Administrator checklist">
      <h2>Next as administrator</h2>
      <ul>
        <li>Confirm auth providers and secrets in your server environment</li>
        <li>Configure outbound email if you use verification or invites</li>
        <li>Plan backups for your Postgres database</li>
      </ul>
    </section>
  {/if}

  <p>
    <button type="button" class="primary" onclick={() => goto("/")}>Go to home</button>
  </p>
</div>

<style>
  .wrap {
    max-width: 480px;
    margin: 3rem auto;
    padding: 1.5rem;
    font-family: system-ui, sans-serif;
  }
  .card {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 12px 16px;
    margin: 1rem 0;
    background: #fafafa;
  }
  .card h2 {
    font-size: 1rem;
    margin: 0 0 8px;
  }
  .card ul {
    margin: 0;
    padding-left: 1.2rem;
    color: #4b5563;
    font-size: 0.9rem;
  }
  .primary {
    padding: 10px 14px;
    border-radius: 8px;
    border: none;
    background: #111827;
    color: #fff;
    cursor: pointer;
  }
</style>
