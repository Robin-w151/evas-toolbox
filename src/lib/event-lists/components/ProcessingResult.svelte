<script lang="ts">
  import { faArrowRight, faCheck, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
  import saveAs from 'file-saver';
  import { Icon } from 'svelte-awesome';
  import type { LookupResult } from '../model/lookup';

  export let data: LookupResult;

  let manuallyAssigned: Array<any> = [];
  let manuallyAssignedMap = new Map<any, any>();

  $: resetManuallyAssigned(data);

  function resetManuallyAssigned(_data: LookupResult): void {
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
    if (data) {
      const { header, records } = data.matches;
      const serializedData = [
        header.join(','),
        ...records.map((record) => header.map((h) => record[h]).join(',')),
        ...manuallyAssigned.map((record) => header.map((h) => record[h]).join(',')),
      ].join('\n');

      saveAs(new Blob([serializedData], { type: 'text/csv;charset=utf-8' }), 'export.csv');
    }
  }
</script>

{#if data.unassigned}
  <h3 class="h3">
    Nicht zugeordnet ({data.unassigned.candidateMappings.length - manuallyAssigned.length})
  </h3>
  <div class="table-container max-h-[600px]">
    <table class="table table-hover">
      <thead>
        <tr>
          {#each data.unassigned.headerLeft as header (header)}
            <th>{header}</th>
          {/each}
          <th>
            <div class="flex justify-center">
              <Icon data={faArrowRight} />
            </div>
          </th>
          {#each data.unassigned.headerRight as header (header)}
            <th>{header}</th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each data.unassigned.candidateMappings as mapping}
          {#each mapping.candidates as candidate, index}
            <tr on:click={() => assignManually(mapping.left, candidate)}>
              {#each data.unassigned.headerLeft as header}
                <td>
                  {#if index === 0}
                    {mapping.left[header]}
                  {/if}
                </td>
              {/each}
              <td>
                <div class="flex justify-center">
                  {#if manuallyAssignedMap.get(mapping.left) === candidate}
                    <Icon data={faCheck} />
                  {/if}
                </div>
              </td>
              {#each data.unassigned.headerRight as header}
                <td>{candidate[header]}</td>
              {/each}
            </tr>
          {:else}
            <tr>
              {#each data.unassigned.headerLeft as header}
                <td>
                  {mapping.left[header]}
                </td>
              {/each}
              <td>
                <Icon data={faTriangleExclamation} />
              </td>
              <td colspan={data.unassigned.headerRight.length}>
                Keine mögliche Zuordnung gefunden!
              </td>
            </tr>
          {/each}
        {/each}
      </tbody>
    </table>
  </div>
{/if}
<h3 class="h3">Ergebnis ({data.matches.records.length + manuallyAssigned.length})</h3>
<div class="table-container max-h-[600px]">
  <table class="table">
    <thead>
      <tr>
        <th>Manuell zugeordnet</th>
        {#each data.matches.header as header (header)}
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
          {#each data.matches.header as header}
            <td>{candidate[header]}</td>
          {/each}
        </tr>
      {/each}
      {#each data.matches.records as record}
        <tr>
          <td></td>
          {#each data.matches.header as header}
            <td>{record[header]}</td>
          {/each}
        </tr>
      {/each}
      {#if manuallyAssigned.length === 0 && data.matches.records.length === 0}
        <tr>
          <td colspan={data.matches.header.length + 1}>Keine Einträge</td>
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
