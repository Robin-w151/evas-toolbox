<script lang="ts">
  import AppLayout from '$lib/shared/components/app/AppLayout.svelte';
  import { initializeStores } from '@skeletonlabs/skeleton';
  import '../app.scss';

  initializeStores();
</script>

<AppLayout>
  <slot />
</AppLayout>
