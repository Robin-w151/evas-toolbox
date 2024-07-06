<script lang="ts">
  import PageCard from '$lib/shared/components/page/PageCard.svelte';
  import DataInput from './components/DataInput.svelte';
  import ProcessingConfig from './components/ProcessingConfig.svelte';
  import ProcessingResult from './components/ProcessingResult.svelte';
  import type { CsvData } from './model/csv-data';
  import { deduplicate, lookup, parse } from './service/csv';

  let attendeesData: CsvData | undefined;
  let attendeesDeduplicateColumn: string | undefined;
  let attendeesKeyColumn: string | undefined;
  let attendeesSearchColumns: Array<string> = [];

  let registeredData: CsvData | undefined;
  let registeredKeyColumn: string | undefined;
  let registeredSearchColumns: Array<string> = [];

  $: attendeesWithRegisteredData = lookup({
    data: deduplicate(attendeesData, attendeesDeduplicateColumn),
    dataKeyColumn: attendeesKeyColumn,
    dataSearchColumns: attendeesSearchColumns,
    reference: registeredData,
    referenceKeyColumn: registeredKeyColumn,
    referenceSearchColumns: registeredSearchColumns,
  });

  async function processData({
    detail,
  }: CustomEvent<{ attendeesFile: File; registeredFile: File }>): Promise<void> {
    const { attendeesFile, registeredFile } = detail;
    if (!attendeesFile || !registeredFile) {
      return;
    }

    attendeesData = await parse(attendeesFile);
    registeredData = await parse(registeredFile);

    attendeesSearchColumns = [...attendeesData.header];
    registeredSearchColumns = [...registeredData.header];
  }
</script>

<PageCard>
  <h2 class="h2">Dateneingabe</h2>
  <DataInput on:submit={processData} />
  {#if attendeesData && registeredData}
    <hr />
    <h2 class="h2">Auswertung</h2>
    <ProcessingConfig
      attendeesHeader={attendeesData.header}
      registeredHeader={registeredData.header}
      bind:attendeesDeduplicateColumn
      bind:attendeesKeyColumn
      bind:attendeesSearchColumns
      bind:registeredKeyColumn
      bind:registeredSearchColumns
    />
    {#if attendeesWithRegisteredData}
      <hr />
      <ProcessingResult data={attendeesWithRegisteredData} />
    {/if}
  {/if}
</PageCard>
