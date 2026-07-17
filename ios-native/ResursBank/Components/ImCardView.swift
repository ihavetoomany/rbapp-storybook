import SwiftUI

// ImCardView — port of the RN ImCard row: product logo, name / date / third
// line, amount + one short status tag. Two modes:
//   • stacked: own bordered card with state tint (To-pay list)
//   • row: a row inside the Handled list card
struct ImCardView: View {
    @Environment(AppModel.self) private var app
    let card: ImCard
    var stacked: Bool = false
    var showDivider: Bool = true
    var onTap: (ImCard) -> Void = { _ in }

    private var colors: RySemanticColors { app.colors }

    var body: some View {
        Button { onTap(card) } label: { rowContent }
            .buttonStyle(PressableStyle())
    }

    private var rowContent: some View {
        HStack(spacing: Space.s3) {
            ProductLogo(product: card.product, size: 40)
            VStack(alignment: .leading, spacing: Space.s1) {
                Text(card.name)
                    .font(.ry(17, 700))
                    .foregroundStyle(colors.fgPrimary)
                    .lineLimit(1)
                Text(card.dateLine)
                    .font(.ry(12.5, 400))
                    .foregroundStyle(colors.fgSecondary)
                    .lineLimit(1)
                Text(card.third)
                    .font(.ry(12.5, 500))
                    .foregroundStyle(colors.fgSecondary)
                    .lineLimit(1)
            }
            Spacer(minLength: Space.s3)
            VStack(alignment: .trailing, spacing: Space.s1) {
                MoneyText(amount: card.strike ? card.fullAmount : displayAmount,
                          size: 15, weight: card.strike ? 600 : 700,
                          color: card.strike ? colors.fgSecondary : colors.fgPrimary,
                          strike: card.strike)
                Text(card.tag.text)
                    .font(.ry(12, 600))
                    .foregroundStyle(tagColor)
            }
        }
        .padding(.vertical, Space.s3)
        .padding(.horizontal, 14)
        .background(background)
        .clipShape(RoundedRectangle(cornerRadius: stacked ? Radii.lg : 0, style: .continuous))
        .overlay(alignment: .bottom) {
            if !stacked && showDivider {
                Rectangle().fill(colors.borderSubtle).frame(height: 0.5)
                    .padding(.leading, 14 + 40 + Space.s3)
            }
        }
        .overlay {
            if stacked {
                RoundedRectangle(cornerRadius: Radii.lg, style: .continuous)
                    .stroke(borderColor, lineWidth: 1)
            }
        }
    }

    private var displayAmount: Int {
        if card.state == .scheduled && card.amount < card.fullAmount { return card.amount }
        return card.fullAmount
    }

    private var background: Color {
        guard stacked else { return .clear }
        if card.state == .overdue {
            return app.dark ? Color(hex: "rgba(251, 139, 140, 0.14)") : Color(hex: "rgba(186, 26, 25, 0.07)")
        }
        return colors.bgPaper
    }

    private var borderColor: Color {
        if card.state == .overdue {
            return app.dark ? Color(hex: "rgba(251, 139, 140, 0.45)") : Color(hex: "rgba(186, 26, 25, 0.40)")
        }
        return colors.borderSubtle
    }

    private var tagColor: Color {
        switch card.tag.tone {
        case .error: return colors.errorMain
        case .info: return colors.infoMain
        case .success: return colors.successMain
        case .muted, .neutral, .urgent: return colors.fgSecondary
        }
    }
}
