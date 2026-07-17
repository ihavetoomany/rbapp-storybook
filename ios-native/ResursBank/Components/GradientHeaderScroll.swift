import SwiftUI

// GradientHeaderScroll — a ScrollView with the shared brand-green header wash:
// a gradient (solid green at the top → transparent) behind the content that
// scrolls up with it and ends a bit below the large title. Used by every tab.
struct GradientHeaderScroll<Content: View>: View {
    @Environment(AppModel.self) private var app
    var bandHeight: CGFloat = 110
    @ViewBuilder var content: () -> Content

    @State private var scrollY: CGFloat = 0

    private var bandTop: Color { app.dark ? app.colors.bandHighlight : RsColors.green100 }

    var body: some View {
        GeometryReader { proxy in
            let topInset = proxy.safeAreaInsets.top
            ZStack(alignment: .top) {
                app.colors.bgDefault.ignoresSafeArea()

                LinearGradient(
                    colors: [bandTop, bandTop.opacity(0)],
                    startPoint: .top, endPoint: .bottom
                )
                .frame(height: topInset + bandHeight)
                .frame(maxWidth: .infinity)
                .offset(y: min(0, scrollY))
                .ignoresSafeArea(edges: .top)

                ScrollView {
                    VStack(spacing: 0) {
                        Color.clear
                            .frame(height: 0)
                            .background(GeometryReader { g in
                                Color.clear.preference(
                                    key: HeaderScrollKey.self,
                                    value: g.frame(in: .named("hdrScroll")).minY
                                )
                            })
                        content()
                    }
                }
                .scrollContentBackground(.hidden)
                .coordinateSpace(name: "hdrScroll")
                .onPreferenceChange(HeaderScrollKey.self) { scrollY = $0 }
            }
        }
    }
}

// Tracks the scroll offset so the header wash can move with the content.
private struct HeaderScrollKey: PreferenceKey {
    static let defaultValue: CGFloat = 0
    static func reduce(value: inout CGFloat, nextValue: () -> CGFloat) { value = nextValue() }
}
