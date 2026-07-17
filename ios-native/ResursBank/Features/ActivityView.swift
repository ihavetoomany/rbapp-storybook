import SwiftUI

// ActivityView — the default "To handle" tab: welcome large title, invoices
// hero, "To pay" card stack, "Handled" list, and an Explore footer.
struct ActivityView: View {
    @Environment(AppModel.self) private var app
    @State private var path: [String] = []

    private var colors: RySemanticColors { app.colors }

    var body: some View {
        NavigationStack(path: $path) {
            GradientHeaderScroll {
                let lists = InvoiceModel.lists(for: app.persona)
                let toPayTotal = lists.toPay.reduce(0) { $0 + $1.amount }
                let overdue = lists.toPay.filter { $0.state == .overdue }.count

                VStack(alignment: .leading, spacing: 0) {
                    heroCard(total: toPayTotal, count: lists.toPay.count, overdue: overdue)
                        .padding(.top, Space.s2)
                        .padding(.bottom, Space.s5)

                    if !lists.toPay.isEmpty {
                        SectionTitle(text: "To pay", topPadding: 0)
                        VStack(spacing: Space.s2) {
                            ForEach(lists.toPay) { card in
                                ImCardView(card: card, stacked: true) { path.append($0.id) }
                            }
                        }
                    }

                    promoCard
                        .padding(.top, Space.s6)

                    if !lists.handled.isEmpty {
                        SectionTitle(text: "Handled invoices")
                        RyCard(padding: 0) {
                            VStack(spacing: 0) {
                                ForEach(Array(lists.handled.enumerated()), id: \.element.id) { i, card in
                                    ImCardView(card: card, showDivider: i < lists.handled.count - 1) {
                                        path.append($0.id)
                                    }
                                }
                            }
                        }
                    }

                    SectionTitle(text: "Explore Resurs")
                    exploreRow
                }
                .padding(.horizontal, Space.s5)
            }
            .navigationTitle("Welcome")
            .navigationBarTitleDisplayMode(.large)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    BellButton()
                }
            }
            .navigationDestination(for: String.self) { cardId in
                InvoiceDetailView(cardId: cardId)
            }
            .onAppear {
                if let open = UserDefaults.standard.string(forKey: "openInvoice"),
                   !open.isEmpty, path.isEmpty {
                    path.append(open)
                }
            }
        }
    }

    // MARK: - Hero

    private func heroCard(total: Int, count: Int, overdue: Int) -> some View {
        let sub = overdue > 0
            ? "\(overdue) overdue · \(count) invoice\(count == 1 ? "" : "s") to handle"
            : "\(count) invoice\(count == 1 ? "" : "s") to handle"
        return VStack(alignment: .leading, spacing: Space.s2) {
            Text("Invoices")
                .font(.ry(13, 700))
                .tracking(0.4)
                .foregroundStyle(colors.fgSecondary)
            HStack(alignment: .firstTextBaseline, spacing: 4) {
                Text(RyFormat.grouped(total))
                    .font(.ry(40, 800))
                    .foregroundStyle(colors.fgPrimary)
                    .monospacedDigit()
                Text("kr")
                    .font(.ry(20, 700))
                    .foregroundStyle(colors.fgSecondary)
            }
            Text(sub)
                .font(.ry(14, 500))
                .foregroundStyle(overdue > 0 ? colors.errorMain : colors.fgSecondary)
        }
        .padding(Space.s5)
        .frame(maxWidth: .infinity, alignment: .leading)
        .background(app.dark ? colors.bandHighlight : RsColors.green100)
        .clipShape(RoundedRectangle(cornerRadius: Radii.xl, style: .continuous))
    }

    // MARK: - Promo

    private var promoCard: some View {
        ZStack(alignment: .leading) {
            RoundedRectangle(cornerRadius: Radii.xl, style: .continuous)
                .fill(LinearGradient(colors: [Color(hex: "#0C5D57"), Color(hex: "#117069")],
                                     startPoint: .topLeading, endPoint: .bottomTrailing))
            HStack {
                VStack(alignment: .leading, spacing: Space.s2) {
                    Text("PRIVATE LOAN")
                        .font(.ry(11, 700)).tracking(1).foregroundStyle(.white.opacity(0.7))
                    Text("When bigger expenses\ncome all at once")
                        .font(.ry(19, 700)).foregroundStyle(.white)
                    Text("See your options")
                        .font(.ry(13, 700)).foregroundStyle(RsColors.mint300)
                        .padding(.top, 2)
                }
                Spacer()
                RyIcon(name: "fa-coins", size: 36, color: .white.opacity(0.9))
            }
            .padding(Space.s5)
        }
    }

    // MARK: - Explore

    private var exploreRow: some View {
        VStack(spacing: Space.s3) {
            exploreItem(icon: "fa-piggy-bank", title: "Savings account", sub: "Up to 4.05% interest, free withdrawals")
            exploreItem(icon: "fa-coins", title: "Private loan", sub: "From 5.95% — no collateral required")
            exploreItem(icon: "fa-credit-card", title: "Resurs Mastercard", sub: "Pay now or pay later — your choice")
        }
    }

    private func exploreItem(icon: String, title: String, sub: String) -> some View {
        RyCard {
            HStack(spacing: Space.s3) {
                ZStack {
                    Circle().fill(colors.primaryBackground).frame(width: 42, height: 42)
                    RyIcon(name: icon, size: 17, color: colors.primaryMain)
                }
                VStack(alignment: .leading, spacing: 2) {
                    Text(title).font(.ry(15, 700)).foregroundStyle(colors.fgPrimary)
                    Text(sub).font(.ry(13, 400)).foregroundStyle(colors.fgSecondary).lineLimit(1)
                }
                Spacer()
                RyIcon(name: "fa-chevron-right", size: 13, color: colors.fgSecondary)
            }
        }
    }
}

// BellButton — trailing header action with a small unread dot. As a toolbar
// item it renders as a Liquid Glass circular control on iOS 26.
struct BellButton: View {
    @Environment(AppModel.self) private var app
    var action: () -> Void = {}
    var body: some View {
        Button(action: action) {
            ZStack(alignment: .topTrailing) {
                RyIcon(name: "fa-bell", size: 18, color: app.colors.fgPrimary)
                Circle().fill(app.colors.primaryMain).frame(width: 7, height: 7).offset(x: 2, y: -1)
            }
        }
    }
}

// HeaderButton — generic trailing header action (SF Symbol). As a toolbar item
// it renders as a Liquid Glass circular control on iOS 26.
struct HeaderButton: View {
    @Environment(AppModel.self) private var app
    let systemImage: String
    var action: () -> Void = {}
    var body: some View {
        Button(action: action) {
            Image(systemName: systemImage)
                .font(.system(size: 18, weight: .semibold))
                .foregroundStyle(app.colors.fgPrimary)
        }
    }
}
