<script lang="ts">
  import { faArrowRight, faCheck, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
  import saveAs from 'file-saver';
  import { Icon } from 'svelte-awesome';
  import type { LookupResult } from '../model/lookup';

  export let lookup: LookupResult;
  export let dataSearchColumns: Array<string>;
  export let referenceSearchColumns: Array<string>;

  let manuallyAssigned: Array<any> = [];
  let manuallyAssignedMap = new Map<any, any>();

  $: dataManualAssignmentColumns = getColumnsForManualAssignment(
    dataSearchColumns,
    lookup.unassigned?.dataHeader ?? [],
  );
  $: referenceManualAssignmentColumns = getColumnsForManualAssignment(
    referenceSearchColumns,
    lookup.unassigned?.referenceHeader ?? [],
  );
  $: resetManuallyAssigned(lookup);

  function getColumnsForManualAssignment(
    searchColumns: Array<string>,
    header: Array<string>,
  ): Array<string> {
    return searchColumns.length > 0 ? searchColumns : header;
  }

  function resetManuallyAssigned(_lookup: LookupResult): void {
    manuallyAssigned = [];
    manuallyAssignedMap = new Map();
  }

  function assignManually(left: any, candidate: any): void {
    const assignedCandidate = manuallyAssignedMap.get(left);

    if (candidate === assignedCandidate) {
      manuallyAssignedMap.delete(left);
    } else {
      manuallyAssignedMap.set(left, candidate);
    }

    manuallyAssignedMap = manuallyAssignedMap;
    manuallyAssigned = [...manuallyAssignedMap.values()];
  }

  function exportData(): void {
    if (lookup) {
      const { header, records } = lookup.matches;
      const serializedData = [
        header.join(','),
        ...records.map((record) => header.map((h) => record[h]).join(',')),
        ...manuallyAssigned.map((record) => header.map((h) => record[h]).join(',')),
      ].join('\n');

      saveAs(new Blob([serializedData], { type: 'text/csv;charset=utf-8' }), 'export.csv');
    }
  }
</script>

{#if lookup.unassigned}
  <h3 class="h3">
    Nicht zugeordnet ({lookup.unassigned.candidateMappings.length - manuallyAssigned.length})
  </h3>
  <div class="table-container max-h-[600px]">
    <table class="table table-hover">
      <thead>
        <tr>
          {#each dataManualAssignmentColumns as header (header)}
            <th>{header}</th>
          {/each}
          <th>
            <div class="flex justify-center">
              <Icon data={faArrowRight} />
            </div>
          </th>
          {#each referenceManualAssignmentColumns as header (header)}
            <th>{header}</th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each lookup.unassigned.candidateMappings as mapping}
          {#each mapping.candidates as candidate, index}
            <tr on:click={() => assignManually(mapping.dataRecord, candidate)}>
              {#each dataManualAssignmentColumns as header}
                <td>
                  {#if index === 0}
                    {mapping.dataRecord[header]}
                  {/if}
                </td>
              {/each}
              <td>
                <div class="flex justify-center">
                  {#if manuallyAssignedMap.get(mapping.dataRecord) === candidate}
                    <Icon data={faCheck} />
                  {/if}
                </div>
              </td>
              {#each referenceManualAssignmentColumns as header}
                <td>{candidate[header]}</td>
              {/each}
            </tr>
          {:else}
            <tr>
              {#each dataManualAssignmentColumns as header}
                <td>
                  {mapping.dataRecord[header]}
                </td>
              {/each}
              <td>
                <div class="flex justify-center">
                  <Icon data={faTriangleExclamation} />
                </div>
              </td>
              <td colspan={referenceManualAssignmentColumns.length}>
                Keine mögliche Zuordnung gefunden!
              </td>
            </tr>
          {/each}
        {/each}
      </tbody>
    </table>
  </div>
{/if}
<h3 class="h3">Ergebnis ({lookup.matches.records.length + manuallyAssigned.length})</h3>
<div class="table-container max-h-[600px]">
  <table class="table">
    <thead>
      <tr>
        <th>Manuell zugeordnet</th>
        {#each lookup.matches.header as header (header)}
          <th>{header}</th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each manuallyAssigned as candidate}
        <tr>
          <td>
            <Icon data={faCheck} />
          </td>
          {#each lookup.matches.header as header}
            <td>{candidate[header]}</td>
          {/each}
        </tr>
      {/each}
      {#each lookup.matches.records as record}
        <tr>
          <td></td>
          {#each lookup.matches.header as header}
            <td>{record[header]}</td>
          {/each}
        </tr>
      {/each}
      {#if manuallyAssigned.length === 0 && lookup.matches.records.length === 0}
        <tr>
          <td colspan={lookup.matches.header.length + 1}>Keine Einträge</td>
        </tr>
      {/if}
    </tbody>
  </table>
</div>
<div class="flex justify-end gap-2">
  <button type="button" class="btn variant-filled-primary" on:click={exportData}
    >Ergebnis exportieren</button
  >
</div>
