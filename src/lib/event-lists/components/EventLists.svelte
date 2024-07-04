<script lang="ts">
  import Form from '$lib/shared/components/form/Form.svelte';
  import Label from '$lib/shared/components/form/Label.svelte';
  import PageCard from '$lib/shared/components/page/PageCard.svelte';

  import type { CsvData } from '../model/csv-data';
  import { deduplicate, parse } from '../service/csv';

  let zoomAttendeesFiles: FileList | undefined;
  let zoomAttendeesData: CsvData | undefined;
  let zoomAttendeesDeduplicateColumn: string | undefined;

  $: zoomAttendees = zoomAttendeesFiles?.[0];
  $: zoomAttendeesDataDeduplicated = deduplicate(zoomAttendeesData, zoomAttendeesDeduplicateColumn);
  $: isFormValid = !!zoomAttendees;

  async function process(): Promise<void> {
    if (!zoomAttendees) {
      return;
    }

    zoomAttendeesData = await parse(zoomAttendees);
  }
</script>

<PageCard>
  <h2 class="h2">Dateneingabe</h2>
  <Form>
    <Label text="Zoom Teilnehmerliste">
      <input class="input" type="file" accept=".csv" bind:files={zoomAttendeesFiles} />
    </Label>
    <div class="flex justify-end gap-2">
      <button class="btn variant-filled-primary" disabled={!isFormValid} on:click={process}
        >Ausführen</button
      >
    </div>
  </Form>
  {#if zoomAttendeesData}
    <hr />
    <h2 class="h2">Auswertung</h2>
    <Label text="Spalte für die Duplikatserkennung">
      <select class="select" bind:value={zoomAttendeesDeduplicateColumn}>
        <option value={undefined}>Keine</option>
        {#each zoomAttendeesData.header as header}
          <option value={header}>{header}</option>
        {/each}
      </select>
    </Label>
    <div class="table-container">
      <table class="table">
        <thead>
          <tr>
            {#each zoomAttendeesData.header as header}
              <th>{header}</th>
            {/each}
          </tr>
        </thead>
        <tbody>
          {#each zoomAttendeesDataDeduplicated?.records ?? [] as record}
            <tr>
              {#each zoomAttendeesData.header as header}
                <td>{record[header]}</td>
              {/each}
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</PageCard>
