<script lang="ts">
  import Form from '$lib/shared/components/form/Form.svelte';
  import Label from '$lib/shared/components/form/Label.svelte';
  import PageCard from '$lib/shared/components/page/PageCard.svelte';
  import { Icon } from 'svelte-awesome';

  import type { CsvData } from '../model/csv-data';
  import { deduplicate, lookup, parse } from '../service/csv';
  import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

  let attendeesFiles: FileList | undefined;
  let attendeesData: CsvData | undefined;
  let attendeesDeduplicateColumn: string | undefined;
  let attendeesLookupColumn: string | undefined;

  let registeredFiles: FileList | undefined;
  let registeredData: CsvData | undefined;
  let registeredLookupColumn: string | undefined;

  $: attendeesWithRegisteredData = lookup({
    data: deduplicate(attendeesData, attendeesDeduplicateColumn),
    dataKeyColumn: attendeesLookupColumn,
    reference: registeredData,
    referenceKeyColumn: registeredLookupColumn,
  });
  $: isFormValid = !!attendeesFiles?.[0] && !!registeredFiles?.[0];

  async function process(): Promise<void> {
    const attendeesFile = attendeesFiles?.[0];
    const registeredFile = registeredFiles?.[0];
    if (!attendeesFile || !registeredFile) {
      return;
    }

    attendeesData = await parse(attendeesFile);
    registeredData = await parse(registeredFile);
  }
</script>

<PageCard>
  <h2 class="h2">Dateneingabe</h2>
  <Form>
    <Label text="Liste der anwesenden Teilnehmer">
      <input class="input" type="file" accept=".csv" bind:files={attendeesFiles} />
    </Label>
    <Label text="Liste der angemeldeten Teilnehmer">
      <input class="input" type="file" accept=".csv" bind:files={registeredFiles} />
    </Label>
    <div class="flex justify-end gap-2">
      <button class="btn variant-filled-primary" disabled={!isFormValid} on:click={process}
        >Ausführen</button
      >
    </div>
  </Form>
  {#if attendeesData && registeredData}
    <hr />
    <h2 class="h2">Auswertung</h2>
    <Label text="Spalte für die Duplikatserkennung">
      <select class="select" bind:value={attendeesDeduplicateColumn}>
        <option value={undefined}>Keine</option>
        {#each attendeesData.header as header}
          <option value={header}>{header}</option>
        {/each}
      </select>
    </Label>
    <Label text="Spalten für die Zuordnung">
      <div class="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <select class="select" bind:value={attendeesLookupColumn} placeholder="Bitte wählen">
          <option value={undefined}></option>
          {#each attendeesData.header ?? [] as header}
            <option value={header}>{header}</option>
          {/each}
        </select>
        <Icon data={faArrowRight} />
        <select class="select" bind:value={registeredLookupColumn} placeholder="Bitte wählen">
          <option value={undefined}></option>
          {#each registeredData.header ?? [] as header}
            <option value={header}>{header}</option>
          {/each}
        </select>
      </div>
    </Label>
    {#if attendeesWithRegisteredData}
      <h3 class="h3">Ergebnis</h3>
      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              {#each attendeesWithRegisteredData.header as header}
                <th>{header}</th>
              {/each}
            </tr>
          </thead>
          <tbody>
            {#each attendeesWithRegisteredData?.records ?? [] as record}
              <tr>
                {#each attendeesWithRegisteredData.header as header}
                  <td>{record[header]}</td>
                {/each}
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  {/if}
</PageCard>
