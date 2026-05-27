# God's Math — Xcode Setup (Local iPhone Testing)

Project saved at: `/Users/longmorebiz/Desktop/ChristianAppEmpire/God-Math-main/expo`

## Prerequisites

- macOS with Xcode installed
- Node.js 20+ and npm
- Apple Developer account (for device testing)
- CocoaPods (`sudo gem install cocoapods` if needed)

## 1. Install dependencies

```bash
cd /Users/longmorebiz/Desktop/ChristianAppEmpire/God-Math-main/expo
npm install
```

## 2. Generate native iOS project

```bash
npm run prebuild:ios
```

This creates `ios/GodsMath.xcworkspace`.

## 3. Open in Xcode

```bash
open ios/GodsMath.xcworkspace
```

Use the **`.xcworkspace`** file, not `.xcodeproj`.

## 4. Configure signing

1. Select the app target in Xcode.
2. **Signing & Capabilities** → choose your Team.
3. Bundle ID: `com.christianappempire.godsmath`

## 5. App Store Connect — In-App Purchase

Create a non-consumable IAP:

- **Product ID:** `com.christianappempire.godsmath.removeads`
- **Price:** $4.99 (Tier 5)
- Add to the God's Math app record before testing purchases on device.

## 6. AdMob test vs production

- **Debug / Xcode Run:** `USE_TEST_ADS` follows `__DEV__` in `constants/ads.ts` → Google test units fill reliably.
- **App Store archive:** `__DEV__` is false → your production AdMob IDs are used automatically.
- **Never** set `USE_TEST_ADS = true` in a build you submit to the App Store.

## 7. Run on your iPhone

1. Connect iPhone via USB.
2. Select your device in Xcode’s scheme selector.
3. Press **Run** (⌘R).
4. On first launch: splash → **ATT prompt** → main screen → banner ad at bottom.

## 8. GitHub Pages (Privacy Policy)

Privacy policy file: `docs/privacy-policy.html` in the repo root.

Enable GitHub Pages: **Settings → Pages → Source: Deploy from branch `main` → folder `/docs`**

Published URL (after enable): `https://christianappsfamily.github.io/GodsMath/privacy-policy.html`

## Troubleshooting

- **No ads in simulator:** Use a physical device; ads often do not fill in Simulator.
- **ATT not showing:** Delete app, reinstall; ATT only shows once per install when status is undetermined.
- **IAP errors:** Sign in with a Sandbox Apple ID under Settings → App Store on the test device.
