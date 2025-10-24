/** See <stanPath>/system/stan.project.md for global requirements. */
import { promises as fsp, readFileSync } from 'node:fs';
import { builtinModules } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import aliasPlugin, { type Alias } from '@rollup/plugin-alias';
import commonjsPlugin from '@rollup/plugin-commonjs';
import jsonPlugin from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terserPlugin from '@rollup/plugin-terser';
import typescriptPlugin from '@rollup/plugin-typescript';
import type {
  InputOptions,
  OutputOptions,
  Plugin,
  RollupOptions,
} from 'rollup';
import dtsPlugin from 'rollup-plugin-dts';

const outputPath = 'dist';

// Path alias @ -> <abs>/src (absolute to avoid module duplication warnings in Rollup)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcAbs = path.resolve(__dirname, 'src');
const aliases: Alias[] = [{ find: '@', replacement: srcAbs }];
const alias = aliasPlugin({ entries: aliases });

// Treat Node built-ins and node: specifiers as external.
const nodeExternals = new Set([
  ...builtinModules,
  ...builtinModules.map((m) => `node:${m}`),
]);

// Read runtime deps from package.json to keep them external (dependencies + peerDependencies).
interface Pkg {
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
}
const pkgJsonPath = path.resolve(__dirname, 'package.json');
let runtimeDeps = new Set<string>();
try {
  const pkg = JSON.parse(readFileSync(pkgJsonPath, 'utf8')) as Pkg;
  runtimeDeps = new Set([
    ...Object.keys(pkg.dependencies ?? {}),
    ...Object.keys(pkg.peerDependencies ?? {}),
  ]);
} catch {
  runtimeDeps = new Set();
}

// Additional externals that should not be bundled (example: platform fallback deps).
const externalPkgs = new Set<string>([
  // 'clipboardy',
  // 'fs-extra', // keep if used at runtime; config-only usage is already out of bundle
]);

const copyDocsPlugin = (dest: string): Plugin => {
  return {
    name: 'stan-copy-docs',
    async writeBundle() {
      const fromSystem = path.resolve(__dirname, '.stan', 'system');
      const candidates = [
        {
          src: path.join(fromSystem, 'stan.system.md'),
          dest: path.join(dest, 'stan.system.md'),
        },
      ];
      try {
        await fsp.mkdir(dest, { recursive: true });
        for (const c of candidates) {
          let exists = false;
          try {
            await fsp.access(c.src);
            exists = true;
          } catch {
            exists = false;
          }
          if (exists) await fsp.copyFile(c.src, c.dest);
        }
      } catch {
        // best-effort
      }
    },
  };
};

const makePlugins = (minify: boolean, extras: Plugin[] = []): Plugin[] => {
  const base: Plugin[] = [
    alias,
    nodeResolve({ exportConditions: ['node', 'module', 'default'] }),
    commonjsPlugin(),
    jsonPlugin(),
    typescriptPlugin(),
    ...extras,
  ];
  return minify
    ? [...base, terserPlugin({ format: { comments: false } })]
    : base;
};

const commonInputOptions = (
  minify: boolean,
  extras: Plugin[] = [],
): InputOptions => ({
  plugins: makePlugins(minify, extras),
  onwarn(warning, defaultHandler) {
    defaultHandler(warning);
  },
  external: (id) =>
    nodeExternals.has(id) ||
    runtimeDeps.has(id) ||
    externalPkgs.has(id) ||
    // Also treat deep subpath imports of runtime deps/extras as external
    Array.from(runtimeDeps).some((p) => id === p || id.startsWith(`${p}/`)) ||
    Array.from(externalPkgs).some((p) => id === p || id.startsWith(`${p}/`)),
});

const outCommon = (dest: string): OutputOptions[] => [
  { dir: `${dest}/mjs`, format: 'esm', sourcemap: false },
  { dir: `${dest}/cjs`, format: 'cjs', sourcemap: false },
];

export const buildLibrary = (dest: string): RollupOptions => ({
  input: 'src/index.ts',
  output: outCommon(dest),
  ...commonInputOptions(
    true,
    // Copy docs once from library config
    [copyDocsPlugin(dest)],
  ),
});

export const buildTypes = (dest: string): RollupOptions => ({
  input: 'src/index.ts',
  // Keep compatibility with existing package.json "types": "dist/index.d.ts"
  output: [{ file: `${dest}/index.d.ts`, format: 'esm' }],
  // Ensure alias resolution works during type bundling to avoid unresolved "@/..." warnings.
  plugins: [alias, dtsPlugin()],
});

export default [buildLibrary(outputPath), buildTypes(outputPath)];
