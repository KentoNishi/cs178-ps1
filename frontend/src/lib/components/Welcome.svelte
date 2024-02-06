<script lang="ts">
	import { Availability } from "$lib/ts/types";
	import { fade } from "svelte/transition";
  import InputPane from "./InputPane.svelte";
  import tap from "$lib/assets/tap.svg";
	import { onMount, tick } from "svelte";

  let fakeData = Array.from({ length: 8 }, () => ({
    begin: new Date(),
    end: new Date(),
    userValue: Availability.Unavailable,
    othersValues: {
      [Availability.Available]: [],
      [Availability.Unavailable]: [],
      [Availability.Inconvenient]: []
    }
  }));
  let open = true;
  const checkIfUnlocked = (slots: typeof fakeData) => {
    return slots.every(slot => slot.userValue === Availability.Undefined);
  }
  $: open = !checkIfUnlocked(fakeData);
  let dialogElem: HTMLDivElement;
  let leftmostX = 0;
  let rightmostX = 0;
  const recalcBounds = async () => {
    await tick();
    const elems = Array.from(dialogElem.querySelectorAll(".col-query"));
    leftmostX = elems[0].getBoundingClientRect().left;
    rightmostX = elems[elems.length - 1].getBoundingClientRect().left - 60;
  };
  onMount(recalcBounds);
</script>

<svelte:window on:resize={recalcBounds} />

{#if open}
  <div class="dialog" transition:fade bind:this={dialogElem}>
    <h1>Swipe to Start</h1>
    <InputPane bind:slots={fakeData} isWelcome />
  </div>
  <img src={tap} alt="tap" class="tap" class:pulse-floating={open} transition:fade style="--leftmost-x: {leftmostX}px; --rightmost-x: {rightmostX}px;" />
{/if}

<style>
  .dialog {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    z-index: 10000;
  }
  h1 {
    font-size: 4em;
  }
  @keyframes pulse-floating {
    0% {
      opacity: 0;
      left: var(--leftmost-x);
      scale: 1;
    }

    50% {
      opacity: 0.5;
      left: var(--rightmost-x);
      scale: 1;
      transform: translate(50%, 90%);
    }

    100% {
      opacity: 0;
      left: var(--rightmost-x);
      transform-origin: center center;
      transform: translate(50%, 90%) scale(1.5);
    }
  }
  .pulse-floating {
    animation: pulse-floating 2s infinite;
    animation-fill-mode: forwards;
    position: fixed;
    z-index: 10000;
    width: 100px;
    height: 100px;
    bottom: 45vh;
    transform: translate(50%, 90%);
    pointer-events: none;
    touch-action: none;
    filter: invert(1) drop-shadow(0px 0px 10px rgba(0, 0, 0, 0.678));
  }
</style>
