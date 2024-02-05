<script lang="ts">
  import { Availability, type OthersValues } from "$lib/ts/types";

  export let othersValues: OthersValues = {
    [Availability.Available]: [],
    [Availability.Unavailable]: [],
    [Availability.Inconvenient]: []
  };
</script>

<div class="slot-stats">
  {#if othersValues.available.length > 0}
    <div class="slot-count available-color" style="flex: {othersValues.available.length}">
      {othersValues.available.length}
    </div>
  {/if}
  {#if othersValues.inconvenient.length > 0}
    <div class="slot-count inconvenient-color" style="flex: {othersValues.inconvenient.length}">
      {othersValues.inconvenient.length}
    </div>
  {/if}
  {#if othersValues.unavailable.length > 0}
    <div class="slot-count unavailable-color" style="flex: {othersValues.unavailable.length}">
      {othersValues.unavailable.length}
    </div>
  {/if}
  {#if othersValues.unavailable.length + othersValues.inconvenient.length + othersValues.available.length == 0}
  <div class="slot-count" style="flex: 1">
    No data yet!
  </div>
  {/if}
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
  }
  .slot-stats {
    border-radius: 5px;
    overflow: hidden;
    width: 100%;
    min-height: 40px;
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: aliceblue;
    content: "";
    box-shadow: 1px 1px 10px rgb(167, 167, 167);
  }
</style>