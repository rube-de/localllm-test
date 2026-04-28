<script lang="ts">
  let { form } = $props();
</script>

<div class="mx-auto mt-12 max-w-sm">
  <h1 class="text-xl font-semibold">Admin sign in</h1>
  <form method="POST" class="mt-6 space-y-4">
    <label class="block">
      <span class="text-sm text-neutral-400">Password</span>
      <input
        type="password"
        name="password"
        autocomplete="current-password"
        required
        class="mt-1 w-full rounded border border-neutral-700 bg-neutral-950 px-3 py-2 text-neutral-100 focus:border-neutral-400 focus:outline-none"
      />
    </label>
    {#if form?.error}
      <p class="text-sm text-red-400">{form.error}</p>
    {/if}
    <button
      type="submit"
      class="w-full rounded bg-emerald-600 px-3 py-2 font-medium text-white hover:bg-emerald-500"
      >Sign in</button
    >
  </form>
</div>
