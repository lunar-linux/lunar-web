import { queryCollection } from '@nuxt/content/server'
import { joinURL } from 'ufo'

type SitemapEntry = { path: string, lastmod?: string | Date }

export default defineEventHandler(async (event) => {
  const { siteUrl } = useRuntimeConfig(event).public
  const [docs, news] = await Promise.all([
    queryCollection(event, 'docs').select('path', 'lastUpdated').all(),
    queryCollection(event, 'news').select('path', 'date').all()
  ])

  const entries: SitemapEntry[] = [
    { path: '/' },
    { path: '/news' },
    { path: '/download' },
    { path: '/history' },
    { path: '/about' },
    ...docs.map(doc => ({ path: doc.path, lastmod: doc.lastUpdated })),
    ...news.map(article => ({ path: article.path, lastmod: article.date }))
  ]

  const urls = entries.map(({ path, lastmod }) => {
    const lastmodTag = lastmod ? `\n    <lastmod>${new Date(lastmod).toISOString().slice(0, 10)}</lastmod>` : ''
    return `  <url>\n    <loc>${escapeXml(joinURL(siteUrl, path))}</loc>${lastmodTag}\n  </url>`
  })

  setResponseHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`
})
