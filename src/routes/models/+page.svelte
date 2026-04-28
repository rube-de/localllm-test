<script lang="ts">
  let { data } = $props();

  const totalSubmissions = $derived(
    data.models.reduce((acc, m) => acc + m.submissionCount, 0)
  );
</script>

<section class="grid grid-cols-1 gap-10 pt-4 pb-12 md:grid-cols-12 md:gap-8">
  <div class="md:col-span-8">
    <div class="eyebrow mb-5">/ models · roster</div>
    <h1
      class="text-[clamp(2.5rem,6vw,4.5rem)] font-medium leading-[0.95] tracking-[-0.035em] text-neutral-100"
    >
      Every model<br />
      <span class="text-neutral-500">that has ever</span>
      <span class="gradient-text">answered a test.</span>
    </h1>
  </div>
  <aside class="flex flex-col justify-end gap-3 md:col-span-4">
    <div
      class="surface-card flex items-center justify-between rounded-2xl px-5 py-4 font-mono text-[12px] tracking-tight"
    >
      <span class="text-neutral-500">models</span>
      <span class="text-2xl font-medium text-neutral-100">
        {String(data.models.length).padStart(2, '0')}
      </span>
    </div>
    <div
      class="surface-card flex items-center justify-between rounded-2xl px-5 py-4 font-mono text-[12px] tracking-tight"
    >
      <span class="text-neutral-500">total submissions</span>
      <span class="text-neutral-300">{totalSubmissions}</span>
    </div>
  </aside>
</section>

<div class="flex items-baseline justify-between gap-6 border-t border-white/[0.06] pt-8 pb-6">
  <h2 class="text-[13px] font-medium tracking-tight text-neutral-300">All models</h2>
  <span class="font-mono text-[11px] tracking-tight text-neutral-600">
    sorted A→Z
  </span>
</div>

{#if data.models.length === 0}
  <div class="surface-card grid place-items-center rounded-3xl px-8 py-16 text-center">
    <div class="max-w-sm space-y-2">
      <div class="eyebrow">empty</div>
      <p class="text-[15px] text-neutral-300">No models yet.</p>
    </div>
  </div>
{:else}
  <ul class="cascade grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {#each data.models as m, i (m.id)}
      <li style="--i: {i};">
        <a
          href={`/models/${m.id}`}
          class="surface-card lift group flex h-full flex-col justify-between gap-6 rounded-3xl p-6"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <div class="truncate text-[16px] font-medium tracking-tight text-neutral-100">
                {m.name}
              </div>
              <div class="mt-1 font-mono text-[11px] tracking-tight text-neutral-500">
                temp {m.temperature ?? '—'} · {m.quantization ?? '—'}
              </div>
            </div>
            <span
              class="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-accent-500)]"
              aria-hidden="true"
            ></span>
          </div>

          <div class="flex items-end justify-between">
            <div class="flex items-baseline gap-1">
              <span class="font-mono text-3xl font-medium tracking-tight text-neutral-100">
                {m.submissionCount}
              </span>
              <span class="font-mono text-[11px] text-neutral-500">
                {m.submissionCount === 1 ? 'submission' : 'submissions'}
              </span>
            </div>
            <span
              class="text-[12px] text-neutral-500 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-[var(--color-accent-400)]"
            >
              view →
            </span>
          </div>
        </a>
      </li>
    {/each}
  </ul>
{/if}
