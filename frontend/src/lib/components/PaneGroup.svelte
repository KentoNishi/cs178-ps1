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

  const sat = new Date(`2/10/2024 12:00:00`);
  DayInputs.push(
    {
      day: sat,
      slots: (Array.from({ length: 4}, (_, i) => {
        return {
          begin: new Date(sat.getTime() + 1000 * 60 * 60 * i),
          end: new Date(sat.getTime() + 1000 * 60 * 60 * (i + 1)),
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
    }
  );

  let currentDisplayDay = DayInputs[0];

  function to_day_string(day : Date) {
    return `${day.toLocaleDateString("en-us", { weekday: 'long' })}`;
  }

  function to_date_string(day: Date) {
    return `${day.getMonth() + 1}/${day.getDate()}`
  }

</script>

<InputPane bind:slots={currentDisplayDay.slots} />

<div class="day-menu">
  {#each DayInputs as day}
    <button class="day-option" id="{currentDisplayDay.day === day.day ? 'active' : ''}" on:click={() =>{currentDisplayDay=day}}>
      <div class="ta-center"> {to_day_string(day.day)} </div>
      <div class="ta-center"> {to_date_string(day.day)} </div>
    </button>
  {/each}
</div>


<style>
  .ta-center {
    width: 100%;
    text-align: center;
  }

  .day-menu {
    display: flex;
    flex-direction: row;
    gap: 3px;
    justify-content: center;
    align-items: center;
    /* This is a terrible way to fix this, why does flex: 1 not obey me, maybe I'm being dumb */
    min-width: 700px;
  }

  /* Credit: https://copy-paste-css.com/ using the second twitch button CSS as template for quick button styling proto */
  .day-option {
    box-sizing: border-box;
    text-wrap: pretty;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    outline: 0;
    border: none;
    cursor: pointer;
    font-weight: 800;
    font-size: 20px;
    min-width: 0;
    height: 60px;
    background-color: #9147ff;
    color: white;
    padding: 0 10px;
  }

  .day-option:first-of-type {
    border-radius: 0px 0px 0px 10px;
  }

  .day-option:last-of-type {
    border-radius: 0px 0px 10px 0px;
  }

  .day-option:hover {
    background-color: #772ce8;
  }

  #active {
    background-color: #321164;
  }

  #active:hover {
    background-color: #321164;
  }


</style>
