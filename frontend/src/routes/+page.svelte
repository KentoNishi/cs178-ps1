<script>
	import InputPane from "$lib/components/InputPane.svelte";
  import Welcome from "$lib/components/Welcome.svelte";
  import PaneGroup from "$lib/components/PaneGroup.svelte";
</script>

<div class="page">
  <PaneGroup />
  <!-- <InputPane /> -->
</div>
<!-- <Welcome /> -->

<style>
  :global(body) {
    margin: 0px;
    font-family: 'Segoe UI';
  }
  :global(.available-color) {
    background-color: rgb(87, 255, 127);
  }
  :global(.inconvenient-color) {
    background-color: rgb(249, 255, 79);
  }
  :global(.unavailable-color) {
    background-color: rgb(255, 91, 91);
  }
  :global(.undefined-color) {
    background-color: rgb(213, 213, 213);
  }
  .page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
  }
</style>
