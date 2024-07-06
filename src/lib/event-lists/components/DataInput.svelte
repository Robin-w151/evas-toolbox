<script lang="ts">
  import Form from '$lib/shared/components/form/Form.svelte';
  import Label from '$lib/shared/components/form/Label.svelte';
  import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let attendeesFiles: FileList | undefined = undefined;
  let registeredFiles: FileList | undefined = undefined;

  $: isFormValid = !!attendeesFiles?.[0] && !!registeredFiles?.[0];

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
</script>

<Form>
  <Label text="Liste der anwesenden Teilnehmer">
    <input class="input" type="file" accept=".csv" bind:files={attendeesFiles} />
  </Label>
  <Label text="Liste der angemeldeten Teilnehmer">
    <input class="input" type="file" accept=".csv" bind:files={registeredFiles} />
  </Label>
  <div class="flex justify-end gap-2">
    <button class="btn variant-filled-primary" disabled={!isFormValid} on:click={handleSubmit}
      >Daten laden</button
    >
  </div>
</Form>
