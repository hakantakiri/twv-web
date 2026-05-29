# Text Generator with Variables

Generate reusable rich text templates with variables, list variables, and environment-specific values.

Live app: https://text-generator-with-variables.netlify.app/

## Features

- Create text templates with rich text formatting powered by CKEditor.
- Replace simple variables with `{{key}}` placeholders.
- Expand list variables inside iterable template sections.
- Define environments for values that change by context.
- Switch each template between edit and converted preview modes.
- Create file templates that convert XLSX, DOCX, and TXT files client-side by replacing placeholders.
- Copy converted rich text previews to the clipboard.
- Save the current workspace to a JSON file and load it later.
- Persist active work in browser `localStorage`.

## Getting Started

Install dependencies:

```bash
npm install
```

Start the local development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

Run lint checks:

```bash
npm run lint
```

## Usage

### Variables

Single variables replace `{{key}}` tokens in templates.

Example variable:

```text
key: name
value: Jane
```

Template:

```text
Hello {{name}}
```

Converted result:

```text
Hello Jane
```

### List Variables

List variables contain multiple label/value pairs. They are expanded inside iterable sections wrapped with `:::` markers.

Example list variable:

```text
key: products
label: Apple, value: Red
label: Banana, value: Yellow
```

Template:

```text
:::The {{products.label}} color is {{products.value}}.:::
```

Converted result:

```text
The Apple color is Red.
The Banana color is Yellow.
```

The app inserts `<br/>` between expanded list rows so the converted rich text keeps line breaks.

### Environments

Environments let variable values depend on the selected context. Add environment keys in the Environments table, then provide a value for each environment column.

Environment placeholders are resolved inside variable values before template placeholders are converted.

Example:

```text
Environment key: baseUrl
Production value: https://example.com

Variable key: loginUrl
Variable value: {{baseUrl}}/login

Template: Open {{loginUrl}}
```

With the Production environment selected, the converted result is:

```text
Open https://example.com/login
```

### Copy Converted Text

Each converted rich text preview includes a **Copy** button. The copy action writes rich text HTML to the clipboard when the browser supports it and falls back to plain text otherwise.

### Template Modes

Templates show either the editable original or the converted preview, never both at the same time. Use a template's **Convert** button to convert only that template and switch it to preview mode. Use the global **Convert** button to convert every template and switch every template to preview mode. Use **Edit** on a preview to return that template to edit mode.

### File Templates

Use **File Templates** to select an `.xlsx`, `.docx`, or `.txt` file, choose a download file name, and download a converted copy. The app reads the file in the browser, replaces simple placeholders like `{{name}}`, and downloads the converted file.

Each file template has a **Download file name** input. The filename can use variables and the active environment, for example:

```text
report-{{clientName}}-{{environmentName}}
```

If the filename input is empty, the app downloads `<original-name>-converted.<ext>`. If the filename input includes a different supported extension, the app replaces it with the uploaded file's extension. Uploaded files are not sent to a server or stored in `localStorage`. File conversion uses the selected environment before replacing variables. List-variable row expansion is only supported in rich text templates, not file templates.

### Save And Load

Use **Save as** to download the current browser cache as `save_document.json`.

Use **Open file** to load a saved JSON document. Loading a file writes the imported data to `localStorage` and reloads the page.

The saved document contains:

```ts
{
  variables: VariableInterface[]
  textResults: TextResultInterface[]
  environments: EnvironmentInterface[]
  fileTemplates: FileTemplateInterface[]
}
```

Saved files created before File Templates are still supported. When an old JSON file is opened, the app creates a default File Templates row.

## Main Components

- `App`: Owns application state, localStorage synchronization, drag-and-drop ordering, section scrolling, and template conversion.
- `Header`: Renders the fixed top header, instructions modal trigger, JSON export, and JSON import controls.
- `ToolsHeader`: Renders navigation buttons, active environment selector, and global Convert action.
- `Environments`: Manages environment columns and shared environment keys.
- `Variable`: Manages a single variable or list variable, including list item ordering.
- `RichTextPair`: Displays one template in either edit or preview mode, including per-template Convert/Edit/Copy actions.
- `RichText`: Wraps CKEditor for editor and read-only preview modes.
- `FileTemplates`: Manages saved file-template rows.
- `FileTemplateUploader`: Uploads XLSX, DOCX, or TXT files, runs simple placeholder replacement, and downloads a converted file.
- `InstructionsModal`: Shows in-app usage instructions.
- `TextPair`: Legacy plain textarea implementation that is currently not used by `App`.

## Data Persistence

The app stores working state in browser `localStorage` using these keys:

- `variables`
- `textResults`
- `environments`
- `currentEnvironmentId`
- `fileTemplates`

The cache service in `src/services/cache.service.ts` reads and writes these values. The file service in `src/services/files.service.ts` creates the downloadable JSON file.

## Developer Reference

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for project structure, architecture notes, data flow, and guidance for future feature work.
