import type { Plugin } from "vite";
import { parse, compileTemplate, transform } from "@vue/compiler-sfc";
import path from "path";

export default function VueSourceTagPlugin(): Plugin {
  return {
    name: "vite-plugin-vue-source-tag",
    enforce: "pre",
    apply: "serve", // dev only
    transform(code, id) {
      const filename = path.relative(process.cwd(), id);
      const { descriptor } = parse(code, { filename });

      console.log("template", descriptor.template);
      if (!descriptor.template) return;

      const { ast } = compileTemplate({
        id,
        source: descriptor.template.content,
        filename,
        compilerOptions: {
          mode: "module",
        },
      });

      // Modify each element node to include data-source
      const injectSourceInfo = (node: any) => {
        if (node.type === 1 /* ELEMENT */ && node.loc) {
          const line = node.loc.start.line;
          const dataAttr = {
            type: 6, // ATTRIBUTE
            name: "data-source",
            value: {
              type: 2, // TEXT
              content: `${filename}:${line}`,
              loc: node.loc,
            },
            loc: node.loc,
          };
          node.props.push(dataAttr);
        }
        if (node.children) {
          node.children.forEach(injectSourceInfo);
        }
      };

      injectSourceInfo(ast);

      // Vue doesn't expose re-compilation with transformed AST,
      // so we re-inject a comment instead, to demonstrate.
      // Full integration would require patching SFC transforms or using vue-loader.

      return null; // noop — just for demonstration unless used with a compatible tool
    },
  };
}
