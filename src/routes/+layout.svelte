<script lang="ts">
  import '../app.css';
  import { page } from '$app/state';

  let { children } = $props();

  type NavItem = { href: string; label: string; match: (p: string) => boolean };
  const items: NavItem[] = [
    { href: '/', label: 'Tests', match: (p) => p === '/' || p.startsWith('/tests') },
    { href: '/models', label: 'Models', match: (p) => p.startsWith('/models') },
    { href: '/admin', label: 'Admin', match: (p) => p.startsWith('/admin') }
  ];
</script>

<div class="grain-overlay"></div>

<div
  class="relative mx-auto flex min-h-[100dvh] max-w-[1400px] flex-col px-6 py-6 sm:px-8 lg:px-12"
>
  <header class="flex items-center justify-between gap-6 pt-2 pb-6">
    <a href="/" class="group flex items-baseline gap-2">
      <span
        class="grid h-7 w-7 place-items-center rounded-md border border-white/10 bg-white/[0.03] font-mono text-[10px] font-medium tracking-tight text-neutral-300 transition-colors duration-300 group-hover:border-[var(--color-accent-400)] group-hover:text-[var(--color-accent-400)]"
        >LL</span>
      <span class="font-mono text-[13px] tracking-tight text-neutral-300">
        localllm<span class="text-neutral-600">/</span><span class="text-neutral-100">gallery</span>
      </span>
    </a>

    <nav
      class="flex items-center gap-1 rounded-full border border-white/[0.06] bg-white/[0.02] p-1 text-[13px]"
    >
      {#each items as item (item.href)}
        {@const active = item.match(page.url.pathname)}
        <a
          href={item.href}
          aria-current={active ? 'page' : undefined}
          class="rounded-full px-4 py-1.5 transition-colors duration-300"
          class:text-neutral-100={active}
          class:text-neutral-500={!active}
          class:hover:text-neutral-200={!active}
          style={active ? 'background-color: oklch(1 0 0 / 0.06);' : ''}
        >
          {item.label}
        </a>
      {/each}
    </nav>
  </header>

  <main class="flex-1 pt-2 pb-16">{@render children()}</main>

  <footer
    class="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.06] pt-6 pb-2 text-xs"
  >
    <div class="flex items-center gap-2 text-neutral-500">
      <span
        class="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-accent-500)]"
      ></span>
      <span class="font-mono tracking-tight">offline-first · single-tenant</span>
    </div>
    <span class="font-mono text-neutral-600">v0.0.1 — local model HTML gallery</span>
  </footer>
</div>
