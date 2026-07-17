import SwiftUI

// PaymentSheet — port of the PaySheet flow: select amount (payment tiers when
// present, otherwise the fixed invoice amount) → confirm → BankID → success.
struct PaymentSheet: View {
    @Environment(AppModel.self) private var app
    @Environment(\.dismiss) private var dismiss
    let card: ImCard
    var onPaid: () -> Void

    enum Step { case amount, confirm, signing, success }
    @State private var step: Step = .amount
    @State private var selectedTierId: String?
    @State private var amount: Int = 0

    private var colors: RySemanticColors { app.colors }
    private var tiers: [PaymentTier] { card.pr.tiers ?? [] }

    var body: some View {
        NavigationStack {
            Group {
                switch step {
                case .amount: amountStep
                case .confirm: confirmStep
                case .signing: signingStep
                case .success: successStep
                }
            }
            .background(colors.bgDefault)
            .navigationTitle(title)
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button { dismiss() } label: { RyIcon(name: "fa-xmark", size: 16, color: colors.fgSecondary) }
                }
            }
        }
        .onAppear {
            amount = card.amount
            selectedTierId = tiers.first(where: { $0.recommended })?.id ?? tiers.first?.id
            if let t = tiers.first(where: { $0.id == selectedTierId }) { amount = t.amount.amount }
        }
    }

    private var title: String {
        switch step {
        case .amount: return "Select amount"
        case .confirm: return "Confirm payment"
        case .signing: return "BankID"
        case .success: return "Payment sent"
        }
    }

    // MARK: - Step 1: amount

    private var amountStep: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: Space.s4) {
                amountHeader
                if tiers.isEmpty {
                    RyCard {
                        VStack(alignment: .leading, spacing: Space.s2) {
                            Text("Invoice amount").font(.ry(13, 400)).foregroundStyle(colors.fgSecondary)
                            MoneyText(amount: card.amount, size: 28, weight: 800, color: colors.fgPrimary)
                        }
                    }
                } else {
                    VStack(spacing: Space.s3) {
                        ForEach(tiers) { tier in tierRow(tier) }
                    }
                }
                Color.clear.frame(height: 90)
            }
            .padding(.horizontal, Space.s5)
            .padding(.top, Space.s3)
        }
        .safeAreaInset(edge: .bottom) {
            RyButton(title: "Pay \(RyFormat.grouped(amount)) SEK") { step = .confirm }
                .padding(.horizontal, Space.s5).padding(.bottom, Space.s6).padding(.top, Space.s3)
                .background(colors.bgDefault.opacity(0.96))
        }
    }

    private var amountHeader: some View {
        HStack(spacing: Space.s3) {
            ProductLogo(product: card.product, size: 40)
            VStack(alignment: .leading, spacing: 1) {
                Text(card.name).font(.ry(16, 700)).foregroundStyle(colors.fgPrimary)
                Text(card.third).font(.ry(13, 400)).foregroundStyle(colors.fgSecondary)
            }
            Spacer()
        }
    }

    private func tierRow(_ tier: PaymentTier) -> some View {
        let selected = tier.id == selectedTierId
        return Button {
            selectedTierId = tier.id
            amount = tier.amount.amount
        } label: {
            HStack(alignment: .top, spacing: Space.s3) {
                Image(systemName: selected ? "largecircle.fill.circle" : "circle")
                    .foregroundStyle(selected ? colors.primaryMain : colors.borderDefault)
                    .font(.system(size: 20))
                VStack(alignment: .leading, spacing: 3) {
                    HStack {
                        Text(tier.label).font(.ry(15, 700)).foregroundStyle(colors.fgPrimary)
                        if tier.recommended {
                            Text("Recommended").font(.ry(10, 700))
                                .foregroundStyle(colors.chipGreenText)
                                .padding(.horizontal, 6).padding(.vertical, 2)
                                .background(colors.chipGreenBg, in: Capsule())
                        }
                        Spacer()
                        MoneyText(amount: tier.amount.amount, size: 15, weight: 700, color: colors.fgPrimary)
                    }
                    Text(tier.desc).font(.ry(12.5, 400)).foregroundStyle(colors.fgSecondary)
                        .fixedSize(horizontal: false, vertical: true)
                }
            }
            .padding(Space.s4)
            .background(colors.bgPaper, in: RoundedRectangle(cornerRadius: Radii.lg, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: Radii.lg, style: .continuous)
                    .stroke(selected ? colors.primaryMain : colors.borderSubtle, lineWidth: selected ? 2 : 1)
            )
        }
        .buttonStyle(PressableStyle())
    }

    // MARK: - Step 2: confirm

    private var confirmStep: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: Space.s4) {
                RyCard {
                    VStack(alignment: .leading, spacing: Space.s2) {
                        Text("Amount to pay").font(.ry(13, 400)).foregroundStyle(colors.fgSecondary)
                        MoneyText(amount: amount, size: 32, weight: 800, color: colors.fgPrimary)
                    }
                }
                RyCard(padding: 0) {
                    VStack(spacing: 0) {
                        confirmRow("Relates to", card.name, divider: true)
                        confirmRow("From account", "Nordea *345", divider: true)
                        confirmRow("Payment date", "Today", divider: false)
                    }
                }
                Color.clear.frame(height: 90)
            }
            .padding(.horizontal, Space.s5).padding(.top, Space.s3)
        }
        .safeAreaInset(edge: .bottom) {
            RyButton(title: "Confirm with BankID", icon: "fa-lock") {
                step = .signing
                DispatchQueue.main.asyncAfter(deadline: .now() + 1.6) {
                    withAnimation { step = .success }
                }
            }
            .padding(.horizontal, Space.s5).padding(.bottom, Space.s6).padding(.top, Space.s3)
            .background(colors.bgDefault.opacity(0.96))
        }
    }

    private func confirmRow(_ label: String, _ value: String, divider: Bool) -> some View {
        HStack {
            Text(label).font(.ry(14, 400)).foregroundStyle(colors.fgSecondary)
            Spacer()
            Text(value).font(.ry(14, 700)).foregroundStyle(colors.fgPrimary)
        }
        .padding(.vertical, Space.s3).padding(.horizontal, Space.s4)
        .overlay(alignment: .bottom) {
            if divider { Rectangle().fill(colors.borderSubtle).frame(height: 0.5).padding(.horizontal, Space.s4) }
        }
    }

    // MARK: - Step 3: signing

    private var signingStep: some View {
        VStack(spacing: Space.s4) {
            Spacer()
            ProgressView().controlSize(.large).tint(colors.primaryMain)
            Text("Confirm with BankID").font(.ry(17, 700)).foregroundStyle(colors.fgPrimary)
            Text("Open the BankID app to sign the payment.")
                .font(.ry(14, 400)).foregroundStyle(colors.fgSecondary).multilineTextAlignment(.center)
            Spacer()
        }
        .padding(Space.s6)
    }

    // MARK: - Step 4: success

    private var successStep: some View {
        VStack(spacing: Space.s4) {
            Spacer()
            ZStack {
                Circle().fill(colors.successBackground).frame(width: 84, height: 84)
                RyIcon(name: "fa-check", size: 34, color: colors.successMain)
            }
            Text("Payment sent").font(.ry(22, 800)).foregroundStyle(colors.fgPrimary)
            Text("Your payment of \(RyFormat.grouped(amount)) kr is on its way. It may take up to one business day to appear.")
                .font(.ry(14, 400)).foregroundStyle(colors.fgSecondary).multilineTextAlignment(.center)
                .padding(.horizontal, Space.s4)
            Spacer()
            RyButton(title: "Done") { onPaid(); dismiss() }
                .padding(.horizontal, Space.s5).padding(.bottom, Space.s6)
        }
        .padding(.top, Space.s6)
    }
}
