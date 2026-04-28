<script lang="ts">
  let { data, form } = $props();
</script>

<h1 class="text-2xl font-semibold">Tests</h1>

<section class="mt-6 rounded-lg border border-neutral-800 bg-neutral-900 p-4">
  <h2 class="text-sm font-medium text-neutral-400">Create test</h2>
  <form method="POST" action="?/create" class="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
    <label class="block">
      <span class="text-xs text-neutral-500">Name</span>
      <input
        name="name"
        required
        placeholder="Snake game"
        value={form?.values?.name ?? ''}
        class="mt-1 w-full rounded border border-neutral-700 bg-neutral-950 px-2 py-1 text-sm"
      />
    </label>
    <label class="block">
      <span class="text-xs text-neutral-500">Slug (URL)</span>
      <input
        name="slug"
        placeholder="auto from name if empty"
        value={form?.values?.slug ?? ''}
        class="mt-1 w-full rounded border border-neutral-700 bg-neutral-950 px-2 py-1 text-sm"
      />
    </label>
    <label class="block sm:col-span-2">
      <span class="text-xs text-neutral-500">Initial prompt (v1)</span>
      <textarea
        name="prompt"
        required
        rows="6"
        placeholder="Write a single-file HTML5 snake game..."
        class="mt-1 w-full rounded border border-neutral-700 bg-neutral-950 px-2 py-1 text-sm font-mono"
      >{form?.values?.prompt ?? ''}</textarea>
    </label>
    <div class="sm:col-span-2 flex items-center gap-3">
      <button class="rounded bg-emerald-600 px-3 py-1 text-sm font-medium text-white hover:bg-emerald-500">
        Create
      </button>
      {#if form?.error}
        <span class="text-sm text-red-400">{form.error}</span>
      {/if}
    </div>
  </form>
</section>

<section class="mt-6">
  {#if data.tests.length === 0}
    <p class="text-neutral-400">No tests yet.</p>
  {:else}
    <ul class="space-y-2">
      {#each data.tests as t (t.id)}
        <li class="rounded border border-neutral-800 bg-neutral-900 p-3">
          <a href={`/admin/tests/${t.id}`} class="font-medium hover:underline">{t.name}</a>
          <span class="ml-2 text-xs text-neutral-500">/{t.slug}</span>
          <span class="ml-2 text-xs text-neutral-500">v{t.currentVersionNumber ?? '?'}</span>
          <span class="ml-2 text-xs text-neutral-500">{t.versionCount} version{t.versionCount === 1 ? '' : 's'}</span>
        </li>
      {/each}
    </ul>
  {/if}
</section>
