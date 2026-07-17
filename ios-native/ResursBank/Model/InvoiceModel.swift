import Foundation

// Invoice card model — ported from src/features/activity/invoiceModel.ts.
// Turns a PaymentRequest + its Product into a display card with a canonical
// state, a status tag, and a "third line", then splits into To-pay / Handled.

enum ImState {
    case topay, overdue, missed, scheduled, paidPartial, paidFull, cancelled, failed
}

enum ImTagTone { case error, muted, urgent, info, success, neutral }

struct ImTag {
    var text: String
    var tone: ImTagTone
}

struct ImCard: Identifiable {
    var id: String
    var product: Product
    var pr: PaymentRequest
    var state: ImState
    var urgent: Bool
    var name: String
    var dateLine: String
    var third: String
    var amount: Int      // remaining
    var fullAmount: Int  // original
    var dueDate: String
    var daysLeft: Int
    var daysOverdue: Int
    var tag: ImTag
    var strike: Bool
}

enum InvoiceModel {

    private static let handledStates: Set<PaymentStatus> = [.paid, .voided, .scheduled, .partiallyPaid]

    private static func billTypeLabel(_ kind: PaymentRequestKind) -> String {
        switch kind {
        case .laneavi: return "Installment"
        case .manadsavi: return "Statement"
        case .delbetalning: return "Partpayment"
        case .faktura: return "Invoice"
        case .kontoavi: return "Account invoice"
        }
    }

    static func card(from pr: PaymentRequest, product: Product) -> ImCard {
        let daysLeft = RyFormat.daysUntil(pr.dueDate)
        let daysOverdue = max(0, -daysLeft)

        var state: ImState
        switch pr.status {
        case .overdue: state = .overdue
        case .unpaid where daysLeft < 0: state = .overdue
        case .missed: state = .missed
        case .scheduled: state = .scheduled
        case .partiallyPaid: state = .paidPartial
        case .paid: state = .paidFull
        case .voided: state = .cancelled
        default: state = .topay
        }

        let urgent = state == .topay && daysLeft <= 2

        let tag: ImTag = {
            switch state {
            case .overdue: return ImTag(text: "Pay now", tone: .error)
            case .failed: return ImTag(text: "Pay now", tone: .error)
            case .topay: return ImTag(text: "\(max(0, daysLeft)) days left", tone: urgent ? .urgent : .muted)
            case .scheduled: return ImTag(text: "Scheduled", tone: .info)
            case .paidPartial, .paidFull: return ImTag(text: "Paid", tone: .success)
            case .missed: return ImTag(text: "\(max(0, daysLeft)) days left", tone: .muted)
            case .cancelled: return ImTag(text: "Cancelled", tone: .neutral)
            }
        }()

        let third: String = {
            switch state {
            case .overdue: return "Overdue \(daysOverdue) day" + (daysOverdue == 1 ? "" : "s")
            case .failed: return "Payment failed — retry"
            case .topay:
                if let o = pr.thirdLineOverride { return o }
                if pr.kind == .delbetalning, let no = pr.paymentNo, let total = pr.paymentsTotal {
                    return "Part payment \(no) of \(total)"
                }
                return billTypeLabel(pr.kind)
            case .scheduled:
                let full = pr.originalAmount.amount
                let sched = pr.remainingAmount.amount
                return sched < full ? "Part payment of \(RyFormat.grouped(full)) kr" : "Full payment"
            case .paidPartial: return "Part payment of \(RyFormat.grouped(pr.originalAmount.amount)) kr"
            case .paidFull: return "Full payment"
            case .missed: return "Includes overdue balance"
            case .cancelled: return "No payment required"
            }
        }()

        let dateLine: String = {
            if (state == .paidFull || state == .paidPartial), let paid = pr.paidDate {
                return "Paid " + RyFormat.date(paid)
            }
            if state == .scheduled { return "Scheduled to " + RyFormat.date(pr.dueDate) }
            return "Due " + RyFormat.date(pr.dueDate)
        }()

        return ImCard(
            id: pr.id, product: product, pr: pr, state: state, urgent: urgent,
            name: pr.displayName ?? product.name,
            dateLine: dateLine, third: third,
            amount: pr.remainingAmount.amount, fullAmount: pr.originalAmount.amount,
            dueDate: pr.dueDate, daysLeft: max(0, daysLeft), daysOverdue: daysOverdue,
            tag: tag, strike: state == .cancelled
        )
    }

    private static func rank(_ c: ImCard) -> Int {
        c.state == .overdue ? 0 : c.state == .failed ? 1 : 2
    }

    /// All cards, split into To-pay and Handled, sorted like the RN prototype.
    static func lists(for persona: Persona) -> (toPay: [ImCard], handled: [ImCard]) {
        var all: [ImCard] = []
        for p in persona.products {
            for pr in p.paymentRequests { all.append(card(from: pr, product: p)) }
        }
        let toPay = all
            .filter { !handledStates.contains($0.pr.status) }
            .sorted { a, b in
                if rank(a) != rank(b) { return rank(a) < rank(b) }
                return (RyFormat.parse(a.dueDate) ?? .distantFuture) < (RyFormat.parse(b.dueDate) ?? .distantFuture)
            }
        let handled = all
            .filter { handledStates.contains($0.pr.status) }
            .sorted { a, b in
                let ad = RyFormat.parse(a.pr.paidDate ?? a.dueDate) ?? .distantPast
                let bd = RyFormat.parse(b.pr.paidDate ?? b.dueDate) ?? .distantPast
                return ad > bd
            }
        return (toPay, handled)
    }

    static func find(_ id: String, in persona: Persona) -> ImCard? {
        for p in persona.products {
            for pr in p.paymentRequests where pr.id == id {
                return card(from: pr, product: p)
            }
        }
        return nil
    }
}
