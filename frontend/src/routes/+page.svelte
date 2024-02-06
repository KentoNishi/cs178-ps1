<script>
	import InputPane from "$lib/components/InputPane.svelte";
</script>
<InputPane />

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
</style>
