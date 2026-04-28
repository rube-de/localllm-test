<script lang="ts">
  let { data, form } = $props();
</script>

<a href={`/admin/tests/${data.test.id}`} class="text-sm text-neutral-500 hover:text-neutral-300"
  >← Back to {data.test.name}</a>
<h1 class="mt-2 text-2xl font-semibold">New version of {data.test.name}</h1>
<p class="text-xs text-neutral-500">Next version number: v{data.nextVersionNumber}</p>

<form method="POST" class="mt-6 max-w-3xl space-y-4">
  <label class="block">
    <span class="text-xs text-neutral-500">Prompt</span>
    <textarea
      name="prompt"
      required
      rows="14"
      class="mt-1 w-full rounded border border-neutral-700 bg-neutral-950 px-2 py-1 text-sm font-mono"
    >{form?.values?.prompt ?? ''}</textarea>
  </label>
  <label class="flex items-center gap-2 text-sm">
    <input type="checkbox" name="setCurrent" value="1" checked class="rounded" />
    <span>Mark this as the current version</span>
  </label>
  <div class="flex items-center gap-3">
    <button class="rounded bg-emerald-600 px-3 py-1 text-sm font-medium text-white hover:bg-emerald-500"
      >Create version</button>
    {#if form?.error}
      <span class="text-sm text-red-400">{form.error}</span>
    {/if}
  </div>
</form>
