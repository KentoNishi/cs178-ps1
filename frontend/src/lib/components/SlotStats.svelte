<script lang="ts">
  import { Availability, type OthersValues, type Timeslot } from "$lib/ts/types";

  export let timeslot: Timeslot;
  $: othersValues = timeslot.othersValues; 
  $: available = [othersValues[Availability.Available], ...(timeslot.userValue === Availability.Available ? [timeslot] : [])];
  $: inconvenient = [othersValues[Availability.Inconvenient], ...(timeslot.userValue === Availability.Inconvenient ? [timeslot] : [])];
  $: unavailable = [othersValues[Availability.Unavailable], ...(timeslot.userValue === Availability.Unavailable ? [timeslot] : [])];
</script>

<div class="slot-stats" style="grid-template-columns: {available.length}fr {inconvenient.length}fr {unavailable.length}fr;">
  <div class="slot-count available-color" class:translucent={!available.length}>
    {available.length}
  </div>
  <div class="slot-count inconvenient-color" class:translucent={!inconvenient.length}>
    {inconvenient.length}
  </div>
  <div class="slot-count unavailable-color" class:translucent={!unavailable.length}>
    {unavailable.length}
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
    transition: 0.2s;
  }
  .translucent {
    opacity: 0.5;
  }
</style>