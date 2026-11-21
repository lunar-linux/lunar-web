<template>
  <StoryPage
    :page="page"
    crumb="About"
  />
</template>

<script setup lang="ts">
const { data } = await useAsyncData('about', () => queryCollection('about').first())

if (!data.value) {
  throw createError({ statusCode: 404, statusMessage: 'About page not found', fatal: true })
}

const page = computed(() => data.value!)

usePageSeo({
  title: 'About Lunar Linux',
  description: page.value.description
})
</script>
