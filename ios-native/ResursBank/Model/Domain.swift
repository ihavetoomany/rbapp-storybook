import Foundation

// Domain models — ported from src/data/types.ts. Account is modelled as a
// single struct with a `type` discriminator + optional fields (closer to the
// TS shape and simpler to seed than a Swift enum union).

// MARK: - Merchants

enum MerchantId: String {
    case bauhaus, netonnet, jula, ahlens, gekas
}

// MARK: - Product theming

struct ProductTheme {
    var brandColor: String
    var brandColor2: String
    /// FontAwesome 'fa-*' name (mapped to SF Symbols in the UI layer).
    var icon: String
}

struct Metric: Identifiable {
    let id = UUID()
    var label: String
    var value: Money
    var sentiment: Sentiment?
    enum Sentiment { case positive, negative }
}

// MARK: - Transactions

enum TransactionType: String {
    case purchase, refund, fee, withdrawal, other
}

struct Purchase: Identifiable {
    var id: String
    var type: TransactionType
    var date: String // ISO YYYY-MM-DD
    var merchant: String
    var amount: Money
    var accountId: String?
    var icon: String // fa-*
    var subLabel: String?
    var user: String?
    var preliminary: Bool = false
}

// MARK: - Accounts

enum AccountType: String {
    case creditAccount, invoiceAccount, depositAccount, loanAccount
}

struct Account: Identifiable {
    var id: String
    var type: AccountType
    var name: String
    var number: String
    var ocr: String?
    var bankgiro: String?

    // credit
    var subtype: String?
    var storeCredit: Bool = false
    var creditLimit: Money?
    var usedCredit: Money?
    var availableCredit: Money?

    // invoice / loan
    var originalAmount: Money?
    var remainingBalance: Money?
    var interestRate: Double?
    var termMonths: Int?
    var monthlyPayment: Money?
    var paymentsMade: Int?

    // deposit
    var balance: Money?
    var goalAmount: Money?

    var hidden: Bool = false
}

// MARK: - Invoices & payment requests

enum PaymentRequestKind: String {
    case laneavi, manadsavi, delbetalning, faktura, kontoavi
}

enum PaymentStatus: String {
    case unpaid, overdue, missed, scheduled, partiallyPaid, paid, voided
}

struct StatementBreakdownItem: Identifiable {
    let id = UUID()
    var label: String
    var amount: Int
}

struct PaymentTier: Identifiable {
    var id: String
    var label: String
    var desc: String
    var amount: Money
    var recommended: Bool = false
}

struct EcomItem: Identifiable {
    let id = UUID()
    var name: String
    var qty: Int
    var price: Money
}

struct PaymentRequestPurchase {
    var store: String
    var items: [EcomItem]
}

struct PaymentRequest: Identifiable {
    var id: String
    var invoiceId: String?
    var accountId: String?
    var productId: String?
    var kind: PaymentRequestKind
    var title: String
    var displayName: String?
    var description: String?
    var statementBreakdown: [StatementBreakdownItem]?
    var remainingAmount: Money
    var originalAmount: Money
    var dueDate: String
    var paidDate: String?
    var status: PaymentStatus
    var ocr: String
    var bankgiro: String
    var tiers: [PaymentTier]?
    var purchase: PaymentRequestPurchase?
    // part-payment / loan installment
    var loanAmount: Money?
    var loanRemaining: Money?
    var paymentNo: Int?
    var paymentsTotal: Int?
    var interestRate: Double?
    var principal: Money?
    var interestPart: Money?
    var thirdLineOverride: String?
}

// MARK: - Offers

struct Offer: Identifiable {
    let id = UUID()
    enum Kind: String { case benefit, offer, action }
    var type: Kind
    var icon: String
    var title: String
    var desc: String
}

// MARK: - Family, profile

struct FamilyMember: Identifiable {
    var id: String
    var name: String
    var age: Int
    var role: String
    var roleTone: Tone
    var access: String
    var avatar: Int
    enum Tone { case primary, info }
}

struct Profile {
    var legalName: String
    var address: [String]
    var customerId: String
    var preferredName: String
    var email: String
    var phone: String
}

// MARK: - Products & persona

enum ProductOrigin: String { case direct, merchant }
enum ProductType: String { case credit, invoice, savings, loan }

struct Product: Identifiable {
    var id: String
    var name: String
    var origin: ProductOrigin
    var merchantId: MerchantId?
    var type: ProductType
    var theme: ProductTheme
    var partnerLogo: String? // image resource name
    var monthlyBudget: Money?
    var bonusPoints: Int?
    var primaryMetric: Metric
    var secondaryMetrics: [Metric]
    var accounts: [Account]
    var purchases: [Purchase]
    var paymentRequests: [PaymentRequest]
    var offers: [Offer]
    var familyMembers: [FamilyMember]?
}

struct Persona: Identifiable {
    var id: String
    var name: String
    var avatar: String
    var products: [Product]
    var profile: Profile
}
