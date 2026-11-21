<!--
  "Lunar at a glance" for the About page (`::fact-sheet` in MDC, rows in its YAML block):
  a short spec sheet, one fact per row. Values are plain text with `backticks` for code; `to` makes one a link.
-->
<template>
  <section
    class="not-prose my-12 rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8"
    :aria-label="title"
  >
    <p class="flex items-center gap-2.5 text-sm font-medium text-indigo-200">
      <MoonPhaseIcon
        :phase="0.4"
        class="h-5 w-5"
      />
      {{ title }}
    </p>
    <dl class="mt-6 grid gap-x-10 sm:grid-cols-2">
      <div
        v-for="fact in facts"
        :key="fact.label"
        class="border-t border-white/10 py-3.5"
      >
        <dt class="text-xs font-medium tracking-wide text-gray-500 uppercase">
          {{ fact.label }}
        </dt>
        <dd class="mt-1 text-gray-100">
          <NuxtLink
            v-if="fact.to?.startsWith('/')"
            :to="fact.to"
            class="text-indigo-200 underline-offset-4 transition-colors hover:text-white hover:underline"
          >
            {{ fact.value }}
          </NuxtLink>
          <a
            v-else-if="fact.to"
            :href="fact.to"
            class="text-indigo-200 underline-offset-4 transition-colors hover:text-white hover:underline"
          >{{ fact.value }}</a>
          <!-- One element per part, so no whitespace sneaks in before punctuation -->
          <template v-else>
            <template
              v-for="(part, index) in splitInlineCode(fact.value)"
              :key="index"
            >
              <code
                v-if="part.code"
                class="rounded bg-white/5 px-1.5 py-0.5 text-[0.9em] text-indigo-200"
                v-text="part.text"
              />
              <span
                v-else
                v-text="part.text"
              />
            </template>
          </template>
        </dd>
      </div>
    </dl>
  </section>
</template>

<script setup lang="ts">
type Fact = { label: string, value: string, to?: string }

defineProps<{
  title: string
  facts: Fact[]
}>()
</script>
