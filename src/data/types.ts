// src/data/types.ts — strong TypeScript types for the ResursYellow demo-data
// domain. Ported 1:1 from the design prototype's data.js / account-spec.js
// (window.RY_PERSONAS / RY_MERCHANTS / RY_ACCOUNT_SPEC).

import type { ImageSourcePropType } from 'react-native';

// ---------------------------------------------------------------------------
// Money
// ---------------------------------------------------------------------------

/** Integer SEK (no decimals — Resurs rule). '%' is used for rate metrics. */
export type Currency = 'SEK' | '%';

export type Money = {
  amount: number;
  currency: Currency;
};

// ---------------------------------------------------------------------------
// Merchants
// ---------------------------------------------------------------------------

export type PaymentPlanConfig = {
  months: number;
  /** Yearly interest in percent, e.g. 9.95. 0 = interest-free. */
  interestRate: number;
  fee: Money;
};

export type MerchantId = 'bauhaus' | 'netonnet' | 'jula' | 'ahlens' | 'gekas';

export type Merchant = {
  id: MerchantId;
  name: string;
  brandColor: string;
  brandColor2: string;
  iconLetter: string;
  paymentPlanConfigs: PaymentPlanConfig[];
};

// ---------------------------------------------------------------------------
// Product theming
// ---------------------------------------------------------------------------

export type ProductTheme = {
  brandColor: string;
  brandColor2: string;
  /** FontAwesome name in the design's 'fa-*' form. */
  icon: string;
};

export type MetricSentiment = 'positive' | 'negative';

export type Metric = {
  label: string;
  value: Money;
  sentiment?: MetricSentiment;
};

// ---------------------------------------------------------------------------
// Transactions / purchases
// ---------------------------------------------------------------------------

export type TransactionType = 'purchase' | 'refund' | 'fee' | 'withdrawal' | 'other';

export type EcomItem = {
  name: string;
  qty: number;
  price: Money;
};

export type EcomDetail = {
  items: EcomItem[];
  shipping?: string;
};

/**
 * A ledger row — card purchase, refund/payment, fee, deposit-account entry…
 * Rows on deposit accounts have no accountId (they live on the account).
 */
export type Purchase = {
  id: string;
  type: TransactionType;
  /** ISO date YYYY-MM-DD. */
  date: string;
  merchant: string;
  amount: Money;
  accountId?: string;
  /** FontAwesome 'fa-*' name. */
  icon: string;
  /** Sub-label shown under the merchant (e.g. 'Interest', 'Fee', 'Deposit'). */
  subLabel?: string;
  /** Overrides the default amount colour (design uses '#000000' for credits). */
  amountColor?: string;
  /** Cardholder ref for family accounts (matches CreditAccount.cards[].id). */
  user?: string;
  /** Not yet booked — shown in the Preliminary section. */
  preliminary?: boolean;
  /** E-commerce purchase detail (items + shipping). */
  ecomDetail?: EcomDetail;
};

/** Alias — deposit-account rows use the same shape. */
export type Transaction = Purchase;

// ---------------------------------------------------------------------------
// Accounts
// ---------------------------------------------------------------------------

/** Family-account cardholder ref ({ id, name }) — drives the "Users" filter. */
export type AccountCardholder = {
  id: string;
  name: string;
};

/** Physical card details (Cards section on revolving credit accounts). */
export type AccountCardDetails = {
  holder: string;
  last4: string;
  exp: string;
  maskedNumber?: string;
  main?: boolean;
  extra?: boolean;
};

export type AccountCard = AccountCardholder | AccountCardDetails;

export type BonusCheck = {
  id: string;
  amount: Money;
  reference: string;
  /** ISO date — active checks only. */
  expires?: string;
  /** ISO date the check was redeemed — used checks only. */
  used?: string;
};

export type BonusChecks = {
  active: BonusCheck[];
  used: BonusCheck[];
};

