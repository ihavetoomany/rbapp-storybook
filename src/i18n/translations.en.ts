// English dictionary — ported 1:1 from design-reference/i18n.js (T.en).
import type { TranslationDict } from './translations';

export const en: TranslationDict = {
  // Navigation tabs
  'tab.activity': 'To handle',
  'tab.products': 'Wallet',
  'tab.discover': 'Discover',
  'tab.myresurs': 'My Resurs',
  'tab.finances': 'Finances',
  'tab.merchants': 'Merchants',

  // Activity screen
  welcome: 'Welcome',
  'activity.subtitle': 'Handle',

  // Hero
  'hero.label': 'Invoices',
  'hero.label.purchases': 'Purchases',
  'hero.label.savings': 'Budget',
  'hero.sub.savings': (n: number) => 'On ' + n + ' savings account' + (n === 1 ? '' : 's'),
  'hero.sub.overdue': (n: number, tot: number) =>
    n + ' overdue · ' + tot + ' invoice' + (tot === 1 ? '' : 's') + ' to handle',
  'hero.sub.normal': (n: number) => n + ' invoice' + (n === 1 ? '' : 's') + ' to handle',
  'hero.sub.purchases': (n: number) =>
    n + ' purchase' + (n === 1 ? '' : 's') + ' this month.\nNo invoices to handle.',
  'alert.purchases_pending.title': 'Purchases registered — invoices pending',
  'alert.purchases_pending.body':
    'Your purchases have been registered but the invoices have not yet been created.',

  // Sections
  'section.topay': 'To pay',
  'section.handled': 'HANDLED INVOICES',
  'section.explore': 'EXPLORE RESURS',
  'empty.caught_up': "No invoices right now — you're all caught up.",

  // Card third line
  'inv.installment': 'Installment',
  'inv.statement': 'Statement',
  'inv.partpayment': 'Partpayment',
  'inv.account': 'Account invoice',
  'inv.monthly_invoice': 'Monthly invoice',
  'inv.monthly_payment': 'Monthly payment',
  'inv.invoice': 'Invoice',
  'inv.purchase': 'Purchase',
  'inv.pay_now': 'Pay now!',
  'inv.overdue_days': (n: number) => 'Overdue ' + n + ' day' + (n === 1 ? '' : 's'),
  'inv.missed_count': (_n: number) => 'Includes transferred balance',
  'inv.failed_retry': 'Payment failed — retry',
  'inv.scheduled': (a: string | number) => 'Scheduled payment of ' + a + ' kr',
  'inv.part_payment': (a: string | number) => 'Part payment of ' + a + ' kr',
  'inv.full_payment': 'Full payment',
  'inv.paid_partial': (p: string | number, t: string | number) => 'Paid ' + p + ' kr of ' + t + ' kr',
  'inv.part_paid': (r: string | number) => 'Part payment - ' + r + ' kr',
  'inv.invoiced': (a: string | number) => 'Part payment of ' + a + ' kr',
  'inv.paid_full': 'Full payment',
  'inv.added_next': 'Replaced by new invoice',
  'inv.new_coming': 'New invoice coming.',
  'inv.do_not_pay': 'No payment required',

  // Status chip labels (RY_STATUS_STYLES in the design)
  'inv.st.paid': 'Paid',
  'inv.st.scheduled': 'Scheduled',
  'inv.st.snoozed': 'Snoozed',
  'inv.st.partial': 'Partial',
  'inv.st.overdue': 'Overdue',
  'inv.st.missed': 'Missed',
  'inv.st.unpaid': 'Unpaid',
  'inv.st.voided': 'Voided',

  // Payment-request row outcome lines
  'inv.paid_amount': (a: string | number) => 'Paid amount: ' + a + ' kr',
  'inv.new_invoice_created': 'New invoice created',
  'inv.partpayment_amount': (a: string | number) => 'Partpayment (' + a + ' kr)',
  'inv.missed_payment': 'Missed payment',

  // Transaction row
  'tx.convert_to_account': 'Convert to account',
  'tag.part_pay': 'Part Pay',

  // Card date line
  'date.due': (d: string) => 'Due ' + d,
  'date.paid': (d: string) => 'Paid ' + d,
  'date.scheduled': (d: string) => 'Scheduled to ' + d,

  // Tags
  'tag.overdue': 'Pay now',
  'tag.failed': 'Pay now',
  'tag.days_left': (n: number) => n + ' days left',
  'tag.scheduled': 'Scheduled',
  'tag.paid': 'Paid',
  'tag.missed': 'Missed',
  'tag.cancelled': 'Cancelled',
  'tag.pay_now': 'Pay now',
  'tag.missed_payment': 'Overdue',

  // Detail — kind title
  'kind.statement': 'Monthly invoice',
  'kind.merchant': 'Invoice',
  'kind.loan': 'Installment',
  'kind.flex': 'Invoice',

  // Detail — hero labels
  'detail.amount_due': 'Amount due',
  'detail.inv_amount': 'Invoice amount',

  // Detail — sub line by state
  'sub.urgent': (n: number) => 'Due in ' + n + ' days',
  'sub.due': (d: string) => 'Due ' + d,
  'sub.overdue': (n: number) => n + ' days overdue',
  'sub.failed': 'Payment failed',
  'sub.scheduled': (a: string | number, d: string) => 'Scheduled payment of ' + a + ' kr\non ' + d,
  'sub.paid_partial': (p: string | number, t: string | number, d: string) =>
    'Paid ' + p + ' kr of ' + t + ' kr on ' + d,
  'sub.paid_full': (d: string) => 'Paid in full on ' + d,
  'sub.missed': 'Missed — pay now to avoid extra fees',
  'sub.cancelled': (d: string) => 'Cancelled on ' + d,

  // Detail — buttons
  'btn.pay': 'Pay invoice',
  'btn.try_again': 'Try again',
  'btn.change_scheduled': 'Cancel payment',
  'btn.pay_more': 'Pay more',
  'btn.cancel_scheduled': 'Cancel scheduled payment',
  'btn.view_receipt': 'View receipt',

  // Detail — banners (plain text; JSX handled inline with t() for text parts)
  'banner.partpay_pre':
    'Most invoices can be part paid with no interest. Open “Pay Invoice” to spread the cost.',
  'banner.partpay_link': '',
  'banner.partpay_post': '',
  'banner.partpay_upsell_pre': 'You have purchases over 1 000 kr that can be ',
  'banner.partpay_upsell_link':
    'part paid - break out big purchases on your credit card and spread the cost with no interest.',
  'banner.partpay_upsell_post': '',
  'banner.partpay_upsell_title': 'Flex - Choose how to pay',
  'banner.partpay_upsell_body': (n: number) =>
    n +
    ' purchases can be moved to separate invoices with additional payment options. Tap to learn more.',

  // Part-pay overlay
  'partpay_overlay.title': 'Eligible for part payment',
  'partpay_overlay.desc':
    'These purchases are over 1 000 kr and can be broken out into a separate part payment plan with no interest.',
  'partpay_overlay.pick': 'Pick the purchases you want to break out',
  'partpay_overlay.confirm_none': 'Select purchases to continue',
  'partpay_overlay.confirm': (n: number) => 'Break out ' + n + ' purchase' + (n === 1 ? '' : 's'),

  'banner.overdue.title': 'Past due',
  'banner.overdue.body': 'Pay now to avoid fees.',
  'banner.failed.title': "Your payment didn't go through",
  'banner.failed.body': 'No money has left your account. Try again to complete the payment.',
  'banner.scheduled':
    'Payment initiated — funds may already have been debited, awaiting confirmation.',
  'banner.paid_partial': 'A lower amount was paid; the remainder rolls into your next invoice.',
  'banner.paid_full': 'Payment completed.',
  'banner.missed.title': 'Payment missed',
  'banner.missed.body':
    'This invoice is past its due date. Pay now to avoid late fees and protect your credit score.',
  'banner.includes_missed.title': 'Includes a missed payment',
  'banner.includes_missed.body':
    'Part of this amount is a missed payment from last month. Pay before the due date to avoid further fees.',
  'banner.cancelled':
    "This invoice was cancelled. A new invoice is on the way and will appear here once it's issued.",
  'banner.snoozed.title': 'This invoice was snoozed',
  'banner.snoozed.body':
    'You moved the due date forward. It now behaves like any other dated invoice.',
  // Payments-tab header banners (overdue summary / due-soon / part-pay promo)
  'banner.payments.overdue_summary': (n: number) => n + ' invoice' + (n === 1 ? '' : 's') + ' overdue',
  'banner.payments.overdue_body': 'Pay now to avoid late fees and protect your credit score.',
  'banner.payments.due_soon': (n: number) => n + ' day' + (n === 1 ? '' : 's') + ' until next due date',
  'banner.payments.due_soon_body':
    "Did you know most invoices can be part paid with no interest - if you'd like to spread the cost.",
  'banner.payments.partpay_promo': 'Spread the cost of your purchases',
  'banner.payments.partpay_promo_body':
    'Purchases over 1 000 SEK can be part paid with no interest — tap one to set it up.',

  // Detail — snooze info
  'snooze.prev': 'Previous due date',
  'snooze.new': 'New due date',
  'snooze.cost': 'Snooze cost',
  'snooze.length': 'Snooze length',
  'snooze.days': (n: number) => n + ' days',

  // Detail — loan block
  'detail.payment_n_of': (n: number, t: number) => 'Payment ' + n + ' of ' + t,
  'detail.loan_amount': 'Loan amount',
  'detail.remaining': 'Remaining debt',
  'detail.remaining_debt': 'Remaining debt',
  'detail.remaining_balance': 'Remaining balance',

  // Detail — breakdown descriptions
  'desc.loan': (amt: string | number) => 'This invoice relates to your ' + amt + ' kr loan.',
  'desc.partpay': (amt: string | number, name: string) =>
    'This invoice is a part payment on your ' +
    amt +
    ' kr purchase at ' +
    name +
    '. You can see the purchase details on your initial invoice.',
  'desc.statement': (name: string) =>
    'This invoice relates to last month’s purchases with ' +
    name +
    ' and the monthly amount of any ongoing part payment plans from previous statements.',
  'desc.account': (name: string) => 'This invoice relates to your recent purchases at ' + name + '.',
  'desc.invoice': (amt: string | number, name: string) =>
    'This invoice relates to your ' + amt + ' kr purchase at ' + name + '.',

  // Detail — payment info
  'payinfo.title': 'Payment information',
  'payinfo.ocr': 'OCR',
  'payinfo.bankgiro': 'Bankgiro',
  'payinfo.due': 'Due date',
  'payinfo.pdf': 'View PDF invoice',

  // Detail — services
  'svc.title': 'Services',
  'svc.snooze': 'Snooze',
  'svc.snooze_sub': 'Move the due date forward',
  'svc.product': 'Product page',
  'svc.report': 'Report a problem',

  // Promo card
  'promo.loan.label': 'Private loan',
  'promo.loan.headline': 'When bigger expenses\ncome all at once',
  'promo.loan.desc': 'Spread larger costs into manageable monthly payments.',
  'promo.loan.cta': 'See your options',

  // Monthly deposits flow
  'md.funds_note': 'Funds will be withdrawn from your Nordea account (****1234) via autogiro.',
  'md.deposit_amount': 'Deposit amount',
  'md.amount_placeholder': 'Enter monthly deposit amount',
  'md.deposit_date': 'Deposit date',
  'md.day_of_month': 'Day of month',
  'md.on_the': 'On the',
  'md.range': '(1–28)',
  'md.done': 'Done',
  'md.cancel': 'Cancel',
  'md.set_up': 'Set up deposit',
  'md.update': 'Update deposit',
  'md.stop_row': 'Stop monthly deposit',
  'md.repeat': (r: string) => 'Your deposit will repeat ' + r + '.',
  'md.upcoming': (d: string) => 'Upcoming deposit: ' + d,
  'md.opt.direct': 'Direct deposit',
  'md.opt.direct_sub': 'Instant transfer with open banking',
  'md.opt.bank': 'Bank deposit',
  'md.opt.bank_sub': 'Manual transfer, 1 banking day',
  'md.opt.monthly': 'Monthly deposits',
  'md.opt.monthly_sub': 'Automatic deposits with autogiro',
  'md.title.options': 'How would you like to deposit your funds?',
  'md.title.setup': 'Monthly deposits',
  'md.title.edit': 'Edit monthly deposit',
  'md.title.bank': 'Bank deposit',
  'md.bank.intro':
    'Transfer money from your own bank to the bankgiro below. Add the reference so we can match the payment to your savings account. Funds normally arrive within 1 banking day.',
  'md.bank.recipient': 'Recipient',
  'md.bank.recipient_val': 'Resurs Bank AB',
  'md.bank.bankgiro': 'Bankgiro',
  'md.bank.reference': 'Reference',
  'md.bank.account': 'Savings account',
  'md.bank.copied': 'Copied',
  'md.bank.done': 'Done',
  'md.success.title': 'Monthly deposit activated',
  'md.success.body': (amt: string, date: string, r: string) =>
    'Your automatic deposit of ' + amt + ' will start on ' + date + ' and repeat ' + r + '.',
  'md.success.note':
    'You can change or cancel this deposit anytime in the savings account overview.',
  'md.summary.permonth': (amt: string) => amt + ' / month',
  'md.summary.every': (e: string) => 'Every ' + e + ' · from Nordea',
  'md.stop.title': 'Stop monthly deposit?',
  'md.stop.body': (amt: string, r: string) =>
    'This will stop all future automatic deposits of ' + amt + ' scheduled ' + r + '.',
  'md.stop.keep': 'Keep deposit',
  'md.stop.confirm': 'Stop deposit',

  // My Resurs tab
  'mr.account': 'Account',
  'mr.title': 'My Resurs',
  'mr.support_subtitle': 'Your profile, messages and settings.',
  'mr.chat': 'Chat',
  'mr.profile_sub': 'Edit your contact information',
  'mr.messages': 'Messages',
  'mr.messages_sub': 'Messages from the bank',
  'mr.messages_q3': 'Messages from the bank',
  'mr.messages_q3_sub': 'Latest news and messages',
  'mr.unread': (n: number) => n + ' unread',
  'mr.documents': 'Documents',
  'mr.documents_sub': 'Requested documents, agreements and contracts',
  'mr.documents_q3': 'My documents',
  'mr.documents_q3_sub': 'Agreements and contracts',
  'mr.new': (n: number) => n + ' new',
  'mr.knowledge': 'Customer knowledge',
  'mr.knowledge_sub': 'Update your answers',
  'mr.cancel_agreement': 'Cancel credit agreement',
  'mr.cancel_agreement_sub': 'How to utilize your cancellation right',
  'mr.section.support': 'Support',
  'mr.support_desc':
    "You'll be redirected to an external page. Remember to log out from the app/onlinebank.",
  'mr.faq': 'FAQ',
  'mr.faq_sub': 'Frequently asked questions and answers.',
  'mr.send_msg': 'Send a message',
  'mr.send_msg_sub': "We'll answer you within 3-4 banking days.",
  'mr.tickets': 'My support tickets',
  'mr.tickets_sub': 'View and track your support cases.',
  'mr.section.payment': 'Payment settings',
  'mr.connect_bank': 'Connect bank account',
  'mr.connect_bank_sub': 'Add bank account to pay invoices',
  'mr.section.general': 'General settings',
  'mr.notifications': 'Notifications',
  'mr.notifications_sub': 'Settings for reminders and communication',
  'mr.theme': 'Theme',
  'mr.theme_light': 'Light mode',
  'mr.language': 'Language',
  'mr.language_value': 'English',
  'mr.logout': 'Log out',
  'help.title': 'Need help?',
  'help.sub': 'Chat with us or read FAQ',
  'help.chat': 'Open chat',
  'help.chat_sub': 'Opening hours mon-fri 8-16',

  // ── Close-account / terminate-agreement flow ──
  'ca.cancel': 'Cancel',
  'ca.svc.hint': (l: string) => 'Tap “' + l + '” to start the flow',
  'ca.ins.hint': (l: string) => 'Tap “' + l + '” to open the details',
  'ca.svc.title': 'Services',
  'ca.svc.close': 'Close account',
  'ca.svc.pay_extra': 'Pay extra',
  'ca.svc.change_limit': 'Change credit limit',
  'ca.svc.deposit': 'Deposit',
  'ca.svc.withdraw': 'Withdraw',
  'ca.svc.manage': 'Manage insurance',
  'ca.info.title': 'Termination of agreement',
  'ca.info.intro': 'What happens when you terminate your agreement:',
  'ca.info.happens.b1':
    'Nothing will be terminated until you confirm the termination. You can cancel at any time.',
  'ca.info.happens.b2':
    'Once the termination has been processed and the agreement is ended, you will lose access to the service. This means that the card and the credit linked to the agreement can no longer be used. A new application is required if you wish to use the service again.',
  'ca.info.oblig.title': 'Your obligations remain:',
  'ca.info.oblig.b1':
    'Any outstanding debt must be repaid in accordance with the terms of the agreement. Interest and fees may be charged until the debt has been fully repaid.',
  'ca.info.oblig.b2':
    'Outstanding transactions still apply. Purchases and other transactions that have been made but not yet posted may therefore still be charged to the account.',
  'ca.info.before.title': 'Before you close your account',
  'ca.info.before.sub': 'Please review the following important information',
  'ca.info.before.b1': 'Any benefits and bonuses linked to the agreement will cease.',
  'ca.info.before.b2': 'Any insurance linked to the service will be terminated.',
  'ca.info.footer':
    'Make sure that any outstanding debt can be repaid to Resurs Bank in accordance with the terms of the agreement. Full terms and conditions are available in the general terms and conditions, which you can find under your account.',
  'ca.info.cta': 'Continue with Contract Termination',
  'ca.info.placeholder': 'Information for this product will be added here.',
  'ca.back': 'Back',
  'ca.info.title.loan': 'Termination of loan',
  'ca.info.intro.loan': 'What happens when you terminate your loan agreement:',
  'ca.info.footer.short':
    'Full terms and conditions are available in the general terms and conditions, which you can find under your account.',
  'ca.know.title': 'Important to know',
  'ca.before2.title': 'Before you continue',
  'ca.dep.happens.b1':
    'Once the termination has been processed the account is closed. This means you can no longer use the account or the services linked to it. A new application is required if you want the service again.',
  'ca.dep.happens.b2':
    'Any remaining balance and interest are paid out to your pre-registered payout account in accordance with the terms of the agreement.',
  'ca.dep.happens.b3':
    'Nothing is closed until you confirm the termination. You can cancel at any time.',
  'ca.dep.know.b1':
    'Interest is calculated in accordance with the terms of the agreement until the account is closed and the money is paid out.',
  'ca.dep.know.b2':
    'Special terms may apply to some savings accounts, for example terms regarding lock-in period, withdrawals or fees.',
  'ca.dep.before.sub':
    'Optional - but recommended. It does not prevent the agreement from being terminated.',
  'ca.dep.before.b1': 'Check which account the money should be paid out to.',
  'ca.dep.before.b2': 'Make sure you do not need the account for future savings.',
  'ca.loan.happens.b1': 'When you continue, a request to terminate the loan is sent.',
  'ca.loan.happens.b2':
    'The loan is not closed until the entire remaining debt has been repaid in accordance with the agreement and applicable terms.',
  'ca.loan.happens.b3':
    'Nothing happens until you confirm the termination. You can cancel at any time.',
  'ca.loan.know.b1':
    'You have the right to repay the entire loan early. On request you will be given the amount required to settle the loan in full.',
  'ca.loan.know.b2':
    'If the loan is not settled in full, repayment continues according to your payment plan.',
  'ca.loan.know.b3': 'Interest and any fees are charged until the loan has been fully repaid.',
  'ca.loan.rights.title': 'Rights that cease',
  'ca.loan.rights.b1': 'You cannot make changes to the loan',
  'ca.loan.rights.b2': 'Any benefits or terms linked to the loan cease',
  'ca.otc.happens.b1':
    'Nothing is closed until you confirm the termination. You can cancel at any time.',
  'ca.otc.happens.b2': 'Once the termination has been processed, the agreement is terminated.',
  'ca.otc.happens.b3': 'Any campaigns or offers linked to the credit may cease.',
  'ca.otc.oblig.title': 'Your obligation remains',
  'ca.otc.oblig.b1': 'Any debt must be paid in accordance with the terms of the agreement.',
  'ca.otc.oblig.b2': 'Interest and fees may be charged until the debt has been fully repaid.',
  'ca.otc.before.sub': 'Optional - but recommended. This does not affect your termination.',
  'ca.otc.before.b1':
    'Make sure any debt can be paid to Resurs Bank in accordance with the terms of the agreement.',
  'ca.ins.section': 'Insurances',
  'ca.ins.name': 'Payment protection insurance',
  'ca.ins.cancel_cta': 'Cancel payment insurance',
  'ca.ins.dialog_placeholder': 'Insurance information is shown here.',
  'ca.ins.title': 'Terminate payment protection insurance agreement',
  'ca.ins.intro': 'What does termination mean?',
  'ca.ins.p1':
    'Nothing will happen until you confirm the termination. You can cancel at any time.',
  'ca.ins.p2':
    'Once the termination has been processed, the insurance will be terminated in accordance with the insurance terms.',
  'ca.ins.lead': 'This means, among other things, that:',
  'ca.ins.card.b1':
    'You will no longer be covered by the insurance for events that occur after the insurance has ended.',
  'ca.ins.card.b2':
    'The right to any compensation for events that occurred before the insurance was terminated will be assessed in accordance with the insurance terms. The assessment may depend, among other things, on when the qualifying event occurred.',
  'ca.ins.card.b3':
    'Any remaining premium will be charged in accordance with the insurance terms.',
  'ca.ins.before.sub': 'The following is optional and does not prevent you from continuing:',
  'ca.ins.before.b1': 'Check whether you will need the insurance cover going forward.',
  'ca.ins.before.b2': 'Compare with any other insurance cover you may have.',
  'ca.ins.footer': 'Full terms and conditions are available in the insurance terms.',
  'ca.verify.title': 'Verify email',
  'ca.verify.intro':
    "To cancel your agreement we need to confirm that the email on file is yours. We'll send a 6-digit code by email.",
  'ca.verify.card.title': 'Verify your email to continue',
  'ca.verify.card.sub': "We'll send your confirmation to the address below.",
  'ca.verify.email_label': 'Email',
  'ca.verify.verify': 'Verify',
  'ca.verify.verified': 'Verified',
  'ca.verify.change': 'Change email',
  'ca.email.title': 'Change email',
  'ca.email.label': 'Email address',
  'ca.email.sub':
    'Enter the email address where we should send your confirmation. You will need to verify the new address.',
  'ca.email.save': 'Save email',
  'ca.email.invalid': 'Enter a valid email address.',
  'ca.verify.continue': 'Continue',
  'ca.code.title': 'Enter the code',
  'ca.code.sub': 'Enter the 6-digit code we sent to your email.',
  'ca.code.resend': 'Resend code',
  'ca.reason.intro':
    "Your request to terminate the agreement and close the associated account will be registered as a case under My support cases. You'll receive an email when there's an update to your case.",
  'ca.reason.acct_title': 'Account information',
  'ca.reason.label': 'Reason for termination',
  'ca.reason.placeholder': 'Select a reason from the list *',
  'ca.reason.processing': 'Processing time: We normally handle your case within 1-3 banking days',
  'ca.reason.confirm':
    'I confirm that I want to terminate the agreement above and that I have read the information about what the termination entails.',
  'ca.reason.submit': 'Send request',
  'ca.reason.opt1': "I don't need this product anymore",
  'ca.reason.opt2': 'The fees/cost are too high',
  'ca.reason.opt3': 'I had a bad customer experience',
  'ca.reason.opt4': 'I found a better option somewhere else',
  'ca.reason.opt5': 'My personal situation has changed',
  'ca.reason.opt6': 'I am not happy with the product',
  'ca.reason.opt7': 'Other',
  'ca.acct.debt': 'Debt',
  'ca.acct.credit_limit': 'Credit limit',
  'ca.acct.balance': 'Balance',
  'ca.acct.remaining': 'Remaining debt',
  'ca.acct.product': 'Product',
  'ca.success.title': 'Request to terminate agreement submitted',
  'ca.success.case': 'Case created',
  'ca.success.product': 'Product',
  'ca.success.processing': 'Processing time',
  'ca.success.processing_val': '1-3 banking days',
  'ca.success.track':
    'Track the case under My support cases. You will receive an email when there is an update in your case.',
  'ca.success.close': 'Close',

  // ── Right of withdrawal flow ──────────────────────────────────────
  // Entry (My Resurs menu)
  'wd.menu.section': 'My agreements',
  'wd.menu.cancel': 'Cancel credit agreement',
  'wd.menu.cancel_sub': 'Exercise your right of withdrawal',
  'wd.menu.hint': 'Tap “Cancel credit agreement” to start the flow',
  // Overview
  'wd.title': 'Withdraw from an agreement',
  'wd.overview.intro1':
    'As a private individual, you have the right to withdraw from your agreement within 14 days from the date the agreement was entered into.',
  'wd.overview.intro2':
    'You exercise your right of withdrawal by notifying Resurs Bank. Once the right of withdrawal is exercised, the agreement ceases to apply. What has already been carried out under the agreement must be reversed and settled in accordance with the terms applicable to the respective agreement.',
  'wd.overview.return':
    'If you wish to return a product but not withdraw from your agreement, you need to contact the store where you made your purchase.',
  'wd.overview.select': 'Select the agreement you want to withdraw from:',
  'wd.overview.hint': 'Tap an agreement to open its withdrawal page',
  'wd.overview.empty': 'You currently have no agreements that can be withdrawn from.',
  'wd.chip.processing': 'Processing',
  // Information page (per-product)
  'wd.info.cta': 'Confirm',
  // Verify email (shared with the inline card + code sub-view)
  'wd.verify.title': 'Verify your email',
  'wd.verify.card.title': 'Verify your email to continue',
  'wd.verify.card.sub': 'We will send your confirmation to the address below.',
  'wd.verify.email_label': 'Email',
  'wd.verify.verify': 'Verify',
  'wd.verify.verified': 'Verified',
  'wd.verify.change': 'Change email',
  'wd.email.title': 'Change email',
  'wd.email.label': 'Email address',
  'wd.email.sub':
    'Enter the email address where we should send your confirmation. You will need to verify the new address.',
  'wd.email.save': 'Save email',
  'wd.email.invalid': 'Enter a valid email address.',
  'wd.code.title': 'Enter the code',
  'wd.code.sub': 'Enter the 6-digit code we sent to your email.',
  'wd.code.resend': 'Resend code',
  // Agreement details card
  'wd.agr.title': 'The agreement you are withdrawing from:',
  'wd.agr.product': 'Product',
  'wd.agr.provider': 'Credit provider',
  'wd.agr.provider_val': 'Resurs Bank',
  'wd.agr.date': 'Date',
  'wd.agr.credit_limit': 'Credit limit',
  'wd.agr.purchase_amount': 'Purchase amount',
  'wd.agr.store': 'Store',
  // Confirmation checkbox
  'wd.confirm':
    'I confirm that I wish to exercise my right of withdrawal regarding the agreement above and that I am liable for payment in accordance with the agreement and applicable terms.',
  // Credit-account information copy (authored)
  'wd.credit.title': 'When you withdraw from your agreement',
  'wd.credit.p1':
    'When you notify Resurs Bank that you wish to exercise your right of withdrawal, the agreement ceases to apply.',
  'wd.credit.p2':
    'The right of withdrawal applies to the agreement entered into and does not cover individual withdrawals, payments, transactions, transfers or other services carried out during the term of the agreement. The right of withdrawal also does not apply to actions already performed by Resurs Bank at your request before you notified your withdrawal.',
  'wd.credit.p3_b': 'Have you used the credit?',
  'wd.credit.p3':
    ' A final invoice will then be issued for the amount you have used, as well as the accrued interest for the period during which the credit was provided and up until repayment is made.',
  'wd.credit.p4':
    'Repayment must be made within 30 days from the date you notified Resurs Bank.',
  'wd.credit.p5':
    'Resurs Bank will refund any fees you have paid within 30 days, except for fees that Resurs Bank is legally entitled to retain.',
  'wd.credit.p6_b': 'Do you have payment protection insurance linked to your instalment plan?',
  'wd.credit.p6':
    ' When you exercise your right of withdrawal, the insurance agreement will also cease to apply. Paid insurance premiums will be refunded with a deduction for the time the insurance has been in effect. Any unpaid premium for the corresponding period will be charged on the final invoice.',
  // Savings / deposit information copy
  'wd.sav.p3':
    'Any funds held in the account will be paid out to your pre-registered payout account within 30 days from the date you notify Resurs Bank, unless otherwise stipulated in the agreement or by applicable law.',
  // Loan information copy
  'wd.loan.q1_b': 'Has the loan been disbursed?',
  'wd.loan.q1':
    ' A final invoice will then be issued for the disbursed loan amount, as well as the accrued interest for the period during which the credit was provided and until repayment is made. Repayment must be made within 30 days from the date you notified Resurs Bank.',
  'wd.loan.q2_b': 'Do you have payment protection insurance linked to your loan?',
  'wd.loan.q2':
    ' When you exercise your right of withdrawal, the insurance agreement will also cease to apply. Paid insurance premiums will be refunded with a deduction for the time the insurance has been in effect. Any unpaid insurance premium for the corresponding period will be charged on the final invoice.',
  // One-off purchase (OTC) information copy
  'wd.otc.notcov_b': 'Credits not covered by the right of withdrawal',
  'wd.otc.notcov':
    'The right of withdrawal does not apply to interest-free overdraft facilities that are not subject to more than an insignificant charge and that must be repaid within three months, or to overdraft facilities that must be repaid on demand or within three months.',
  // Insurance information copy
  'wd.ins.p1':
    'When you notify Resurs Bank that you wish to exercise your right of withdrawal, the insurance agreement ceases to apply.',
  'wd.ins.q1_b': 'Have you paid the insurance premium?',
  'wd.ins.q1':
    ' Any premium paid will be refunded with a deduction for the time the insurance has been in effect. The refund will be made within 30 days from the date you notified Resurs Bank.',
  'wd.ins.q2_b': 'Have you not paid the insurance premium?',
  'wd.ins.q2':
    ' The premium for the period during which the insurance has been in effect will be charged by issuing a final invoice. Payment must be made within 30 days from the date you notified Resurs Bank.',
  'wd.ins.notcov_b': 'Insurance not covered by the right of withdrawal.',
  'wd.ins.notcov':
    ' The right of withdrawal does not apply to insurance agreements with an agreed term of one month or less.',
  // Success
  'wd.success.title': 'Request submitted',
  'wd.success.sub':
    'This is your confirmation that we have received your request to exercise your right of withdrawal.',
  'wd.success.track':
    'You will receive a confirmation by email with a link to your case. You can also track your case under My support cases in My Resurs.',
  'wd.success.close': 'Close',
  // Processing base dialog
  'wd.proc.title': 'Your withdrawal request is being processed',
  'wd.proc.body':
    'Your case is being handled. You will receive an email when your case is updated. You can follow the case under My support cases in My Resurs.',
  'wd.proc.close': 'Close',
  'wd.cancel': 'Cancel',

  // activity screens
  'activity.empty_intro':
    "If you've recently applied for a product or made a purchase, it may take a little while to appear here. In the meantime, explore our products below.",
  'activity.sub.savings': 'Savings overview',
  'activity.sub.latest_purchase': 'Latest purchase',
  'activity.sub.topay': 'To pay',
  'activity.support.empty': 'Your invoices and purchases will appear here.',
  'activity.support.purchases': (n: number) =>
    "You've made " + n + ' purchase' + (n === 1 ? '' : 's') + ' this week',
  'activity.support.invoices': (n: number) =>
    'You have ' + n + ' invoice' + (n === 1 ? '' : 's') + ' to handle',
  'summary.total_label': 'Total amount to handle',
  'summary.hint': 'See more payment options under each invoice',
  'section.start': 'Start with Resurs',
  'section.popular': 'Popular stores',
  'section.handled_short': 'Handled',
  'merchant.upto_months': (m: number) => 'Up to ' + m + ' months part payment',
  'empty.topay.title': 'Nothing to pay right now',
  'empty.topay.desc': 'When you have invoices, they will appear here.',
  'empty.purchases.title': 'No purchases yet',
  'empty.purchases.desc': 'Card purchases and store invoices will show up here.',
  'explore.savings.title': 'Savings account',
  'explore.savings.sub': 'Up to 4.05% interest, free withdrawals',
  'explore.loan.title': 'Private loan',
  'explore.loan.sub': 'From 5.95% — no collateral required',
  'explore.card.title': 'Resurs Mastercard',
  'explore.card.sub': 'Pay now or pay later — your choice',
  'inv.partpay_n_of': (n: number, tot: number) => 'Part payment ' + n + ' of ' + tot,
  'inv.includes_overdue': 'Includes overdue balance',
  'detail.original_amount': 'Original amount',
  'detail.principal': 'Principal',
  'detail.interest': 'Interest',
  'detail.this_payment': 'This payment',
  'detail.total': 'Total',
  'detail.awaiting_invoice':
    'We are awaiting an invoice from the merchant. Payment details will appear here once it has been received.',
  'ah.subtitle': 'Activity',
  'ah.support.clear': "Nothing to pay right now — you're all caught up.",
  'ah.support.overdue': (n: number) =>
    n + ' invoice' + (n > 1 ? 's' : '') + ' overdue — action needed',
  'ah.support.count': (n: number) => n + ' invoice' + (n !== 1 ? 's' : '') + ' to handle',
  'ah.label.overdue': 'Overdue',
  'ah.label.tohandle': 'To handle',
  'ah.sub.options': 'Payment options available',
  'ah.section.needs': 'Needs attention',
  'ah.section.explore': 'Explore',
  'ah.empty.future': 'Future invoices will appear here',
  'ah.promo.cta': 'Explore how it works',
  'ihb.label.savings': 'Savings',
  'ihb.label.overdue': 'Overdue',
  'ihb.label.topay': 'To pay',
  'ihb.label.invoices': 'Invoices',
  'ihb.savings_sub': 'Total saved · 4.05% interest',
  'ihb.clear': 'Looking good!',
  'ihb.sub.count_next': (c: number, when: string) =>
    c + ' invoice' + (c === 1 ? '' : 's') + ' · next due ' + when,
  'ihb.when.today': 'today',
  'ihb.when.tomorrow': 'tomorrow',
  'ihb.when.in_days': (n: number) => 'in ' + n + ' days',
  'ihb.sub.history': 'All paid — view your history',
  'ihb.sub.nothing': 'Nothing to pay right now',
  'ihb.go.handle': 'Handle invoices',
  'ihb.go.view': 'View invoices',
  'ph.sub.week': (n: number) => n + ' purchase' + (n === 1 ? '' : 's') + ' this week',
  'ph.sub.latest': (m: string) => 'Latest: ' + m,
  'ph.sub.none': 'No recent activity',
  'ph.go': 'View purchases',
  'car.explore.label': 'Explore',
  'car.explore.body': 'Have a look around and see what Resurs can help you with.',
  'car.section.products': 'My products',
  'car.show_more': (n: number) => 'Show ' + n + ' more',
  'car.show_less': 'Show less',
  'sg.title': 'Savings',
  'sg.total': 'Total savings',
  'sg.accounts': 'Accounts',
  'sg.interest': (r: string | number) => r + '% interest',
  'sg.locked': (d: string) => 'locked to ' + d,
  'il.title': 'Invoices',
  'pl.title': 'Purchases',
  'plc.purchases_month': (n: number, amt: string) => n + ' purchases this month · ' + amt + ' kr',
  'plc.no_tx': 'No transactions',
  'plc.no_tx_since': (d: string) => 'No transactions since ' + d,

  // shell screens — login / my-resurs tweaks entry / tweaks screen / inbox / notifications
  'mr.section.tweaks': 'Prototype',
  'mr.tweaks': 'Tweak settings',
  'mr.tweaks_sub': 'Personas, layouts and demo data',

  'login.hero1': 'Loans, payments,',
  'login.hero2': 'savings and cards.',
  'login.sub': 'All in one bank. Flexible and in control.',
  'login.bankid_open': 'Open the BankID app',
  'login.bankid_hint': 'Start the BankID app and tap the QR icon.',
  'login.cancel': 'Cancel',
  'login.cta': 'Log in',
  'login.more': 'More options and cookies',

  'profile.title': 'My profile',
  'profile.contact_section': 'Contact information',
  'profile.customer_id': 'Customer ID',
  'profile.preferred_name': 'Preferred name',
  'profile.email': 'Email',
  'profile.phone': 'Phone',

  'docs.title': 'Documents',
  'docs.empty': 'No documents in this category.',
  'docs.filter.all': 'All',
  'docs.filter.reminder': 'Payment reminder',
  'docs.filter.requested': 'Requested by you',
  'docs.filter.contracts': 'Contracts',
  'docs.filter.news': 'News',
  'msgs.empty': 'No messages.',
  'msg.title': 'Message',

  'doctype.LEGAL/FINANCIAL': 'Legal / financial',
  'doctype.AGREEMENT': 'Agreement',
  'doctype.TERMS': 'Terms',
  'doctype.MESSAGE': 'Message',
  'doctype.MARKETING': 'Marketing',
  'doctype.REMINDER': 'Payment reminder',
  'doctype.REQUEST': 'Requested by you',
  'doctype.DEPOSIT_INSURANCE': 'Deposit insurance',
  'doctype.SAVINGS_COMMON_TERMS_NATURAL': 'Savings — general terms (private)',
  'doctype.SAVINGS_COMMON_TERMS_LEGAL': 'Savings — general terms (business)',
  'doctype.SAVINGS_SPECIAL_TERMS': 'Savings — special terms',
  'doctype.DEFAULT_SEKKI': 'Standard credit information (SEKKI)',
  'doctype.INDIVIDUAL_SEKKI': 'Individual credit information (SEKKI)',
  'doctype.CREDIT_AGREEMENT': 'Credit agreement',
  'doctype.CONSUMER_LOAN_AGREEMENT': 'Consumer loan agreement',
  'doctype.COMMON_TERMS': 'Common terms',
  'doctype.SAVINGS_ACCOUNT_APPLICATION': 'Savings account application',
  'doctype.ANNUAL_STATEMENT_SAVINGS_ACCOUNT': 'Annual statement — savings account',
  'doctype.ANNUAL_STATEMENT_PRIVATE_LOAN_ACCOUNT': 'Annual statement — private loan',
  'doctype.ANNUAL_STATEMENT_OF_FEES': 'Annual statement of fees',
  'doctype.PAYMENT_PROTECTION_INSURANCE': 'Payment protection insurance',

  'notif.title': 'Notifications',
  'notif.mark_all': 'Mark all as read',
  'notif.rates_title': 'Updated interest rates',
  'notif.rates_desc': 'New savings and lending rates apply from 1 Dec 2025.',
  'notif.hours_title': 'Holiday opening hours',
  'notif.hours_desc': 'Customer service has reduced hours over the holidays.',
  'notif.hours_when': '2 days ago',

  'tweaks.title': 'Tweaks',
  'tweaks.section.prototype': 'Prototype',
  'tweaks.section.sandbox': 'Sandbox',
  'tweaks.section.session': 'Session',
  'tweaks.reset': 'Reset',
  'tweaks.persona': 'Persona',
  'tweaks.invoice_status': 'Invoice status',
  'tweaks.language': 'Language',
  'tweaks.family_version': 'Family version',
  'tweaks.dark_theme': 'Dark theme',
  'tweaks.seed_deposit': 'Seed monthly deposit',
  'tweaks.confirm_pay': 'Confirm payment',
  'tweaks.activity': 'Activity',
  'tweaks.wallet_layout': 'Wallet layout',
  'tweaks.login_layout': 'Login layout',
  'tweaks.back_to_login': '← Back to login',
  'tweaks.persona.John':
    'John — Resurs Family (Superkonto), Bauhaus & NetOnNet merchant cards, savings + car loan. Invoices to pay AND handled invoices. Family account with partner and kids.',
  'tweaks.persona.Bill': 'Bill — No invoices to pay, has savings account.',
  'tweaks.persona.Kim': 'Kim — One invoice to pay, no handled invoices.',
  'tweaks.persona.Eva': 'Eva — No products yet.',
  'tweaks.persona.Maja': 'Maja — Has made purchases but there is no invoice to pay.',
  'tweaks.persona.Alex': 'Alex — Two invoices to pay, none handled.',
  'tweaks.persona.Lena': 'Lena — Two handled invoices.',

  // flows — bonus checks (strings hardcoded English in the design JSX)
  'bc.title': 'Bonus checks',
  'bc.tab.active': 'Active',
  'bc.tab.used': 'Used',
  'bc.expires': (d: string) => 'Expires ' + d,
  'bc.usedline': (d: string) => 'Used ' + d,
  'bc.valid_until': (d: string) => 'Valid until ' + d,
  'bc.reference': (r: string) => 'Reference nr: ' + r,
  'bc.sheet.title': 'Bonus check',
  'bc.sheet.title_n': (i: number, n: number) => 'Bonus check (' + i + '/' + n + ')',
  'bc.download': 'Download',
  'bc.the_partner': 'the partner',
  'bc.empty.active.title': 'No active bonus checks',
  'bc.empty.active.body': 'When you receive a bonus check, it will appear here.',
  'bc.empty.used.title': 'No used bonus checks yet',
  'bc.empty.used.body': "When you've used a bonus check, it will appear here.",
  'bc.terms.p1': (partner: string) =>
    'This bonus check is valid as a means of payment at ' +
    partner +
    ' and can only be used in its entirety at a single purchase.',
  'bc.terms.p2': 'Expired or used bonus checks will not be replaced.',
  'bc.terms.p3':
    'If you have questions about bonus points or bonus checks, you can easily chat with our administrators via the Resurs app or in the online bank at resursbank.se.',

  // payment sheet
  'rc.select_amount': 'Select amount',
  'rc.change_amount': 'Change amount',
  'rc.confirm_payment': 'Confirm payment',
  'rc.fallback_product': 'Resurs account',
  'rc.stop.min': 'Minimum',
  'rc.stop.m12': '12 months',
  'rc.stop.m6': '6 months',
  'rc.stop.m3': '3 months',
  'rc.stop.full': 'Full amount',
  'rc.tier.plan.full': (full: string) =>
    'Pays the full invoice of ' +
    full +
    ' kr now. No interest and no payment plan — this purchase is settled.',
  'rc.tier.plan.months': (amount: string, rest: string, months: number) =>
    'Pay ' +
    amount +
    ' kr now and split the remaining ' +
    rest +
    ' kr into a ' +
    months +
    '-month plan, interest free. Admin fee 39 kr per month.',
  'rc.tier.plan.min': (amount: string, rest: string, rate: number) =>
    'Pays ' +
    amount +
    ' kr now. The remaining ' +
    rest +
    ' kr moves to a ' +
    rate +
    "% interest plan until it's cleared.",
  'rc.tier.custom.title': 'Custom amount',
  'rc.tier.fixed.body': (fixed: string) =>
    'Adjust the amount if needed. The agreed installment is ' +
    fixed +
    ' kr. Paying more reduces your remaining balance faster.',
  'rc.tier.min.title': 'Minimum payment',
  'rc.tier.min.body': (min: string, rest: string, rate: number) =>
    "Covers this month's required minimum of " +
    min +
    ' kr. The remaining ' +
    rest +
    ' kr moves to a ' +
    rate +
    "% interest plan — you'll pay interest on the unpaid portion each month until it's cleared.",
  'rc.tier.slow.body': (rest: string, rate: number) =>
    'Pays more than the minimum but less than one sixth of the statement. The unpaid ' +
    rest +
    ' kr moves to a ' +
    rate +
    '% interest plan and accrues interest each month until cleared.',
  'rc.tier.sixmo.title': '6 months',
  'rc.tier.sixmo.body': (sixmo: string) =>
    "Covers any ongoing payment plans and splits last month's expenses into 6 equal monthly payments of " +
    sixmo +
    ' kr with no interest. Setup fee 0 kr, admin fee 39 kr per month.',
  'rc.tier.partial.body': (amount: string, rest: string) =>
    'Covers any ongoing payment plans plus ' +
    amount +
    " kr towards last month's expenses. The remaining " +
    rest +
    ' kr is split into equal monthly amounts over 6 months with no interest.',
  'rc.tier.full.title': 'Pay in full',
  'rc.tier.full.body': (balance: string) =>
    'Clears the entire statement of ' +
    balance +
    ' kr for this billing period. No interest, no payment plan, and your credit line stays open for future purchases.',
  'rc.tier.topup.title': 'Top up',
  'rc.tier.topup.body': (extra: string) =>
    'Pays the full statement plus an extra ' +
    extra +
    ' kr towards credit already used this cycle.',
  'rc.tier.allused.title': 'All used credit',
  'rc.tier.allused.body': (top: string) =>
    'Pays everything you have used — ' +
    top +
    ' kr — including any pending charges from this cycle.',
  'rc.cta.minimum': (min: string) => 'Minimum is ' + min + ' SEK',
  'rc.cta.pay': (amt: string) => 'Pay ' + amt + ' SEK',
  'rc.cta.use': (amt: string) => 'Use ' + amt + ' SEK',
  // Legally-styled consumer-credit warning — Swedish-only by design (verbatim).
  'rc.warning.title': 'Att låna kostar pengar!',
  'rc.warning.body':
    'Om du inte kan betala tillbaka skulden i tid riskerar du en betalningsanmärkning. ' +
    'Det kan leda till svårigheter att få hyra bostad, teckna abonnemang och få nya lån. ' +
    'För stöd, vänd dig till budget- och skuldrådgivningen i din kommun. Kontaktuppgifter finns på ',
  'rc.warning.link': 'konsumentverket.se',
  'rc.dial.type': 'Type',
  'rc.dial.done': 'Done',
  'rc.cfs.amount_label': 'Amount to pay',
  'rc.cfs.change': 'Change',
  'rc.cfs.changed_from': (amt: string) => 'Changed from ' + amt + ' SEK',
  'rc.cfs.relates_to': 'Relates to',
  'rc.cfs.from_account': 'From account',
  'rc.cfs.payment_date': 'Payment date',
  'rc.from.nordea': 'Nordea *345',
  'rc.from.savings': 'Savings · Flexible',
  'rc.date.today': 'Today',
  'rc.date.tomorrow': 'Tomorrow',
  'rc.date.due': 'On due date',
  'rc.date.other': 'Other',
  'rc.confirm.bankid': 'Confirm with BankID',
  'rc.success.title': 'Payment sent',
  'rc.success.body': 'Your payment is on its way. It may take up to one business day to appear.',
  'rc.success.product': 'Product',
  'rc.success.reference': 'Reference',
  'rc.success.done': 'Done',
  'rc.ppi.title': 'Payment Protection',
  'rc.ppi.price': '39 kr/mo',
  'rc.ppi.body':
    "Covers your monthly payments if you can't work due to illness or involuntary unemployment.",
  'rc.ppi.add': 'Add protection',
  'rc.ppi.added': 'Added — tap to remove',
  // wallet+discover screens
  'wallet.empty.title': 'No products yet',
  'wallet.empty.desc': 'Open a savings account, apply for a loan, or pay at a partner store.',
  'wallet.empty.cta': 'Explore products',
  'wallet.section.products': 'My products',
  'wallet.show_hidden': (n: number) => 'Show ' + n + ' hidden',
  'wallet.hide_hidden': 'Hide hidden',
  'wallet.hide': 'Hide',
  'wallet.unhide': 'Unhide',
  'wallet.no_credit_used': 'No credit used',
  'wallet.purchases_month': (n: number, amt: string) =>
    n + ' purchase' + (n === 1 ? '' : 's') + ' this month · ' + amt + ' kr',
  'wallet.rollup_purchases': (amt: string) => 'Purchases this month ' + amt + ' kr',
  'wallet.pay_remaining': 'Pay remaining balance',
  'wallet.paid_on': (d: string) => 'Paid on ' + d,
  'wallet.purchased': (d: string) => 'Purchased ' + d,
  'wallet.original_loan': (amt: string) => 'Original loan ' + amt + ' kr',
  'wallet.interest_ctx': (r: string) => 'Interest ' + r + '%',
  'wallet.interest_range': (lo: string, hi: string) => 'Interest ' + lo + '%–' + hi + '%',
  'wallet.locked_to': (d: string) => 'locked to ' + d,
  'wallet.accounts_count': (n: number) => n + (n === 1 ? ' account' : ' accounts'),
  'wallet.needs_attention': (n: number) => n + ' needs attention',
  'disc.empty.title': 'There are no offers available right now',
  'disc.empty.sub':
    'Personalised offers show up here once you get started. In the meantime, explore Resurs savings, loans and Resurs credit cards — flexible everyday products with no hidden fees.',
  'disc.start.savings.t': 'Savings account',
  'disc.start.savings.s': 'Up to 4.05% interest',
  'disc.start.loan.t': 'Private loan',
  'disc.start.loan.s': 'From 5.95% — no collateral',
  'disc.start.card.t': 'Resurs credit cards',
  'disc.start.card.s': 'Pay now, pay later — your choice',
  'disc.offer.cta': 'See your options',
  'disc.sheet.note': (label: string) =>
    'This is a placeholder screen — the full ' + label + " flow isn't built yet.",

  // detail screens
  'detail.not_found_title': 'Not found',
  'detail.not_found_desc': "We couldn't find what you're looking for.",
  'setting.placeholder_desc':
    "This screen isn't part of the prototype yet. It's a placeholder so the flow stays tappable.",
  'setting.back': 'Go back',
  'common.edit': 'Edit',
  'common.total': 'Total',
  'acct.no_tx': 'No transactions yet.',
  'acct.creation_date': 'Account creation date',
  'acct.owner_val': 'Account Owner',
  'acct.rate_type': 'Interest rate type',
  'acct.rate_variable': 'Variable interest rate',
  'acct.rate_date': 'Interest rate date',
  'acct.limit': 'Limit',
  'hero.total_savings': 'Total savings',
  'hero.earned_this_year': 'Earned this year',
  'hero.pts': 'pts',
  'hero.credit': 'Credit',
  'hero.buffer': 'Buffer',
  'hero.used': 'used',
  'hero.saved': 'saved',
  'pd.qa.pay': 'Pay',
  'pd.qa.move': 'Move',
  'pd.qa.card': 'Card',
  'pd.qa.help': 'Help',
  'pd.budget.over': (a: string | number) => a + ' kr over budget',
  'pd.budget.under': (a: string | number) => a + ' kr under budget',
  'pd.budget.days_left': (n: number) => n + ' days left',
  'pd.empty.merchant': (name: string) =>
    'Pay at ' + name + ' with Resurs to see your purchases here.',
  'pd.empty.generic': 'Use your account to see activity here.',
  'pd.family_credit': 'Family credit',
  'pd.family_buffer': 'Family buffer',
  'pd.total_saved': 'Total saved',
  'pd.no_offers': 'No offers available right now.',
  'fam.years_old': (n: number) => n + ' years old',
  'fam.add': 'Add family member',
  'fam.add_sub': 'You can add family members at any time',
  'fam.profile_title': 'User profile',
  'fam.back_coordinator': 'Coordinator account',
  'fam.back_overview': 'Resurs Family overview',
  'fam.edit_name': 'Edit family name',
  'fam.name_label': 'What should we call your family? (optional)',
  'fam.name_help': 'For example Andersson or Bergström',
  'fam.edit_member': 'Edit family member',
  'fam.enter_name': 'Enter name',
  'fam.dob': 'Date of birth',
  'fam.ssn': 'SSN',
  'fam.label': 'Add a label (optional)',
  'fam.avatar': 'Select avatar',
  'fam.delete': 'Delete user profile',
  'fam.child.title': 'Digital card for children',
  'fam.child.coming': '(coming later)',
  'fam.child.body': "When your child is 13+, you'll be able to give them a digital card.",
  'fam.child.bullet1': 'You set a spending limit',
  'fam.child.bullet2': 'You see transactions in real time',
  'fam.save': 'Save changes',
  'fbp.period': 'Period',
  'fbp.period_line': (range: string, n: number) => range + ' · ' + n + ' days left',
  'fbp.spent_so_far': 'Spent so far',
  'fbp.avg_per_day': (n: string | number) => 'Average per day: ' + n + ' kr',
  'fbp.forecast': 'Forecast',
  'fbp.at_end': 'at end of the period',
  'fbp.compare_lower': (n: string | number) =>
    'Average per day compared to the previous period: ' + n + ' kr lower',
  'ppi.linked_to': 'Linked to',
  'ppi.insurer': 'Insurer',
  'ppi.when_title': 'When can the insurance provide compensation?',
  'ppi.when_intro':
    'The insurance may provide compensation in accordance with the terms and conditions if, for example, you:',
  'ppi.bullet1': 'Are on sick leave with at least 50%.',
  'ppi.bullet2': 'Become involuntarily unemployed with at least 50%.',
  'ppi.bullet3': 'Are hospitalized for more than 5 days.',
  'ppi.bullet4': 'Pass away as a result of an accident.',
  'ppi.compensation':
    'For certain events that give rise to compensation, benefits may be paid for up to 12 months. In the event of death due to an accident, up to SEK 50,000 may be paid to the estate.',
  'ppi.full_terms': 'Full terms and conditions are available in the insurance policy terms.',
  'ppi.cancel_insurance': 'Cancel payment insurance',
  'fins.headline': 'Piece of mind for the unexpected',
  'fins.intro':
    'Built-in insurances that protect the family when life takes an unexpected turn. To read how to use the insurances listed below, see the Resurs Family agreement connected to the product.',
  'fins.home_title': 'Home Insurance Excess Coverage',
  'fins.home_help': 'Covers deductible for your home insurance claims',
  'fins.home_amount': 'Up to 10 000 kr in deductible coverage',
  'fins.food_title': 'Food protection insurance',
  'fins.food_help':
    'Helpful if you lose your job. Provided the card has been used for grocery purchases during the last 3 months.',
  'fins.food_amount': 'A one-time compensation of 3 000 kr',
  'fins.travel_title': 'Travel insurance',
  'fins.travel_help':
    'Reimburses prepaid costs (flights, hotels, tours) if you have to cancel before your trip starts. Reimburses essential items if your flight or bags are delayed.',
  'fins.travel_amount': 'Up to 5 000 kr per incident',
  'fins.included': 'Included',
  'pr.sub.partial': (paid: string, d: string) => paid + ' paid on ' + d,
  'pr.sub.paid': (d: string) => 'Paid on ' + d,
  'pr.sub.scheduled': (d: string) => 'Scheduled for ' + d,
  'pr.banner.partial':
    'A lower amount was paid, which will result in a new payment plan. If this was not your intention, make sure to catch up on the next invoice.',
  'pr.banner.paid': 'Payment successfully completed.',
  'pr.banner.scheduled':
    'A payment request will be initiated to the Nordea *34 account. For a successful payment, make sure there is money on the transaction date.',
  'pr.desc.delbetalning':
    'This is a monthly part payment for your Flexed purchases in August, spreading the cost into equal installments.',
  'pr.desc.laneavi':
    'This is a monthly installment on your loan, covering part of the principal plus interest. The remaining debt decreases with each payment.',
  'pr.desc.faktura': (name: string) =>
    'This invoice covers purchases made at ' +
    name +
    ' in November. Pay the full amount before the due date or split it up into a part payment plan.',
  'pr.desc.manadsavi':
    'This invoice relates to purchases made last month and any ongoing payment plans started from a previous statement.',
  'pr.original_debt': 'Original debt',
  'pr.last_month': 'Last month',
  'pr.purchases_count': (n: number) => n + ' purchases',
  'pr.items_count': (n: number) => n + (n === 1 ? ' item' : ' items'),
  'pr.july': 'July',
  'tx.resursone_pitch':
    'Activate ResursOne - check out faster anywhere, earn kickback on your purchases and split your invoice into interest-free part payments.',
  'tx.partpay_active': (n: number) =>
    'This purchase is being part paid over ' +
    n +
    ' months and will be invoiced as a part payment in December.',
  'tx.date_time': 'Date & time',
  'tx.type_ecom': 'E-commerce',
  'tx.type_instore': 'In-store card',
  'tx.pp.title': 'Part payment options',
  'tx.pp.desc': (amt: string, merchant: string) =>
    'Split your ' + amt + ' purchase at ' + merchant + ' into equal monthly payments.',
  'tx.pp.months': (n: number) => n + ' months',
  'tx.pp.interest_free': 'Interest-free',
  'tx.pp.interest': (r: string | number) => r + ' % interest',
  'tx.pp.fee': (fee: string) => fee + '/mo fee',
  'tx.pp.per_month': (amt: string, cur: string) => amt + ' ' + cur + '/mo',
  'tx.pp.confirm': 'Confirm part payment',
  'tx.pp.done_title': 'Part payment activated',
  'tx.pp.done_body': (amt: string, merchant: string, months: number) =>
    'Your ' +
    amt +
    ' purchase at ' +
    merchant +
    ' will now be paid over ' +
    months +
    ' months. It will appear as a part payment invoice, due Dec 31, 2025.',
  'invpdf.note':
    'This is a prototype invoice. In production, this PDF is generated by the core system.',
};
