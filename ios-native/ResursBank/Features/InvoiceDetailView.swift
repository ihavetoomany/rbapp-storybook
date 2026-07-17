import SwiftUI

// InvoiceDetailView — port of the im-invoice detail: amount-due hero, state
// banner, statement breakdown / loan block, payment info, and a Pay CTA that
// opens the payment sheet.
struct InvoiceDetailView: View {
    @Environment(AppModel.self) private var app
    @Environment(\.dismiss) private var dismiss
    let cardId: String
    @State private var showPay = false
    @State private var paid = false

    private var colors: RySemanticColors { app.colors }
    private var card: ImCard? { InvoiceModel.find(cardId, in: app.persona) }

    var body: some View {
        Group {
            if let card {
                content(card)
            } else {
                Text("Not found").foregroundStyle(colors.fgSecondary).padding(.top, 80)
            }
        }
        .background(colors.bgDefault)
        .navigationTitle("Invoice")
        .navigationBarTitleDisplayMode(.inline)
    }

    private func content(_ card: ImCard) -> some View {
        let pr = card.pr
        let isPaid = paid || card.state == .paidFull || card.state == .scheduled
        return ScrollView {
            VStack(alignment: .leading, spacing: Space.s4) {
                hero(card)

                banner(for: card, paidNow: paid)

                if let breakdown = pr.statementBreakdown, !breakdown.isEmpty {
                    breakdownCard(breakdown)
                } else if let purchase = pr.purchase {
                    purchaseCard(purchase)
                }

                if let no = pr.paymentNo, let total = pr.paymentsTotal {
                    loanBlock(pr, no: no, total: total)
                }

                paymentInfo(pr)
                Color.clear.frame(height: 120)
            }
            .padding(.horizontal, Space.s5)
            .padding(.top, Space.s3)
        }
        .safeAreaInset(edge: .bottom) {
            if !isPaid {
                RyButton(title: "Pay invoice", icon: "fa-lock") { showPay = true }
                    .padding(.horizontal, Space.s5)
                    .padding(.top, Space.s3)
                    .padding(.bottom, Space.s6)
                    .background(colors.bgDefault.opacity(0.96))
            }
        }
        .sheet(isPresented: $showPay) {
            PaymentSheet(card: card) { paid = true }
                .presentationDetents([.large])
        }
        .onAppear {
            if UserDefaults.standard.bool(forKey: "openPay") { showPay = true }
        }
    }

