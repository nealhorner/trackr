<script lang="ts">
  import type { PageData } from "./$types";

  export let data: PageData;

  let newComment = "";
  let saving = false;
  let saveErr = "";

  async function addComment(e: Event) {
    e.preventDefault();
    if (!newComment.trim()) return;
    saving = true;
    saveErr = "";
    const res = await fetch(`/api/v1/tickets/${data.ticket.id}/comments`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: newComment }),
    });
    saving = false;
    if (!res.ok) {
      const j = (await res.json().catch(() => ({}))) as { message?: string };
      saveErr = j.message ?? "Could not add comment";
      return;
    }
    newComment = "";
    window.location.reload();
  }
</script>

<p class="back">
  <a href="/projects/{data.ticket.projectId}/board">← Board</a>
</p>

<h1>{data.ticket.title}</h1>
<p class="meta">
  #{data.ticket.id} · {data.ticket.status}
</p>

{#if data.ticket.descriptionMarkdown}
  <div class="desc">{data.ticket.descriptionMarkdown}</div>
{/if}

<section class="comments">
  <h2>Comments</h2>
  <ul>
    {#each data.comments as c}
      <li>
        <div class="cm-head">
          <span class="author">{c.author.email}</span>
          <time datetime={c.createdAt}>{c.createdAt}</time>
        </div>
        <p class="cm-body">{c.body}</p>
      </li>
    {/each}
  </ul>

  <form class="add" onsubmit={addComment}>
    <label>
      Add comment
      <textarea bind:value={newComment} rows="3"></textarea>
    </label>
    <button type="submit" disabled={saving}>Post</button>
    {#if saveErr}
      <p class="err" role="alert">{saveErr}</p>
    {/if}
  </form>
</section>

<style>
  .back {
    margin-bottom: 0.5rem;
  }
  .back a {
    color: #2563eb;
    text-decoration: none;
  }
  .meta {
    color: #6b7280;
    font-size: 0.875rem;
  }
  .desc {
    margin: 1rem 0;
    white-space: pre-wrap;
  }
  .comments {
    margin-top: 1.5rem;
    border-top: 1px solid #e5e7eb;
    padding-top: 1rem;
  }
  .comments ul {
    list-style: none;
    padding: 0;
    margin: 0 0 1rem;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .cm-head {
    display: flex;
    gap: 8px;
    font-size: 0.75rem;
    color: #6b7280;
  }
  .author {
    font-weight: 600;
    color: #374151;
  }
  .cm-body {
    margin: 4px 0 0;
    font-size: 0.875rem;
  }
  .add label {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 0.875rem;
  }
  textarea {
    font-family: inherit;
    padding: 8px;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
  }
  button {
    margin-top: 8px;
    padding: 8px 12px;
    border-radius: 8px;
    border: none;
    background: #111827;
    color: #fff;
    cursor: pointer;
  }
  button:disabled {
    opacity: 0.6;
  }
  .err {
    color: #b91c1c;
    font-size: 0.875rem;
  }
</style>
