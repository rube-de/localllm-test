<script lang="ts">
  type Props = {
    title: string;
    subtitle?: string;
    html: string | null;
    isSolo: boolean;
    onSolo: () => void;
    onExitSolo: () => void;
  };
  let { title, subtitle, html, isSolo, onSolo, onExitSolo }: Props = $props();
</script>

<div
  class="surface-card lift group relative flex flex-col overflow-hidden rounded-3xl focus-within:border-[var(--color-accent-500)]"
  class:fixed={isSolo}
  class:inset-4={isSolo}
  class:z-50={isSolo}
  class:cell-solo={isSolo}
>
  <header
    class="flex items-center gap-3 border-b border-white/[0.06] bg-black/20 px-4 py-3"
  >
    <span
      class="pulse-dot inline-block h-1.5 w-1.5 shrink-0 rounded-full"
      style="background-color: {html ? 'var(--color-accent-500)' : 'oklch(0.5 0 0)'};"
      aria-hidden="true"
    ></span>
    <div class="min-w-0 flex-1">
      <div class="truncate text-[13px] font-medium text-neutral-100">{title}</div>
      {#if subtitle}
        <div class="truncate font-mono text-[11px] tracking-tight text-neutral-500">
          {subtitle}
        </div>
      {/if}
    </div>

    {#if !isSolo}
      <button
        type="button"
        onclick={onSolo}
        disabled={!html}
        class="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-medium tracking-tight text-neutral-300 transition-all duration-300 hover:border-[var(--color-accent-500)] hover:text-[var(--color-accent-400)] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-white/10 disabled:hover:text-neutral-300"
        aria-label="Play solo"
      >
        <svg width="9" height="9" viewBox="0 0 9 9" fill="currentColor" aria-hidden="true">
          <path d="M2 1L8 4.5L2 8V1Z" />
        </svg>
        solo
      </button>
    {:else}
      <button
        type="button"
        onclick={onExitSolo}
        class="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-accent-500)] bg-[var(--color-accent-500)]/15 px-3 py-1 text-[11px] font-medium tracking-tight text-[var(--color-accent-300)] transition-all duration-300 hover:bg-[var(--color-accent-500)]/25 active:scale-[0.97]"
      >
        <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true">
          <path
            d="M2 2L7 7M7 2L2 7"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
          />
        </svg>
        exit · esc
      </button>
    {/if}
  </header>

  <div class="relative flex-1 min-h-[60vh]">
    {#if html}
      <iframe
        {title}
        srcdoc={html}
        sandbox="allow-scripts"
        loading="lazy"
        referrerpolicy="no-referrer"
        class="absolute inset-0 h-full w-full bg-white"
      ></iframe>
    {:else}
      <div class="grid h-full place-items-center p-8">
        <div class="space-y-2 text-center">
          <div
            class="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.02]"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path
                d="M3 7h8M3 7l3-3M3 7l3 3"
                stroke="oklch(0.5 0 0)"
                stroke-width="1.4"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <p class="text-[13px] text-neutral-400">No submission</p>
          <p class="font-mono text-[11px] text-neutral-600">version mismatch</p>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .cell-solo {
    border-color: var(--color-accent-500);
    box-shadow:
      inset 0 1px 0 oklch(1 0 0 / 0.06),
      0 40px 80px -20px oklch(0 0 0 / 0.8);
  }
</style>
