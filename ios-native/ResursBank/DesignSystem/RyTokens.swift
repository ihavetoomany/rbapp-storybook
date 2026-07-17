import SwiftUI

// Resurs UI 2.0 design tokens — ported 1:1 from the RN prototype's
// src/theme/tokens.ts (which itself traces to ds/colors_and_type.css).
// Every hex value here traces back to that file — do not invent values.

// MARK: - Semantic color set

/// The resolved semantic palette for one theme (light or dark).
struct RySemanticColors {
    let bgDefault: Color
    let bgPaper: Color
    let bgSubtle: Color
    let primaryBackground: Color
    let iconMuted: Color

    let primaryLight: Color
    let primaryMain: Color
    let primaryDark: Color
    let primaryContrast: Color

    let secondaryMain: Color
    let secondaryBackground: Color

    let successMain: Color
    let successBackground: Color
    let infoMain: Color
    let infoBackground: Color
    let warningMain: Color
    let warningBackground: Color
    let errorMain: Color
    let errorBackground: Color

    let grey100: Color
    let grey200: Color

    let cashbackBg: Color

    let fgPrimary: Color
    let fgSecondary: Color
    let fgDisabled: Color

    let borderSubtle: Color
    let borderDefault: Color

    let chipGreenBg: Color
    let chipGreenText: Color
    let chipBlueBg: Color
    let chipBlueText: Color

    let bandHighlight: Color
}

extension RySemanticColors {
    /// Light theme — from tokens.ts `lightColors` (`:root`).
    static let light = RySemanticColors(
        bgDefault: Color(hex: "#F5F5F5"),
        bgPaper: Color(hex: "#FFFFFF"),
        bgSubtle: Color(hex: "#F1F3F5"),
        primaryBackground: Color(hex: "#E3ECEB"),
        iconMuted: Color(hex: "#A1A1A1"),
        primaryLight: Color(hex: "#3B817A"),
        primaryMain: Color(hex: "#117069"),
        primaryDark: Color(hex: "#0C5D57"),
        primaryContrast: Color(hex: "#FFFFFF"),
        secondaryMain: Color(hex: "#2C2C2B"),
        secondaryBackground: Color(hex: "#E9E9E8"),
        successMain: Color(hex: "#1D664D"),
        successBackground: Color(hex: "#B0E2C7"),
        infoMain: Color(hex: "#0069A8"),
        infoBackground: Color(hex: "#B8E6FE"),
        warningMain: Color(hex: "#BB4D00"),
        warningBackground: Color(hex: "#FEE685"),
        errorMain: Color(hex: "#C10007"),
        errorBackground: Color(hex: "#FFE2E2"),
        grey100: Color(hex: "#F5F5F5"),
        grey200: Color(hex: "#E5E5E5"),
        cashbackBg: Color(hex: "#FEE685"),
        fgPrimary: Color(hex: "#0A0A0A"),
        fgSecondary: Color(hex: "#525252"),
        fgDisabled: Color(hex: "#737373"),
        borderSubtle: Color(hex: "rgba(212, 212, 212, 0.6)"),
        borderDefault: Color(hex: "#A1A1A1"),
        chipGreenBg: Color(hex: "#E3ECEB"),
        chipGreenText: Color(hex: "#0C5D57"),
        chipBlueBg: Color(hex: "#B8E6FE"),
        chipBlueText: Color(hex: "#00598A"),
        bandHighlight: Color(hex: "#E3ECEB")
    )

    /// Dark theme — from tokens.ts `darkColors` (`[data-theme="dark"]`).
    static let dark = RySemanticColors(
        bgDefault: Color(hex: "#2C2C2B"),
        bgPaper: Color(hex: "#393838"),
        bgSubtle: Color(hex: "#343A40"),
        primaryBackground: Color(hex: "#151A19"),
        iconMuted: Color(hex: "#A1A1A1"),
        primaryLight: Color(hex: "#C0DED4"),
        primaryMain: Color(hex: "#ABD3C6"),
        primaryDark: Color(hex: "#93B6AF"),
        primaryContrast: Color(hex: "#000000"),
        secondaryMain: Color(hex: "#F7F0EB"),
        secondaryBackground: Color(hex: "#AFA8A8"),
        successMain: Color(hex: "#80D0AA"),
        successBackground: Color(hex: "#082720"),
        infoMain: Color(hex: "#74D4FF"),
        infoBackground: Color(hex: "#052F4A"),
        warningMain: Color(hex: "#FFD230"),
        warningBackground: Color(hex: "#461901"),
        errorMain: Color(hex: "#FFA2A2"),
        errorBackground: Color(hex: "#460809"),
        grey100: Color(hex: "#171717"),
        grey200: Color(hex: "#262626"),
        cashbackBg: Color(hex: "#FFB900"),
        fgPrimary: Color(hex: "#FFFFFF"),
        fgSecondary: Color(hex: "#D4D4D4"),
        fgDisabled: Color(hex: "#A1A1A1"),
        borderSubtle: Color(hex: "rgba(115, 115, 115, 0.3)"),
        borderDefault: Color(hex: "#D4D4D4"),
        chipGreenBg: Color(hex: "#E3ECEB"),
        chipGreenText: Color(hex: "#0C5D57"),
        chipBlueBg: Color(hex: "#B8E6FE"),
        chipBlueText: Color(hex: "#00598A"),
        bandHighlight: Color(hex: "#3F4D46")
    )
}

// MARK: - Brand raw palette (mode-independent)

enum RsColors {
    static let green50 = Color(hex: "#E3ECEB")
    static let green100 = Color(hex: "#C7DAD7")
    static let green200 = Color(hex: "#ACC8C4")
    static let green700 = Color(hex: "#117069") // BASE
    static let green500 = Color(hex: "#59928C")
    static let mint300 = Color(hex: "#ABD3C6")
    static let sand100 = Color(hex: "#F7F0EB")
    static let night900 = Color(hex: "#2C2C2B")
    static let yellow = Color(hex: "#FFEC89")
}

// MARK: - Radii (--radius-*)

enum Radii {
    static let xs: CGFloat = 4
    static let sm: CGFloat = 8
    static let md: CGFloat = 10
    static let lg: CGFloat = 16
    static let xl: CGFloat = 20
    static let xxl: CGFloat = 40
    static let pill: CGFloat = 999
}

// MARK: - Spacing (8px base, --space-*)

enum Space {
    static let s1: CGFloat = 4
    static let s2: CGFloat = 8
    static let s3: CGFloat = 12
    static let s4: CGFloat = 16
    static let s5: CGFloat = 20
    static let s6: CGFloat = 24
    static let s8: CGFloat = 32
    static let s10: CGFloat = 40
    static let s12: CGFloat = 48
    static let s16: CGFloat = 64
}
