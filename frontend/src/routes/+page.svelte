<script>
	import InputPane from "$lib/components/InputPane.svelte";
</script>
<InputPane />

<style>
  :global(body) {
    margin: 0px;
  }
  :global(.available-color) {
    background-color: rgb(87, 255, 127);
  }
  :global(.inconvenient-color) {
    background-color: rgb(252, 255, 78);
  }
  :global(.unavailable-color) {
    background-color: rgb(255, 91, 91);
  }
</style>
