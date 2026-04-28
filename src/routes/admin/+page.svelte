<script lang="ts">
  let { data } = $props();
</script>

<h1 class="text-2xl font-semibold">Dashboard</h1>

<div class="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
  <a href="/admin/tests" class="rounded-lg border border-neutral-800 bg-neutral-900 p-4 hover:border-neutral-700">
    <div class="text-2xl font-semibold">{data.counts.tests}</div>
    <div class="text-xs text-neutral-500">Tests</div>
  </a>
  <a href="/admin/models" class="rounded-lg border border-neutral-800 bg-neutral-900 p-4 hover:border-neutral-700">
    <div class="text-2xl font-semibold">{data.counts.models}</div>
    <div class="text-xs text-neutral-500">Models</div>
  </a>
  <a href="/admin/submissions" class="rounded-lg border border-neutral-800 bg-neutral-900 p-4 hover:border-neutral-700">
    <div class="text-2xl font-semibold">{data.counts.submissions}</div>
    <div class="text-xs text-neutral-500">Submissions</div>
  </a>
  <a href="/admin/submissions/new" class="rounded-lg border border-emerald-700 bg-emerald-900/40 p-4 hover:border-emerald-600">
    <div class="text-2xl font-semibold">+</div>
    <div class="text-xs text-emerald-300">New submission</div>
  </a>
</div>
