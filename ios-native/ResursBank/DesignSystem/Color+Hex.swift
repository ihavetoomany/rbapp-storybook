import SwiftUI

extension Color {
    /// Create a Color from a hex string (`#RRGGBB`, `RRGGBB`, or `rgba(r,g,b,a)`).
    init(hex: String) {
        let s = hex.trimmingCharacters(in: .whitespacesAndNewlines)
        if s.hasPrefix("rgba") || s.hasPrefix("rgb") {
            // rgba(212, 212, 212, 0.6)
            let inner = s
                .replacingOccurrences(of: "rgba(", with: "")
                .replacingOccurrences(of: "rgb(", with: "")
                .replacingOccurrences(of: ")", with: "")
            let parts = inner.split(separator: ",").map {
                $0.trimmingCharacters(in: .whitespaces)
            }
            let r = Double(parts[safe: 0] ?? "0") ?? 0
            let g = Double(parts[safe: 1] ?? "0") ?? 0
            let b = Double(parts[safe: 2] ?? "0") ?? 0
            let a = Double(parts[safe: 3] ?? "1") ?? 1
            self = Color(.sRGB, red: r / 255, green: g / 255, blue: b / 255, opacity: a)
            return
        }
        var hexValue = s
        if hexValue.hasPrefix("#") { hexValue.removeFirst() }
        var int: UInt64 = 0
        Scanner(string: hexValue).scanHexInt64(&int)
        let r, g, b, a: UInt64
        switch hexValue.count {
        case 8: // RRGGBBAA
            (r, g, b, a) = (int >> 24 & 0xFF, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default: // RRGGBB
            (r, g, b, a) = (int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF, 255)
        }
        self = Color(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue: Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}

private extension Array {
    subscript(safe index: Int) -> Element? {
        indices.contains(index) ? self[index] : nil
    }
}
