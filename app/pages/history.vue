<template>
  <StoryPage
    :page="page"
    crumb="History"
  />
</template>

<script setup lang="ts">
const { data } = await useAsyncData('history', () => queryCollection('history').first())

if (!data.value) {
  throw createError({ statusCode: 404, statusMessage: 'History page not found', fatal: true })
}

const page = computed(() => data.value!)

usePageSeo({
  title: 'History of Lunar Linux',
  description: page.value.description
})
</script>
