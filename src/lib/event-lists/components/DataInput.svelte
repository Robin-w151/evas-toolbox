<script lang="ts">
  import Form from '$lib/shared/components/form/Form.svelte';
  import Label from '$lib/shared/components/form/Label.svelte';
  import { createEventDispatcher } from 'svelte';

  export let errorMessage: string | undefined = undefined;

  const dispatch = createEventDispatcher();
  const invalidFormatMessage = 'Ungültiges Format!';

  let attendeesFiles: FileList | undefined = undefined;
  let registeredFiles: FileList | undefined = undefined;

  $: isAttendeesFileValid = isSingleCSVFile(attendeesFiles);
  $: isRegisteredFileValid = isSingleCSVFile(registeredFiles);
  $: isFormValid = isAttendeesFileValid && isRegisteredFileValid;

  function handleSubmit(): void {
    const attendeesFile = attendeesFiles?.[0];
    const registeredFile = registeredFiles?.[0];

    if (attendeesFile && registeredFile) {
      dispatch('submit', {
        attendeesFile,
        registeredFile,
      });
    }
  }

  function isSingleCSVFile(files?: FileList): boolean {
    const file = files?.[0];
    return !!file && file.type === 'text/csv';
  }

  function isSingleCSVFileOrEmpty(files?: FileList): boolean {
    const file = files?.[0];
    return !file || file.type === 'text/csv';
  }
</script>

<Form>
  <Label
    text="Liste der anwesenden Teilnehmer"
    error={!isSingleCSVFileOrEmpty(attendeesFiles)}
    errorMessage={invalidFormatMessage}
  >
    <input class="input" type="file" accept=".csv" bind:files={attendeesFiles} />
  </Label>
  <Label
    text="Liste der angemeldeten Teilnehmer"
    error={!isSingleCSVFileOrEmpty(registeredFiles)}
    errorMessage={invalidFormatMessage}
  >
    <input class="input" type="file" accept=".csv" bind:files={registeredFiles} />
  </Label>
  <div class="flex justify-between items-center gap-4">
    <p class="text-error-600-300-token">{errorMessage ?? ''}</p>
    <div class="flex justify-end gap-2">
      <button class="btn variant-filled-primary" disabled={!isFormValid} on:click={handleSubmit}
        >Daten laden</button
      >
    </div>
  </div>
</Form>
