import SwiftUI

// Central app state — mirrors the RN TweaksProvider's session + theme + persona.
// Theme follows an in-app toggle (not the OS), exactly like useRyTheme().
@Observable
final class AppModel {
    var loggedIn: Bool = false
    var dark: Bool = false
    var persona: Persona = Personas.john

    init() {
        // Launch-argument hooks for verification (simctl passes -key value into
        // UserDefaults). No effect in normal use.
        let defaults = UserDefaults.standard
        if defaults.bool(forKey: "startLoggedIn") { loggedIn = true }
        if defaults.bool(forKey: "startDark") { dark = true }
    }

    var colors: RySemanticColors { dark ? .dark : .light }

    /// SwiftUI color scheme for the whole app (drives system controls too).
    var colorScheme: ColorScheme { dark ? .dark : .light }

    func login() { loggedIn = true }
    func logout() { loggedIn = false }
}
