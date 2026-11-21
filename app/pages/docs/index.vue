<template>
  <div class="px-6 pt-12 pb-24">
    <div class="container mx-auto max-w-5xl">
      <header class="flex flex-wrap items-end justify-between gap-6">
        <div class="max-w-xl">
          <h1 class="text-4xl font-bold tracking-[-0.035em] text-white sm:text-5xl">
            Documentation
          </h1>
          <p class="mt-4 text-lg text-gray-400">
            Your flight plan through Lunar Linux, from the first boot to your first module.
          </p>
          <!-- For people who reach the docs without knowing what Lunar is -->
          <p class="mt-3 text-gray-400">
            New to Lunar? Start with the
            <NuxtLink
              to="/about"
              class="font-medium text-indigo-300 underline-offset-4 transition-colors hover:text-white hover:underline"
            >pre-flight briefing</NuxtLink>.
          </p>
        </div>
        <SearchLauncher class="sm:w-80">
          Where are you headed?
        </SearchLauncher>
      </header>

      <!-- The flight plan: a real sequence for someone new to Lunar, so it's an ordered list -->
      <ol
        class="flight-plan mt-16"
        :class="{ 'is-playing': isSettled }"
        aria-label="Flight plan"
      >
        <li
          v-for="(stage, index) in stages"
          :key="stage.path"
          class="stage group relative grid grid-cols-[var(--gutter)_minmax(0,1fr)] gap-x-5 pb-16 last:pb-0 sm:gap-x-8"
          :style="{ '--i': index, '--x': stage.x }"
        >
          <!-- Trajectory from this marker down to the next one -->
          <span
            v-if="stages[index + 1]"
            class="trajectory"
            aria-hidden="true"
          >
            <span class="trajectory-wipe">
              <svg
                class="trajectory-art"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >
                <path
                  :d="`M ${stage.x} 0 C ${stage.x} 55, ${stages[index + 1]!.x} 45, ${stages[index + 1]!.x} 100`"
                  fill="none"
                  stroke="rgb(165 180 252 / 0.5)"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-dasharray="0 7"
                  vector-effect="non-scaling-stroke"
                />
              </svg>
            </span>
          </span>

          <div
            class="marker"
            aria-hidden="true"
          >
            <PlanetEarth
              v-if="index === 0"
              class="h-full w-full"
            />
            <MoonPhaseIcon
              v-else-if="index === stages.length - 1"
              :phase="0.5"
              class="h-full w-full"
            />
            <span
              v-else
              class="waypoint"
            >{{ index + 1 }}</span>
          </div>

          <div class="stage-text min-w-0 pt-1">
            <p class="flex flex-wrap items-baseline gap-x-3 text-sm">
              <span class="font-medium text-indigo-300/80">{{ stage.label }}</span>
              <span
                v-if="stage.visitedCount"
                class="text-gray-500"
              >{{ stage.visitedCount }} of {{ stage.pages.length }} visited</span>
            </p>
            <h2 class="mt-1 text-2xl font-semibold tracking-tight text-white">
              <NuxtLink
                :to="stage.path"
                class="transition-colors hover:text-indigo-200"
              >
                {{ stage.title }}
              </NuxtLink>
            </h2>
            <p class="mt-2 max-w-xl text-gray-400">
              {{ stage.blurb }}
            </p>
            <!-- The stops in this stage. A lit marker means you've read that page (this browser only). -->
            <ul
              v-if="stage.pages.length"
              class="-mx-3 mt-5 grid max-w-3xl md:grid-cols-2 md:gap-x-2"
            >
              <li
                v-for="item in stage.pages"
                :key="item.path"
              >
                <NuxtLink
                  :to="item.path"
                  class="stop group/stop flex gap-3 rounded-lg px-3 py-2.5 hover:bg-white/[0.04]"
                  :class="{ 'is-visited': item.visited }"
                >
                  <span
                    class="stop-marker"
                    aria-hidden="true"
                  />
                  <span class="min-w-0">
                    <span class="flex flex-wrap items-baseline gap-x-2">
                      <span class="font-medium text-gray-100 group-hover/stop:text-white">{{ item.title }}</span>
                      <span
                        v-if="item.pageCount"
                        class="text-xs text-gray-500"
                      >{{ item.pageCount }} {{ item.pageCount === 1 ? 'page' : 'pages' }}</span>
                      <span
                        v-if="item.visited"
                        class="sr-only"
                      >(visited)</span>
                    </span>
                    <span
                      v-if="item.description"
                      class="mt-0.5 line-clamp-2 block text-sm text-gray-500"
                    >{{ item.description }}</span>
                  </span>
                </NuxtLink>
              </li>
            </ul>
          </div>
        </li>
      </ol>

      <section
        v-if="sideTrips.length"
        class="mt-20 border-t border-white/10 pt-10"
        aria-labelledby="side-trips"
      >
        <h2
          id="side-trips"
          class="text-xl font-semibold tracking-tight text-white"
        >
          Side trips
        </h2>
        <ul class="mt-5 grid max-w-3xl sm:grid-cols-2 sm:gap-x-2">
          <li
            v-for="trip in sideTrips"
            :key="trip.path"
          >
            <NuxtLink
              :to="trip.path"
              class="stop group/stop -mx-3 flex gap-3 rounded-lg px-3 py-2.5 hover:bg-white/[0.04]"
              :class="{ 'is-visited': trip.visited }"
            >
              <span
                class="stop-marker"
                aria-hidden="true"
              />
              <span class="min-w-0">
                <span class="block font-medium text-gray-100 group-hover/stop:text-white">
                  {{ trip.title }}
                  <span
                    v-if="trip.visited"
                    class="sr-only"
                  >(visited)</span>
                </span>
                <span
                  v-if="trip.description"
                  class="mt-0.5 line-clamp-2 block text-sm text-gray-500"
                >{{ trip.description }}</span>
              </span>
            </NuxtLink>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
