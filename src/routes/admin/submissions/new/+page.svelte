<script lang="ts">
  let { data, form } = $props();
</script>

<a href="/admin/submissions" class="text-sm text-neutral-500 hover:text-neutral-300">← All submissions</a>
<h1 class="mt-2 text-2xl font-semibold">New submission</h1>
<p class="text-xs text-neutral-500">Submitting again for the same (model, version) overwrites the previous HTML.</p>

{#if data.models.length === 0 || data.versions.length === 0}
  <p class="mt-6 text-sm text-amber-400">
    You need at least one
    {#if data.models.length === 0}<a href="/admin/models" class="underline">model</a>{/if}
    {#if data.models.length === 0 && data.versions.length === 0} and {/if}
    {#if data.versions.length === 0}<a href="/admin/tests" class="underline">test version</a>{/if}
    before you can submit.
  </p>
{:else}
  <form method="POST" class="mt-6 max-w-3xl space-y-4">
    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <label class="block">
        <span class="text-xs text-neutral-500">Model</span>
        <select
          name="modelId"
          required
          class="mt-1 w-full rounded border border-neutral-700 bg-neutral-950 px-2 py-1 text-sm"
        >
          <option value="">— pick a model —</option>
          {#each data.models as m (m.id)}
            <option value={m.id} selected={String(m.id) === form?.values?.modelId}>
              {m.name} ({m.temperature ?? '—'} / {m.quantization ?? '—'})
            </option>
          {/each}
        </select>
      </label>
      <label class="block">
        <span class="text-xs text-neutral-500">Test version</span>
        <select
          name="testVersionId"
          required
          class="mt-1 w-full rounded border border-neutral-700 bg-neutral-950 px-2 py-1 text-sm"
        >
          <option value="">— pick a version —</option>
          {#each data.testGroups as g (g.testId)}
            <optgroup label={g.testName}>
              {#each g.versions as v (v.id)}
                <option value={v.id} selected={String(v.id) === form?.values?.testVersionId}>
                  v{v.versionNumber}{v.isCurrent ? ' (current)' : ''}
                </option>
              {/each}
            </optgroup>
          {/each}
        </select>
      </label>
    </div>
    <label class="block">
      <span class="text-xs text-neutral-500">HTML</span>
      <textarea
        name="html"
        required
        rows="20"
        placeholder="<!doctype html>..."
        class="mt-1 w-full rounded border border-neutral-700 bg-neutral-950 px-2 py-1 text-xs font-mono"
      >{form?.values?.html ?? ''}</textarea>
    </label>
    <div class="flex items-center gap-3">
      <button class="rounded bg-emerald-600 px-3 py-1 text-sm font-medium text-white hover:bg-emerald-500"
        >Save</button>
      {#if form?.error}
        <span class="text-sm text-red-400">{form.error}</span>
      {/if}
    </div>
  </form>
{/if}
