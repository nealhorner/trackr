<script lang="ts">
  import { goto } from "$app/navigation";

  let email = "admin@example.com";
  let err = "";

  async function submit(e: Event) {
    e.preventDefault();
    err = "";
    const res = await fetch("/api/v1/auth/dev-login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) {
      const j = (await res.json().catch(() => ({}))) as { message?: string };
      err = j.message ?? "Sign in failed";
      return;
    }
    await goto("/");
  }
</script>

<div class="login">
  <h1>Sign in (dev)</h1>
  <p class="hint">
    Use a seeded user (e.g. <code>admin@example.com</code>) after running the DB
    seed.
  </p>
  <form onsubmit={submit}>
    <label>
      Email
      <input name="email" type="email" bind:value={email} autocomplete="username" />
    </label>
    <button type="submit">Sign in</button>
    {#if err}
      <p class="error" role="alert">{err}</p>
    {/if}
  </form>
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
    border: 1px solid #e5e7eb;
    border-radius: 8px;
  }
  button {
    padding: 10px 14px;
    border-radius: 8px;
    border: none;
    background: #111827;
    color: #fff;
    cursor: pointer;
  }
  button:hover {
    opacity: 0.92;
  }
  .error {
    color: #b91c1c;
    font-size: 0.875rem;
    margin: 0;
  }
</style>
