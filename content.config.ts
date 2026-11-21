import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    docs: defineCollection({
      type: 'page',
      source: 'docs/**/*.md',
      schema: z.object({
        category: z.string().optional(),
        tags: z.array(z.string()).default([]),
        lastUpdated: z.date().optional(),
        order: z.number().optional(),
        archived: z.boolean().default(false),
        seeAlso: z.array(z.object({
          title: z.string(),
          path: z.string()
        })).optional()
      })
    }),
    news: defineCollection({
      type: 'page',
      source: 'news/*.md',
      schema: z.object({
        date: z.date(),
        // Filled in at build time (nuxt.config.ts hook), not in frontmatter.
        readingTime: z.number().optional()
      })
    }),
    // A single page (/download): the featured ISO lives in frontmatter, so the homepage's
    // Downloads section reads the same data and the two can't drift apart.
    download: defineCollection({
      type: 'page',
      source: 'download.md',
      schema: z.object({
        featured: z.object({
          version: z.string(),
          channel: z.string(),
          arch: z.string(),
          // Date of the build the page describes; the release's moon phase is drawn from it.
          built: z.date(),
          href: z.string(),
          checksum: z.string()
        })
      })
    }),
    // A single page (/history), linked from the footer only. Its chapters, family tree and
    // moonlight calendar are MDC components with their data inline (app/components/content/).
    history: defineCollection({
      type: 'page',
      source: 'history.md',
      schema: z.object({
        headline: z.string()
      })
    }),
    // A single page (/about), linked from the footer. Its fact sheet and launch sequence are MDC
    // components with their data inline.
    about: defineCollection({
      type: 'page',
      source: 'about.md',
      schema: z.object({
        headline: z.string()
      })
    })
  }
})
