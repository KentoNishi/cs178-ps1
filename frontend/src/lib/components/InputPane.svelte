<script lang="ts">
	import { Availability, type Timeslot, type User } from "$lib/ts/types";
	import { onMount, tick } from "svelte";
  import SlotStats from "./SlotStats.svelte";

  const currentUser: User = {
    name: "Bob",
    id: 0
  };
  const now = new Date().getTime();
  export let slots: Timeslot[] = Array.from({ length: 10 }, (_, i) => {
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
    columnWidth = Math.max(100, rect.width / slots.length);
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
    const start = Math.min(regionSelection.index, index);
    const end = Math.max(regionSelection.index, index);
    for (let i = start; i <= end; i++) {
      slots[i] = { ...slots[i], userValue: hoveredWhileDown.availability };
    }
    renderedSlotIndices = renderedSlotIndices.filter(i => i < start || i > end);
    await tick();
    regionSelection = null;
    slots = [...slots];
    renderedSlotIndices = Array.from({ length: slots.length }, (_, i) => i);
    hoveredWhileDown = null;
  };
  const checkIndex = (index: number, availability: Availability) => {
    if (!regionSelection || !hoveredWhileDown) return false;
    return hoveredWhileDown.start <= index && index <= hoveredWhileDown.end && availability === hoveredWhileDown.availability;
  };
</script>
<svelte:window on:resize={updateColumnWidth} />
<div class="scroller" style="--column-width: {columnWidth}px;" bind:this={scroller}>
  <div class="wrapper">
    {#each slots as slot, index}
      <div class="column">
        <div class="top">
          <SlotStats timeslot={slot} />
        </div>

        {#if index === 0 || slot.begin.getTime() != slots[index - 1].end.getTime()}
          <p class="overlay bottom-left no-break">{formatTime(slot.begin)}</p>
        {/if}
        <p class="overlay bottom-right no-break">{formatTime(slot.end)}</p>
        <div class="regions">
          {#each [Availability.Available, Availability.Inconvenient, Availability.Unavailable] as availability}
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div
              class="region {availability}-color"
              style="height: 100%; width: 100%;"
              class:hovered={hoveredWhileDown && hoveredWhileDown.start <= index && index <= hoveredWhileDown.end && hoveredWhileDown.availability === availability}
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
            >
              <div>
                <div class="dot absolute" />
                {#if (((!hoveredWhileDown || index < hoveredWhileDown.start || index > hoveredWhileDown.end) && slot.userValue === availability) || checkIndex(index, availability)) && renderedSlotIndices.includes(index)}
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
    height: 100vh;
    user-select: none;
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
    transform: translate(-50%, -50%);
  }
  @keyframes fade-in {
    from {
      transform: translate(-50%, -50%) scale(0);
      filter: opacity(0);
    }
    to {
      transform: translate(-50%, -50%) scale(1);
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
  .hovered .dot {
    width: 100%;
    border-radius: 0px;
  }
  .region:hover:not(.hovered).hoverable .dot {
    width: 70px;
    height: 70px;
  }
  .region.hoverable {
    z-index: 100;
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
    display: flex;
    justify-content: center;
    align-items: center;
    transition: 0.1s;
    border-radius: 5px;
    overflow: hidden;
    cursor: pointer;
  }
  .hovered {
    transform: scale(1.1);
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
</style>