/** Family-buffer cashback budget figures (feeds the Family budget overview). */
export type FamilyBudget = {
  thisMonth: Money;
  prevMonth: Money;
  saved: Money;
  daysLeft: number;
  avgPerDay: Money;
};

/** Seeded auto-deposit config (Monthly-deposits flow). */
export type MonthlyDepositConfig = {
  amount: Money;
  mode: 'day' | 'weekday';
  day: number;
  ordinalWeek: number;
  weekday: number;
};

export type CreditAccountSubtype = 'superkonto' | 'kort2000';

export type CreditAccount = {
  id: string;
  type: 'creditAccount';
  subtype?: CreditAccountSubtype;
  /** Merchant store credit (e.g. Åhléns) — affects accountKind(). */
  storeCredit?: boolean;
  name: string;
  number: string;
  ocr?: string;
  bankgiro?: string;
  creditLimit: Money;
  usedCredit: Money;
  availableCredit: Money;
  /** "Purchase to handle this month" (Superkonto). */
  debtThisMonth?: Money;
  /** "Purchase to handle next month" (Superkonto). */
  debtNextMonth?: Money;
  /** Already billed this month (Superkonto). */
  billedThisMonth?: Money;
  /** Not listed in ProductDetailView. */
  hidden?: boolean;
  cards?: AccountCard[];
  /** Partner-branded round logo (e.g. Gekås) for the bonus-check card. */
  partnerLogo?: ImageSourcePropType;
  bonusChecks?: BonusChecks;
};

export type InvoiceAccountOrigin = 'superkontoBreakout' | 'kort2000' | 'flexibleInvoice';

export type InvoiceAccount = {
  id: string;
  type: 'invoiceAccount';
  origin?: InvoiceAccountOrigin;
  status?: 'active' | 'closed';
  name: string;
  number: string;
  ocr?: string;
  bankgiro?: string;
  originalAmount: Money;
  remainingBalance: Money;
  interestRate: number;
  termMonths: number;
  monthlyPayment: Money;
  paymentsMade: number;
  hidden?: boolean;
};

export type DepositAccount = {
  id: string;
  type: 'depositAccount';
  name: string;
  number: string;
  balance: Money;
  interestRate: number;
  /** Savings goal (Family buffer) — makes accountKind() return 'fambuffer'. */
  goalAmount?: Money;
  earnedThisYear?: Money;
  /** ISO date the account was opened. */
  openedDate?: string;
  /** ISO date the current rate applies from. */
  rateDate?: string;
  /** Fixed-term lock date — makes accountKind() return 'fixedsavings'. */
  lockedUntil?: string;
  autoDeposit?: Money;
  /** Enables the Monthly-deposits flow (John only). */
  autoSave?: boolean;
  /** Optional seeded auto-deposit. */
  monthlyDeposit?: MonthlyDepositConfig | null;
  transactions?: Transaction[];
  budget?: FamilyBudget;
  /** Surfaced via the bespoke Family layout, not the default list. */
  hidden?: boolean;
};

export type LoanAccount = {
  id: string;
  type: 'loanAccount';
  name: string;
  number: string;
  ocr?: string;
  bankgiro?: string;
  originalAmount: Money;
  remainingBalance: Money;
  interestRate: number;
  termMonths: number;
  monthlyPayment: Money;
  paymentsMade: number;
  hidden?: boolean;
};

export type Account = CreditAccount | InvoiceAccount | DepositAccount | LoanAccount;

export type AccountType = Account['type'];

// ---------------------------------------------------------------------------
// Invoices & payment requests
// ---------------------------------------------------------------------------

/**
 * Backend invoice/payment-request kinds:
 *  - 'laneavi'      — loan installment invoice
 *  - 'manadsavi'    — monthly statement (revolving credit / Superkonto)
 *  - 'delbetalning' — part-payment plan installment
 *  - 'faktura'      — one-time merchant invoice
 *  - 'kontoavi'     — store-credit account statement
 */
