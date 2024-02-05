<script lang="ts">
  import { Availability, type OthersValues } from "$lib/ts/types";

  export let othersValues: OthersValues = {
    [Availability.Available]: [],
    [Availability.Unavailable]: [],
    [Availability.Inconvenient]: []
  };
</script>

<div class="slot-stats" style="grid-template-columns: {othersValues.available.length}fr {othersValues.inconvenient.length}fr {othersValues.unavailable.length}fr;">
  <div class="slot-count available-color" class:translucent={!othersValues.available.length}>
    {othersValues.available.length}
  </div>
  <div class="slot-count inconvenient-color" class:translucent={!othersValues.inconvenient.length}>
    {othersValues.inconvenient.length}
  </div>
  <div class="slot-count unavailable-color" class:translucent={!othersValues.unavailable.length}>
    {othersValues.unavailable.length}
  </div>
</div>

<style>
  .slot-count {
    font-weight: bold;
    font-size: 18px;
    text-align: center;
    min-height: inherit;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0px 5px;
  }
  .slot-stats {
    border-radius: 5px;
    overflow: hidden;
    width: 100%;
    min-height: 40px;
    display: grid;
    align-items: center;
    background-color: aliceblue;
    content: "";
    box-shadow: 1px 1px 10px rgb(188, 188, 188);
  }
  .translucent {
    opacity: 0.5;
  }
</style>