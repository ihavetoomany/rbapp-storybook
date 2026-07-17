import SwiftUI

// DiscoverView — port of the Discover tab: cross-sell "Start with Resurs" and
// popular partner stores.
struct DiscoverView: View {
    @Environment(AppModel.self) private var app
    private var colors: RySemanticColors { app.colors }

    private let starters = [
        (icon: "fa-piggy-bank", title: "Savings account", sub: "Up to 4.05% interest"),
        (icon: "fa-coins", title: "Private loan", sub: "From 5.95% — no collateral"),
        (icon: "fa-credit-card", title: "Resurs credit cards", sub: "Pay now, pay later — your choice"),
    ]
    private let stores: [MerchantId] = [.bauhaus, .netonnet, .ahlens, .gekas, .jula]

    var body: some View {
        NavigationStack {
            GradientHeaderScroll {
                VStack(alignment: .leading, spacing: Space.s3) {
                    featured
                    SectionTitle(text: "Start with Resurs")
                    ForEach(starters, id: \.title) { s in
                        RyCard {
                            HStack(spacing: Space.s3) {
                                ZStack {
                                    Circle().fill(colors.primaryBackground).frame(width: 44, height: 44)
                                    RyIcon(name: s.icon, size: 18, color: colors.primaryMain)
                                }
                                VStack(alignment: .leading, spacing: 2) {
                                    Text(s.title).font(.ry(15, 700)).foregroundStyle(colors.fgPrimary)
                                    Text(s.sub).font(.ry(13, 400)).foregroundStyle(colors.fgSecondary)
                                }
                                Spacer()
                                RyIcon(name: "fa-chevron-right", size: 13, color: colors.fgSecondary)
                            }
                        }
                    }
                    SectionTitle(text: "Popular stores")
                    storeGrid
                }
                .padding(.horizontal, Space.s5)
            }
            .navigationTitle("Discover")
            .navigationBarTitleDisplayMode(.large)
            .toolbar { ToolbarItem(placement: .topBarTrailing) { HeaderButton(systemImage: "plus") } }
        }
    }

    private var featured: some View {
        ZStack(alignment: .bottomLeading) {
            RoundedRectangle(cornerRadius: Radii.xl, style: .continuous)
                .fill(LinearGradient(colors: [Color(hex: "#117069"), Color(hex: "#0C5D57")],
                                     startPoint: .topLeading, endPoint: .bottomTrailing))
                .frame(height: 168)
            VStack(alignment: .leading, spacing: Space.s2) {
                Text("FEATURED").font(.ry(11, 700)).tracking(1.2).foregroundStyle(RsColors.mint300)
                Text("Split any purchase,\ninterest-free").font(.ry(24, 800)).foregroundStyle(.white)
                Text("Part payment on purchases over 1 000 kr").font(.ry(13, 400)).foregroundStyle(.white.opacity(0.8))
            }
            .padding(Space.s5)
        }
        .padding(.top, Space.s2)
    }

    private var storeGrid: some View {
        LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: Space.s3) {
            ForEach(stores, id: \.rawValue) { mid in
                RyCard {
                    HStack(spacing: Space.s3) {
                        merchantChip(mid)
                        VStack(alignment: .leading, spacing: 1) {
                            Text(Merchants.all[mid]?.name ?? "").font(.ry(14, 700)).foregroundStyle(colors.fgPrimary).lineLimit(1)
                            Text("Up to 24 mo").font(.ry(11, 400)).foregroundStyle(colors.fgSecondary)
                        }
                        Spacer(minLength: 0)
                    }
                }
            }
        }
    }

    private func merchantChip(_ mid: MerchantId) -> some View {
        Group {
            if mid == .netonnet {
                ZStack { Color.white; Image("netonnet").resizable().scaledToFit().padding(5) }
                    .overlay(Circle().stroke(colors.borderSubtle, lineWidth: 1))
            } else if mid == .bauhaus {
                ZStack { Color(hex: "#E1201D"); Image("bauhaus-logo").resizable().scaledToFit().padding(4) }
            } else if mid == .gekas {
                ZStack { Color.white; Image("gekas-logo").resizable().scaledToFill() }
                    .overlay(Circle().stroke(colors.borderSubtle, lineWidth: 1))
            } else {
                ZStack {
                    Color(hex: Merchants.brandColor(mid))
                    Text(Merchants.letter(mid)).font(.ry(15, 800)).foregroundStyle(.white)
                }
            }
        }
        .frame(width: 36, height: 36)
        .clipShape(Circle())
    }
}
