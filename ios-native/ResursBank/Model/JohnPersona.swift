import Foundation

// PERSONA: John Andersson — ported from src/data/personas/john.ts.
// Resurs Family (Superkonto) + Gold + NetOnNet + Bauhaus + Åhléns + Gekås
// + Segelbåten savings + Billån private loan.

private func d(_ n: Int) -> String { RyFormat.d(n) }

enum Personas {

    static let john: Persona = {

        // ---------- DIRECT: RESURS FAMILY (Superkonto) ----------
        let family = Product(
            id: "p-family",
            name: "Resurs Family",
            origin: .direct,
            type: .credit,
            theme: ProductTheme(brandColor: "#117069", brandColor2: "#3B817A", icon: "fa-users"),
            monthlyBudget: m(12000),
            primaryMetric: Metric(label: "Available credit", value: m(38400), sentiment: .positive),
            secondaryMetrics: [
                Metric(label: "Credit limit", value: m(60000)),
                Metric(label: "Used credit", value: m(21600)),
            ],
            accounts: [
                Account(id: "a-super", type: .creditAccount, name: "Superkonto",
                        number: "8421-22 123 4567", ocr: "4500 1234 0009", bankgiro: "5827-9090",
                        subtype: "superkonto",
                        creditLimit: m(60000), usedCredit: m(21600), availableCredit: m(38400),
                        hidden: true),
                Account(id: "a-fam-savings", type: .depositAccount, name: "Family buffer",
                        number: "8480-22 770 2200",
                        interestRate: 2.75, balance: m(14200), goalAmount: m(20000), hidden: true),
            ],
            purchases: [
                Purchase(id: "t-prelim1", type: .purchase, date: d(0), merchant: "Willys", amount: m(642), accountId: "a-super", icon: "fa-basket-shopping", user: "john", preliminary: true),
                Purchase(id: "t1", type: .purchase, date: d(-6), merchant: "Hemköp", amount: m(2400), accountId: "a-super", icon: "fa-basket-shopping", user: "john"),
                Purchase(id: "t6", type: .purchase, date: d(-9), merchant: "Elgiganten", amount: m(10000), accountId: "a-super", icon: "fa-tv", user: "anna"),
                Purchase(id: "t3", type: .purchase, date: d(-11), merchant: "Statoil Circle K", amount: m(1500), accountId: "a-super", icon: "fa-gas-pump", user: "john"),
            ],
            paymentRequests: [
                PaymentRequest(id: "pr-fam-nov", invoiceId: "i-fam-nov", accountId: "a-super", productId: "p-family",
                               kind: .manadsavi, title: "Monthly invoice · Superkonto",
                               description: "This invoice relates to last month's purchases with Resurs Family and the monthly amount of any ongoing part payment plans from previous statements.",
                               statementBreakdown: [
                                   StatementBreakdownItem(label: "New purchases · October", amount: 935),
                                   StatementBreakdownItem(label: "Part payment · Sony WH-1000XM5", amount: 305),
                               ],
                               remainingAmount: m(1240), originalAmount: m(1240), dueDate: d(8),
                               status: .unpaid, ocr: "4500 1234 0009", bankgiro: "5827-9090",
                               tiers: [
                                   PaymentTier(id: "min", label: "Minimum", desc: "Total debt converted to 17% plan", amount: m(1080)),
                                   PaymentTier(id: "6m", label: "6 months interest-free", desc: "1/6 of purchases + ongoing plans", amount: m(1240), recommended: true),
                                   PaymentTier(id: "full", label: "Full invoice", desc: "Pay this month's purchases + plans", amount: m(2710)),
                                   PaymentTier(id: "max", label: "Maximize credit", desc: "Pay all used credit including uninvoiced", amount: m(21600)),
                               ]),
                PaymentRequest(id: "pr-super-loan", invoiceId: "i-super-loan-nov", accountId: "a-super-inv-nov", productId: "p-family",
                               kind: .delbetalning, title: "Part payment · Sony WH-1000XM5", displayName: "Resurs Family Flex",
                               description: "This invoice relates to your Sony WH-1000XM5 part payment plan.",
                               remainingAmount: m(305), originalAmount: m(305), dueDate: d(5),
                               status: .unpaid, ocr: "4500 5500 0011 7", bankgiro: "5827-9090",
                               loanAmount: m(3490), loanRemaining: m(2326),
                               paymentNo: 5, paymentsTotal: 12, interestRate: 9.95,
                               principal: m(286), interestPart: m(19), thirdLineOverride: "Invoice"),
                PaymentRequest(id: "pr-fam-oct", invoiceId: "i-fam-oct", accountId: "a-super", productId: "p-family",
                               kind: .manadsavi, title: "Monthly invoice · Superkonto",
                               remainingAmount: m(1180), originalAmount: m(1180), dueDate: d(-22), paidDate: d(-24),
                               status: .paid, ocr: "4500 1234 0008", bankgiro: "5827-9090"),
                PaymentRequest(id: "pr-fam-sched", invoiceId: "i-fam-sep", accountId: "a-super", productId: "p-family",
                               kind: .manadsavi, title: "Monthly invoice · Superkonto",
                               remainingAmount: m(1640), originalAmount: m(1640), dueDate: d(4),
                               status: .scheduled, ocr: "4500 1234 0007", bankgiro: "5827-9090"),
            ],
            offers: [
                Offer(type: .benefit, icon: "fa-shield-halved", title: "Free purchase insurance", desc: "On every card purchase, up to 30 000 SEK"),
                Offer(type: .benefit, icon: "fa-percent", title: "0.5% cashback", desc: "On groceries, gas, and pharmacy"),
                Offer(type: .offer, icon: "fa-gift", title: "Welcome bonus", desc: "300 SEK after first 3 000 SEK spent · 12 days left"),
            ],
            familyMembers: [
                FamilyMember(id: "fm-anna", name: "John", age: 36, role: "Coordinator", roleTone: .primary, access: "Full account access", avatar: 0),
                FamilyMember(id: "fm-anders", name: "Anna", age: 37, role: "Partner", roleTone: .primary, access: "Full account access", avatar: 1),
                FamilyMember(id: "fm-agnes", name: "Agnes", age: 13, role: "Little sister", roleTone: .info, access: "Monthly limit: 450 kr / 1 000 kr", avatar: 2),
            ]
        )

        // ---------- DIRECT: RESURS GOLD ----------
        let gold = Product(
            id: "p-gold", name: "Resurs Gold", origin: .direct, type: .credit,
            theme: ProductTheme(brandColor: "#0C5D57", brandColor2: "#3B817A", icon: "fa-credit-card"),
            monthlyBudget: m(10000), bonusPoints: 1240000,
            primaryMetric: Metric(label: "Available credit", value: m(31500), sentiment: .positive),
            secondaryMetrics: [
                Metric(label: "Credit limit", value: m(40000)),
                Metric(label: "Available credit", value: m(31500)),
            ],
            accounts: [
                Account(id: "a-gold-credit", type: .creditAccount, name: "Main credit account",
                        number: "8501-22 778 9001", ocr: "4500 7789 0011", bankgiro: "5827-4545",
                        subtype: "kort2000",
                        creditLimit: m(40000), usedCredit: m(8500), availableCredit: m(31500)),
            ],
            purchases: [
                Purchase(id: "tg1", type: .purchase, date: d(-1), merchant: "Coop", amount: m(842), accountId: "a-gold-credit", icon: "fa-basket-shopping"),
                Purchase(id: "tg2", type: .purchase, date: d(-4), merchant: "Circle K", amount: m(615), accountId: "a-gold-credit", icon: "fa-gas-pump"),
                Purchase(id: "tg3", type: .purchase, date: d(-11), merchant: "Elgiganten", amount: m(2990), accountId: "a-gold-credit", icon: "fa-tv"),
            ],
            paymentRequests: [
                PaymentRequest(id: "pr-gold-nov", invoiceId: "i-gold-nov", accountId: "a-gold-inv-nov", productId: "p-gold",
                               kind: .manadsavi, title: "Monthly invoice · Resurs Gold", displayName: "Resurs Gold",
                               description: "This invoice relates to last month's purchases with Resurs Gold.",
                               statementBreakdown: [StatementBreakdownItem(label: "Purchases · October", amount: 1290)],
                               remainingAmount: m(1290), originalAmount: m(1290), dueDate: d(12),
                               status: .unpaid, ocr: "4500 7789 0021 3", bankgiro: "5827-4545"),
                PaymentRequest(id: "pr-gold-oct", invoiceId: "i-gold-oct", accountId: "a-gold-inv-nov", productId: "p-gold",
                               kind: .manadsavi, title: "Monthly invoice · Resurs Gold", displayName: "Resurs Gold",
                               remainingAmount: m(1190), originalAmount: m(1190), dueDate: d(-21), paidDate: d(-23),
                               status: .paid, ocr: "4500 7789 0021 2", bankgiro: "5827-4545"),
            ],
            offers: [
                Offer(type: .benefit, icon: "fa-shield-halved", title: "Free purchase insurance", desc: "On every card purchase, up to 30 000 SEK"),
                Offer(type: .action, icon: "fa-pen-to-square", title: "Update direct debit", desc: "Set up autopay so you never miss an invoice"),
            ]
        )

        // ---------- MERCHANT: NETONNET ----------
        let netonnet = Product(
            id: "p-netonnet-john", name: "NetOnNet", origin: .merchant, merchantId: .netonnet, type: .credit,
            theme: ProductTheme(brandColor: Merchants.brandColor(.netonnet), brandColor2: Merchants.brandColor2(.netonnet), icon: "fa-basket-shopping"),
            primaryMetric: Metric(label: "To pay this month", value: m(3700), sentiment: .negative),
            secondaryMetrics: [
                Metric(label: "Credit limit", value: m(25000)),
                Metric(label: "Available credit", value: m(21300)),
            ],
            accounts: [
                Account(id: "a-non-john", type: .creditAccount, name: "NetOnNet account",
                        number: "8311-22 410 7700",
                        creditLimit: m(25000), usedCredit: m(3700), availableCredit: m(21300), hidden: true),
            ],
            purchases: [
                Purchase(id: "tnj1", type: .purchase, date: "2026-06-12", merchant: "NetOnNet.se", amount: m(2500), accountId: "a-non-john", icon: "fa-tv"),
                Purchase(id: "tnj2", type: .purchase, date: "2026-06-18", merchant: "NetOnNet.se", amount: m(1200), accountId: "a-non-john", icon: "fa-headphones"),
            ],
            paymentRequests: [
                PaymentRequest(id: "pr-nonj-jun", invoiceId: "i-nonj-jun", accountId: "a-non-john", productId: "p-netonnet-john",
                               kind: .faktura, title: "NetOnNet · part payment",
                               description: "This invoice relates to your recent NetOnNet purchases.",
                               remainingAmount: m(3700), originalAmount: m(3700), dueDate: "2026-07-25",
                               status: .unpaid, ocr: "4400 4100 7700 2", bankgiro: "5827-3434",
                               purchase: PaymentRequestPurchase(store: "NetOnNet.se", items: [
                                   EcomItem(name: "Samsung 55\" 4K UHD TV", qty: 1, price: m(2500)),
                                   EcomItem(name: "Sony WH-1000XM5 headphones", qty: 1, price: m(1200)),
                               ])),
            ],
            offers: [
                Offer(type: .benefit, icon: "fa-shield-halved", title: "3-year warranty", desc: "On all electronics paid with Resurs"),
                Offer(type: .action, icon: "fa-clock", title: "Convert to part payment", desc: "Split a purchase over up to 24 months"),
            ]
        )

        // ---------- MERCHANT: BAUHAUS ----------
        let bauhaus = Product(
            id: "p-bauhaus-john", name: "Bauhaus", origin: .merchant, merchantId: .bauhaus, type: .credit,
            theme: ProductTheme(brandColor: Merchants.brandColor(.bauhaus), brandColor2: Merchants.brandColor2(.bauhaus), icon: "fa-hammer"),
            primaryMetric: Metric(label: "Monthly payment", value: m(305), sentiment: .negative),
            secondaryMetrics: [
                Metric(label: "Remaining debt", value: m(2326)),
                Metric(label: "Original purchase", value: m(3490)),
            ],
            accounts: [
                Account(id: "a-bauhaus-john", type: .invoiceAccount, name: "Garden furniture set · part payment",
                        number: "8311-22 500 1234", ocr: "4500 5500 0011 1", bankgiro: "5827-9090",
                        originalAmount: m(3490), remainingBalance: m(2326), interestRate: 9.95,
                        termMonths: 12, monthlyPayment: m(305), paymentsMade: 4),
            ],
            purchases: [
                Purchase(id: "tbj1", type: .purchase, date: d(-120), merchant: "Bauhaus Malmö", amount: m(3490), accountId: "a-bauhaus-john", icon: "fa-tree"),
            ],
            paymentRequests: [
                PaymentRequest(id: "pr-bauhaus-john-2", invoiceId: "i-bauhaus-john-2", accountId: "a-bauhaus-john-2", productId: "p-bauhaus-john",
                               kind: .faktura, title: "Bauhaus · purchase", displayName: "Bauhaus",
                               remainingAmount: m(249), originalAmount: m(249), dueDate: d(-15), paidDate: d(-12),
                               status: .paid, ocr: "4500 5500 0011 2", bankgiro: "5827-9090"),
                PaymentRequest(id: "pr-bauhaus-john-nov", invoiceId: "i-bauhaus-john-nov", accountId: "a-bauhaus-john", productId: "p-bauhaus-john",
                               kind: .delbetalning, title: "Bauhaus · part payment", displayName: "Bauhaus",
                               description: "This invoice relates to your garden furniture set, purchased at Bauhaus in July 2025.",
                               remainingAmount: m(305), originalAmount: m(305), dueDate: d(12),
                               status: .unpaid, ocr: "4500 5500 0011 1", bankgiro: "5827-9090",
                               loanAmount: m(3490), loanRemaining: m(2326),
                               paymentNo: 5, paymentsTotal: 12, interestRate: 9.95,
                               principal: m(286), interestPart: m(19)),
            ],
            offers: [
                Offer(type: .benefit, icon: "fa-truck", title: "Free delivery on orders over 500 kr", desc: "For Resurs Bauhaus card holders"),
            ]
        )

        // ---------- MERCHANT: ÅHLÉNS (store credit) ----------
        let ahlens = Product(
            id: "p-ahlens-john", name: "Åhléns", origin: .merchant, merchantId: .ahlens, type: .credit,
            theme: ProductTheme(brandColor: Merchants.brandColor(.ahlens), brandColor2: Merchants.brandColor2(.ahlens), icon: "fa-bag-shopping"),
            primaryMetric: Metric(label: "Available credit", value: m(27650), sentiment: .positive),
            secondaryMetrics: [
                Metric(label: "Credit limit", value: m(30000)),
                Metric(label: "Available credit", value: m(27650)),
            ],
            accounts: [
                Account(id: "a-ahlens-john", type: .creditAccount, name: "Åhléns store credit",
                        number: "8190-22 200 4411", ocr: "4488 2200 0044 1", bankgiro: "5827-2233",
                        storeCredit: true,
                        creditLimit: m(30000), usedCredit: m(2350), availableCredit: m(27650)),
            ],
            purchases: [
                Purchase(id: "taj1", type: .purchase, date: d(-3), merchant: "Åhléns City", amount: m(899), accountId: "a-ahlens-john", icon: "fa-shirt"),
                Purchase(id: "taj2", type: .purchase, date: d(-17), merchant: "Åhléns.com", amount: m(1451), accountId: "a-ahlens-john", icon: "fa-couch"),
            ],
            paymentRequests: [
                PaymentRequest(id: "pr-ahlens-john-nov", invoiceId: "i-ahlens-john-nov", accountId: "a-ahlens-john", productId: "p-ahlens-john",
                               kind: .kontoavi, title: "Account invoice · Åhléns",
                               description: "This invoice relates to your recent purchases at Åhléns.",
                               remainingAmount: m(2350), originalAmount: m(2350), dueDate: d(14),
                               status: .unpaid, ocr: "4488 2200 0044 1", bankgiro: "5827-2233",
                               purchase: PaymentRequestPurchase(store: "Åhléns", items: [
                                   EcomItem(name: "Winter jacket — Åhléns City", qty: 1, price: m(899)),
                                   EcomItem(name: "Cushion set, 4 pcs — Åhléns.com", qty: 1, price: m(1451)),
                               ])),
            ],
            offers: [
                Offer(type: .benefit, icon: "fa-percent", title: "Interest-free 60 days", desc: "On every purchase at Åhléns with this account"),
                Offer(type: .offer, icon: "fa-tag", title: "Winter sale — extra 10%", desc: "For card holders · valid until Dec 31"),
            ]
        )

        // ---------- DIRECT: GEKÅS (revolving Mastercard, partner logo) ----------
        let gekas = Product(
            id: "p-gekas-credit-john", name: "Gekås", origin: .direct, type: .credit,
            theme: ProductTheme(brandColor: "#0C5D57", brandColor2: "#3B817A", icon: "fa-credit-card"),
            partnerLogo: "gekas-logo",
            primaryMetric: Metric(label: "Available credit", value: m(22550), sentiment: .positive),
            secondaryMetrics: [
                Metric(label: "Credit limit", value: m(30000)),
                Metric(label: "Available credit", value: m(22550)),
            ],
            accounts: [
                Account(id: "a-gekas-credit-john", type: .creditAccount, name: "Gekås",
                        number: "8602-31 904 5512", ocr: "4490 6612 0044", bankgiro: "5921-3380",
                        subtype: "kort2000",
                        creditLimit: m(30000), usedCredit: m(7450), availableCredit: m(22550)),
            ],
            purchases: [
                Purchase(id: "tgk1", type: .purchase, date: d(-2), merchant: "Gekås Ullared", amount: m(1245), accountId: "a-gekas-credit-john", icon: "fa-basket-shopping"),
                Purchase(id: "tgk2", type: .purchase, date: d(-6), merchant: "ICA Maxi", amount: m(742), accountId: "a-gekas-credit-john", icon: "fa-basket-shopping"),
            ],
            paymentRequests: [
                PaymentRequest(id: "pr-gekascr-nov", invoiceId: "i-gekascr-nov", accountId: "a-gekas-credit-john", productId: "p-gekas-credit-john",
                               kind: .manadsavi, title: "Monthly invoice · Gekås", displayName: "Gekås",
                               description: "This invoice relates to last month's purchases with your Gekås card.",
                               statementBreakdown: [StatementBreakdownItem(label: "Purchases · October", amount: 1290)],
                               remainingAmount: m(1290), originalAmount: m(1290), dueDate: d(12),
                               status: .unpaid, ocr: "4490 6612 0044 3", bankgiro: "5921-3380"),
            ],
            offers: [
                Offer(type: .benefit, icon: "fa-tag", title: "Bonus checks from Gekås", desc: "Earn bonus checks to use on your next purchase"),
            ]
        )

        // ---------- DIRECT: SEGELBÅTEN SAVINGS ----------
        let savings = Product(
            id: "p-savings-john", name: "Segelbåten", origin: .direct, type: .savings,
            theme: ProductTheme(brandColor: "#117069", brandColor2: "#3B817A", icon: "fa-piggy-bank"),
            primaryMetric: Metric(label: "Total savings", value: m(100000), sentiment: .positive),
            secondaryMetrics: [
                Metric(label: "Interest", value: Money(amount: 4, currency: .percent)),
            ],
            accounts: [
                Account(id: "a-sav-flex", type: .depositAccount, name: "Flexible savings",
                        number: "8480-22 100 3300", interestRate: 4.05, balance: m(0)),
                Account(id: "a-sav-fixed", type: .depositAccount, name: "Fixed 12 months",
                        number: "8480-22 100 3301", interestRate: 4.35, balance: m(100000)),
            ],
            purchases: [],
            paymentRequests: [],
            offers: []
        )

        // ---------- DIRECT: BILLÅN PRIVATE LOAN ----------
        let loan = Product(
            id: "p-loan-john", name: "Billån", origin: .direct, type: .loan,
            theme: ProductTheme(brandColor: "#117069", brandColor2: "#3B817A", icon: "fa-coins"),
            primaryMetric: Metric(label: "Remaining debt", value: m(84000), sentiment: .negative),
            secondaryMetrics: [
                Metric(label: "Monthly payment", value: m(2450)),
                Metric(label: "Original loan", value: m(120000)),
            ],
            accounts: [
                Account(id: "a-loan-john", type: .loanAccount, name: "Private loan",
                        number: "8901-22 660 1100", ocr: "4470 6600 1100", bankgiro: "5827-1212",
                        originalAmount: m(120000), remainingBalance: m(84000), interestRate: 6.95,
                        termMonths: 60, monthlyPayment: m(2450), paymentsMade: 15),
            ],
            purchases: [],
            paymentRequests: [],
            offers: []
        )

        // Family v2 clone (editable copy shown in the wallet).
        var familyV2 = family
        familyV2.id = "p-family-v2"
        familyV2.name = "Resurs Family v2"
        familyV2.paymentRequests = [] // v2 clone doesn't drive activity in the slice

        return Persona(
            id: "john",
            name: "John Andersson",
            avatar: "JA",
            products: [family, familyV2, gold, netonnet, bauhaus, ahlens, gekas, savings, loan],
            profile: Profile(
                legalName: "John Erik Andersson",
                address: ["Storgatan 12", "211 24 Malmö", "Sverige"],
                customerId: "32423432",
                preferredName: "John",
                email: "john.andersson@gmail.com",
                phone: "+46 70 781 22 34"
            )
        )
    }()
}
