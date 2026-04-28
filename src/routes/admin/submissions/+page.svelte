<script lang="ts">
  let { data } = $props();
</script>

<div class="flex items-center justify-between">
  <h1 class="text-2xl font-semibold">Submissions</h1>
  <a
    href="/admin/submissions/new"
    class="rounded bg-emerald-600 px-3 py-1 text-sm font-medium text-white hover:bg-emerald-500"
    >+ New submission</a
  >
</div>

<section class="mt-6">
  {#if data.submissions.length === 0}
    <p class="text-neutral-400">No submissions yet.</p>
  {:else}
    <table class="w-full text-sm">
      <thead class="text-left text-xs text-neutral-500">
        <tr>
          <th class="py-2">Test</th>
          <th>Version</th>
          <th>Model</th>
          <th>HTML size</th>
          <th>Created</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {#each data.submissions as s (s.id)}
          <tr class="border-t border-neutral-800">
            <td class="py-2 font-medium">{s.testName}</td>
            <td>v{s.versionNumber}</td>
            <td>{s.modelName}</td>
            <td class="text-neutral-400">{s.htmlSize.toLocaleString()} B</td>
            <td class="text-neutral-500">{new Date(s.createdAt).toISOString().slice(0, 10)}</td>
            <td class="text-right">
              <form
                method="POST"
                action="?/delete"
                onsubmit={(e) => {
                  if (!confirm('Delete this submission?')) e.preventDefault();
                }}
              >
                <input type="hidden" name="id" value={s.id} />
                <button class="text-red-400 underline hover:text-red-300">delete</button>
              </form>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</section>
