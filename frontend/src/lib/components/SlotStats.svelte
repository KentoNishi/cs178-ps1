<script lang="ts">
  import { Availability, type Timeslot, type OthersValues, type User} from "$lib/ts/types";

  // Toy data. Put within one of the othersValue array to test functionality.
  // TODO: Remove this once InputPane component has data to work with.
  const user1: User = { name: "John" };
  const user2: User = { name: "Alice" };

  export let othersValues: OthersValues = {
    [Availability.Available]: [],
    [Availability.Unavailable]: [],
    [Availability.Inconvenient]: []
  };
</script>

<div class="slot-stats">
  {#if othersValues.Available.length > 0}
    <div class="slot-count available-count" style="flex: {othersValues.Available.length}">
      {othersValues.Available.length}
    </div>
  {/if}
  {#if othersValues.Inconvenient.length > 0}
    <div class="slot-count inconvenient-count" style="flex: {othersValues.Inconvenient.length}">
      {othersValues.Inconvenient.length}
    </div>
  {/if}
  {#if othersValues.Unavailable.length > 0}
    <div class="slot-count unavailable-count" style="flex: {othersValues.Unavailable.length}">
      {othersValues.Unavailable.length}
    </div>
  {/if}
  {#if othersValues.Unavailable.length + othersValues.Inconvenient.length + othersValues.Available.length == 0}
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
    width: calc(var(--column-width) - 10px);
    min-height: 40px;
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: aliceblue;
    content: "";
    border: 1px solid black;
    box-shadow: 1px 1px 10px black;
  }
  .available-count {
    background-color: green;
  }
  .inconvenient-count {
    background-color: orange;
  }
  .unavailable-count {
    background-color: red;
  }
</style>