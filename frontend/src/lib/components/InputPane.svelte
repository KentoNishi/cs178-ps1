<script lang="ts">
	import { Availability, type Timeslot } from "$lib/ts/types";
	import { onMount } from "svelte";
  import SlotStats from "./SlotStats.svelte";

  const now = new Date().getTime();
  export let slots: Timeslot[] = Array.from({ length: 10 }, (_, i) => ({
    begin: new Date(now + 1000 * 60 * 60 * i),
    end: new Date(now + 1000 * 60 * 60 * (i + 1)),
    userValue: Availability.Unavailable,
    othersValues: {
      [Availability.Available]: [{
        name: "John"
      }],
      [Availability.Unavailable]: [{
        name: "Alice"
      }],
      [Availability.Inconvenient]: [{
        name: "Bob"
      }]
    }
  }));
  let scroller: HTMLDivElement;
  let columnWidth = 0;
  const updateColumnWidth = () => {
    if (!scroller) return;
    const rect = scroller.getBoundingClientRect();
    columnWidth = Math.max(100, rect.width / slots.length);
  };
  onMount(updateColumnWidth);
  const formatTime = (date: Date) => date.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric" });
  const startSelectRegion = (index: number, availability: Availability) => {
    console.log(index, availability);
  };
</script>
<svelte:window on:resize={updateColumnWidth} />
<div class="scroller" style="--column-width: {columnWidth}px;" bind:this={scroller}>
  <div class="wrapper">
    {#each slots as slot, index}
      <div class="column">
        <div class="top">
          <SlotStats othersValues={slot.othersValues} />
        </div>

        {#if index === 0 || slot.begin.getTime() != slots[index - 1].end.getTime()}
          <p class="bottom-left no-break">{formatTime(slot.begin)}</p>
        {/if}
        <p class="bottom-right no-break">{formatTime(slot.end)}</p>
        <div class="regions">
          {#each [Availability.Available, Availability.Inconvenient, Availability.Unavailable] as availability}
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div
              class="region {availability}-color"
              style="height: 100%; width: 100%;"
              on:mousedown={() => startSelectRegion(index, availability)}
            >
              <div class="dot" />
            </div>
          {/each}
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .wrapper {
    display: inline-flex;
    flex-direction: row;
    height: 100%;
  }
  .scroller {
    overflow-x: scroll;
    overflow-y: hidden;
    padding: 0px calc(var(--column-width) / 2);
    height: 100vh;
    user-select: none;
  }
  .column {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--column-width);
    position: relative;
    border-left: 2px solid rgb(255, 255, 255);
    height: 100%;
  }
  .dot {
    width: 10px;
    height: 10px;
    background-color: rgba(92, 92, 92, 0.229);
    border-radius: 50%;
    transition: width 0.1s, height 0.1s;
  }
  .region:hover > .dot {
    width: 25px;
    height: 25px;
  }
  .regions {
    height: calc(100% - 120px);
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .region {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .top {
    position: absolute;
    top: 10px;
    width: 90%;
  }
  .bottom-left {
    position: absolute;
    bottom: 0;
    left: 0;
    transform: translateX(-50%);
  }
  .bottom-right {
    position: absolute;
    bottom: 0;
    right: 0;
    transform: translateX(50%);
  }
  .no-break {
    white-space: nowrap;
  }
</style>
