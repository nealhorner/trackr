<script lang="ts">
  import { onMount } from "svelte";

  import { goto } from "$app/navigation";

  import { authClient } from "$lib/auth-client";
  import { ENV } from "varlock/env";

  type AuthFlags = {
    password: boolean;
    google: boolean;
    apple: boolean;
    github: boolean;
    okta: boolean;
  };

  let email = "";
  let password = "";
  if (ENV.APP_ENV === "development") {
    email = "admin@example.com";
    password = "TrackrDev!local1";
  }
  let err = "";
  let busy = false;
  let setupComplete = true;
  let auth: AuthFlags = {
    password: true,
    google: false,
    apple: false,
    github: false,
    okta: false,
  };
  let authAvailable: AuthFlags = { ...auth };

  onMount(async () => {
    const r = await fetch("/api/v1/public-config", { credentials: "include" });
    const j = (await r.json()) as {
      data: {
        setupComplete: boolean;
        auth: AuthFlags;
        authAvailable: AuthFlags;
      };
    };
    setupComplete = j.data.setupComplete;
    auth = j.data.auth;
    authAvailable = j.data.authAvailable ?? j.data.auth;
    if (!setupComplete) {
      await goto("/setup");
    }
  });

  async function submit(e: Event) {
    e.preventDefault();
    err = "";
    busy = true;
    try {
      const res = await fetch("/api/auth/sign-in/email", {
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
        const t = (await res.text().catch(() => "")) || "Sign in failed";
        err = t;
        return;
      }
      await goto("/welcome");
    } finally {
      busy = false;
    }
  }

  async function oauthSocial(provider: "google" | "github" | "apple") {
    err = "";
    busy = true;
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: `${window.location.origin}/welcome`,
      });
    } catch (e) {
      err = e instanceof Error ? e.message : "Sign in failed";
    } finally {
      busy = false;
    }
  }

  async function oauthOkta() {
    err = "";
    busy = true;
    try {
      await authClient.signIn.oauth2({
        providerId: "okta",
        callbackURL: `${window.location.origin}/welcome`,
      });
    } catch (e) {
      err = e instanceof Error ? e.message : "Sign in failed";
    } finally {
      busy = false;
    }
  }
</script>

<div class="login">
  <h1>Sign in</h1>
  <p class="hint">
    Use the administrator account you created during setup (or a seeded user in development).
  </p>

  {#if authAvailable.google && auth.google}
    <button
      type="button"
      class="oauth"
      disabled={busy}
      onclick={() => oauthSocial("google")}
    >
      Continue with Google
    </button>
  {/if}
  {#if authAvailable.github && auth.github}
    <button
      type="button"
      class="oauth"
      disabled={busy}
      onclick={() => oauthSocial("github")}
    >
      Continue with GitHub
    </button>
  {/if}
  {#if authAvailable.apple && auth.apple}
    <button
      type="button"
      class="oauth"
      disabled={busy}
      onclick={() => oauthSocial("apple")}
    >
      Continue with Apple
    </button>
  {/if}
  {#if authAvailable.okta && auth.okta}
    <button
      type="button"
      class="oauth"
      disabled={busy}
      onclick={() => oauthOkta()}
    >
      Continue with Okta
    </button>
  {/if}

  {#if auth.password && authAvailable.password}
    <form onsubmit={submit}>
      <label>
        Email
        <input name="email" type="email" bind:value={email} autocomplete="username" />
      </label>
      <label>
        Password
        <input
          name="password"
          type="password"
          bind:value={password}
          autocomplete="current-password"
        />
      </label>
      <button type="submit" disabled={busy}>Sign in with email</button>
    </form>
  {/if}

  {#if err}
    <p class="error" role="alert">{err}</p>
  {/if}
</div>

<style>
  .login {
    max-width: 400px;
    margin: 4rem auto;
    padding: 1.5rem;
    font-family:
      system-ui,
      sans-serif;
  }
  h1 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }
  .hint {
    color: #6b7280;
    font-size: 0.875rem;
    margin-bottom: 1rem;
  }
  .oauth {
    display: block;
    width: 100%;
    margin-bottom: 10px;
    padding: 10px 14px;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
    background: #fff;
    cursor: pointer;
    font-size: 0.875rem;
  }
  .oauth:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #e5e7eb;
  }
  label {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 0.875rem;
  }
  input {
    padding: 8px 10px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
  }
  form button {
    padding: 10px 14px;
    border-radius: 8px;
    border: none;
    background: #111827;
    color: #fff;
    cursor: pointer;
  }
  form button:disabled {
    opacity: 0.6;
  }
  form button:hover:enabled {
    opacity: 0.92;
  }
  .error {
    color: #b91c1c;
    font-size: 0.875rem;
    margin: 0.75rem 0 0;
  }
</style>
