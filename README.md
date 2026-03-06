# App Doodler

App Doodler is a localized App Store screenshot generator.

It lets you design text overlays once, import translations, preview each locale, and export screenshots in the exact iPhone/iPad sizes needed for App Store Connect.

## Core capabilities

- Upload one or more template screenshots.
- Add and position labels visually.
- Import translation JSON for many languages.
- Preview output per template and language.
- Export batches grouped by language.
- Save and reopen project files.

## Tech stack

- Next.js 16 + TypeScript
- Prisma + SQLite
- Sharp (image generation)
- shadcn/ui

## Requirements

- Node.js 20+
- npm 10+

## Quick start

```bash
npm install
npm run prisma:generate
npm run prisma:push
npm run dev
```

Open `http://localhost:3000`.

## Typical workflow

1. Upload template images.
2. Add label keys (for example `title`, `subtitle`, `cta`).
3. Position and style labels in the editor.
4. Import translation JSON.
5. Select templates, locales, and output sizes.
6. Generate and download/save outputs.

## Translation JSON format

```json
{
  "en": {
    "title": "Plan your day in seconds",
    "subtitle": "Smart reminders and calm focus mode"
  },
  "es": {
    "title": "Planifica tu dia en segundos",
    "subtitle": "Recordatorios inteligentes y modo enfoque"
  }
}
```

Rules:

- Top-level keys are language codes (`en`, `es`, `de`, etc.).
- Nested keys must match label keys from the editor.
- All values must be strings.

## Output layout

```text
my-output/
  screenshots/
    en-US/
      01-shot.png
      02-shot.png
    de-DE/
      01-shot.png
      02-shot.png
```

## Useful commands

```bash
npm run dev
npm run build
npm run lint
npm test
```

## Notes

- Full editing is optimized for desktop and iPad-sized viewports.
- Small mobile screens show a simplified warning view instead of the full editor.
