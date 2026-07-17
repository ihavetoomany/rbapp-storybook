import SwiftUI

// Inter typography — mirrors src/components/ry/typography.ts `ryFont(weight)`:
// weight >= 600 maps to Inter-Bold, >= 800 to Inter-ExtraBold, else Inter-Regular.
// The RN prototype ships Inter Regular/Bold/ExtraBold only, so intermediate
// weights snap to the nearest available face — reproduced here exactly.

enum RyFontFace {
    static let regular = "Inter-Regular"
    static let bold = "Inter-Bold"
    static let extraBold = "Inter-ExtraBold"

    static func name(for weight: Int) -> String {
        if weight >= 800 { return extraBold }
        if weight >= 600 { return bold }
        return regular
    }
}

extension Font {
    /// Inter at an explicit point size + design weight (400/500/700/900).
    static func ry(_ size: CGFloat, _ weight: Int = 400) -> Font {
        .custom(RyFontFace.name(for: weight), size: size)
    }
}

// Type scale — from tokens.ts `typeScale`. Each style carries the size and the
// design weight; line height is applied via `.ryLineSpacing`.
enum RyType {
    struct Style {
        let size: CGFloat
        let lineHeight: CGFloat
        let weight: Int
        var font: Font { .ry(size, weight) }
        /// SwiftUI lineSpacing = lineHeight - font size (approximation of CSS line-height).
        var lineSpacing: CGFloat { max(0, lineHeight - size) }
    }

    static let h1 = Style(size: 36, lineHeight: 48, weight: 700)
    static let h2 = Style(size: 32, lineHeight: 40, weight: 700)
    static let h3 = Style(size: 28, lineHeight: 40, weight: 700)
    static let h4 = Style(size: 24, lineHeight: 32, weight: 700)
    static let h6 = Style(size: 20, lineHeight: 24, weight: 700)
    static let subtitle1 = Style(size: 16, lineHeight: 24, weight: 700)
    static let subtitle2 = Style(size: 14, lineHeight: 24, weight: 700)
    static let body1 = Style(size: 16, lineHeight: 24, weight: 400)
    static let body2 = Style(size: 14, lineHeight: 24, weight: 400)
    static let button = Style(size: 14, lineHeight: 16, weight: 700)
    static let caption = Style(size: 12, lineHeight: 16, weight: 400)
    static let overline = Style(size: 11, lineHeight: 16, weight: 400)
}

extension View {
    /// Apply a full RyType.Style (font + line spacing).
    func ryText(_ style: RyType.Style) -> some View {
        self.font(style.font).lineSpacing(style.lineSpacing * 0.5)
    }
}
