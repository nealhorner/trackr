<script lang="ts">
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";

  import { getDesktopConfig, openRemoteLoginWindow } from "$lib/api";

  let email = $state("");
  let password = $state("");
  let err = $state("");
  let busy = $state(false);
  let base = $state("");

  onMount(async () => {
    const c = await getDesktopConfig();
    if (c.mode !== "remote" || !c.remoteBaseUrl) {
      await goto("/");
      return;
    }
    base = c.remoteBaseUrl.replace(/\/$/, "");
  });

  async function submit(e: Event) {
    e.preventDefault();
    err = "";
    busy = true;
    try {
      const res = await fetch(`${base}/api/auth/sign-in/email`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          rememberMe: true,
        }),
      });
      if (!res.ok) {
        err = (await res.text().catch(() => "")) || "Sign in failed";
        return;
      }
      const me = await fetch(`${base}/api/v1/me`, { credentials: "include" });
      if (!me.ok) {
        err = "Signed in but session could not be verified.";
        return;
      }
      await goto("/");
    } finally {
      busy = false;
    }
  }

  async function openWebview() {
    err = "";
    try {
      await openRemoteLoginWindow(base);
    } catch (e) {
      err = e instanceof Error ? e.message : "Could not open login window";
    }
  }
</script>

<div class="wrap">
  <h1>Sign in to remote Trackr</h1>
  <p class="hint">
    Sign in with the same account you use in the browser. For OAuth providers, open the login window
    and complete sign-in there; then return here — cookies may be shared when using the in-app
    window on some platforms.
  </p>

  <form onsubmit={submit}>
    <label>
      Email
      <input type="email" bind:value={email} autocomplete="username" required />
    </label>
    <label>
      Password
      <input type="password" bind:value={password} autocomplete="current-password" required />
    </label>
    <button type="submit" class="primary" disabled={busy}>Sign in</button>
  </form>

  <p class="or">or</p>
  <button type="button" class="secondary" disabled={busy || !base} onclick={() => openWebview()}>
    Open server login page in a window
  </button>

  {#if err}
    <p class="error" role="alert">{err}</p>
  {/if}
</div>

<style>
  .wrap {
    max-width: 420px;
    margin: 2rem auto;
    padding: 1rem;
  }
  h1 {
    font-size: 1.35rem;
    margin-bottom: 0.5rem;
  }
  .hint {
    color: #64748b;
    font-size: 0.875rem;
    margin-bottom: 1.25rem;
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  label {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 0.875rem;
  }
  input {
    padding: 8px 10px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
  }
  .primary,
  .secondary {
    padding: 10px 14px;
    border-radius: 8px;
    cursor: pointer;
  }
  .primary {
    border: none;
    background: #0f172a;
    color: #fff;
  }
  .secondary {
    width: 100%;
    border: 1px solid #e2e8f0;
    background: #fff;
  }
  .primary:disabled,
  .secondary:disabled {
    opacity: 0.6;
  }
  .or {
    text-align: center;
    color: #94a3b8;
    margin: 1rem 0;
    font-size: 0.8rem;
  }
  .error {
    color: #b91c1c;
    margin-top: 12px;
    font-size: 0.875rem;
  }
</style>