export type PaymentRequestKind = 'laneavi' | 'manadsavi' | 'delbetalning' | 'faktura' | 'kontoavi';

/** Alias — Invoice.type uses the same values. */
export type InvoiceKind = PaymentRequestKind;

/**
 * Payment statuses. Demo data only ships 'unpaid' | 'paid' | 'scheduled';
 * the remaining values are produced by the invoiceStatus tweak override
 * (STATUS_CODE map in the design's app.jsx) and by handled-state logic.
 */
export type PaymentRequestStatus =
  | 'unpaid'
  | 'overdue'
  | 'missed'
  | 'scheduled'
  | 'partiallyPaid'
  | 'paid'
  | 'voided';

export type InvoiceStatus = PaymentRequestStatus;

export type Invoice = {
  id: string;
  accountId: string;
  /** Human period label, e.g. 'November 2025'. */
  period: string;
  amount: Money;
  /** Issue date (ISO). */
  date: string;
  /** Due date (ISO). */
  due: string;
  ocr: string;
  status: InvoiceStatus;
  type: InvoiceKind;
};

/** One row of the monthly-statement breakdown. Amounts are plain SEK numbers. */
export type StatementBreakdownItem = {
  label: string;
  amount: number;
};

/** Payment tier option on a revolving-credit monthly invoice. */
export type PaymentTier = {
  id: string;
  label: string;
  desc: string;
  amount: Money;
  recommended?: boolean;
};

/** Purchase summary attached to one-time merchant invoices. */
export type PaymentRequestPurchase = {
  store: string;
  items: EcomItem[];
};

export type PaymentRequest = {
  id: string;
  invoiceId?: string;
  accountId?: string;
  productId?: string;
  kind: PaymentRequestKind;
  title: string;
  /** Product display name override (e.g. 'Resurs Family Flex'). */
  displayName?: string;
  description?: string;
  statementBreakdown?: StatementBreakdownItem[];
  remainingAmount: Money;
  originalAmount: Money;
  /** ISO due date. */
  dueDate: string;
  /** ISO date the request was paid (paid/scheduled history). */
  paidDate?: string;
  status: PaymentRequestStatus;
  ocr: string;
  bankgiro: string;
  /** Payment tier options (Superkonto monthly invoice). */
  tiers?: PaymentTier[];
  /** One-time merchant invoice purchase detail. */
  purchase?: PaymentRequestPurchase;
  // --- part-payment / loan installment fields ---
  loanAmount?: Money;
  loanRemaining?: Money;
  paymentNo?: number;
  paymentsTotal?: number;
  remainingBalance?: Money;
  originalDebt?: Money;
  interestRate?: number;
  principal?: Money;
  interestPart?: Money;
  /** i18n key overriding the third line of the payment row (e.g. 'inv.invoice'). */
  thirdLineOverride?: string;
};

// ---------------------------------------------------------------------------
// Offers
// ---------------------------------------------------------------------------

export type OfferType = 'benefit' | 'offer' | 'action';

export type Offer = {
  type: OfferType;
  /** FontAwesome 'fa-*' name. */
  icon: string;
  title: string;
  desc: string;
};

// ---------------------------------------------------------------------------
// Family members
// ---------------------------------------------------------------------------

export type FamilyMember = {
  id: string;
  name: string;
  age: number;
  role: string;
  roleTone: 'primary' | 'info';
  access: string;
  /** Adults have an SSN… */
  ssn?: string;
  /** …children have a date of birth. */
  dob?: string;
  /** Avatar index (0-based). */
  avatar: number;
};

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

export type ProductOrigin = 'direct' | 'merchant';

export type ProductType = 'credit' | 'invoice' | 'savings' | 'loan';

/** Dev-state gates a product can be scoped to. */
export type DevState = 'Q1' | 'Q3' | 'Q4';

