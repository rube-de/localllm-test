<script lang="ts">
  let { data, form } = $props();
  // Build a quick lookup from id → model for the featured-models list
  const modelById = $derived(new Map(data.allModels.map((m) => [m.id, m])));
  const featured = $derived(
    data.test.defaultModelIds
      .map((id) => modelById.get(id))
      .filter((m): m is (typeof data.allModels)[number] => !!m)
  );
  const featuredIds = $derived(new Set(data.test.defaultModelIds));
  const unselectedModels = $derived(data.allModels.filter((m) => !featuredIds.has(m.id)));
  const featuredJson = $derived(JSON.stringify(data.test.defaultModelIds));
</script>

<a href="/admin/tests" class="text-sm text-neutral-500 hover:text-neutral-300">← All tests</a>
<h1 class="mt-2 text-2xl font-semibold">{data.test.name}</h1>
<div class="text-xs text-neutral-500">/{data.test.slug}</div>

<!-- Edit basics -->
<section class="mt-6 rounded-lg border border-neutral-800 bg-neutral-900 p-4">
  <h2 class="text-sm font-medium text-neutral-400">Basics</h2>
  <form method="POST" action="?/updateBasics" class="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
    <label class="block">
      <span class="text-xs text-neutral-500">Name</span>
      <input
        name="name"
        required
        value={form?.values?.name ?? data.test.name}
        class="mt-1 w-full rounded border border-neutral-700 bg-neutral-950 px-2 py-1 text-sm"
      />
    </label>
    <label class="block">
      <span class="text-xs text-neutral-500">Slug</span>
      <input
        name="slug"
        required
        value={form?.values?.slug ?? data.test.slug}
        class="mt-1 w-full rounded border border-neutral-700 bg-neutral-950 px-2 py-1 text-sm"
      />
    </label>
    <div class="sm:col-span-2 flex items-center gap-3">
      <button class="rounded bg-emerald-600 px-3 py-1 text-sm font-medium text-white hover:bg-emerald-500"
        >Save</button>
      {#if form?.error && form?.section === 'basics'}
        <span class="text-sm text-red-400">{form.error}</span>
      {/if}
      {#if form?.saved && form?.section === 'basics'}
        <span class="text-sm text-emerald-400">Saved.</span>
      {/if}
    </div>
  </form>
</section>

<!-- Versions -->
<section class="mt-6 rounded-lg border border-neutral-800 bg-neutral-900 p-4">
  <div class="flex items-center justify-between">
    <h2 class="text-sm font-medium text-neutral-400">Versions</h2>
    <a
      href={`/admin/tests/${data.test.id}/versions/new`}
      class="rounded bg-emerald-600 px-3 py-1 text-sm font-medium text-white hover:bg-emerald-500"
    >+ New version</a>
  </div>
  <ul class="mt-3 space-y-2">
    {#each data.versions as v (v.id)}
      <li class="rounded border border-neutral-800 p-3">
        <div class="flex items-center gap-2">
          <span class="text-sm font-medium">v{v.versionNumber}</span>
          {#if v.id === data.test.currentVersionId}
            <span class="rounded bg-emerald-900/50 px-2 py-0.5 text-xs text-emerald-300"
              >current</span>
          {:else}
            <form method="POST" action="?/setCurrent">
              <input type="hidden" name="versionId" value={v.id} />
              <button class="text-xs text-neutral-400 underline hover:text-neutral-100"
                >set current</button>
            </form>
          {/if}
          <span class="ml-auto text-xs text-neutral-500"
            >{new Date(v.createdAt).toISOString().slice(0, 10)}</span>
        </div>
        <pre class="mt-2 max-h-40 overflow-auto whitespace-pre-wrap rounded bg-neutral-950 p-2 text-xs text-neutral-300">{v.prompt}</pre>
      </li>
    {/each}
  </ul>
</section>

<!-- Featured models -->
<section class="mt-6 rounded-lg border border-neutral-800 bg-neutral-900 p-4">
  <h2 class="text-sm font-medium text-neutral-400">Featured models (shown by default in comparison)</h2>

  {#if featured.length === 0}
    <p class="mt-3 text-sm text-neutral-500">None yet. Add models below.</p>
  {:else}
    <ol class="mt-3 space-y-2">
      {#each featured as m, i (m.id)}
        <li class="flex items-center gap-2 rounded border border-neutral-800 px-3 py-2 text-sm">
          <span class="font-mono text-xs text-neutral-500">{i + 1}.</span>
          <span class="font-medium">{m.name}</span>
          <span class="text-xs text-neutral-500">
            {m.temperature ?? '—'} / {m.quantization ?? '—'}
          </span>
          <div class="ml-auto flex gap-1">
            {#if i > 0}
              <form method="POST" action="?/moveModelUp">
                <input type="hidden" name="modelId" value={m.id} />
                <button class="rounded border border-neutral-700 px-2 text-xs hover:bg-neutral-800">↑</button>
              </form>
            {/if}
            {#if i < featured.length - 1}
              <form method="POST" action="?/moveModelDown">
                <input type="hidden" name="modelId" value={m.id} />
                <button class="rounded border border-neutral-700 px-2 text-xs hover:bg-neutral-800">↓</button>
              </form>
            {/if}
            <form method="POST" action="?/removeModel">
              <input type="hidden" name="modelId" value={m.id} />
              <button
                class="rounded border border-red-800 bg-red-950/50 px-2 text-xs text-red-300 hover:bg-red-900/50"
                >×</button>
            </form>
          </div>
        </li>
      {/each}
    </ol>
  {/if}

  {#if unselectedModels.length > 0}
    <form method="POST" action="?/addModel" class="mt-4 flex gap-2 text-sm">
      <select
        name="modelId"
        required
        class="rounded border border-neutral-700 bg-neutral-950 px-2 py-1"
      >
        <option value="">— add a model —</option>
        {#each unselectedModels as m (m.id)}
          <option value={m.id}>
            {m.name} ({m.temperature ?? '—'}/{m.quantization ?? '—'})
          </option>
        {/each}
      </select>
      <button class="rounded bg-emerald-600 px-3 py-1 font-medium text-white hover:bg-emerald-500"
        >+ Add</button>
    </form>
  {/if}

  <p class="mt-3 text-xs text-neutral-500">Stored: <code>{featuredJson}</code></p>
</section>

<!-- Delete -->
<form
  method="POST"
  action="?/delete"
  class="mt-10 border-t border-neutral-800 pt-4"
  onsubmit={(e) => {
    if (!confirm('Delete this test, all its versions and submissions?')) e.preventDefault();
  }}
>
  <button class="rounded border border-red-800 bg-red-950/50 px-3 py-1 text-sm text-red-300 hover:bg-red-900/50">
    Delete test
  </button>
</form>
