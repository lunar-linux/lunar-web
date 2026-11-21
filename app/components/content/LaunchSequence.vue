<!--
  "What happens when you type lin" for the About page (`:::launch-sequence` in MDC, steps in its
  YAML block): a command, then its steps as a countdown, T−4 … T−0, the last one being liftoff.
  `backticks` in a step's text become inline code.

  The page's one orchestrated moment: when it scrolls into view, the steps count down one after
  another. Transform and opacity only (iPhone rules in AGENTS.md); server-rendered, no-JS and
  reduced-motion pages show every step straight away.
-->
<template>
  <figure
    ref="sequence"
    class="launch not-prose my-10 overflow-hidden rounded-2xl border border-white/10 bg-gray-950/60"
    :class="`is-${state}`"
  >
    <p class="border-b border-white/10 px-5 py-3.5 font-mono text-sm sm:px-7">
      <span
        class="text-purple-300 select-none"
        aria-hidden="true"
      >$ </span><span class="text-gray-100">{{ command }}</span>
    </p>
    <ol class="px-5 sm:px-7">
      <li
        v-for="(step, index) in steps"
        :key="step.title"
        class="launch-step grid grid-cols-[3rem_minmax(0,1fr)] gap-x-4 border-t border-white/5 py-5 first:border-t-0 sm:grid-cols-[3.5rem_minmax(0,1fr)]"
        :style="{ '--i': index }"
      >
        <span class="pt-0.5 text-sm font-semibold text-indigo-200/80 tabular-nums">
          T−{{ steps.length - 1 - index }}
        </span>
        <div>
          <p
            class="flex items-center gap-2 font-semibold"
            :class="index === steps.length - 1 ? 'text-indigo-200' : 'text-white'"
          >
            {{ step.title }}
            <Icon
              v-if="index === steps.length - 1"
              name="ph:rocket-launch"
              class="h-4 w-4"
            />
          </p>
          <p class="mt-1 text-gray-400">
            <!-- One element per part, so no whitespace sneaks in before punctuation -->
            <template
              v-for="(part, partIndex) in splitInlineCode(step.text)"
              :key="partIndex"
            >
              <code
                v-if="part.code"
                class="rounded bg-white/5 px-1.5 py-0.5 text-sm text-indigo-200"
                v-text="part.text"
              />
              <span
                v-else
                v-text="part.text"
              />
            </template>
          </p>
        </div>
      </li>
    </ol>
  </figure>
</template>

<script setup lang="ts">
type Step = { title: string, text: string }

defineProps<{
  command: string
  steps: Step[]
}>()

type LaunchState = 'idle' | 'pending' | 'playing'
const state = ref<LaunchState>('idle')
const sequence = useTemplateRef<HTMLElement>('sequence')
let observer: IntersectionObserver | undefined

onMounted(() => {
  if (!sequence.value || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  state.value = 'pending'
  observer = new IntersectionObserver(([entry]) => {
    if (!entry?.isIntersecting) return
    observer?.disconnect()
    // Next frame, so the hidden state has been painted before the transitions start.
    requestAnimationFrame(() => {
      state.value = 'playing'
    })
  }, { threshold: 0.3 })
  observer.observe(sequence.value)
})

onBeforeUnmount(() => observer?.disconnect())
</script>

<style scoped>
/* Hidden until in view; 0.001 rather than 0 so each row is already painted */
.is-pending .launch-step {
  opacity: 0.001;
  transform: translateY(8px);
}

.is-playing .launch-step {
  transition: opacity 0.5s ease-out, transform 0.5s cubic-bezier(0.2, 0.7, 0.2, 1);
  transition-delay: calc(0.15s + var(--i) * 0.55s);
}
</style>
