# App Doodler

App Doodler is a free multilingual App Store screenshot generator for ASO, localization, and product launches.

Create one visual layout, add reusable headlines and feature callouts, import your translated copy, and preview every language before export. App Doodler generates complete iPhone and iPad PNG sets in the sizes required by App Store Connect, so you do not have to rebuild the same campaign for every locale in a design tool.

Use App Doodler free at [doodler.copymyui.com](https://doodler.copymyui.com). The project is also open source.

## What can you make with it?

Here are a few practical examples:

- Launch an app in 12 countries using one screenshot layout and 12 translated headline sets.
- Localize feature names, captions, badges, and callouts placed beside app icons or UI controls.
- Create different ASO messages such as "Plan your day" or "Never miss a task" without editing the original screenshot in a design tool.
- Update a translated call to action once, then regenerate every affected screenshot size.
- Preview longer German or French copy before export so text does not overflow its design.
- Export files into language folders that are easy to review and upload to App Store Connect.

App Doodler localizes text overlays. It does not translate text already baked into screenshot pixels. If the app interface itself changes by locale, upload the appropriate localized screenshots as templates and use App Doodler for the surrounding headlines and annotations.

## How to use App Doodler

### 1. Add your screenshots

Upload clean screenshots from your app. You can add multiple shots to create a complete App Store gallery, such as onboarding, search, editor, results, and subscription screens.

### 2. Add reusable text labels

Create labels such as `headline`, `subtitle`, `feature_name`, or `cta`. Position and style each label on the screenshot once. The same label positions are reused when you switch languages.

For example, a screenshot showing a calendar icon might use:

- `headline`: the main ASO benefit.
- `feature_name`: the translated name beside the icon.
- `subtitle`: a short explanation of the feature.

### 3. Import your translations

Prepare a JSON file containing the same label keys for every language:

```json
{
  "en-US": {
    "headline": "Plan your day in seconds",
    "feature_name": "Smart reminders",
    "subtitle": "Stay focused on what matters"
  },
  "de-DE": {
    "headline": "Plane deinen Tag in Sekunden",
    "feature_name": "Smarte Erinnerungen",
    "subtitle": "Konzentriere dich auf das Wesentliche"
  }
}
```

App Doodler imports your translated copy; it does not generate translations. This keeps your localization under the control of your translators or localization workflow.

Translation rules:

- Top-level keys are locale codes such as `en-US`, `de-DE`, and `es-ES`.
- Every locale must contain the same label keys.
- Label keys must match the labels used in the screenshot editor.
- Every translated value must be a string.

### 4. Preview every locale

Switch between languages to check line wrapping, alignment, font size, and contrast. You can adjust a locale when translated text needs more room while keeping the overall screenshot design consistent.

### 5. Choose App Store sizes

Select the iPhone and iPad output presets required for your release. App Doodler maps the design to precise pixel dimensions instead of relying on manual resizing.

### 6. Export the complete set

Generate the selected screenshots and save them as PNG files grouped by locale:

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

Review each folder with your localization or marketing team, then upload the approved images to the matching App Store Connect locale.

## Why this helps with ASO

App Store screenshots are part of the product page users see before installing an app. App Doodler makes it practical to present the same product benefits in each audience's language while keeping branding, spacing, and device dimensions consistent.

It is especially useful when you need to:

- Test a new screenshot headline across several markets.
- Refresh seasonal or launch messaging without rebuilding every design.
- Keep translated feature callouts aligned with the same icons and UI elements.
- Hand off predictable locale folders for review and App Store upload.

## Run locally

### Requirements

- Node.js 24.5 or newer in the Node 24 release line.
- npm 10 or newer.

### Setup

```bash
npm ci
npm run prisma:generate
npm run prisma:push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The editor uses SQLite for local persistence. You can also save project files and reopen them later.

## Useful commands

```bash
npm run dev
npm run build
npm run lint
npm test
```

## Tech stack

- Next.js and TypeScript.
- Prisma and SQLite.
- Sharp for image generation.
- shadcn/ui components.

## Display note

The full editor is designed for desktop and iPad-sized viewports. Small mobile screens show a simplified warning view instead of the complete editing interface.

## License

App Doodler is available under the [Apache License 2.0](LICENSE).