    private func hero(_ card: ImCard) -> some View {
        let sub: String = {
            switch card.state {
            case .overdue: return "\(card.daysOverdue) days overdue"
            case .topay: return card.urgent ? "Due in \(card.daysLeft) days" : "Due \(RyFormat.date(card.dueDate))"
            case .scheduled: return "Scheduled payment"
            case .paidFull: return "Paid in full"
            default: return "Due \(RyFormat.date(card.dueDate))"
            }
        }()
        return VStack(alignment: .leading, spacing: Space.s3) {
            HStack(spacing: Space.s3) {
                ProductLogo(product: card.product, size: 46)
                VStack(alignment: .leading, spacing: 2) {
                    Text(card.name).font(.ry(18, 700)).foregroundStyle(colors.fgPrimary)
                    Text(card.third).font(.ry(13, 400)).foregroundStyle(colors.fgSecondary)
                }
            }
            Text("Amount due").font(.ry(13, 700)).tracking(0.3).foregroundStyle(colors.fgSecondary)
                .padding(.top, Space.s2)
            HStack(alignment: .firstTextBaseline, spacing: 4) {
                Text(RyFormat.grouped(card.amount)).font(.ry(42, 800)).foregroundStyle(colors.fgPrimary).monospacedDigit()
                Text("kr").font(.ry(20, 700)).foregroundStyle(colors.fgSecondary)
            }
            Text(sub).font(.ry(14, 500))
                .foregroundStyle(card.state == .overdue ? colors.errorMain : colors.fgSecondary)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(Space.s5)
        .background(colors.bgPaper, in: RoundedRectangle(cornerRadius: Radii.xl, style: .continuous))
        .overlay(RoundedRectangle(cornerRadius: Radii.xl, style: .continuous).stroke(colors.borderSubtle, lineWidth: 1))
    }

    @ViewBuilder private func banner(for card: ImCard, paidNow: Bool) -> some View {
        if paidNow {
            infoBanner(icon: "fa-check", tone: .success, title: "Payment completed.", body: nil)
        } else if card.state == .overdue {
            infoBanner(icon: "fa-circle-info", tone: .error, title: "Past due", body: "Pay now to avoid fees.")
        } else if let desc = card.pr.description {
            infoBanner(icon: "fa-circle-info", tone: .info, title: nil, body: desc)
        }
    }

    private func infoBanner(icon: String, tone: BannerTone, title: String?, body: String?) -> some View {
        let (bg, fg) = tone.colors(colors)
        return HStack(alignment: .top, spacing: Space.s3) {
            RyIcon(name: icon, size: 15, color: fg)
            VStack(alignment: .leading, spacing: 2) {
                if let title { Text(title).font(.ry(14, 700)).foregroundStyle(colors.fgPrimary) }
                if let body { Text(body).font(.ry(13, 400)).foregroundStyle(colors.fgSecondary) }
            }
            Spacer(minLength: 0)
        }
        .padding(Space.s4)
        .background(bg, in: RoundedRectangle(cornerRadius: Radii.lg, style: .continuous))
    }

    private func breakdownCard(_ items: [StatementBreakdownItem]) -> some View {
        RyCard {
            VStack(spacing: Space.s3) {
                ForEach(items) { item in
                    HStack {
                        Text(item.label).font(.ry(14, 400)).foregroundStyle(colors.fgSecondary)
                        Spacer()
                        MoneyText(amount: item.amount, size: 14, weight: 700, color: colors.fgPrimary)
                    }
                }
            }
        }
    }

    private func purchaseCard(_ purchase: PaymentRequestPurchase) -> some View {
        RyCard {
            VStack(alignment: .leading, spacing: Space.s3) {
                Text(purchase.store).font(.ry(14, 700)).foregroundStyle(colors.fgPrimary)
                ForEach(purchase.items) { item in
                    HStack {
                        Text("\(item.qty)× \(item.name)").font(.ry(13, 400)).foregroundStyle(colors.fgSecondary)
                        Spacer()
                        MoneyText(amount: item.price.amount, size: 13, weight: 600, color: colors.fgPrimary)
                    }
                }
            }
        }
    }

    private func loanBlock(_ pr: PaymentRequest, no: Int, total: Int) -> some View {
        RyCard {
            VStack(alignment: .leading, spacing: Space.s3) {
                Text("Payment \(no) of \(total)").font(.ry(14, 700)).foregroundStyle(colors.fgPrimary)
                ProgressView(value: Double(no), total: Double(total)).tint(colors.primaryMain)
                HStack {
                    kv("Remaining debt", pr.loanRemaining?.amount)
                    Spacer()
                    kv("Original amount", pr.loanAmount?.amount, alignEnd: true)
                }
            }
        }
    }

    private func kv(_ label: String, _ amount: Int?, alignEnd: Bool = false) -> some View {
        VStack(alignment: alignEnd ? .trailing : .leading, spacing: 2) {
            Text(label).font(.ry(12, 400)).foregroundStyle(colors.fgSecondary)
            if let amount { MoneyText(amount: amount, size: 15, weight: 700, color: colors.fgPrimary) }
        }
    }

    private func paymentInfo(_ pr: PaymentRequest) -> some View {
        VStack(alignment: .leading, spacing: 0) {
            SectionTitle(text: "Payment information", topPadding: Space.s2)
            RyCard(padding: 0) {
                VStack(spacing: 0) {
                    infoRow("OCR", pr.ocr, divider: true)
                    infoRow("Bankgiro", pr.bankgiro, divider: true)
                    infoRow("Due date", RyFormat.date(pr.dueDate), divider: false)
                }
            }
        }
    }

    private func infoRow(_ label: String, _ value: String, divider: Bool) -> some View {
        HStack {
            Text(label).font(.ry(14, 400)).foregroundStyle(colors.fgSecondary)
            Spacer()
            Text(value).font(.ry(14, 700)).foregroundStyle(colors.fgPrimary).monospacedDigit()
        }
        .padding(.vertical, Space.s3)
        .padding(.horizontal, Space.s4)
        .overlay(alignment: .bottom) {
            if divider { Rectangle().fill(colors.borderSubtle).frame(height: 0.5).padding(.horizontal, Space.s4) }
        }
    }
}

enum BannerTone {
    case info, error, success
    func colors(_ c: RySemanticColors) -> (Color, Color) {
        switch self {
        case .info: return (c.infoBackground, c.infoMain)
        case .error: return (c.errorBackground, c.errorMain)
        case .success: return (c.successBackground, c.successMain)
        }
    }
}