/*
 * The route from Earth to the Moon. `x` is where the stage's marker sits across the trajectory
 * gutter (0–100), so the path meanders. Sections that aren't on the route become side trips.
 */
const FLIGHT_PLAN = [
  { path: '/docs/installation', label: 'Launch', x: 8, blurb: 'Get Lunar onto your machine: what you need, the installer and your first boot.' },
  { path: '/docs/package-management', label: 'Orbit', x: 70, blurb: 'Settle in. Install, update and remove software with lin, lvu, lrm and lunar.' },
  { path: '/docs/system-administration', label: 'Station', x: 30, blurb: 'Keep the station running: services, users and a healthy system.' },
  { path: '/docs/development', label: 'Build', x: 92, blurb: 'Write modules, test them and send them to the moonbase.' },
  { path: '/docs/community', label: 'Crew', x: 50, blurb: 'Meet the people on board, and share how you run Lunar.' }
] as const

const { data: page } = await useAsyncData('docs:/docs', () =>
  queryCollection('docs').path('/docs').first()
)
const { data: tree } = await useDocsNavigation()
const { data: descriptions } = await useAsyncData('docs-descriptions', async () => {
  const docs = await queryCollection('docs').select('path', 'description').all()
  return Object.fromEntries(docs.map(doc => [doc.path, doc.description]))
}, { default: () => ({} as Record<string, string | undefined>) })

// Pages this visitor has read, loaded after hydration (see useVisitedDocs)
const { visited, load: loadVisited } = useVisitedDocs()
onMounted(loadVisited)

const stages = computed(() => FLIGHT_PLAN.flatMap((stage) => {
  const node = tree.value.find(item => item.path === stage.path)
  if (!node) return []
  const pages = node.children.map(child => ({
    title: child.title,
    path: child.path,
    description: descriptions.value[child.path],
    // A sub-section, like "Advanced Installation Methods"
    pageCount: child.children.length,
    visited: visited.value.includes(child.path)
  }))
  return [{ ...stage, title: node.title, pages, visitedCount: pages.filter(item => item.visited).length }]
}))

const sideTrips = computed(() => {
  const planned = new Set<string>(FLIGHT_PLAN.map(stage => stage.path))
  return tree.value
    .filter(item => !planned.has(item.path))
    .map(item => ({
      title: item.title,
      path: item.path,
      description: descriptions.value[item.path],
      visited: visited.value.includes(item.path)
    }))
})

// The trajectory draws itself in once the page has settled (see AGENTS.md).
const isSettled = usePageSettled()

