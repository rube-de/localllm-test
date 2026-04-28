<script lang="ts">
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import IframeCell from '$lib/components/IframeCell.svelte';
  import ModelChipRow from '$lib/components/ModelChipRow.svelte';

  let { data } = $props();

  let soloModelId = $state<number | null>(null);
  let promptOpen = $state(false);

  const modelOptions = $derived(
    data.allModels.map((m) => ({
      id: m.id,
      label: `${m.name} (${m.temperature ?? '—'}/${m.quantization ?? '—'})`
    }))
  );

  function gotoWith(params: Record<string, string | null>) {
    const u = new URL(page.url);
    for (const [k, v] of Object.entries(params)) {
      if (v === null) u.searchParams.delete(k);
      else u.searchParams.set(k, v);
    }
    goto(u, { replaceState: true, noScroll: true, keepFocus: true });
  }

  function setModels(ids: number[]) {
    gotoWith({ models: ids.length ? ids.join(',') : null });
  }

  function setVersion(versionId: number) {
    gotoWith({ v: String(versionId) });
  }

  function handleEsc(e: KeyboardEvent) {
    if (e.key === 'Escape' && soloModelId !== null) soloModelId = null;
  }
</script>

<svelte:window onkeydown={handleEsc} />

<a
  href="/"
  class="inline-flex items-center gap-1.5 font-mono text-[12px] tracking-tight text-neutral-500 transition-colors hover:text-neutral-200"
>
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
    <path
      d="M6.5 2.5L3.5 5l3 2.5"
      stroke="currentColor"
      stroke-width="1.4"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
  all tests
</a>

<header class="mt-3 grid grid-cols-1 gap-6 pb-2 md:grid-cols-12 md:gap-8">
  <div class="md:col-span-9">
    <div class="eyebrow mb-3">/tests/{data.test.slug}</div>
    <h1
      class="text-[clamp(2rem,4.4vw,3.25rem)] font-medium leading-[1.02] tracking-[-0.03em] text-neutral-100"
    >
      {data.test.name}
    </h1>
  </div>

  <div class="flex items-end md:col-span-3 md:justify-end">
    <label class="flex items-center gap-2 font-mono text-[11px] tracking-tight">
      <span class="text-neutral-500">version</span>
      <select
        value={data.version.id}
        onchange={(e) => setVersion(Number((e.target as HTMLSelectElement).value))}
        class="surface-card rounded-full px-3 py-1.5 text-[12px] tracking-tight text-neutral-100 outline-none transition-colors hover:border-white/15 focus:!border-[var(--color-accent-500)]"
      >
        {#each data.versions as v (v.id)}
          <option value={v.id}>
            v{v.versionNumber}{v.id === data.test.currentVersionId ? ' · current' : ''}
          </option>
        {/each}
      </select>
    </label>
  </div>
</header>

<details class="group mt-6" bind:open={promptOpen}>
  <summary
    class="surface-card flex cursor-pointer items-center justify-between rounded-2xl px-5 py-3 text-[12px] transition-colors hover:border-white/15"
  >
    <span class="flex items-center gap-2 font-mono tracking-tight text-neutral-300">
      <span
        class="grid h-5 w-5 place-items-center rounded-full bg-white/5 text-[10px] text-neutral-400 transition-transform duration-300 group-open:rotate-90"
      >
        <svg width="7" height="7" viewBox="0 0 7 7" fill="none" aria-hidden="true">
          <path
            d="M2 1l3 2.5L2 6"
            stroke="currentColor"
            stroke-width="1.3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </span>
      prompt
    </span>
    <span class="font-mono text-[11px] tracking-tight text-neutral-600">
      {data.version.prompt.length} chars
    </span>
  </summary>
  <div
    class="mt-2 max-h-64 overflow-auto rounded-2xl border border-white/[0.06] bg-black/40 p-5"
  >
    <pre
      class="whitespace-pre-wrap font-mono text-[12px] leading-relaxed text-neutral-300">{data.version.prompt}</pre>
  </div>
</details>

<div
  class="glass sticky top-0 z-20 mt-6 -mx-6 rounded-none px-6 py-3 sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12"
>
  <ModelChipRow
    selected={data.selectedIds}
    available={modelOptions}
    onChange={setModels}
  />
</div>

{#if data.cells.length === 0}
  <div
    class="surface-card mt-8 grid place-items-center rounded-3xl px-8 py-16 text-center"
  >
    <div class="max-w-sm space-y-3">
      <div class="eyebrow">empty</div>
      <p class="text-[15px] text-neutral-300">No models selected.</p>
      <p class="text-sm text-neutral-500">
        Pick at least one above, or
        <a
          href="/admin/tests/{data.test.id}"
          class="text-[var(--color-accent-400)] underline-offset-4 hover:underline"
          >edit this test</a
        > to set defaults.
      </p>
    </div>
  </div>
{:else}
  <div
    class="cascade mt-6 grid gap-5"
    class:grid-cols-1={soloModelId !== null || data.cells.length === 1}
    class:sm:grid-cols-2={soloModelId === null && data.cells.length >= 2}
    class:xl:grid-cols-3={soloModelId === null && data.cells.length >= 3}
  >
    {#each data.cells as cell, i (cell.model.id)}
      {#if soloModelId === null || soloModelId === cell.model.id}
        <div style="--i: {i};">
          <IframeCell
            title={cell.model.name}
            subtitle={`temp ${cell.model.temperature ?? '—'} · ${cell.model.quantization ?? '—'}`}
            html={cell.html}
            isSolo={soloModelId === cell.model.id}
            onSolo={() => (soloModelId = cell.model.id)}
            onExitSolo={() => (soloModelId = null)}
          />
        </div>
      {/if}
    {/each}
  </div>
{/if}
