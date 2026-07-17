# Resurs Bank — Expo + Web + Storybook

Cross-platform Resurs Bank UI built with **Expo**, **React Native Paper**, and **Storybook**. One codebase targets iOS, Android, and web.

## Tabs

| Tab | Description |
|-----|-------------|
| **Wallet** | Accounts and cards overview |
| **Merchants** | Partner merchants with search and filters |
| **My Resurs** | Profile and settings |

## Tech stack

- [Expo SDK 56](https://expo.dev/) + [Expo Router](https://docs.expo.dev/router/introduction/)
- [React Native Paper](https://callstack.github.io/react-native-paper/) (Material Design 3)
- [Storybook for React Native](https://storybookjs.github.io/react-native/) (unified on-device + web)
- Resurs design tokens ported from `rb-app` (teal `#117069`, Inter typography, light/dark themes)

## Getting started

```bash
npm install
```

### Run the app

```bash
npm start          # Dev server (choose iOS, Android, or web)
npm run ios        # iOS simulator
npm run android    # Android emulator
npm run web        # Browser
```

### Run Storybook (device / Metro)

Storybook uses entry-point swapping — set `STORYBOOK_ENABLED=true` to load the component catalog instead of the app.

```bash
npm run storybook       # Dev server (Storybook mode)
npm run storybook:web   # Storybook in browser (Metro)
npm run storybook:ios   # Storybook on iOS
npm run storybook:android
```

### Run Storybook (browser / a11y)

Browser Storybook uses Vite + `@storybook/addon-a11y` (axe-core) for automated accessibility checks.

```bash
npm run storybook:browser   # http://localhost:6006 — Accessibility panel + vision simulator
npm run test:a11y           # Run a11y tests in CI (requires Playwright Chromium)
```

First-time setup for automated tests:

```bash
npx playwright install chromium
```

Stories with `parameters.a11y.test: 'error'` fail `npm run test:a11y` when axe finds violations. See `ResursButton` → **AccessiblePrimary** for an example.

## Project structure

```
app/                    # Expo Router routes
  (tabs)/               # Wallet, Merchants, My Resurs
src/
  components/           # Paper-based shared components + *.stories.tsx
  features/             # Tab screen content
  theme/                # Resurs palette, Paper MD3 theme, ThemeProvider
.rnstorybook/           # On-device Storybook (Metro)
.storybook/             # Browser Storybook (Vite + a11y)
assets/fonts/           # Inter font files
```

## Component development workflow

1. Create or update a component in `src/components/`
2. Add a co-located `*.stories.tsx` file
3. Preview in Storybook (`npm run storybook:web`)
4. Compose into tab screens in `src/features/`
5. Verify in the app (`npm run web`)

## Shared components

| Component | Paper base |
|-----------|-----------|
| `ResursText` | `Text` |
| `ResursButton` | `Button` |
| `ResursCard` | `Card` |
| `ResursListItem` | `List.Item` |
| `ResursChip` | `Chip` |
| `ScreenLayout` | Safe area + scroll layout |

## Theming

`ResursThemeProvider` wraps the app and Storybook. It loads Inter fonts, configures Paper's MD3 theme with Resurs colors, and injects Material Community Icons for web.

Light/dark mode follows the system color scheme.
