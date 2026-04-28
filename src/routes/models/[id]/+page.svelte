<script lang="ts">
  let { data } = $props();
</script>

<a
  href="/models"
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
  all models
</a>

<header class="mt-3 grid grid-cols-1 gap-6 pb-2 md:grid-cols-12 md:gap-8">
  <div class="md:col-span-9">
    <div class="eyebrow mb-3">/models/{data.model.id}</div>
    <h1
      class="text-[clamp(2rem,4.4vw,3.25rem)] font-medium leading-[1.02] tracking-[-0.03em] text-neutral-100"
    >
      {data.model.name}
    </h1>
    <p class="mt-3 font-mono text-[12px] tracking-tight text-neutral-500">
      temp {data.model.temperature ?? '—'} · {data.model.quantization ?? '—'}
      {#if data.model.paramsNotes}
        <span class="text-neutral-700">·</span> {data.model.paramsNotes}
      {/if}
    </p>
  </div>

  <aside class="flex items-end md:col-span-3 md:justify-end">
    <div
      class="surface-card inline-flex items-baseline gap-2 rounded-2xl px-5 py-4 font-mono text-[12px] tracking-tight"
    >
      <span class="text-2xl font-medium text-neutral-100">{data.submissions.length}</span>
      <span class="text-neutral-500">
        {data.submissions.length === 1 ? 'submission' : 'submissions'}
      </span>
    </div>
  </aside>
</header>

<div class="flex items-baseline justify-between gap-6 border-t border-white/[0.06] pt-8 pb-6">
  <h2 class="text-[13px] font-medium tracking-tight text-neutral-300">Submissions</h2>
  <span class="font-mono text-[11px] tracking-tight text-neutral-600">test · version</span>
</div>

{#if data.submissions.length === 0}
  <div class="surface-card grid place-items-center rounded-3xl px-8 py-16 text-center">
    <div class="max-w-sm space-y-2">
      <div class="eyebrow">empty</div>
      <p class="text-[15px] text-neutral-300">No submissions for this model yet.</p>
    </div>
  </div>
{:else}
  <ul class="cascade divide-y divide-white/[0.06] overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.015]">
    {#each data.submissions as s, i (s.id)}
      <li style="--i: {i};">
        <a
          href={`/tests/${s.testSlug}?v=${s.testVersionId}&models=${data.model.id}`}
          class="group flex items-center justify-between gap-4 px-6 py-4 transition-colors duration-300 hover:bg-white/[0.025]"
        >
          <div class="min-w-0 flex-1">
            <div class="truncate text-[15px] font-medium tracking-tight text-neutral-100">
              {s.testName}
            </div>
            <div class="mt-1 font-mono text-[11px] tracking-tight text-neutral-500">
              /{s.testSlug}
            </div>
          </div>
          <span
            class="shrink-0 rounded-full border border-white/[0.08] bg-black/30 px-2.5 py-0.5 font-mono text-[11px] text-neutral-400"
          >
            v{s.versionNumber}
          </span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            class="shrink-0 text-neutral-600 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-[var(--color-accent-400)]"
            aria-hidden="true"
          >
            <path
              d="M4 7h6m0 0L7 4m3 3L7 10"
              stroke="currentColor"
              stroke-width="1.4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </a>
      </li>
    {/each}
  </ul>
{/if}
