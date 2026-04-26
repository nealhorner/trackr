<script lang="ts">
  import { invoke } from "@tauri-apps/api/core";

  let lastResult = $state("");
  let inFlight = $state(false);

  async function exportData() {
    inFlight = true;
    try {
      const result = await invoke<string>("export_local_data");
      lastResult = `Exported to ${result}`;
    } catch (error) {
      lastResult = String(error);
    } finally {
      inFlight = false;
    }
  }

  async function importData() {
    inFlight = true;
    try {
      const result = await invoke<string>("import_local_data");
      lastResult = `Imported from ${result}`;
    } catch (error) {
      lastResult = String(error);
    } finally {
      inFlight = false;
    }
  }
</script>

<h2>Local Data</h2>
<p>Use export before upgrading or moving to a different machine.</p>
<div class="row">
  <button onclick={exportData} disabled={inFlight}>Export JSON backup</button>
  <button onclick={importData} disabled={inFlight}>Import JSON (replace local data)</button>
</div>
{#if lastResult}
  <p>{lastResult}</p>
{/if}

<style>
  .row {
    display: flex;
    gap: 10px;
  }
  button {
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    background: #fff;
    padding: 8px 12px;
    cursor: pointer;
  }
</style>
