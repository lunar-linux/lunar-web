<!--
  Layout for the long-read project pages rendered from one markdown file (/history, /about):
  breadcrumb, headline, then the content. The first paragraph reads as a lede and the last section
  (Sources, Signing off) closes the page quietly. Their MDC components live in components/content.
-->
<template>
  <div class="px-6 pt-10 pb-24">
    <div class="container mx-auto max-w-4xl">
      <Breadcrumb :items="[{ label: crumb, path: page.path }]" />

      <header class="mt-10 max-w-2xl">
        <h1 class="text-4xl font-bold tracking-[-0.035em] text-balance text-white sm:text-5xl">
          {{ page.headline }}
        </h1>
        <p class="mt-5 text-lg text-pretty text-gray-400">
          {{ page.description }}
        </p>
      </header>

      <ContentRenderer
        :value="page"
        class="story mt-12 prose max-w-[72ch] prose-invert sm:prose-lg
               prose-headings:tracking-tight prose-headings:text-white
               prose-h2:text-2xl sm:prose-h2:text-3xl
               prose-p:text-gray-300 prose-li:text-gray-300 prose-li:marker:text-indigo-300/60
               prose-a:text-indigo-300 prose-a:underline-offset-4 hover:prose-a:text-white
               prose-strong:text-white prose-em:text-indigo-100
               prose-blockquote:border-indigo-400/50 prose-blockquote:text-xl prose-blockquote:font-medium prose-blockquote:text-white prose-blockquote:not-italic
               prose-code:rounded prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:font-normal prose-code:text-indigo-200
               prose-pre:border prose-pre:border-white/10 prose-pre:bg-gray-900
               [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-inherit
               prose-th:text-gray-200 prose-td:text-gray-300
               [&_code::after]:content-none [&_code::before]:content-none"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PageCollectionItemBase } from '@nuxt/content'

defineProps<{
  page: PageCollectionItemBase & { headline: string }
  /** The breadcrumb label for this page: "History", "About". */
  crumb: string
}>()
</script>

<style scoped>
/* The first paragraph reads as a lede */
.story :deep(> p:first-child) {
  margin-top: 0;
  margin-bottom: 3.5rem;
  font-size: 1.25rem;
  color: var(--color-gray-200);
}

/* The last section closes the page quietly, below the story */
.story :deep(> h2:last-of-type) {
  margin-top: 4rem;
  font-size: 1rem;
  color: var(--color-gray-400);
}

.story :deep(> h2:last-of-type ~ p) {
  font-size: 0.9375rem;
  color: var(--color-gray-500);
}
</style>
