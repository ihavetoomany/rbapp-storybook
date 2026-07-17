import SwiftUI

/// Renders a `fa-*` icon name as its mapped SF Symbol.
struct RyIcon: View {
    let name: String
    var size: CGFloat = 17
    var color: Color = .primary
    var weight: Font.Weight = .semibold

    var body: some View {
        Image(systemName: Icons.sfSymbol(name))
            .font(.system(size: size, weight: weight))
            .foregroundStyle(color)
    }
}
