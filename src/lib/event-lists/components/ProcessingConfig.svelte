<script lang="ts">
  import Label from '$lib/shared/components/form/Label.svelte';
  import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
  import { Icon } from 'svelte-awesome';
  import { findEmailColumn } from '../service/csv';

  export let attendeesHeader: Array<string>;
  export let attendeesDeduplicateColumn: string | undefined;
  export let attendeesLookupColumn: string | undefined;
  export let registeredHeader: Array<string>;
  export let registeredLookupColumn: string | undefined;

  let isInitialized = false;

  $: initColumns(attendeesHeader, registeredHeader);

  function initColumns(attendeesHeader: Array<string>, registeredHeader: Array<string>): void {
    if (isInitialized) {
      return;
    }
    isInitialized = true;

    const attendeesHeaderEmailColumn = findEmailColumn(attendeesHeader);
    if (attendeesHeaderEmailColumn) {
      attendeesDeduplicateColumn = attendeesHeaderEmailColumn;
      attendeesLookupColumn = attendeesHeaderEmailColumn;
    }

    const registeredHeaderEmailColumn = findEmailColumn(registeredHeader);
    if (registeredHeaderEmailColumn) {
      registeredLookupColumn = registeredHeaderEmailColumn;
    }
  }
</script>

<Label text="Spalte für die Duplikatserkennung">
  <select class="select" bind:value={attendeesDeduplicateColumn}>
    <option value={undefined}>Keine</option>
    {#each attendeesHeader as header}
      <option value={header}>{header}</option>
    {/each}
  </select>
</Label>
<Label text="Spalten für die Zuordnung">
  <div class="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
    <select class="select" bind:value={attendeesLookupColumn} placeholder="Bitte wählen">
      <option value={undefined}></option>
      {#each attendeesHeader ?? [] as header}
        <option value={header}>{header}</option>
      {/each}
    </select>
    <Icon data={faArrowRight} />
    <select class="select" bind:value={registeredLookupColumn} placeholder="Bitte wählen">
      <option value={undefined}></option>
      {#each registeredHeader ?? [] as header}
        <option value={header}>{header}</option>
      {/each}
    </select>
  </div>
</Label>
