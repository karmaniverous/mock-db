import { readFileSync } from 'node:fs';
import { builtinModules } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import aliasPlugin, { type Alias } from '@rollup/plugin-alias';
import commonjsPlugin from '@rollup/plugin-commonjs';
import jsonPlugin from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terserPlugin from '@rollup/plugin-terser';
import typescriptPlugin from '@rollup/plugin-typescript';
import type { InputOptions, Plugin, RollupOptions } from 'rollup';
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

// Additional externals that should not be bundled.
const externalPkgs = new Set<string>([]);

const makePlugins = (
  outDir: string,
  minify: boolean,
  extras: Plugin[] = [],
): Plugin[] => {
  const base: Plugin[] = [
    alias,
    nodeResolve({ exportConditions: ['node', 'module', 'default'] }),
    commonjsPlugin(),
    jsonPlugin(),
    typescriptPlugin({
      compilerOptions: { outDir },
      outputToFilesystem: true,
    }),
    ...extras,
  ];
  return minify
    ? [...base, terserPlugin({ format: { comments: false } })]
    : base;
};

const commonInputOptions = (
  outDir: string,
  minify: boolean,
  extras: Plugin[] = [],
): InputOptions => ({
  plugins: makePlugins(outDir, minify, extras),
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

export const buildEsm = (dest: string): RollupOptions => ({
  input: 'src/index.ts',
  output: [{ dir: `${dest}/mjs`, format: 'esm', sourcemap: false }],
  ...commonInputOptions(`${dest}/mjs`, true),
});

export const buildCjs = (dest: string): RollupOptions => ({
  input: 'src/index.ts',
  output: [{ dir: `${dest}/cjs`, format: 'cjs', sourcemap: false }],
  ...commonInputOptions(`${dest}/cjs`, true),
});

export const buildTypes = (dest: string): RollupOptions => ({
  input: 'src/index.ts',
  output: [{ file: `${dest}/index.d.ts`, format: 'esm' }],
  plugins: [alias, dtsPlugin()],
});

export default [
  buildEsm(outputPath),
  buildCjs(outputPath),
  buildTypes(outputPath),
];
