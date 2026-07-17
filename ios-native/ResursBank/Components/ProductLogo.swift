import SwiftUI

// ProductLogo — port of RyProductLogo: the round logo tile shown for a product
// everywhere (Resurs mark / merchant image / brand initial / partner logo /
// savings·loan glyph).
struct ProductLogo: View {
    @Environment(AppModel.self) private var app
    let product: Product
    var size: CGFloat = 46

    private var colors: RySemanticColors { app.colors }

    var body: some View {
        content
            .frame(width: size, height: size)
            .clipShape(Circle())
    }

    @ViewBuilder private var content: some View {
        if let partner = product.partnerLogo {
            // Partner-branded round logo + hairline border.
            Image(partner)
                .resizable()
                .scaledToFill()
                .frame(width: size, height: size)
                .background(Color.white)
                .overlay(Circle().stroke(colors.borderSubtle, lineWidth: 1))
        } else if product.origin == .merchant, let mid = product.merchantId {
            merchantLogo(mid)
        } else if product.type == .savings {
            glyphTile(bg: "#D5E7DF", icon: "fa-piggy-bank")
        } else if product.type == .loan {
            glyphTile(bg: "#D9E8DD", icon: "fa-coins")
        } else {
            // Direct — Resurs mark (beige tile for Family).
            let beige = product.id == "p-family" || product.id == "p-family-v2"
            ZStack {
                Color(hex: beige ? "#EBE3D4" : "#D9E8DD")
                Image("resurs-logo")
                    .resizable()
                    .scaledToFit()
                    .frame(width: size * 0.65, height: size * 0.65)
            }
        }
    }

    @ViewBuilder private func merchantLogo(_ mid: MerchantId) -> some View {
        switch mid {
        case .netonnet:
            ZStack {
                Color.white
                Image("netonnet").resizable().scaledToFit().padding(size * 0.14)
            }
            .overlay(Circle().stroke(colors.borderSubtle, lineWidth: 1))
        case .bauhaus:
            ZStack {
                Color(hex: "#E1201D")
                Image("bauhaus-logo").resizable().scaledToFit().padding(size * 0.12)
            }
        default:
            // Brand-coloured initial.
            ZStack {
                Color(hex: Merchants.brandColor(mid))
                Text(Merchants.letter(mid))
                    .font(.ry(size * 0.37, 800))
                    .foregroundStyle(.white)
            }
        }
    }

    @ViewBuilder private func glyphTile(bg: String, icon: String) -> some View {
        ZStack {
            Color(hex: bg)
            RyIcon(name: icon, size: size * 0.4, color: RsColors.green700)
        }
    }
}
