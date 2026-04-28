<script lang="ts">
  let { data, form } = $props();
</script>

<a href="/admin/models" class="text-sm text-neutral-500 hover:text-neutral-300">← All models</a>
<h1 class="mt-2 text-2xl font-semibold">{data.model.name}</h1>

<form method="POST" action="?/update" class="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
  <label class="block">
    <span class="text-xs text-neutral-500">Name</span>
    <input
      name="name"
      required
      value={form?.values?.name ?? data.model.name}
      class="mt-1 w-full rounded border border-neutral-700 bg-neutral-950 px-2 py-1 text-sm"
    />
  </label>
  <label class="block">
    <span class="text-xs text-neutral-500">Temperature</span>
    <input
      name="temperature"
      type="number"
      step="0.01"
      value={form?.values?.temperature ?? (data.model.temperature ?? '')}
      class="mt-1 w-full rounded border border-neutral-700 bg-neutral-950 px-2 py-1 text-sm"
    />
  </label>
  <label class="block">
    <span class="text-xs text-neutral-500">Quantization</span>
    <input
      name="quantization"
      value={form?.values?.quantization ?? (data.model.quantization ?? '')}
      class="mt-1 w-full rounded border border-neutral-700 bg-neutral-950 px-2 py-1 text-sm"
    />
  </label>
  <label class="block">
    <span class="text-xs text-neutral-500">Notes</span>
    <input
      name="paramsNotes"
      value={form?.values?.paramsNotes ?? (data.model.paramsNotes ?? '')}
      class="mt-1 w-full rounded border border-neutral-700 bg-neutral-950 px-2 py-1 text-sm"
    />
  </label>
  <div class="sm:col-span-2 flex items-center gap-3">
    <button class="rounded bg-emerald-600 px-3 py-1 text-sm font-medium text-white hover:bg-emerald-500">
      Save
    </button>
    {#if form?.error}
      <span class="text-sm text-red-400">{form.error}</span>
    {/if}
    {#if form?.saved}
      <span class="text-sm text-emerald-400">Saved.</span>
    {/if}
  </div>
</form>

<form
  method="POST"
  action="?/delete"
  class="mt-10 border-t border-neutral-800 pt-4"
  onsubmit={(e) => {
    if (!confirm('Delete this model and all its submissions?')) e.preventDefault();
  }}
>
  <button class="rounded border border-red-800 bg-red-950/50 px-3 py-1 text-sm text-red-300 hover:bg-red-900/50">
    Delete model
  </button>
</form>
