<!--
  The family tree for the 2002 split: one root splitting into branches (`:::history-lineage` in MDC,
  with the names in its YAML block). Static: the page's one moving moment is the moonlight calendar.
-->
<template>
  <figure class="not-prose my-10">
    <!-- Phones: root on top, a trunk down the left with the branches peeling off (like a file tree).
         Wider screens: root on the left, splitting to the right. -->
    <div class="grid grid-cols-[1.75rem_minmax(0,1fr)] sm:grid-cols-[minmax(0,8rem)_5rem_minmax(0,1fr)]">
      <p class="col-span-2 text-sm leading-snug sm:col-span-1 sm:self-center sm:pr-3 sm:text-right">
        <span class="font-semibold text-gray-200 sm:block">{{ root }}</span>
        <span
          v-if="rootWhen"
          class="text-gray-500"
        ><span class="sm:hidden"> · </span>{{ rootWhen }}</span>
      </p>

      <svg
        class="h-full w-full sm:hidden"
        :viewBox="`0 0 100 ${rows * 100}`"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          v-for="(branch, index) in branches"
          :key="branch.name"
          :d="drop(index)"
          fill="none"
          :stroke="branch.current ? 'var(--color-indigo-300)' : 'rgb(165 180 252 / 0.4)'"
          :stroke-width="branch.current ? 2 : 1.5"
          :stroke-dasharray="branch.current ? undefined : '1 5'"
          stroke-linecap="round"
          vector-effect="non-scaling-stroke"
        />
      </svg>

      <svg
        class="hidden h-full w-full sm:block"
        :viewBox="`0 0 100 ${rows * 100}`"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          v-for="(branch, index) in branches"
          :key="branch.name"
          :d="curve(index)"
          fill="none"
          :stroke="branch.current ? 'var(--color-indigo-300)' : 'rgb(165 180 252 / 0.4)'"
          :stroke-width="branch.current ? 2 : 1.5"
          :stroke-dasharray="branch.current ? undefined : '1 5'"
          stroke-linecap="round"
          vector-effect="non-scaling-stroke"
        />
      </svg>

      <ul
        class="grid"
        :style="{ gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))` }"
      >
        <li
          v-for="branch in branches"
          :key="branch.name"
          class="flex items-center gap-3 py-3 pl-2"
        >
          <MoonPhaseIcon
            v-if="branch.current"
            :phase="0.3"
            class="h-5 w-5 shrink-0"
          />
          <span
            v-else
            class="mx-1.5 h-2 w-2 shrink-0 rounded-full bg-indigo-300/40"
            aria-hidden="true"
          />
          <span class="leading-snug">
            <span
              class="block font-semibold"
              :class="branch.current ? 'text-indigo-200' : 'text-gray-200'"
            >{{ branch.name }}</span>
            <span class="text-sm text-gray-400">{{ branch.note }}</span>
          </span>
        </li>
      </ul>
    </div>
  </figure>
</template>

<script setup lang="ts">
type Branch = { name: string, note: string, current?: boolean }

const props = defineProps<{
  root: string
  rootWhen?: string
  branches: Branch[]
}>()

const rows = computed(() => props.branches.length)

/** Phones: down a trunk from the root above, then a bend right into the middle of row `index`. */
const drop = (index: number) => {
  const y = index * 100 + 50
  return `M 30 0 L 30 ${y - 35} Q 30 ${y}, 100 ${y}`
}

/** Wider screens: from the root's middle, a short trunk, then an S-curve to the middle of row `index`. */
const curve = (index: number) => {
  const mid = rows.value * 50
  const y = index * 100 + 50
  return `M 0 ${mid} L 30 ${mid} C 65 ${mid}, 65 ${y}, 100 ${y}`
}
</script>
