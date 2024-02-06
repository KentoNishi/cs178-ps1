<script lang="ts">
  import InputPane from "./InputPane.svelte";
  import { Availability, type DayInput } from "$lib/ts/types";


  let DayInputs: DayInput[] = Array.from({ length : 3}, (_ , j) => {
    const this_day = new Date(`2/${7 + j}/2024 12:00:00`);
    return {
      day: this_day,
      slots: (Array.from({ length: 8 }, (_, i) => {
        return {
          begin: new Date(this_day.getTime() + 1000 * 60 * 60 * i),
          end: new Date(this_day.getTime() + 1000 * 60 * 60 * (i + 1)),
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
        };
      }))
    };
  });

  let currentDisplayDay = DayInputs[0].slots;
</script>

<InputPane bind:slots={currentDisplayDay} />

<div class="day-menu">
  {#each DayInputs as day}
    <button class="day-option" on:click={() => currentDisplayDay=day.slots}> {day.day.toLocaleDateString("en-us", { weekday: 'long' })}</button>
  {/each}
</div>



<style>

  .day-menu {
    display: flex;
    flex-direction: row;
    gap: 5px;
    justify-content: center;
    align-items: center;
    width: 200px;
  }

  /* Credit: https://copy-paste-css.com/ using the second twitch button CSS as template for quick button styling proto */
  .day-option {
    display: inline-block;
    outline: 0;
    border: none;
    cursor: pointer;
    font-weight: 600;
    border-radius: 4px;
    font-size: 13px;
    height: 30px;
    background-color: #9147ff;
    color: white;
    padding: 0 10px;
  }

  .day-option:hover {
    background-color: #772ce8;
  }

  .day-selected {
    background-color: #321164;
  }


</style>
