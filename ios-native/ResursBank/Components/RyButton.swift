import SwiftUI

// RyButton — port of the RN RyButton variants.
enum RyButtonVariant { case primary, tonal, ghost, outline }

struct RyButton: View {
    @Environment(AppModel.self) private var app
    let title: String
    var icon: String? = nil
    var variant: RyButtonVariant = .primary
    var fullWidth: Bool = true
    var action: () -> Void

    private var colors: RySemanticColors { app.colors }

    var body: some View {
        Button(action: action) {
            HStack(spacing: Space.s2) {
                if let icon { RyIcon(name: icon, size: 15, color: fg) }
                Text(title).font(.ry(15, 700))
            }
            .foregroundStyle(fg)
            .frame(maxWidth: fullWidth ? .infinity : nil)
            .padding(.vertical, 15)
            .padding(.horizontal, Space.s5)
            .background(bg)
            .clipShape(Capsule())
            .overlay(
                Capsule().stroke(variant == .outline ? colors.borderDefault : .clear, lineWidth: 1)
            )
        }
        .buttonStyle(PressableStyle())
    }

    private var bg: Color {
        switch variant {
        case .primary: return colors.primaryMain
        case .tonal: return colors.primaryBackground
        case .ghost, .outline: return .clear
        }
    }
    private var fg: Color {
        switch variant {
        case .primary: return colors.primaryContrast
        case .tonal, .ghost, .outline: return colors.primaryMain
        }
    }
}

/// Subtle press-down feedback shared by tappable surfaces.
struct PressableStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .opacity(configuration.isPressed ? 0.85 : 1)
            .scaleEffect(configuration.isPressed ? 0.985 : 1)
            .animation(.easeOut(duration: 0.12), value: configuration.isPressed)
    }
}
