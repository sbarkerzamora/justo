// @ts-nocheck
import { browser } from 'fumadocs-mdx/runtime/browser';
import type * as Config from '../source.config';

const create = browser<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>();
const browserCollections = {
  docs: create.doc("docs", {"index.mdx": () => import("../content/docs/index.mdx?collection=docs"), "legal/nicaragua/aguinaldo.mdx": () => import("../content/docs/legal/nicaragua/aguinaldo.mdx?collection=docs"), "legal/nicaragua/deducciones.mdx": () => import("../content/docs/legal/nicaragua/deducciones.mdx?collection=docs"), "legal/nicaragua/indemnizacion.mdx": () => import("../content/docs/legal/nicaragua/indemnizacion.mdx?collection=docs"), "legal/nicaragua/index.mdx": () => import("../content/docs/legal/nicaragua/index.mdx?collection=docs"), "legal/nicaragua/inss.mdx": () => import("../content/docs/legal/nicaragua/inss.mdx?collection=docs"), "legal/nicaragua/ir-rentas-trabajo.mdx": () => import("../content/docs/legal/nicaragua/ir-rentas-trabajo.mdx?collection=docs"), "legal/nicaragua/salario-proporcional.mdx": () => import("../content/docs/legal/nicaragua/salario-proporcional.mdx?collection=docs"), "legal/nicaragua/vacaciones.mdx": () => import("../content/docs/legal/nicaragua/vacaciones.mdx?collection=docs"), }),
};
export default browserCollections;