useHead({
  noscript: [{ innerHTML: '<style>.flight-plan *{animation:none!important}</style>' }]
})

usePageSeo({
  title: 'Documentation',
  description: page.value?.description ?? 'Documentation for the Lunar Linux distribution'
})
</script>

<style scoped>
.flight-plan {
  --gutter: 3.5rem;
  --marker: 2.75rem;
  --step: 0.35s;
}

@media (min-width: 640px) {
  .flight-plan {
    --gutter: 9rem;
    --marker: 3rem;
  }
}

/* The marker sits at --x across the gutter */
.marker {
  position: relative;
  z-index: 1;
  width: var(--marker);
  height: var(--marker);
  margin-left: calc((var(--gutter) - var(--marker)) * var(--x) / 100);
  transition: transform 0.3s;
}

.stage:hover .marker {
  transform: scale(1.08);
}

.waypoint {
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
  border-radius: 9999px;
  border: 1px solid color-mix(in oklab, var(--color-indigo-300) 45%, transparent);
  background: color-mix(in oklab, var(--color-indigo-950) 70%, transparent);
  color: var(--color-indigo-200);
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

/* A stop: a small ring that lights up once you've read the page */
.stop-marker {
  flex-shrink: 0;
  width: 0.625rem;
  height: 0.625rem;
  margin-top: 0.45rem;
  border-radius: 9999px;
  border: 1.5px solid color-mix(in oklab, var(--color-indigo-300) 55%, transparent);
  /* Hover feedback is instant; only the marker grows, quickly */
  transition: transform 0.12s ease-out;
}

.stop:hover .stop-marker {
  transform: scale(1.3);
}

.stop.is-visited .stop-marker {
  border-color: var(--color-indigo-200);
  background: var(--color-indigo-200);
  box-shadow: 0 0 8px 1px color-mix(in oklab, var(--color-indigo-300) 60%, transparent);
}

/*
 * The path to the next marker: from just below this marker to just above the next one,
 * between the centres of the two markers (the SVG spans the gutter minus one marker width).
 */
.trajectory {
  position: absolute;
  top: calc(var(--marker) + 0.4rem);
  bottom: -0.4rem;
  left: calc(var(--marker) / 2);
  width: calc(var(--gutter) - var(--marker));
  overflow: hidden;
}

.trajectory-wipe,
.trajectory-art {
  display: block;
  width: 100%;
  height: 100%;
}

/* The moving window: it has to clip, or the two opposite transforms cancel out */
.trajectory-wipe {
  overflow: hidden;
}

.trajectory-art {
  overflow: visible;
}

/*
 * One orchestrated moment: the markers appear in turn and the path draws itself down to the next.
 * The "wipe" slides the clipping box down while the drawing slides up by the same amount, so the
 * path stays put and is revealed from the top. Transforms and opacity only (see AGENTS.md).
 */
.marker {
  animation: marker-in 0.5s cubic-bezier(0.2, 0.7, 0.2, 1) both paused;
  /* Arrives as the path from the previous marker reaches it */
  animation-delay: calc(var(--i) * var(--step) + 0.1s);
}

.stage-text {
  animation: text-in 0.6s ease-out both paused;
  animation-delay: calc(var(--i) * var(--step) + 0.15s);
}

.trajectory-wipe {
  animation: wipe-box var(--step) linear both paused;
  animation-delay: calc(var(--i) * var(--step) + 0.1s);
}

.trajectory-art {
  animation: wipe-art var(--step) linear both paused;
  animation-delay: calc(var(--i) * var(--step) + 0.1s);
}

.is-playing :is(.marker, .stage-text, .trajectory-wipe, .trajectory-art) {
  animation-play-state: running;
}

@keyframes marker-in {
  from {
    opacity: 0.001;
    transform: scale(0.6);
  }
}

@keyframes text-in {
  from {
    opacity: 0.001;
    transform: translateY(6px);
  }
}

@keyframes wipe-box {
  from {
    transform: translateY(-100%);
  }
}

@keyframes wipe-art {
  from {
    transform: translateY(100%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .marker,
  .stage-text,
  .trajectory-wipe,
  .trajectory-art {
    animation: none;
  }
}
</style>
