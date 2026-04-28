<script lang="ts">
  let { data, form } = $props();
</script>

<h1 class="text-2xl font-semibold">Models</h1>

<section class="mt-6 rounded-lg border border-neutral-800 bg-neutral-900 p-4">
  <h2 class="text-sm font-medium text-neutral-400">Add model</h2>
  <form method="POST" action="?/create" class="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-4">
    <label class="block">
      <span class="text-xs text-neutral-500">Name</span>
      <input
        name="name"
        required
        placeholder="gemma4-4b"
        value={form?.values?.name ?? ''}
        class="mt-1 w-full rounded border border-neutral-700 bg-neutral-950 px-2 py-1 text-sm"
      />
    </label>
    <label class="block">
      <span class="text-xs text-neutral-500">Temperature</span>
      <input
        name="temperature"
        type="number"
        step="0.01"
        placeholder="0.7"
        value={form?.values?.temperature ?? ''}
        class="mt-1 w-full rounded border border-neutral-700 bg-neutral-950 px-2 py-1 text-sm"
      />
    </label>
    <label class="block">
      <span class="text-xs text-neutral-500">Quantization</span>
      <input
        name="quantization"
        placeholder="q4"
        value={form?.values?.quantization ?? ''}
        class="mt-1 w-full rounded border border-neutral-700 bg-neutral-950 px-2 py-1 text-sm"
      />
    </label>
    <label class="block sm:col-span-1">
      <span class="text-xs text-neutral-500">&nbsp;</span>
      <button class="mt-1 w-full rounded bg-emerald-600 px-3 py-1 text-sm font-medium text-white hover:bg-emerald-500">
        Create
      </button>
    </label>
    <label class="block sm:col-span-4">
      <span class="text-xs text-neutral-500">Notes (optional)</span>
      <input
        name="paramsNotes"
        placeholder="anything else worth remembering"
        value={form?.values?.paramsNotes ?? ''}
        class="mt-1 w-full rounded border border-neutral-700 bg-neutral-950 px-2 py-1 text-sm"
      />
    </label>
  </form>
  {#if form?.error}
    <p class="mt-3 text-sm text-red-400">{form.error}</p>
  {/if}
</section>

<section class="mt-6">
  {#if data.models.length === 0}
    <p class="text-neutral-400">No models yet.</p>
  {:else}
    <table class="w-full text-sm">
      <thead class="text-left text-xs text-neutral-500">
        <tr>
          <th class="py-2">Name</th>
          <th>Temperature</th>
          <th>Quantization</th>
          <th>Notes</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {#each data.models as m (m.id)}
          <tr class="border-t border-neutral-800">
            <td class="py-2 font-medium">{m.name}</td>
            <td>{m.temperature ?? '—'}</td>
            <td>{m.quantization ?? '—'}</td>
            <td class="text-neutral-400">{m.paramsNotes ?? ''}</td>
            <td class="text-right">
              <a href={`/admin/models/${m.id}`} class="text-neutral-300 underline hover:text-neutral-100">edit</a>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</section>
