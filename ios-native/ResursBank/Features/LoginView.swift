import SwiftUI

// LoginView — port of SkymningLogin (BankID mock): brand hero, headline, and a
// "Log in" CTA that shows a short waiting state before signing in.
struct LoginView: View {
    @Environment(AppModel.self) private var app
    @State private var waiting = false

    private var colors: RySemanticColors { app.colors }

    var body: some View {
        ZStack {
            // Dusk gradient — Resurs green deepening to night.
            LinearGradient(
                colors: [Color(hex: "#0C5D57"), Color(hex: "#084A45"), Color(hex: "#053834")],
                startPoint: .top, endPoint: .bottom
            )
            .ignoresSafeArea()

            // Soft glow.
            Circle()
                .fill(RsColors.mint300.opacity(0.18))
                .frame(width: 360, height: 360)
                .blur(radius: 80)
                .offset(x: 120, y: -220)

            VStack(alignment: .leading, spacing: 0) {
                Spacer()
                logoTile
                    .padding(.bottom, Space.s6)

                Text("Loans, payments,\nsavings and cards.")
                    .font(.ry(34, 700))
                    .foregroundStyle(.white)
                    .lineSpacing(4)
                    .padding(.bottom, Space.s3)

                Text("All in one bank. Flexible and in control.")
                    .font(.ry(16, 400))
                    .foregroundStyle(.white.opacity(0.72))

                Spacer()

                bankIDButton
                    .padding(.bottom, Space.s3)

                Text("More options and cookies")
                    .font(.ry(13, 600))
                    .foregroundStyle(.white.opacity(0.6))
                    .frame(maxWidth: .infinity, alignment: .center)
                    .padding(.bottom, Space.s4)
            }
            .padding(.horizontal, Space.s6)

            if waiting { waitingOverlay }
        }
    }

    private var logoTile: some View {
        HStack(spacing: Space.s3) {
            ZStack {
                Circle().fill(.white)
                Image("resurs-logo").resizable().scaledToFit().frame(width: 34, height: 34)
            }
            .frame(width: 56, height: 56)
            Text("Resurs")
                .font(.ry(24, 800))
                .foregroundStyle(.white)
        }
    }

    private var bankIDButton: some View {
        Button {
            startBankID()
        } label: {
            HStack(spacing: Space.s2) {
                Image(systemName: "faceid").font(.system(size: 18, weight: .bold))
                Text("Log in with BankID").font(.ry(16, 700))
            }
            .foregroundStyle(Color(hex: "#0C5D57"))
            .frame(maxWidth: .infinity)
            .padding(.vertical, 17)
            .background(.white, in: Capsule())
        }
        .buttonStyle(PressableStyle())
    }

    private var waitingOverlay: some View {
        ZStack {
            Color.black.opacity(0.35).ignoresSafeArea()
            VStack(spacing: Space.s4) {
                ProgressView()
                    .controlSize(.large)
                    .tint(colors.primaryMain)
                Text("Open the BankID app")
                    .font(.ry(17, 700))
                    .foregroundStyle(colors.fgPrimary)
                Text("Start the BankID app and tap the QR icon.")
                    .font(.ry(14, 400))
                    .foregroundStyle(colors.fgSecondary)
                    .multilineTextAlignment(.center)
            }
            .padding(Space.s8)
            .frame(maxWidth: 300)
            .background(colors.bgPaper, in: RoundedRectangle(cornerRadius: Radii.xl, style: .continuous))
        }
        .transition(.opacity)
    }

    private func startBankID() {
        withAnimation { waiting = true }
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.85) {
            withAnimation(.easeInOut(duration: 0.3)) {
                app.login()
            }
        }
    }
}
