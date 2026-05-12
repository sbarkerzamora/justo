import type { ReactNode } from "react"
import { DocsLayout } from "fumadocs-ui/layouts/docs"
import { IconBook2, IconCalculator, IconGavel, IconHome2 } from "@tabler/icons-react"
import { source } from "@/lib/source"
import { DocsNavTitle } from "@/components/docs-nav-title"
import { DocsFooter } from "@/components/docs-footer"

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <DocsLayout
        tree={source.pageTree}
        containerProps={{
          className: "justo-docs-layout md:[--fd-sidebar-width:180px]",
        }}
        nav={{
          title: <DocsNavTitle />,
        }}
        githubUrl="https://github.com/stephanbarker/justo"
        links={[
          {
            text: "Inicio",
            icon: <IconHome2 className="size-4" />,
            url: "/docs",
            active: "nested-url",
          },
          {
            text: "Calcular",
            icon: <IconCalculator className="size-4" />,
            url: "/",
            active: "nested-url",
          },
          {
            text: "Marco legal",
            icon: <IconGavel className="size-4" />,
            url: "/docs",
            active: "nested-url",
          },
          {
            text: "Guia",
            icon: <IconBook2 className="size-4" />,
            url: "/docs/guia-rapida",
            active: "nested-url",
          },
        ]}
      >
        {children}
      </DocsLayout>
      <DocsFooter />
    </>
  )
}
