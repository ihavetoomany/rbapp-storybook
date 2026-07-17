import SwiftUI

// RyCard — bgPaper surface, hairline border, lg radius, soft card shadow.
// Port of the RN RyCard (--shadow-card: 0 2px 16px rgba(52,58,64,.10)).
struct RyCard<Content: View>: View {
    @Environment(AppModel.self) private var app
    var padding: CGFloat = Space.s4
    var radius: CGFloat = Radii.lg
    @ViewBuilder var content: () -> Content

    var body: some View {
        content()
            .padding(padding)
            .frame(maxWidth: .infinity, alignment: .leading)
            .background(app.colors.bgPaper)
            .clipShape(RoundedRectangle(cornerRadius: radius, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: radius, style: .continuous)
                    .stroke(app.colors.borderSubtle, lineWidth: 1)
            )
    }
}
