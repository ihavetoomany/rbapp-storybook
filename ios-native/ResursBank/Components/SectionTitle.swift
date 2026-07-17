import SwiftUI

// SectionTitle — uppercase overline section label (`.ry-section-title`).
struct SectionTitle: View {
    @Environment(AppModel.self) private var app
    let text: String
    var topPadding: CGFloat = Space.s5

    var body: some View {
        Text(text.uppercased())
            .font(.ry(12, 700))
            .tracking(0.6)
            .foregroundStyle(app.colors.fgSecondary)
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(.top, topPadding)
            .padding(.bottom, Space.s2)
    }
}
