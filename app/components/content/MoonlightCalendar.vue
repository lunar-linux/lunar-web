<!--
  "Moonlight calendar" for the history page (`:::moonlight-calendar` in MDC, data in its YAML block):
  one moon per year, lit in proportion to that year's moonbase changes, so the busiest year is a
  full moon. Real numbers from git (non-merge commits across the moonbase repositories).

  The page's one orchestrated moment: when the calendar scrolls into view, the moons light up one
  year after another. Each moon is a dark disc with the lit moon stacked on top, and only the top
  layer's opacity animates (iPhone rules in AGENTS.md). Server-rendered, no-JS and reduced-motion
  pages show the lit calendar straight away.
-->
<template>
  <figure
    ref="calendar"
    class="moonlight not-prose my-10"
    :class="`is-${state}`"
  >
    <ol class="grid grid-cols-[repeat(auto-fill,minmax(2.75rem,1fr))] gap-y-5">
      <li
        v-for="(year, index) in years"
        :key="year.year"
        class="flex flex-col items-center gap-1.5"
        :style="{ '--i': index }"
        :title="`${year.year}: ${year.label} changes`"
      >
        <span class="relative block h-9 w-9 sm:h-10 sm:w-10">
          <MoonPhaseIcon
            :phase="0"
            class="absolute inset-0 h-full w-full"
          />
          <MoonPhaseIcon
            :phase="year.phase"
            class="moonlight-lit absolute inset-0 h-full w-full"
          />
        </span>
        <span
          class="text-[0.7rem] tabular-nums"
          :class="year.year === busiest.year ? 'font-semibold text-indigo-200' : 'text-gray-500'"
        >{{ year.year }}<span class="sr-only">: {{ year.label }} changes</span></span>
      </li>
    </ol>

    <figcaption class="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-400">
      <span class="inline-flex items-center gap-2">
        <MoonPhaseIcon
          :phase="0.1"
          class="h-4 w-4"
        />
        quieter
        <MoonPhaseIcon
          :phase="0.5"
          class="ml-1 h-4 w-4"
        />
        busier
      </span>
      <span>Busiest: {{ busiest.year }}, with {{ busiest.label }} changes</span>
      <span class="text-gray-500">{{ firstYear }} starts in August; {{ lastYear }} runs to {{ formatDate(asOf) }}</span>
    </figcaption>
  </figure>
</template>

<script setup lang="ts">
const props = defineProps<{
  /**
   * Changes per year. A list rather than a { 2002: 1136 } map: MDC turns number-keyed maps into
   * sparse arrays.
   */
  years: Array<{ year: number, changes: number }>
  /** When the numbers were counted (the last year is partial). */
  asOf: string
}>()

const format = (count: number) => count.toLocaleString('en-US')

/** The waxing phase whose lit fraction is `lit` (0–1): inverse of moonIllumination. */
const phaseFor = (lit: number) => Math.acos(1 - 2 * Math.min(1, Math.max(0, lit))) / (2 * Math.PI)

const years = computed(() => {
  const entries = props.years
    .map(entry => ({ year: Number(entry.year), count: Number(entry.changes) }))
    .sort((a, b) => a.year - b.year)
  const max = Math.max(...entries.map(entry => entry.count))
  return entries.map(entry => ({ ...entry, label: format(entry.count), phase: phaseFor(entry.count / max) }))
})

const busiest = computed(() => years.value.reduce((top, year) => (year.count > top.count ? year : top)))
const firstYear = computed(() => years.value[0]?.year)
const lastYear = computed(() => years.value.at(-1)?.year)

type LightState = 'idle' | 'pending' | 'playing'
const state = ref<LightState>('idle')
const calendar = useTemplateRef<HTMLElement>('calendar')
let observer: IntersectionObserver | undefined

onMounted(() => {
  if (!calendar.value || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  state.value = 'pending'
  observer = new IntersectionObserver(([entry]) => {
    if (!entry?.isIntersecting) return
    observer?.disconnect()
    // Next frame, so the unlit state has been painted before the transitions start.
    requestAnimationFrame(() => {
      state.value = 'playing'
    })
  }, { threshold: 0.35 })
  observer.observe(calendar.value)
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<style scoped>
.moonlight-lit {
  will-change: opacity;
}

/* Unlit until the calendar is in view; 0.001 rather than 0 so the layer is already painted */
.is-pending .moonlight-lit {
  opacity: 0.001;
}

.is-playing .moonlight-lit {
  transition: opacity 0.7s ease-out;
  transition-delay: calc(var(--i) * 70ms);
}
</style>
