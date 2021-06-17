import { nodeResolve } from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import nodePolyfills from "rollup-plugin-node-polyfills"
import json from "@rollup/plugin-json"

export default {
  input: "./index.js",
  context: (id) => {
    const thisAsWindowForModules = [
      "node_modules/@supabase/supabase-js/dist/module/SupabaseClient.js",
    ]

    if (thisAsWindowForModules.some((id_) => id.trimRight().endsWith(id_))) {
      return "window"
    }
  },
  output: {
    file: "bundle.js",
    name: "MyModule",
    format: "cjs",
  },
  plugins: [nodeResolve(), commonjs(), nodePolyfills(), json()],
}
