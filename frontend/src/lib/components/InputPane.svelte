<script lang="ts">
	import { Availability, type Timeslot } from "$lib/ts/types";
	import { onMount, tick } from "svelte";
  import SlotStats from "./SlotStats.svelte";

  const now = new Date('2/7/2024 12:00:00').getTime();
  export let isWelcome = false;
  export let slots: Timeslot[] = Array.from({ length: 8 }, (_, i) => {
    return {
      begin: new Date(now + 1000 * 60 * 60 * i),
      end: new Date(now + 1000 * 60 * 60 * (i + 1)),
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
  let scroller: HTMLDivElement;
  let columnWidth = 0;
  const updateColumnWidth = () => {
    if (!scroller) return;
    const rect = scroller.getBoundingClientRect();
    columnWidth = Math.max(100, rect.width / (1.2 * slots.length));
  };
  onMount(updateColumnWidth);
  const formatTime = (date: Date) => date.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric" });
  let regionSelection: { index: number, availability: Availability } | null = null;
  const startSelectRegion = (event: MouseEvent, index: number, availability: Availability) => {
    regionSelection = { index, availability };
    hoveredWhileDown = {
      start: index,
      end: index,
      availability
    }
  };
  let hoveredWhileDown: { start: number, end: number, availability: Availability } | null = null;
  let renderedSlotIndices = Array.from({ length: slots.length }, (_, i) => i);
  const endRegionSelection = async (index: number) => {
    if (!regionSelection || !hoveredWhileDown) return;
    const start = Math.min(hoveredWhileDown.start, index);
    const end = Math.max(hoveredWhileDown.end, index);
    for (let i = start; i <= end; i++) {
      slots[i] = { ...slots[i], userValue: hoveredWhileDown.availability };
    }
    slots = [...slots];
    renderedSlotIndices = renderedSlotIndices.filter(i => i < start || i > end);
    await tick();
    regionSelection = null;
    renderedSlotIndices = Array.from({ length: slots.length }, (_, i) => i);
    if (isWelcome && end - start == 7) return;
    hoveredWhileDown = null;
  };
  const checkIndex = (index: number, availability: Availability) => {
    if (!regionSelection || !hoveredWhileDown) return false;
    return hoveredWhileDown.start <= index && index <= hoveredWhileDown.end && availability === hoveredWhileDown.availability;
  };
  $: ratio = (columnWidth + 20) / columnWidth;
  const mouseLeftWindow = () => {
    if (hoveredWhileDown) {
      endRegionSelection(hoveredWhileDown.end);
    }
  };
</script>
<svelte:window on:resize={updateColumnWidth}  />
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="scroller" style="--column-width: {columnWidth}px; --column-scale-factor: {ratio};" class:welcome={isWelcome} bind:this={scroller}>
  <div class="wrapper" on:mouseleave={mouseLeftWindow} on:mouseenter={mouseLeftWindow}>
    {#each slots as slot, index}
      <div class="column">
        {#if !isWelcome}
          <div class="top">
            <SlotStats timeslot={slot} />
          </div>
        {/if}

        {#if !isWelcome}
          {#if index === 0 || slot.begin.getTime() != slots[index - 1].end.getTime()}
            <span class="overlay bottom-left no-break time-marker">{formatTime(slot.begin)}</span>
          {/if}
          <span class="overlay bottom-right no-break time-marker">{formatTime(slot.end)}</span>
        {/if}
        <div class="regions">
          {#each (isWelcome ? [Availability.Undefined] : [Availability.Available, Availability.Inconvenient, Availability.Unavailable]) as availability}
            {@const shouldShowCheckmark = (
              (((!hoveredWhileDown || index < hoveredWhileDown.start || index > hoveredWhileDown.end) && slot.userValue === availability) || checkIndex(index, availability))
              && renderedSlotIndices.includes(index)
            )}
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div
              class="region {availability}-color"
              style="height: 100%; width: 100%; {shouldShowCheckmark ? 'filter: grayscale(0.1) brightness(0.9)' : 'filter: grayscale(0.5) brightness(0.3);'}"
              class:floating={hoveredWhileDown && hoveredWhileDown.start <= index && index <= hoveredWhileDown.end && hoveredWhileDown.availability === availability}
              class:hoverable={!hoveredWhileDown || hoveredWhileDown?.availability === availability}
              on:pointerdown={(event) => startSelectRegion(event, index, availability)}
              on:mouseup={() => endRegionSelection(index)}
              on:mouseenter={() => {
                if (regionSelection && hoveredWhileDown) {
                  hoveredWhileDown = {
                    start: Math.min(hoveredWhileDown.start, index),
                    end: Math.max(hoveredWhileDown.end, index),
                    availability: hoveredWhileDown.availability
                  }
                }
              }}
              class:leftmost-border={index == hoveredWhileDown?.start} class:rightmost-border={index == hoveredWhileDown?.end}
            >
              <div class="region-inner shadow {index == hoveredWhileDown?.start ? 'leftmost-inner leftmost-border' : ''} {index == hoveredWhileDown?.end ? 'rightmost-inner rightmost-border' : ''}" />
              <div class="region-inner">
                <div class="dot absolute col-query" />
                {#if shouldShowCheckmark}
                  <div class="overlay absolute checkmark" style="font-size: 50px; font-weight: bold;">✓</div>
                {/if}
              </div>
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
    height: calc(100vh - 200px);
    width: calc(100% - 200px);
    box-sizing: border-box;
    user-select: none;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .welcome {
    overflow: hidden;
  }
  .welcome.scroller {
    height: 50vh;
  }
  .welcome .regions {
    height: calc((100vh - 400px) / 3);
  }
  .column {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--column-width);
    position: relative;
    margin-left: 10px;
    height: 100%;
  }
  .absolute {
    position: absolute;
  }
  @keyframes fade-in {
    from {
      transform: scale(0);
      filter: opacity(0);
    }
    to {
      transform: scale(1);
      filter: opacity(1);
    }
  }
  .checkmark {
    animation: fade-in 0.2s;
  }
  .dot {
    width: 60px;
    height: 60px;
    background-color: rgba(92, 92, 92, 0.229);
    transition: width 0.1s, height 0.1s;
    transition-delay: 0.075s;
  }
  .floating .dot {
    width: 100%;
    border-radius: 0px;
  }
  .region:hover:not(.floating).hoverable .dot {
    width: 70px;
    height: 70px;
  }
  .regions {
    height: calc(100% - 120px);
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 10px;
  }
  .region {
    transition: 0.1s;
    overflow: hidden;
    cursor: pointer;
    overflow: visible;
    position: relative;
  }
  .region:not(.floating) {
    border-radius: 5px;
  }
  .floating.region {
    z-index: 1000;
    filter: grayscale(0) !important;
  }
  .floating .shadow {
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.281);
    clip-path: inset(-40px calc(10px / var(--column-scale-factor)) -40px 0px);
    position: absolute;
  }
  .leftmost-inner {
    clip-path: inset(-40px calc(10px / var(--column-scale-factor)) -40px -40px) !important;
  }
  .rightmost-inner {
    clip-path: inset(-40px -40px -40px 0px) !important;
  }
  .leftmost-inner.rightmost-inner {
    clip-path: inset(-40px -40px -40px -40px) !important;
  }
  .leftmost-border {
    border-radius: 5px 0px 0px 5px;
  }
  .rightmost-border {
    border-radius: 0px 5px 5px 0px;
  }
  .leftmost-border.rightmost-border {
    border-radius: 5px;
  }
  .region-inner {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
  }
  .floating {
    transform: scale(var(--column-scale-factor));
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
  .overlay {
    z-index: 100;
  }
  .time-marker {
    font-size: 2rem;
    font-weight: bold;
    color: rgba(0, 0, 0, 0.5);
  }
</style>
