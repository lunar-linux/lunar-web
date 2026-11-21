<template>
  <footer class="w-full border-t border-gray-800 bg-black/30">
    <div class="container mx-auto px-6 py-10">
      <div class="flex flex-col items-center justify-between gap-8 md:flex-row md:items-start">
        <div class="text-center md:text-left">
          <img
            src="~/assets/lunar_logo-01-full.svg"
            alt="Lunar Linux"
            class="mx-auto mb-2 h-10 w-auto md:mx-0"
            width="120"
            height="45"
          >
          <p class="mt-2 text-gray-400">
            It's out of this world!
          </p>
          <!-- Tonight's real moon phase; filled in by the browser (the static build would be stale).
               The line keeps its height while empty so nothing shifts. -->
          <p class="mt-3 flex h-5 items-center justify-center gap-2 text-sm text-gray-500 md:justify-start">
            <template v-if="tonight">
              <MoonPhaseIcon
                :phase="tonight.phase"
                class="h-4 w-4"
              />
              Tonight's moon: {{ tonight.name.toLowerCase() }}
            </template>
          </p>
        </div>

        <div class="grid grid-cols-2 gap-8 md:grid-cols-3">
          <div
            v-for="category in footerLinks"
            :key="category.title"
          >
            <h2 class="mb-3 font-medium text-gray-300">
              {{ category.title }}
            </h2>
            <ul class="space-y-2 text-gray-400">
              <li
                v-for="link in category.links"
                :key="link.text"
              >
                <a
                  v-if="link.external"
                  :href="link.href"
                  class="transition-colors hover:text-blue-300"
                >{{ link.text }}</a>
                <NuxtLink
                  v-else
                  :to="link.href"
                  class="transition-colors hover:text-blue-300"
                >
                  {{ link.text }}
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="mt-10 space-y-2 border-t border-gray-800 pt-6 text-center text-sm text-gray-400">
        <p>&copy; {{ currentYear }} The Lunar Linux Project.</p>
        <p>
          Website code is available under the MIT License. Documentation and news are licensed under
          <a
            href="https://creativecommons.org/licenses/by-sa/4.0/"
            class="underline transition-colors hover:text-blue-300"
            rel="license"
          >CC BY-SA 4.0</a>.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const tonight = ref<{ phase: number, name: string } | null>(null)

onMounted(() => {
  const phase = moonPhaseAt()
  tonight.value = { phase, name: moonPhaseName(phase) }
})

type FooterLink = {
  text: string
  href: string
  /** Plain `<a>` instead of a router link: other sites, placeholders and prerendered files. */
  external?: boolean
}

type FooterCategory = {
  title: string
  links: FooterLink[]
}

const { withBase } = useSiteLinks()

// TODO: replace the '#' placeholders once the real destinations are confirmed.
const footerLinks: FooterCategory[] = [
  {
    title: 'Project',
    links: [
      { text: 'About', href: '/about' },
      { text: 'History', href: '/history' },
      { text: 'Roadmap', href: '#', external: true },
      { text: 'Team', href: '#', external: true }
    ]
  },
  {
    title: 'Resources',
    links: [
      { text: 'Download', href: '/download' },
      { text: 'Documentation', href: '/docs' },
      { text: 'News', href: '/news' },
      { text: 'RSS Feed', href: withBase('/rss.xml'), external: true }
    ]
  },
  {
    title: 'Community',
    links: [
      { text: 'IRC (#lunar on Libera.Chat)', href: 'https://web.libera.chat/#lunar', external: true },
      { text: 'GitHub', href: 'https://github.com/lunar-linux', external: true },
      { text: 'Contribute', href: '/docs/contributing' }
    ]
  }
]

const currentYear = new Date().getFullYear()
</script>
