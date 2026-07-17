import SwiftUI

// RootView — login gate + the native 4-tab shell. On iOS 26 SwiftUI's TabView
// renders as a true floating Liquid Glass tab bar (system-managed position,
// scroll-edge effect, minimize-on-scroll, and accessibility).
struct RootView: View {
    @Environment(AppModel.self) private var app
    @State private var activeTab = UserDefaults.standard.string(forKey: "startTab") ?? "activity"

    var body: some View {
        if app.loggedIn {
            shell
        } else {
            LoginView()
        }
    }

    private var shell: some View {
        let toPayCount = InvoiceModel.lists(for: app.persona).toPay.count
        return TabView(selection: $activeTab) {
            ActivityView()
                .tabItem { Label("To handle", systemImage: "doc.text.fill") }
                .badge(toPayCount)
                .tag("activity")

            WalletView()
                .tabItem { Label("Wallet", systemImage: "wallet.bifold.fill") }
                .tag("wallet")

            DiscoverView()
                .tabItem { Label("Discover", systemImage: "safari") }
                .tag("discover")

            MyResursView()
                .tabItem { Label("My Resurs", systemImage: "person.crop.circle") }
                .tag("myresurs")
        }
        .modifier(TabBarMinimizeIfAvailable())
    }
}

// Keeps the full Liquid Glass tab bar visible while scrolling (no minimize),
// with no effect on earlier OSes.
private struct TabBarMinimizeIfAvailable: ViewModifier {
    func body(content: Content) -> some View {
        if #available(iOS 26.0, *) {
            content.tabBarMinimizeBehavior(.never)
        } else {
            content
        }
    }
}
