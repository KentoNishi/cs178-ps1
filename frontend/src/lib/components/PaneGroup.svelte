<script lang="ts">
  import InputPane from "./InputPane.svelte";
  import { type Timeslot, Availability } from "$lib/ts/types";


  let isWelcome = false;

  let allSlots: Timeslot[][] = Array.from({ length : 3}, (_ , j) => {
    const day = new Date(`2/${7 + j}/2024 12:00:00`).getTime();
    return Array.from({ length: 8 }, (_, i) => {
      return {
        begin: new Date(day + 1000 * 60 * 60 * i),
        end: new Date(day + 1000 * 60 * 60 * (i + 1)),
        userValue: Availability.Unavailable,
        othersValues: {
          [Availability.Available]: [{
            name: "John",
            id: 1,
          }],
          [Availability.Unavailable]: [{
            name: "Alice",
            id: 2,
          }],
          [Availability.Inconvenient]: []
          // [{
          //   name: "Bob"
          // }]
        }
      }
    });
  })

  let slots = allSlots[2];
  console.log(allSlots);

  let pos = 0;
  function rotate_panes() {
    pos = (pos + 1) % 3;
    slots = allSlots[pos];
  }

</script>

<InputPane bind:slots={slots} />
<button on:click={() => {rotate_panes()}}> Press me</button>
