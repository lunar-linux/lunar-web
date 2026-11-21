<!--
  One chapter of the history page (`::history-chapter{phase="0.25" when="2002"}` in MDC).
  The story is told as one lunar month: each chapter is marked by a moon one phase further on,
  and a dotted orbit runs down to the next chapter's moon.
-->
<template>
  <section class="history-chapter relative grid grid-cols-[2.75rem_minmax(0,1fr)] gap-x-5 pb-16 sm:grid-cols-[3.5rem_minmax(0,1fr)] sm:gap-x-8">
    <span
      class="chapter-orbit"
      aria-hidden="true"
    />
    <div class="chapter-moon">
      <MoonPhaseIcon
        :phase="moonPhase"
        class="h-full w-full"
      />
    </div>
    <div class="min-w-0 [&_h2]:mt-2 [&_h2]:mb-5">
      <p class="not-prose text-sm">
        <span class="font-medium text-indigo-200">{{ moonPhaseName(moonPhase) }}</span>
        <span class="text-gray-500"> · {{ when }}</span>
      </p>
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{
  /** Position in the lunar cycle, 0–1 (0 and 1 are new moons). MDC passes it as a string. */
  phase: number | string
  /** When this chapter happens, in words: "2001–2002", "Now". */
  when: string
}>()

const moonPhase = computed(() => Number(props.phase))
</script>

<style scoped>
.history-chapter {
  --moon: 2.75rem;
}

@media (min-width: 640px) {
  .history-chapter {
    --moon: 3.5rem;
  }
}

.chapter-moon {
  width: var(--moon);
  height: var(--moon);
  padding: 0.2rem;
}

/* The orbit down to the next chapter's moon; the last chapter has none */
.chapter-orbit {
  position: absolute;
  top: calc(var(--moon) + 0.35rem);
  bottom: 0.35rem;
  left: calc(var(--moon) / 2 - 1.5px);
  width: 3px;
  background: radial-gradient(circle, rgb(165 180 252 / 0.45) 1px, transparent 1.5px) center top / 3px 9px repeat-y;
}

.history-chapter:not(:has(+ .history-chapter)) .chapter-orbit {
  display: none;
}
</style>
