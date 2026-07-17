import SwiftUI

// MyResursView — port of the My Resurs settings hub: profile, messages,
// documents, general settings (theme / language), and log out.
struct MyResursView: View {
    @Environment(AppModel.self) private var app
    private var colors: RySemanticColors { app.colors }

    var body: some View {
        @Bindable var app = app
        return NavigationStack {
            GradientHeaderScroll {
                VStack(alignment: .leading, spacing: Space.s3) {
                    profileHeader

                    SectionTitle(text: "Account")
                    RyCard(padding: 0) {
                        VStack(spacing: 0) {
                            navRow(icon: "fa-envelope", title: "Messages", sub: "Messages from the bank", badge: "2 unread", divider: true)
                            navRow(icon: "fa-file-lines", title: "My documents", sub: "Agreements and contracts", divider: true)
                            navRow(icon: "fa-user", title: "My profile", sub: "Edit your contact information", divider: false)
                        }
                    }

                    SectionTitle(text: "General settings")
                    RyCard(padding: 0) {
                        VStack(spacing: 0) {
                            Toggle(isOn: $app.dark) {
                                settingLabel(icon: app.dark ? "fa-moon" : "fa-sun", title: "Dark mode")
                            }
                            .tint(colors.primaryMain)
                            .padding(.vertical, Space.s2).padding(.horizontal, Space.s4)
                            Rectangle().fill(colors.borderSubtle).frame(height: 0.5).padding(.horizontal, Space.s4)
                            navRow(icon: "fa-comment", title: "Language", sub: "English", divider: false)
                        }
                    }

                    logoutButton
                }
                .padding(.horizontal, Space.s5)
            }
            .navigationTitle("My Resurs")
            .navigationBarTitleDisplayMode(.large)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    HeaderButton(systemImage: "message.fill")
                }
            }
        }
    }

    private var profileHeader: some View {
        HStack(spacing: Space.s3) {
            ZStack {
                Circle().fill(colors.primaryMain)
                Text(app.persona.avatar).font(.ry(18, 800)).foregroundStyle(colors.primaryContrast)
            }
            .frame(width: 52, height: 52)
            VStack(alignment: .leading, spacing: 2) {
                Text(app.persona.name).font(.ry(18, 700)).foregroundStyle(colors.fgPrimary)
                Text("Customer ID \(app.persona.profile.customerId)").font(.ry(13, 400)).foregroundStyle(colors.fgSecondary)
            }
            Spacer()
        }
        .padding(.top, Space.s2)
    }

    private func settingLabel(icon: String, title: String) -> some View {
        HStack(spacing: Space.s3) {
            ZStack {
                RoundedRectangle(cornerRadius: 9, style: .continuous).fill(colors.bgSubtle).frame(width: 34, height: 34)
                RyIcon(name: icon, size: 15, color: colors.fgSecondary)
            }
            Text(title).font(.ry(15, 700)).foregroundStyle(colors.fgPrimary)
        }
    }

    private func navRow(icon: String, title: String, sub: String, badge: String? = nil, divider: Bool) -> some View {
        HStack(spacing: Space.s3) {
            ZStack {
                RoundedRectangle(cornerRadius: 9, style: .continuous).fill(colors.bgSubtle).frame(width: 34, height: 34)
                RyIcon(name: icon, size: 15, color: colors.fgSecondary)
            }
            VStack(alignment: .leading, spacing: 1) {
                Text(title).font(.ry(15, 700)).foregroundStyle(colors.fgPrimary)
                Text(sub).font(.ry(12.5, 400)).foregroundStyle(colors.fgSecondary)
            }
            Spacer()
            if let badge {
                Text(badge).font(.ry(11, 700)).foregroundStyle(colors.primaryMain)
                    .padding(.horizontal, 8).padding(.vertical, 3)
                    .background(colors.primaryBackground, in: Capsule())
            }
            RyIcon(name: "fa-chevron-right", size: 12, color: colors.fgSecondary)
        }
        .padding(.vertical, Space.s3).padding(.horizontal, Space.s4)
        .contentShape(Rectangle())
        .overlay(alignment: .bottom) {
            if divider { Rectangle().fill(colors.borderSubtle).frame(height: 0.5).padding(.leading, Space.s4 + 34 + Space.s3) }
        }
    }

    private var logoutButton: some View {
        Button { withAnimation { app.logout() } } label: {
            HStack {
                Spacer()
                RyIcon(name: "fa-right-from-bracket", size: 15, color: colors.errorMain)
                Text("Log out").font(.ry(15, 700)).foregroundStyle(colors.errorMain)
                Spacer()
            }
            .padding(.vertical, 15)
            .background(colors.bgPaper, in: Capsule())
            .overlay(Capsule().stroke(colors.borderSubtle, lineWidth: 1))
        }
        .buttonStyle(PressableStyle())
        .padding(.top, Space.s4)
    }
}
