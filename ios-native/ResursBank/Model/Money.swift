import Foundation

/// Integer SEK (no decimals — Resurs rule). `%` is used for rate metrics.
enum Currency: String {
    case sek = "SEK"
    case percent = "%"
}

struct Money: Hashable {
    var amount: Int
    var currency: Currency = .sek
}

/// Money helper — `m(12000)` → 12 000 SEK.
func m(_ amount: Int) -> Money { Money(amount: amount, currency: .sek) }
