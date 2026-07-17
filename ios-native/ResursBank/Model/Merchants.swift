import Foundation

// RY_MERCHANTS — ported 1:1 from src/data/merchants.ts.

struct Merchant {
    var id: MerchantId
    var name: String
    var brandColor: String
    var brandColor2: String
    var iconLetter: String
}

enum Merchants {
    static let all: [MerchantId: Merchant] = [
        .bauhaus: Merchant(id: .bauhaus, name: "Bauhaus", brandColor: "#E2231A", brandColor2: "#FFD500", iconLetter: "B"),
        .netonnet: Merchant(id: .netonnet, name: "NetOnNet", brandColor: "#0050A0", brandColor2: "#FFCC00", iconLetter: "N"),
        .jula: Merchant(id: .jula, name: "Jula", brandColor: "#0052A0", brandColor2: "#F0B500", iconLetter: "J"),
        .ahlens: Merchant(id: .ahlens, name: "Åhléns", brandColor: "#E8002D", brandColor2: "#F5A623", iconLetter: "Å"),
        .gekas: Merchant(id: .gekas, name: "Gekås", brandColor: "#D40000", brandColor2: "#FFDD00", iconLetter: "G"),
    ]

    static func brandColor(_ id: MerchantId) -> String { all[id]?.brandColor ?? "#888888" }
    static func brandColor2(_ id: MerchantId) -> String { all[id]?.brandColor2 ?? "#888888" }
    static func letter(_ id: MerchantId) -> String { all[id]?.iconLetter ?? "?" }
}
