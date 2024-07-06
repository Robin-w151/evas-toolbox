<script lang="ts">
  import Label from '$lib/shared/components/form/Label.svelte';
  import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
  import { ListBox, ListBoxItem } from '@skeletonlabs/skeleton';
  import { Icon } from 'svelte-awesome';
  import { findEmailColumn, isEmailColumn, isNameColumn } from '../service/csv';

  export let attendeesHeader: Array<string>;
  export let attendeesDeduplicateColumn: string | undefined;
  export let attendeesKeyColumn: string | undefined;
  export let attendeesSearchColumns: Array<string> = [];
  export let registeredHeader: Array<string>;
  export let registeredKeyColumn: string | undefined;
  export let registeredSearchColumns: Array<string> = [];

  $: initColumns(attendeesHeader, registeredHeader);

  function initColumns(attendeesHeader: Array<string>, registeredHeader: Array<string>): void {
    const attendeesHeaderEmailColumn = findEmailColumn(attendeesHeader);
    if (attendeesHeaderEmailColumn) {
      attendeesDeduplicateColumn = attendeesHeaderEmailColumn;
      attendeesKeyColumn = attendeesHeaderEmailColumn;
    }
    attendeesSearchColumns = attendeesHeader.filter(
      (header) => isEmailColumn(header) || isNameColumn(header),
    );

    const registeredHeaderEmailColumn = findEmailColumn(registeredHeader);
    if (registeredHeaderEmailColumn) {
      registeredKeyColumn = registeredHeaderEmailColumn;
    }
    registeredSearchColumns = registeredHeader.filter(
      (header) => isEmailColumn(header) || isNameColumn(header),
    );
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
    <select class="select" bind:value={attendeesKeyColumn}>
      <option value={undefined}>Bitte wählen</option>
      {#each attendeesHeader ?? [] as header}
        <option value={header}>{header}</option>
      {/each}
    </select>
    <Icon data={faArrowRight} />
    <select class="select" bind:value={registeredKeyColumn}>
      <option value={undefined}>Bitte wählen</option>
      {#each registeredHeader ?? [] as header}
        <option value={header}>{header}</option>
      {/each}
    </select>
  </div>
</Label>
<Label text="Spalten die für die erweiterte Suche verwendet werden">
  <div class="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
    <ListBox multiple>
      {#each attendeesHeader ?? [] as header}
        <ListBoxItem bind:group={attendeesSearchColumns} name={header} value={header}
          >{header}</ListBoxItem
        >
      {/each}
    </ListBox>
    <Icon data={faArrowRight} />
    <ListBox multiple>
      {#each registeredHeader ?? [] as header}
        <ListBoxItem bind:group={registeredSearchColumns} name={header} value={header}
          >{header}</ListBoxItem
        >
      {/each}
    </ListBox>
  </div>
</Label>
