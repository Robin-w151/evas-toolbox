<script lang="ts">
  import Label from '$lib/shared/components/form/Label.svelte';
  import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
  import { Accordion, AccordionItem, ListBox, ListBoxItem } from '@skeletonlabs/skeleton';
  import { Icon } from 'svelte-awesome';
  import { findEmailColumn, isEmailColumn, isNameColumn } from '../service/csv';

  export let attendeesHeader: Array<string>;
  export let attendeesDeduplicateColumn: string | undefined;
  export let attendeesKeyColumn: string | undefined;
  export let attendeesSearchColumns: Array<string> = [];
  export let registeredHeader: Array<string>;
  export let registeredKeyColumn: string | undefined;
  export let registeredSearchColumns: Array<string> = [];
  export let columnMapping: Map<string, string> = new Map();

  let attendeesMappedColumns: Array<string> = [];
  let prevAttendeesHeader: Array<string> | undefined;
  let prevRegisteredHeader: Array<string> | undefined;

  $: initColumns(attendeesHeader, registeredHeader);
  $: isKeyColumnsValid = !!attendeesKeyColumn && !!registeredKeyColumn;

  function initColumns(attendeesHeader: Array<string>, registeredHeader: Array<string>): void {
    if (attendeesHeader === prevAttendeesHeader && registeredHeader === prevRegisteredHeader) {
      return;
    }
    prevAttendeesHeader = attendeesHeader;
    prevRegisteredHeader = registeredHeader;

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

  function handleAttendeesMappedColumnChange(event: Event): void {
    const { checked, value } = (event.target as HTMLInputElement) ?? {};

    if (!checked) {
      columnMapping.delete(value);
      columnMapping = columnMapping;
    }
  }

  function handleColumnMappingChange(attendeesHeader: string, registeredHeader: string): void {
    columnMapping.set(attendeesHeader, registeredHeader);
    columnMapping = columnMapping;
  }
</script>

<Accordion>
  <AccordionItem>
    <svelte:fragment slot="summary">
      <span>Konfiguration für die automatische Zuordnung</span>
    </svelte:fragment>
    <svelte:fragment slot="content">
      <Label text="Spalte der Liste anwesender Teilnehmer für die Duplikatserkennung">
        <select class="select" bind:value={attendeesDeduplicateColumn}>
          <option value={undefined}>Keine</option>
          {#each attendeesHeader as header}
            <option value={header}>{header}</option>
          {/each}
        </select>
      </Label>
      <Label
        text="Spalten für die automatische Zuordnung"
        error={!isKeyColumnsValid}
        errorMessage="Bitte wählen Sie die Spalten für die automatische Zuordnung!"
      >
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
    </svelte:fragment>
  </AccordionItem>
  <AccordionItem>
    <svelte:fragment slot="summary">
      <span
        >Spalten für die erweiterte Suche falls Einträge nicht automatisch zugeordnet werden können</span
      >
    </svelte:fragment>
    <svelte:fragment slot="content">
      <div class="grid grid-cols-[1fr_auto_1fr] items-center gap-2 p-2 bg-surface-700 rounded-lg">
        <ListBox multiple>
          {#each attendeesHeader ?? [] as header}
            <ListBoxItem name={header} value={header} bind:group={attendeesSearchColumns}
              >{header}</ListBoxItem
            >
          {/each}
        </ListBox>
        <Icon data={faArrowRight} />
        <ListBox multiple>
          {#each registeredHeader ?? [] as header}
            <ListBoxItem name={header} value={header} bind:group={registeredSearchColumns}
              >{header}</ListBoxItem
            >
          {/each}
        </ListBox>
      </div>
    </svelte:fragment>
  </AccordionItem>
  <AccordionItem open>
    <svelte:fragment slot="summary">
      <span
        >Spaltenzuordnung um neue Einträge aus der Liste der anwesenden Teilnehmer zu erstellen</span
      >
    </svelte:fragment>
    <svelte:fragment slot="content">
      <div class="grid grid-cols-[1fr_auto_1fr] items-center gap-2 p-2 bg-surface-700 rounded-lg">
        <ListBox multiple>
          {#each attendeesHeader as header (header)}
            <ListBoxItem
              name={header}
              value={header}
              bind:group={attendeesMappedColumns}
              on:change={handleAttendeesMappedColumnChange}>{header}</ListBoxItem
            >
          {/each}
        </ListBox>
        <Icon data={faArrowRight} />
        <ul class="flex flex-col gap-1">
          {#each attendeesHeader as header (header)}
            {#if attendeesMappedColumns.includes(header)}
              <select
                class="select"
                value={columnMapping.get(header)}
                on:change={(event) => handleColumnMappingChange(header, event.currentTarget.value)}
              >
                <option value={undefined}>Bitte wählen</option>
                {#each registeredHeader as header (header)}
                  <option value={header}>{header}</option>
                {/each}
              </select>
            {:else}
              <div class="h-10" />
            {/if}
          {/each}
        </ul>
      </div>
    </svelte:fragment>
  </AccordionItem>
</Accordion>
