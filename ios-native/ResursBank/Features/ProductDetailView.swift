import SwiftUI

// ProductDetailView — port of ProductDetailView: brand hero with the primary
// metric, secondary metric tiles, and the product's purchase list.
struct ProductDetailView: View {
    @Environment(AppModel.self) private var app
    let productId: String

    private var colors: RySemanticColors { app.colors }
    private var product: Product? { app.persona.products.first { $0.id == productId } }

    var body: some View {
        ScrollView {
            if let product {
                VStack(alignment: .leading, spacing: Space.s4) {
                    hero(product)
                    metricTiles(product)
                    if !product.purchases.isEmpty {
                        SectionTitle(text: "Latest transactions", topPadding: Space.s2)
                        RyCard(padding: 0) {
                            VStack(spacing: 0) {
                                ForEach(Array(product.purchases.enumerated()), id: \.element.id) { i, tx in
                                    TransactionRow(tx: tx, showDivider: i < product.purchases.count - 1)
                                }
                            }
                        }
                    }
                    Color.clear.frame(height: 110)
                }
                .padding(.horizontal, Space.s5)
                .padding(.top, Space.s3)
            } else {
                Text("Not found").foregroundStyle(colors.fgSecondary).padding(.top, 80)
            }
        }
        .background(colors.bgDefault)
        .navigationTitle(product?.name ?? "Product")
        .navigationBarTitleDisplayMode(.inline)
    }

    private func hero(_ p: Product) -> some View {
        ZStack {
            RoundedRectangle(cornerRadius: Radii.xl, style: .continuous)
                .fill(LinearGradient(colors: [Color(hex: p.theme.brandColor), Color(hex: p.theme.brandColor2)],
                                     startPoint: .topLeading, endPoint: .bottomTrailing))
            VStack(alignment: .leading, spacing: Space.s2) {
                HStack {
                    Text(p.primaryMetric.label.uppercased())
                        .font(.ry(11, 700)).tracking(1).foregroundStyle(.white.opacity(0.8))
                    Spacer()
                    RyIcon(name: p.theme.icon, size: 20, color: .white.opacity(0.9))
                }
                HStack(alignment: .firstTextBaseline, spacing: 4) {
                    Text(RyFormat.grouped(p.primaryMetric.value.amount))
                        .font(.ry(38, 800)).foregroundStyle(.white).monospacedDigit()
                    Text("kr").font(.ry(18, 700)).foregroundStyle(.white.opacity(0.85))
                }
            }
            .padding(Space.s5)
            .frame(maxWidth: .infinity, alignment: .leading)
        }
    }

    private func metricTiles(_ p: Product) -> some View {
        HStack(spacing: Space.s3) {
            ForEach(p.secondaryMetrics) { metric in
                RyCard {
                    VStack(alignment: .leading, spacing: 4) {
                        Text(metric.label).font(.ry(12, 400)).foregroundStyle(colors.fgSecondary).lineLimit(1)
                        MoneyText(amount: metric.value.amount,
                                  size: 17, weight: 700, color: colors.fgPrimary,
                                  currency: metric.value.currency == .percent ? "%" : "kr")
                    }
                }
            }
        }
    }
}

struct TransactionRow: View {
    @Environment(AppModel.self) private var app
    let tx: Purchase
    var showDivider: Bool = true

    private var colors: RySemanticColors { app.colors }

    var body: some View {
        HStack(spacing: Space.s3) {
            ZStack {
                Circle().fill(colors.bgSubtle).frame(width: 38, height: 38)
                RyIcon(name: tx.icon, size: 15, color: colors.fgSecondary)
            }
            VStack(alignment: .leading, spacing: 1) {
                Text(tx.merchant).font(.ry(15, 700)).foregroundStyle(colors.fgPrimary).lineLimit(1)
                Text(tx.preliminary ? "Preliminary · \(RyFormat.date(tx.date))" : RyFormat.date(tx.date))
                    .font(.ry(12.5, 400)).foregroundStyle(colors.fgSecondary)
            }
            Spacer()
            MoneyText(amount: tx.type == .refund ? tx.amount.amount : -tx.amount.amount,
                      size: 15, weight: 700,
                      color: tx.type == .refund ? colors.successMain : colors.fgPrimary)
        }
        .padding(.vertical, Space.s3)
        .padding(.horizontal, Space.s4)
        .overlay(alignment: .bottom) {
            if showDivider {
                Rectangle().fill(colors.borderSubtle).frame(height: 0.5)
                    .padding(.leading, Space.s4 + 38 + Space.s3)
            }
        }
    }
}
