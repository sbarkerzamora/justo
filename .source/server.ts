// @ts-nocheck
import * as __fd_glob_11 from "../content/docs/legal/nicaragua/vacaciones.mdx?collection=docs"
import * as __fd_glob_10 from "../content/docs/legal/nicaragua/salario-proporcional.mdx?collection=docs"
import * as __fd_glob_9 from "../content/docs/legal/nicaragua/ir-rentas-trabajo.mdx?collection=docs"
import * as __fd_glob_8 from "../content/docs/legal/nicaragua/inss.mdx?collection=docs"
import * as __fd_glob_7 from "../content/docs/legal/nicaragua/index.mdx?collection=docs"
import * as __fd_glob_6 from "../content/docs/legal/nicaragua/indemnizacion.mdx?collection=docs"
import * as __fd_glob_5 from "../content/docs/legal/nicaragua/deducciones.mdx?collection=docs"
import * as __fd_glob_4 from "../content/docs/legal/nicaragua/aguinaldo.mdx?collection=docs"
import * as __fd_glob_3 from "../content/docs/index.mdx?collection=docs"
import { default as __fd_glob_2 } from "../content/docs/legal/nicaragua/meta.json?collection=docs"
import { default as __fd_glob_1 } from "../content/docs/legal/meta.json?collection=docs"
import { default as __fd_glob_0 } from "../content/docs/meta.json?collection=docs"
import { server } from 'fumadocs-mdx/runtime/server';
import type * as Config from '../source.config';

const create = server<typeof Config, import("fumadocs-mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>({"doc":{"passthroughs":["extractedReferences"]}});

export const docs = await create.docs("docs", "content/docs", {"meta.json": __fd_glob_0, "legal/meta.json": __fd_glob_1, "legal/nicaragua/meta.json": __fd_glob_2, }, {"index.mdx": __fd_glob_3, "legal/nicaragua/aguinaldo.mdx": __fd_glob_4, "legal/nicaragua/deducciones.mdx": __fd_glob_5, "legal/nicaragua/indemnizacion.mdx": __fd_glob_6, "legal/nicaragua/index.mdx": __fd_glob_7, "legal/nicaragua/inss.mdx": __fd_glob_8, "legal/nicaragua/ir-rentas-trabajo.mdx": __fd_glob_9, "legal/nicaragua/salario-proporcional.mdx": __fd_glob_10, "legal/nicaragua/vacaciones.mdx": __fd_glob_11, });