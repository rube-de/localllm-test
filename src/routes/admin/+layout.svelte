<script lang="ts">
  import { page } from '$app/state';
  let { data, children } = $props();

  type Item = { href: string; label: string; match: (path: string) => boolean };
  const items: Item[] = [
    { href: '/admin', label: 'Dashboard', match: (p) => p === '/admin' },
    { href: '/admin/tests', label: 'Tests', match: (p) => p.startsWith('/admin/tests') },
    { href: '/admin/models', label: 'Models', match: (p) => p.startsWith('/admin/models') },
    {
      href: '/admin/submissions',
      label: 'Submissions',
      match: (p) => p.startsWith('/admin/submissions')
    }
  ];
</script>

{#if data.authed}
  <div class="mb-4 flex flex-wrap items-center gap-1 border-b border-neutral-800 pb-3 text-sm">
    {#each items as item (item.href)}
      {@const active = item.match(page.url.pathname)}
      <a
        href={item.href}
        aria-current={active ? 'page' : undefined}
        class="rounded px-3 py-1 transition"
        class:bg-neutral-800={active}
        class:text-neutral-100={active}
        class:text-neutral-400={!active}
        class:hover:text-neutral-100={!active}
        class:hover:bg-neutral-900={!active}
      >
        {item.label}
      </a>
    {/each}
    <a
      href="/admin/submissions/new"
      class="ml-auto rounded bg-emerald-600 px-3 py-1 font-medium text-white hover:bg-emerald-500"
      >+ Submit</a>
    <form method="POST" action="/admin/logout">
      <button class="px-3 py-1 text-neutral-500 hover:text-neutral-200" type="submit"
        >Sign out</button>
    </form>
  </div>
{/if}

{@render children()}
