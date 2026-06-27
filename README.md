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

### Run Storybook

Storybook uses entry-point swapping — set `STORYBOOK_ENABLED=true` to load the component catalog instead of the app.

```bash
npm run storybook       # Dev server (Storybook mode)
npm run storybook:web   # Storybook in browser
npm run storybook:ios   # Storybook on iOS
npm run storybook:android
```

## Project structure

```
app/                    # Expo Router routes
  (tabs)/               # Wallet, Merchants, My Resurs
src/
  components/           # Paper-based shared components + *.stories.tsx
  features/             # Tab screen content
  theme/                # Resurs palette, Paper MD3 theme, ThemeProvider
.rnstorybook/           # Storybook config
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
