<script lang="ts">
  type ModelOpt = { id: number; label: string };
  type Props = {
    selected: number[];
    available: ModelOpt[];
    onChange: (ids: number[]) => void;
  };
  let { selected, available, onChange }: Props = $props();

  const selectedSet = $derived(new Set(selected));
  const labelById = $derived(new Map(available.map((m) => [m.id, m.label])));
  const unselected = $derived(available.filter((m) => !selectedSet.has(m.id)));

  let pickerOpen = $state(false);
  let pickerValue = $state('');

  function remove(id: number) {
    onChange(selected.filter((x) => x !== id));
  }
  function add() {
    const id = Number(pickerValue);
    if (!Number.isInteger(id) || id <= 0) return;
    if (selectedSet.has(id)) return;
    onChange([...selected, id]);
    pickerValue = '';
    pickerOpen = false;
  }
</script>

<div class="flex flex-wrap items-center gap-2 text-[12px]">
  <span class="eyebrow mr-1 hidden md:inline">models</span>

  {#each selected as id (id)}
    {@const label = labelById.get(id) ?? `#${id}`}
    <span
      class="group/chip inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] py-1 pr-1.5 pl-3 font-mono tracking-tight text-neutral-200 transition-colors duration-300 hover:border-white/20"
    >
      <span class="pulse-dot inline-block h-1 w-1 rounded-full bg-[var(--color-accent-500)]"
      ></span>
      <span>{label}</span>
      <button
        type="button"
        onclick={() => remove(id)}
        class="grid h-5 w-5 place-items-center rounded-full text-neutral-500 transition-all duration-300 hover:bg-red-500/15 hover:text-red-300 active:scale-90"
        aria-label={`Remove ${label}`}
      >
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none" aria-hidden="true">
          <path
            d="M1.5 1.5L6.5 6.5M6.5 1.5L1.5 6.5"
            stroke="currentColor"
            stroke-width="1.4"
            stroke-linecap="round"
          />
        </svg>
      </button>
    </span>
  {/each}

  {#if unselected.length > 0}
    {#if !pickerOpen}
      <button
        type="button"
        onclick={() => (pickerOpen = true)}
        class="inline-flex items-center gap-1.5 rounded-full border border-dashed border-white/15 px-3 py-1 font-mono tracking-tight text-neutral-500 transition-all duration-300 hover:border-[var(--color-accent-500)] hover:text-[var(--color-accent-400)] active:scale-[0.97]"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
          <path
            d="M5 1.5v7M1.5 5h7"
            stroke="currentColor"
            stroke-width="1.3"
            stroke-linecap="round"
          />
        </svg>
        add model
      </button>
    {:else}
      <select
        bind:value={pickerValue}
        onchange={add}
        onblur={() => (pickerOpen = false)}
        class="rounded-full border border-[var(--color-accent-500)] bg-black px-3 py-1 font-mono tracking-tight text-neutral-100 outline-none focus:ring-2 focus:ring-[var(--color-accent-500)]/30"
      >
        <option value="">— pick —</option>
        {#each unselected as m (m.id)}
          <option value={m.id}>{m.label}</option>
        {/each}
      </select>
    {/if}
  {/if}

  {#if selected.length === 0}
    <span class="font-mono text-[11px] tracking-tight text-neutral-600"
      >no models selected</span
    >
  {/if}
</div>
