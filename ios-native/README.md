# ResursBank — native iOS (SwiftUI)

A native Swift/SwiftUI rebuild of the ResursYellow Q3 prototype (the Expo/React
Native app in the repo root). This is the **vertical slice**: it proves the
architecture and design system end-to-end, and is built to expand screen by
screen toward full parity with the RN app.

## What's in the slice

- **Login** — BankID mock with a short signing wait (`Features/LoginView.swift`)
- **4-tab shell** — native `TabView`, rendered as the system Liquid Glass tab bar on iOS 26 with scroll-edge + minimize-on-scroll (`Features/RootView.swift`)
- **To handle** — invoice-card model: hero, To-pay stack, Handled list, Explore (`Features/ActivityView.swift`)
- **Wallet** — product rollup rows over all products (`Features/WalletView.swift`)
- **Discover** — featured + Start-with-Resurs + popular stores (`Features/DiscoverView.swift`)
- **My Resurs** — settings hub with working dark-mode toggle + logout (`Features/MyResursView.swift`)
- **Invoice detail** — amount due, banner, statement breakdown, payment info (`Features/InvoiceDetailView.swift`)
- **Payment sheet** — tier selection → confirm → BankID → success (`Features/PaymentSheet.swift`)
- **Light + dark themes** — driven by an in-app toggle, not the OS (matches `useRyTheme`)

## Faithful port, native feel

- Design tokens ported 1:1 from `src/theme/tokens.ts` → `DesignSystem/RyTokens.swift`
  (Resurs green `#117069`, mint/sand/night scales, semantic light+dark, radii, spacing, type).
- Inter font (Regular/Bold/ExtraBold) bundled and registered via `Info.plist`.
- Domain models + John persona ported from `src/data/*` → `Model/*`.
- Icons: FontAwesome `fa-*` names mapped to SF Symbols (`DesignSystem/Icons.swift`).
- Navigation uses native `NavigationStack` large titles for an idiomatic iOS feel.

## Build & run

Requires Xcode 26+ (iOS 17 deployment target) and [xcodegen](https://github.com/yonaskolb/XcodeGen).

```sh
cd ios-native
xcodegen generate          # regenerate ResursBank.xcodeproj from project.yml
open ResursBank.xcodeproj  # ⌘R to run

# …or headless:
xcodebuild -project ResursBank.xcodeproj -scheme ResursBank \
  -sdk iphonesimulator -destination 'platform=iOS Simulator,name=iPhone 17 Pro' build
```

### Verification launch args

The app reads a few `UserDefaults` launch args (no effect in normal use) to jump
straight to a state for screenshots:

| Arg | Effect |
|-----|--------|
| `-startLoggedIn 1` | skip login |
| `-startDark 1` | dark theme |
| `-startTab wallet\|discover\|myresurs` | initial tab |
| `-openInvoice pr-fam-nov` | push an invoice detail |
| `-openPay 1` | open the payment sheet on that invoice |

```sh
xcrun simctl launch "iPhone 17 Pro" se.resursbank.app.native -startLoggedIn 1 -startTab wallet
```

## Not yet ported (next slices)

Account/transaction detail, family members, savings graph, bonus checks, close-account
& right-of-withdrawal flows, messages/documents/profile, the other 6 personas, i18n
(Swedish), and the tweak/debug panel.
