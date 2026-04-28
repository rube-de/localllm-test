<script lang="ts">
  let { data } = $props();

  // Bento span pattern: feature first, then varied widths so the grid never
  // collapses into the AI-cliché 3-equal-card row. Cycles deterministically.
  const spans = ['md:col-span-7', 'md:col-span-5', 'md:col-span-4', 'md:col-span-4', 'md:col-span-4', 'md:col-span-6', 'md:col-span-6'];
</script>

<section class="grid grid-cols-1 gap-10 pt-4 pb-12 md:grid-cols-12 md:gap-8">
  <div class="md:col-span-8">
    <div class="eyebrow mb-5">/ tests · current</div>
    <h1
      class="text-[clamp(2.5rem,6vw,4.5rem)] font-medium leading-[0.95] tracking-[-0.035em] text-neutral-100"
    >
      Compare local models<br />
      <span class="text-neutral-500">on the same prompt,</span>
      <span class="gradient-text">side by side.</span>
    </h1>
    <p class="mt-6 max-w-[52ch] text-[15px] leading-relaxed text-neutral-400">
      A hermetic gallery for HTML produced by your local LLMs. Each test pins a prompt; each
      version pins a snapshot. Swap models in-place to see who actually understood the brief.
    </p>
  </div>

  <aside class="flex flex-col justify-end gap-3 md:col-span-4">
    <div
      class="surface-card flex items-center justify-between rounded-2xl px-5 py-4 font-mono text-[12px] tracking-tight"
    >
      <span class="text-neutral-500">tests</span>
      <span class="text-2xl font-medium text-neutral-100">
        {String(data.tests.length).padStart(2, '0')}
      </span>
    </div>
    <div
      class="surface-card flex items-center justify-between rounded-2xl px-5 py-4 font-mono text-[12px] tracking-tight"
    >
      <span class="text-neutral-500">latest version</span>
      <span class="text-neutral-300">
        {data.tests[0]?.currentVersionNumber ? `v${data.tests[0].currentVersionNumber}` : '—'}
      </span>
    </div>
  </aside>
</section>

<div class="flex items-baseline justify-between gap-6 border-t border-white/[0.06] pt-8 pb-6">
  <h2 class="text-[13px] font-medium tracking-tight text-neutral-300">All tests</h2>
  <span class="font-mono text-[11px] tracking-tight text-neutral-600">
    {data.tests.length}/total
  </span>
</div>

{#if data.tests.length === 0}
  <div
    class="surface-card grid place-items-center rounded-3xl px-8 py-16 text-center"
  >
    <div class="max-w-sm space-y-3">
      <div class="eyebrow">empty</div>
      <p class="text-[15px] text-neutral-300">No tests yet.</p>
      <p class="text-sm text-neutral-500">
        <a
          href="/admin"
          class="text-[var(--color-accent-400)] underline-offset-4 transition-colors hover:underline"
          >Sign in as admin</a
        >
        to add your first test.
      </p>
    </div>
  </div>
{:else}
  <ul class="cascade grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-5">
    {#each data.tests as t, i (t.id)}
      <li class="{spans[i % spans.length]}" style="--i: {i};">
        <a
          href={`/tests/${t.slug}`}
          class="surface-card lift group flex h-full min-h-[200px] flex-col justify-between rounded-3xl p-6 sm:p-7"
        >
          <div class="flex items-start justify-between gap-4">
            <h3 class="text-[19px] font-medium tracking-tight text-neutral-100">
              {t.name}
            </h3>
            <span
              class="shrink-0 rounded-full border border-white/[0.08] bg-black/30 px-2.5 py-0.5 font-mono text-[11px] text-neutral-400"
            >
              v{t.currentVersionNumber ?? '?'}
            </span>
          </div>

          {#if t.promptPreview}
            <pre
              class="mt-4 line-clamp-3 max-w-full whitespace-pre-wrap font-mono text-[12px] leading-relaxed text-neutral-500 group-hover:text-neutral-400 transition-colors duration-300">{t.promptPreview}</pre>
          {/if}

          <div class="mt-6 flex items-center justify-between text-[12px]">
            <span class="font-mono text-neutral-600">/{t.slug}</span>
            <span
              class="inline-flex items-center gap-1.5 text-neutral-500 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-[var(--color-accent-400)]"
            >
              compare
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path
                  d="M3 6h6m0 0L6 3m3 3L6 9"
                  stroke="currentColor"
                  stroke-width="1.4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
          </div>
        </a>
      </li>
    {/each}
  </ul>
{/if}
