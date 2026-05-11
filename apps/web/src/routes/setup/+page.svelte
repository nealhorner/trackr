<script lang="ts">
  import { onMount } from "svelte";

  import { goto } from "$app/navigation";

  type AuthFlags = { password: boolean; google: boolean; apple: boolean; github: boolean; okta: boolean };

  let tenantName = "";
  let adminEmail = "";
  let adminPassword = "";
  let err = "";
  let busy = false;
  let needsSetup = true;
  let setupTokenConfigured = false;
  let token = "";
  const auth: AuthFlags = {
    password: true,
    google: false,
    apple: false,
    github: false,
    okta: false,
  };

  onMount(async () => {
    const s = await fetch("/api/v1/setup/status", { credentials: "include" });
    const j = (await s.json()) as { data: { needsSetup: boolean; setupTokenConfigured: boolean; prefill?: { tenantName?: string; adminEmail?: string; authSettings?: Partial<AuthFlags> } } };
    needsSetup = j.data.needsSetup;
    setupTokenConfigured = j.data.setupTokenConfigured;
    if (!needsSetup) {
      await goto("/");
      return;
    }
    const p = j.data.prefill;
    if (p?.tenantName) tenantName = p.tenantName;
    if (p?.adminEmail) adminEmail = p.adminEmail;
    if (p?.authSettings) {
      for (const k of Object.keys(auth) as (keyof AuthFlags)[]) {
        if (typeof p.authSettings![k] === "boolean")
          (auth as Record<string, boolean>)[k] = p.authSettings![k] as boolean;
      }
    }
  });

  async function submit(e: Event) {
    e.preventDefault();
    err = "";
    busy = true;
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (setupTokenConfigured) headers["X-Trackr-Setup-Token"] = token;
      const res = await fetch("/api/v1/setup/complete", {
        method: "POST",
        credentials: "include",
        headers,
        body: JSON.stringify({
          tenantName,
          adminEmail,
          adminPassword,
          adminDisplayName: adminEmail.split("@")[0] ?? "Admin",
          authSettings: auth,
          setupToken: token || undefined,
        }),
      });
      if (!res.ok) {
        const b = (await res.json().catch(() => ({}))) as { message?: string };
        err = b.message ?? "Setup failed";
        return;
      }
      await goto("/login");
    } finally {
      busy = false;
    }
  }
</script>

<div class="page">
  <h1>Welcome to Trackr</h1>
  <p class="sub">
    Create your organization, administrator account, and which sign-in options you will offer.
    (OAuth providers still require environment configuration on the server.)
  </p>
  <form onsubmit={submit}>
    <label>
      Organization / tenant name
      <input name="tenant" required minlength="1" maxlength="200" bind:value={tenantName} />
    </label>
    <label>
      Administrator email
      <input name="email" type="email" required bind:value={adminEmail} />
    </label>
    <label>
      Administrator password
      <input
        name="password"
        type="password"
        required
        minlength="8"
        bind:value={adminPassword}
        autocomplete="new-password"
      />
    </label>
    {#if setupTokenConfigured}
      <label>
        Setup token
        <input
          name="token"
          type="password"
          required
          bind:value={token}
          autocomplete="off"
        />
      </label>
      <p class="hint">A setup token is required. Set it with <code>TRACKR_SETUP_SECRET</code> on the server.</p>
    {/if}
    <section class="flags" aria-label="Planned sign-in options">
      <h2>Sign-in options (onboarding)</h2>
      <label class="ck"><input type="checkbox" bind:checked={auth.password} /> Email & password</label>
      <label class="ck"><input type="checkbox" bind:checked={auth.google} /> Google</label>
      <label class="ck"><input type="checkbox" bind:checked={auth.github} /> GitHub</label>
      <label class="ck"><input type="checkbox" bind:checked={auth.apple} /> Apple</label>
      <label class="ck"><input type="checkbox" bind:checked={auth.okta} /> Okta (OIDC)</label>
    </section>
    <button type="submit" disabled={busy}>Complete setup</button>
    {#if err}
      <p class="error" role="alert">{err}</p>
    {/if}
  </form>
</div>

<style>
  .page {
    max-width: 480px;
    margin: 2rem auto;
    padding: 1.5rem;
    font-family: system-ui, sans-serif;
  }
  h1 {
    font-size: 1.5rem;
  }
  h2 {
    font-size: 1rem;
    margin: 0 0 0.5rem 0;
  }
  .sub {
    color: #4b5563;
    font-size: 0.9rem;
    margin-bottom: 1.25rem;
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  label {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    font-size: 0.875rem;
  }
  input {
    padding: 8px 10px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
  }
  .flags {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 12px;
  }
  .ck {
    flex-direction: row;
    align-items: center;
    gap: 8px;
  }
  .hint {
    color: #6b7280;
    font-size: 0.8rem;
  }
  button {
    margin-top: 0.5rem;
    padding: 10px 14px;
    border-radius: 8px;
    border: none;
    background: #111827;
    color: #fff;
    cursor: pointer;
  }
  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  .error {
    color: #b91c1c;
  }
  code {
    background: #f3f4f6;
    padding: 0 4px;
    border-radius: 4px;
  }
</style>
