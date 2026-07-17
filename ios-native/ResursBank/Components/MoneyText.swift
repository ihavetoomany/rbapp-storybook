import SwiftUI

// MoneyText — grouped amount + small "kr" suffix, tabular figures.
struct MoneyText: View {
    let amount: Int
    var size: CGFloat = 15
    var weight: Int = 700
    var color: Color = .primary
    var currency: String = "kr"
    var strike: Bool = false

    var body: some View {
        (
            Text(RyFormat.grouped(amount))
                .font(.ry(size, weight))
            + Text(" \(currency)")
                .font(.ry(size * 0.92, weight))
        )
        .foregroundStyle(color)
        .monospacedDigit()
        .strikethrough(strike, color: color)
    }
}
