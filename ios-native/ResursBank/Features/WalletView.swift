import SwiftUI

// WalletView — the Wallet tab: one list of product cards over all direct +
// merchant products (no section header).
struct WalletView: View {
    @Environment(AppModel.self) private var app
    @State private var path: [String] = []

    private var colors: RySemanticColors { app.colors }

    var body: some View {
        NavigationStack(path: $path) {
            GradientHeaderScroll {
                VStack(spacing: Space.s4) {
                    ForEach(app.persona.products) { product in
                        ProductCard(product: product) { path.append(product.id) }
                    }
                }
                .padding(.horizontal, Space.s5)
                .padding(.top, Space.s2)
            }
            .navigationTitle("Wallet")
            .navigationBarTitleDisplayMode(.large)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) { HeaderButton(systemImage: "plus") }
            }
            .navigationDestination(for: String.self) { productId in
                ProductDetailView(productId: productId)
            }
        }
    }
}

// ProductCard — a two-tier product card: logo + name/type header, a hairline
// divider, then the primary metric shown large with a context line.
struct ProductCard: View {
    @Environment(AppModel.self) private var app
    let product: Product
    var onTap: () -> Void

    private var colors: RySemanticColors { app.colors }

    private var subtitle: String {
        switch product.type {
        case .savings: return "Savings"
        case .loan: return "Loan"
        case .credit, .invoice:
            if product.id == "p-family" || product.id == "p-family-v2" { return "Resurs Family" }
            if product.origin == .merchant {
                let store = product.accounts.contains { $0.storeCredit }
                return store ? "Store credit account" : "One time credit"
            }
            return "Credit account"
        }
    }

    private var name: String {
        (product.id == "p-family") ? "Family Bergström" : product.name
    }

    private var contextLine: String {
        let n = product.accounts.count
        return "\(n) account\(n == 1 ? "" : "s")"
    }

    private var metricColor: Color {
        product.primaryMetric.sentiment == .positive ? colors.primaryMain : colors.fgPrimary
    }

    var body: some View {
        Button(action: onTap) {
            RyCard(padding: Space.s4, radius: Radii.xl) {
                VStack(spacing: Space.s4) {
                    // Header
                    HStack(spacing: Space.s3) {
                        ProductLogo(product: product, size: 46)
                        VStack(alignment: .leading, spacing: 2) {
                            Text(name).font(.ry(17, 700)).foregroundStyle(colors.fgPrimary).lineLimit(1)
                            Text(subtitle).font(.ry(13, 400)).foregroundStyle(colors.fgSecondary).lineLimit(1)
                        }
                        Spacer(minLength: Space.s3)
                        RyIcon(name: "fa-chevron-right", size: 13, color: colors.fgSecondary)
                    }

                    Rectangle().fill(colors.borderSubtle).frame(height: 0.5)

                    // Primary metric
                    HStack(alignment: .lastTextBaseline) {
                        VStack(alignment: .leading, spacing: 3) {
                            Text(product.primaryMetric.label.uppercased())
                                .font(.ry(11, 700)).tracking(0.5)
                                .foregroundStyle(colors.fgSecondary)
                            MoneyText(amount: product.primaryMetric.value.amount,
                                      size: 24, weight: 800, color: metricColor)
                        }
                        Spacer()
                        Text(contextLine)
                            .font(.ry(12, 500)).foregroundStyle(colors.fgSecondary)
                    }
                }
            }
        }
        .buttonStyle(PressableStyle())
    }
}