export type Product = {
  id: string;
  name: string;
  origin: ProductOrigin;
  /** Set when origin === 'merchant'. */
  merchantId?: MerchantId;
  type: ProductType;
  theme: ProductTheme;
  /** Partner-branded round logo on the wallet card (e.g. Gekås). */
  partnerLogo?: ImageSourcePropType;
  monthlyBudget?: Money;
  bonusPoints?: number;
  /** If set, the product only shows in these dev states. */
  devStates?: DevState[];
  primaryMetric: Metric;
  secondaryMetrics: Metric[];
  accounts: Account[];
  purchases: Purchase[];
  invoices: Invoice[];
  paymentRequests: PaymentRequest[];
  offers: Offer[];
  /** Resurs Family only. */
  familyMembers?: FamilyMember[];
};

// ---------------------------------------------------------------------------
// Documents & messages
// ---------------------------------------------------------------------------

export type DocumentType =
  | 'LEGAL/FINANCIAL'
  | 'AGREEMENT'
  | 'TERMS'
  | 'REMINDER'
  | 'REQUEST'
  | 'MARKETING'
  | 'CREDIT_AGREEMENT'
  | 'CONSUMER_LOAN_AGREEMENT'
  | 'COMMON_TERMS'
  | 'SAVINGS_COMMON_TERMS_NATURAL'
  | 'SAVINGS_COMMON_TERMS_LEGAL'
  | 'SAVINGS_SPECIAL_TERMS'
  | 'DEFAULT_SEKKI'
  | 'INDIVIDUAL_SEKKI'
  | 'DEPOSIT_INSURANCE'
  | 'PAYMENT_PROTECTION_INSURANCE'
  | 'SAVINGS_ACCOUNT_APPLICATION'
  | 'ANNUAL_STATEMENT_SAVINGS_ACCOUNT'
  | 'ANNUAL_STATEMENT_PRIVATE_LOAN_ACCOUNT'
  | 'ANNUAL_STATEMENT_OF_FEES';

export type RyDocument = {
  id: string;
  title: string;
  type: DocumentType;
  /** ISO date. */
  date: string;
  /** Shows the teal dot + bold title. */
  unread: boolean;
  /** Surfaced under the "Requested by you" filter. */
  requestedByYou?: boolean;
};

export type RyMessage = {
  id: string;
  subject: string;
  preview: string;
  sender: string;
  /** ISO date. */
  date: string;
  unread: boolean;
  /** Free-text HTML body (Message Admin Portal sendouts). */
  bodyHtml: string;
};

// ---------------------------------------------------------------------------
// Profile & persona
// ---------------------------------------------------------------------------

export type Profile = {
  legalName: string;
  /** Address lines, e.g. ['Storgatan 12', '211 24 Malmö', 'Sverige']. */
  address: string[];
  customerId: string;
  preferredName: string;
  email: string;
  phone: string;
};

export type PersonaId = 'john' | 'bill' | 'kim' | 'eva' | 'maja' | 'alex' | 'lena';

export type Persona = {
  id: PersonaId;
  name: string;
  /** Initials shown in the avatar disc, e.g. 'JA'. */
  avatar: string;
  products: Product[];
  profile: Profile;
  documents: RyDocument[];
  messages: RyMessage[];
};

// ---------------------------------------------------------------------------
// Notification visibility model (RY_NOTIF)
// ---------------------------------------------------------------------------

export type NotifTier = 'high' | 'medium' | 'low';

export type NotifLevelSpec = {
  /** L1 = global nav badge (urgency / genuinely new only). */
  l1: boolean;
  /** L2 = My Resurs section badge ("Messages" / "Documents"). */
  l2: boolean;
  /** L3 = list-view unread dot. */
  l3: boolean;
  tier: NotifTier;
  /** Recency gate in days for L1/L2 (bank messages: 30). */
  recencyDays?: number;
};

/** A doc type, or 'MESSAGE' for bank messages. */
export type NotifContentType = DocumentType | 'MESSAGE';

export type NotifItem = {
  id: string;
  date: string;
  unread?: boolean;
};
