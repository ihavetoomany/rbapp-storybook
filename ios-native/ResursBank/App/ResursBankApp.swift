import SwiftUI

@main
struct ResursBankApp: App {
    @State private var app = AppModel()

    var body: some Scene {
        WindowGroup {
            RootView()
                .environment(app)
                .preferredColorScheme(app.colorScheme)
                .tint(app.colors.primaryMain)
        }
    }
}
