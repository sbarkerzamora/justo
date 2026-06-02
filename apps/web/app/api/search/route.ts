import { createFromSource } from "fumadocs-core/search/server"

import { source } from "@/lib/source"

const search = createFromSource(source, {
  buildIndex(page) {
    const title = page.data.title
    const description = page.data.description ?? ""

    return {
      id: page.url,
      title,
      description,
      url: page.url,
      structuredData: {
        headings: [],
        contents: [
          {
            heading: title,
            content: `${title}\n${description}`,
          },
        ],
      },
    }
  },
})

export const GET = search.GET
