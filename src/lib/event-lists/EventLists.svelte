<script lang="ts">
  import PageCard from '$lib/shared/components/page/PageCard.svelte';
  import DataInput from './components/DataInput.svelte';
  import ProcessingConfig from './components/ProcessingConfig.svelte';
  import ProcessingResult from './components/ProcessingResult.svelte';
  import type { CsvData } from './model/csv-data';
  import { deduplicate, lookup, parse } from './service/csv';

  let attendeesData: CsvData | undefined;
  let attendeesDeduplicateColumn: string | undefined;
  let attendeesLookupColumn: string | undefined;

  let registeredData: CsvData | undefined;
  let registeredLookupColumn: string | undefined;

  $: attendeesWithRegisteredData = lookup({
    data: deduplicate(attendeesData, attendeesDeduplicateColumn),
    dataKeyColumn: attendeesLookupColumn,
    reference: registeredData,
    referenceKeyColumn: registeredLookupColumn,
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
      bind:attendeesLookupColumn
      bind:registeredLookupColumn
    />
    {#if attendeesWithRegisteredData}
      <hr />
      <ProcessingResult data={attendeesWithRegisteredData} />
    {/if}
  {/if}
</PageCard>
