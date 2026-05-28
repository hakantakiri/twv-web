# Architecture Reference

This document describes the current structure and behavior of the Text Generator with Variables app. Use it as a reference when adding features or changing template behavior.

## High-Level Architecture

The app is a Vite + React + TypeScript single-page application.

- `src/main.tsx` mounts the React application.
- `src/App.tsx` owns the core state, conversion logic, section scrolling, and drag-and-drop ordering.
- Components receive current data and callback props from `App`; most business behavior stays in `App`.
- `src/services/cache.service.ts` isolates browser `localStorage` reads and writes.
- `src/services/files.service.ts` handles JSON download creation.
- CKEditor powers rich text editing and preview through the `RichText` component.

## Project Structure

```text
.
├── docs/
│   └── ARCHITECTURE.md
├── public/
├── src/
│   ├── assets/
│   │   ├── delete.svg
│   │   ├── drag.svg
│   │   └── react.svg
│   ├── common/
│   │   ├── environment.interface.ts
│   │   ├── saveDocument.interface.ts
│   │   ├── textResult.interface.ts
│   │   └── variable.interface.ts
│   ├── components/
│   │   ├── Environments.tsx
│   │   ├── Header.tsx
│   │   ├── InstructionsModal.tsx
│   │   ├── RichText.tsx
│   │   ├── RichTextPair.tsx
│   │   ├── TextPair.tsx
│   │   ├── ToolsHeader.tsx
│   │   └── Variable.tsx
│   ├── services/
│   │   ├── cache.service.ts
│   │   └── files.service.ts
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   ├── settings.ts
│   └── vite-env.d.ts
├── index.html
├── package.json
├── tsconfig*.json
└── vite.config.ts
```

## Data Model

`VariableInterface`

```ts
interface VariableInterface {
  key: string
  value: string | string[]
  label: string | string[]
}
```

Single variables use string `value` and `label`. List variables use parallel `label[]` and `value[]` arrays.

`TextResultInterface`

```ts
interface TextResultInterface {
  raw: string
  converted: string
}
```

`raw` stores the editable template HTML from CKEditor. `converted` stores the generated preview HTML.

`EnvironmentInterface`

```ts
interface EnvironmentInterface {
  id: string
  name: string
  values: { key: string; value: string }[]
}
```

Each environment has the same ordered list of keys. The `Environments` component keeps keys aligned across all environments.

`SaveDocumentInterface`

```ts
interface SaveDocumentInterface {
  variables: VariableInterface[]
  textResults: TextResultInterface[]
  environments: EnvironmentInterface[]
}
```

This is the JSON import/export shape.

## State And Persistence Flow

On startup, `App` initializes state from `localStorage`:

- `vars` from `getCacheVariables()`
- `textResults` from `getCacheTextResults()`
- `environments` from `getCacheEnvironments()`
- `currentEnvironmentId` from `getCacheCurrentEnvironmentId()`

If no templates exist in cache, `App` creates three empty text/template pairs.

State changes are persisted through React effects:

- Variable changes call `setVariablesToCache`.
- Text changes call `setTextResultsCache`.
- Environment changes call `setEnvironmentsToCache`.
- Active environment changes call `setCacheCurrentEnvironmentId`.

The header export action reads the cached document with `getCacheToDownload()` and downloads it as `save_document.json`.

The header import action parses a selected JSON file, checks for `variables` and `textResults`, falls back to an empty `environments` array when missing, writes the data to cache, and reloads the page.

## Template Conversion Flow

The conversion logic lives in `App.tsx` in the `convert` function.

1. Resolve the active environment by `currentEnvironmentId`.
2. Create a resolved copy of variables.
3. For each string variable value, replace environment tokens like `{{baseUrl}}` with the active environment value.
4. For each list variable value, apply the same environment replacement to each list item.
5. Replace simple template placeholders like `{{name}}` with the corresponding variable value.
6. Find iterable sections matching `:::(.*?):::` across the template string.
7. For each iterable section, find list variables referenced with `{{key.label}}`.
8. Expand the section once per list item, replacing `{{key.label}}` and `{{key.value}}`.
9. Join expanded rows with `<br/>` and replace the original iterable block.

The global Convert button runs this conversion for every text/template pair and stores the generated HTML in `converted`.

## Component Responsibilities

- `App`: Coordinates application state, cache sync, conversion, drag-and-drop variable ordering, and section navigation.
- `Header`: Provides app title, instructions modal, save action, and open-file action.
- `ToolsHeader`: Provides quick navigation, active environment selection, and global conversion.
- `Environments`: Manages environment names, shared keys, per-environment values, environment creation, key creation, and deletes.
- `Variable`: Edits single variables and list variables, including list item add/delete/clear/reorder behavior.
- `RichTextPair`: Connects one `TextResultInterface` to editable and preview rich text editors, and owns the converted preview copy-to-clipboard action.
- `RichText`: Configures CKEditor plugins, toolbar, table toolbar, editor mode, and preview mode.
- `InstructionsModal`: Shows user-facing syntax examples.
- `TextPair`: Legacy textarea-based template pair component, currently unused.

## Extension Guidance

When adding new persisted data:

- Update the relevant interface in `src/common/`.
- Update `SaveDocumentInterface` if the data should be exported.
- Update `cache.service.ts` for localStorage read/write behavior.
- Update import fallback behavior so older saved files continue to load.

When adding template syntax:

- Extend `convert` in `App.tsx`.
- Keep environment resolution before template replacement unless the new syntax explicitly needs a different order.
- Add examples to the README and in-app instructions if the syntax is user-facing.

When adding UI:

- Prefer controlled components that receive data and callbacks from `App` or a local owner component.
- Keep file and cache side effects in services.
- Keep import/export JSON compatible with existing saved files where practical.

## Current Technical Notes

- CKEditor content is stored as HTML strings.
- Console logging is present in several components and can be reduced during cleanup.
- Some default Vite CSS classes remain in `App.css`.
- `TextPair` is retained but unused by the current `App` render path.
- JSON import validation is minimal and only checks for required top-level keys.
- Environment keys are treated as an ordered shared schema across all environments.
