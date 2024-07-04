<script lang="ts">
  import { faScrewdriverWrench } from '@fortawesome/free-solid-svg-icons';
  import { AppBar } from '@skeletonlabs/skeleton';
  import { Icon } from 'svelte-awesome';
</script>

<AppBar>
  <a class="flex items-center gap-4 px-2 py-1 md:py-2 w-fit rounded-md" href="/">
    <span>
      <Icon data={faScrewdriverWrench} scale={1.5} />
    </span>
    <span class="text-2xl">Evas Toolbox</span>
  </a>
</AppBar>
