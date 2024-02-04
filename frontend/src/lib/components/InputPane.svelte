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
      [Availability.Available]: [],
      [Availability.Unavailable]: [],
      [Availability.Inconvenient]: []
    }
  }));
  let scroller: HTMLDivElement;
  let columnWidth = 0;
  const updateColumnWidth = () => {
    if (!scroller) return;
    const rect = scroller.getBoundingClientRect();
    columnWidth = rect.width / Math.min(slots.length, rect.width / 100)
  };
  onMount(updateColumnWidth);
  const formatTime = (date: Date) => date.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric" });
</script>
<svelte:window on:resize={updateColumnWidth} />
<div class="scroller" style="--column-width: {columnWidth}px;" bind:this={scroller}>
  <div class="wrapper">
    {#each slots as slot, index}
      <div class="column">

        <div class="top">
        <!--
          Switch to this one once we have some actual (or toy data) within this component:
          <SlotStats othersValues={slot.othersValues} columnWidth={columnWidth} />
         -->
          <SlotStats columnWidth={columnWidth}/>
        </div>

        {#if index === 0 || slot.begin.getTime() != slots[index - 1].end.getTime()}
          <p class="bottom-left">{formatTime(slot.begin)}</p>
        {/if}
        <p class="bottom-right">{formatTime(slot.end)}</p>
        <p>{slot.userValue}</p>
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
  }
  .column {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--column-width);
    position: relative;
    box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.5);
    height: 100%;
  }
  .top {
    position: absolute;
    top: 10px;
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
</style>
