# AGENTS.md

## Setup

```bash
pnpm install
pnpm build
```

- Runtime: Node.js 18+ (dual CJS/ESM output).
- Source: TypeScript 5.x in `src/`, compiled by `tsup` to `dist/`.
- `tsup` handles building; `tsc` is only used for `.d.ts` generation internally.

## Data file dependency

- The library requires users to provide their own data files at runtime.
- `qqwry.dat` is the binary IP database (qqwry format). Pass the path to `libqqwry(dataPath)` or `libqqwry.init(dataPath)`.
- `qqwry.ipdb` is the ipdb-format database. Pass the path to `libqqwry.ipdb(dataPath)`.
- The library will throw if the requested data file is missing or unreadable.

## Commands

| Task         | Command               |
| ------------ | --------------------- |
| Install deps | `pnpm install`        |
| Build        | `pnpm run build`      |
| Run tests    | `pnpm test`           |
| Test watch   | `pnpm run test:watch` |
| Benchmark    | `pnpm run test:bench` |
| Format/lint  | _None configured_     |

## Architecture

- **Source**: `src/` (TypeScript)
  - `index.ts` — main export (callable constructor + static methods)
  - `driver.ts` — `QqwryDriverImpl` class (binary `.dat` query engine)
  - `ipdb-driver.ts` — `IpdbDriverImpl` class (ipdb-format query engine)
  - `data-cmd.ts` — `fileCmd` / `bufferCmd` I/O factories
  - `format.ts` — output formatters (`text`, `csv`, `json`, `object`)
  - `ipdb-cmd.ts` — ipdb Reader wrapper (uses `createRequire` for CJS interop)
  - `shims/gbk.d.ts` — type declaration for `gbk.js`
- **Build output**: `dist/` (dual CJS + ESM)
  - `dist/index.cjs` — CJS bundle
  - `dist/index.js` — ESM bundle
  - `dist/index.d.ts` / `dist/index.d.cts` — type declarations
- **Entry**: `dist/index.cjs` (CJS) / `dist/index.js` (ESM) — exports a callable function with static helpers.
  - `const qqwry = require("lib-qqwry")("./data/qqwry.dat")` — dataPath is required, returns a wrapped callable: `qqwry(ip)`, `qqwry(begin, end)`, `qqwry(begin, end, callback)`.
  - Static helpers: `libqqwry.ipToInt()`, `.intToIP()`, `.ipEndianChange()`, `.ipdb()`, `.init()`.
- **Two I/O modes**:
  - `fileCmd` (default): reads from disk via `fs.openSync`/`fs.readSync`. Lower memory.
  - `bufferCmd` (`.speed()`): loads entire `.dat` into a Buffer. Faster but higher memory.
  - Switching modes: `.speed()` / `.unSpeed()` — both return the callable for chaining.
- **Encoding**: The `.dat` file uses **GBK** encoding. Strings are decoded via `gbk.js` (bundled).
- **ipdb format**: `IpdbDriver` (via `libqqwry.ipdb(path, options)`) supports ipdb format using `ipip-ipdb` Reader internally (loaded via `createRequire` for CJS interop). ipdb always loads into memory — `speed()`/`unSpeed()` are no-ops. Only single-IP lookup is supported. Returns objects keyed by database field names (e.g. `country_name`, `region_name`). Default query language is `"CN"`.

## Coding conventions

- TypeScript 5.x with strict mode.
- ES2022+ syntax: `const`/`let`, arrow functions, `class`.
- ESM source (`import`/`export`); compiled to dual CJS/ESM output via tsup.
- No linting or formatting rules configured. Match the existing style when editing.
