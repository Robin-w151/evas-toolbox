<script lang="ts">
  import { AppShell } from '@skeletonlabs/skeleton';
  import AppBar from './AppBar.svelte';
</script>

<AppShell scrollbarGutter="stable" regionPage="outline-offset-[-3px]">
  <svelte:fragment slot="header">
    <AppBar />
  </svelte:fragment>
  <div class="flex justify-center p-4">
    <div class="flex flex-col items-center gap-4 w-full max-w-screen-3xl">
      <slot />
    </div>
  </div>
</AppShell>
