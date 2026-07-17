// Swedish dictionary — ported 1:1 from design-reference/i18n.js (T.sv).
import type { TranslationDict } from './translations';

export const sv: TranslationDict = {
  // Navigation tabs
  'tab.activity': 'Att hantera',
  'tab.products': 'Plånbok',
  'tab.discover': 'Utforska',
  'tab.myresurs': 'Mitt Resurs',
  'tab.finances': 'Finanser',
  'tab.merchants': 'Handlare',

  // Activity screen
  welcome: 'Välkommen',
  'activity.subtitle': 'Hantera',

  // Hero
  'hero.label': 'Fakturor',
  'hero.label.purchases': 'Köp',
  'hero.label.savings': 'Budget',
  'hero.sub.savings': (n: number) => 'Sparat på ' + n + ' sparkonto' + (n === 1 ? '' : 'n'),
  'hero.sub.overdue': (n: number, tot: number) =>
    n + ' förfallna · ' + tot + ' faktura' + (tot === 1 ? '' : 'r') + ' att hantera',
  'hero.sub.normal': (n: number) => n + ' faktura' + (n === 1 ? '' : 'r') + ' att hantera',
  'hero.sub.purchases': (n: number) => n + ' köp denna månaden.',
  'alert.purchases_pending.title': 'Fakturor kommer!',
  'alert.purchases_pending.body':
    'Dina köp har registrerats men fakturorna har ännu inte skapats.',

  // Sections
  'section.topay': 'Att betala',
  'section.handled': 'HANTERADE FAKTUROR',
  'section.explore': 'UTFORSKA RESURS',
  'empty.caught_up': 'Inga fakturor just nu — allt är betalt.',

  // Card third line
  'inv.installment': 'Låneavi',
  'inv.statement': 'Månadsfaktura',
  'inv.partpayment': 'Delbetalning',
  'inv.account': 'Kontofaktura',
  'inv.monthly_invoice': 'Månadsavi',
  'inv.monthly_payment': 'Månadsbetalning',
  'inv.invoice': 'Faktura',
  'inv.purchase': 'Köp',
  'inv.pay_now': 'Betala nu!',
  'inv.overdue_days': (n: number) => 'Försenad ' + n + ' dagar',
  'inv.missed_count': (_n: number) => 'Inkluderar överfört saldo',
  'inv.failed_retry': 'Betalning misslyckades — försök igen',
  'inv.scheduled': (a: string | number) => 'Schemalagd betalning på ' + a + ' kr',
  'inv.part_payment': (a: string | number) => 'Delbetalning av ' + a + ' kr',
  'inv.full_payment': 'Full betalning',
  'inv.paid_partial': (p: string | number, t: string | number) =>
    'Betalt ' + p + ' kr av ' + t + ' kr',
  'inv.part_paid': (r: string | number) => 'Delbetalning - ' + r + ' kr',
  'inv.invoiced': (a: string | number) => 'Fakturerat: ' + a + ' kr',
  'inv.paid_full': 'Full betalning',
  'inv.added_next': 'Ersatt av ny faktura',
  'inv.new_coming': 'Ny faktura på väg.',
  'inv.do_not_pay': 'Ingen betalning krävs',

  // Status chip labels (RY_STATUS_STYLES in the design)
  'inv.st.paid': 'Betald',
  'inv.st.scheduled': 'Schemalagd',
  'inv.st.snoozed': 'Pausad',
  'inv.st.partial': 'Delbetald',
  'inv.st.overdue': 'Försenad',
  'inv.st.missed': 'Missad',
  'inv.st.unpaid': 'Obetald',
  'inv.st.voided': 'Makulerad',

  // Payment-request row outcome lines
  'inv.paid_amount': (a: string | number) => 'Betalt belopp: ' + a + ' kr',
  'inv.new_invoice_created': 'Ny faktura skapad',
  'inv.partpayment_amount': (a: string | number) => 'Delbetalning (' + a + ' kr)',
  'inv.missed_payment': 'Missad betalning',

  // Transaction row
  'tx.convert_to_account': 'Omvandla till konto',
  'tag.part_pay': 'Delbetala',

  // Card date line
  'date.due': (d: string) => 'Förfaller ' + d,
  'date.paid': (d: string) => 'Betald ' + d,
  'date.scheduled': (d: string) => 'Betalas ' + d,

  // Tags
  'tag.overdue': 'Betala nu',
  'tag.failed': 'Betala nu',
  'tag.days_left': (n: number) => n + ' dagar kvar',
  'tag.scheduled': 'Schemalagd',
  'tag.paid': 'Betald',
  'tag.missed': 'Missad',
  'tag.cancelled': 'Avbruten',
  'tag.pay_now': 'Betala nu',
  'tag.missed_payment': 'Försenad',

  // Detail — kind title
  'kind.statement': 'Månadsavi',
  'kind.merchant': 'Faktura',
  'kind.loan': 'Delbetalning',
  'kind.flex': 'Faktura',

  // Detail — hero labels
  'detail.amount_due': 'Belopp att betala',
  'detail.inv_amount': 'Fakturabelopp',

  // Detail — sub line by state
  'sub.urgent': (n: number) => 'Förfaller om ' + n + ' dagar',
  'sub.due': (d: string) => 'Förfaller ' + d,
  'sub.overdue': (n: number) => n + ' dagar förfallen',
  'sub.failed': 'Betalning misslyckades',
  'sub.scheduled': (a: string | number, d: string) =>
    'Schemalagd betalning på ' + a + ' kr den ' + d,
  'sub.paid_partial': (p: string | number, t: string | number, d: string) =>
    'Betalt ' + p + ' kr av ' + t + ' kr den ' + d,
  'sub.paid_full': (d: string) => 'Fullt betald den ' + d,
  'sub.missed': 'Missad — betala nu för att undvika extra avgifter',
  'sub.cancelled': (d: string) => 'Avbruten den ' + d,

  // Detail — buttons
  'btn.pay': 'Betala faktura',
  'btn.try_again': 'Försök igen',
  'btn.change_scheduled': 'Ändra eller avboka schemalagd betalning',
  'btn.pay_more': 'Betala mer',
  'btn.cancel_scheduled': 'Avboka schemalagd betalning',
  'btn.view_receipt': 'Visa kvitto',

  // Detail — banners
  'banner.partpay_pre': 'De flesta fakturor kan delbetalas utan ränta. Öppna ',
  'banner.partpay_link': 'Betala faktura',
  'banner.partpay_post': ' för att sprida kostnaden.',
  'banner.partpay_upsell_pre': 'Du har köp över 1 000 kr som kan ',
  'banner.partpay_upsell_link': 'delbetalas - sprid kostnaden utan ränta.',
  'banner.partpay_upsell_post': '',
  'banner.partpay_upsell_title': 'Flex - Välj hur du vill betala',
  'banner.partpay_upsell_body': (n: number) =>
    n + ' köp kan flyttas till separata fakturor med fler betalningsalternativ. Tryck för att läsa mer.',

  // Part-pay overlay
  'partpay_overlay.title': 'Kan delbetalas',
  'partpay_overlay.desc':
    'De här köpen är över 1 000 kr och kan brytas ut till en separat delbetalningsplan utan ränta.',
  'partpay_overlay.pick': 'Välj de köp du vill bryta ut',
  'partpay_overlay.confirm_none': 'Välj köp för att fortsätta',
  'partpay_overlay.confirm': (n: number) => 'Bryt ut ' + n + ' köp',

  'banner.overdue.title': 'Förfallen',
  'banner.overdue.body':
    'Betala innan månadsköret den 4:e — annars förs beloppet till nästa månads faktura.',
  'banner.failed.title': 'Din betalning gick inte igenom',
  'banner.failed.body':
    'Inga pengar har lämnat ditt konto. Försök igen för att slutföra betalningen.',
  'banner.scheduled':
    'Betalning initierad — medel kan redan ha dragits, inväntar bekräftelse.',
  'banner.paid_partial': 'Ett lägre belopp betalades; resten läggs till på nästa faktura.',
  'banner.paid_full': 'Betalning slutförd.',
  'banner.missed.title': 'Missad betalning',
  'banner.missed.body':
    'Den här fakturan har passerat förfallodatumet. Betala nu för att undvika förseningsavgifter och skydda din kreditvärdighet.',
  'banner.includes_missed.title': 'Innehåller en missad betalning',
  'banner.includes_missed.body':
    'En del av beloppet är en missad betalning från förra månaden. Betala innan förfallodatumet för att undvika ytterligare avgifter.',
  'banner.cancelled':
    'Den här fakturan avbröts. En ny faktura är på väg och visas här när den utfärdas.',
  'banner.snoozed.title': 'Den här fakturan sköts upp',
  'banner.snoozed.body':
    'Du flyttade förfallodatumet framåt. Den beter sig nu som en vanlig daterad faktura.',
  // Payments-tab header banners (overdue summary / due-soon / part-pay promo)
  'banner.payments.overdue_summary': (n: number) =>
    n + (n === 1 ? ' faktura förfallen' : ' fakturor förfallna'),
  'banner.payments.overdue_body':
    'Betala nu för att undvika förseningsavgifter och skydda din kreditvärdighet.',
  'banner.payments.due_soon': (n: number) =>
    n + (n === 1 ? ' dag' : ' dagar') + ' till nästa förfallodatum',
  'banner.payments.due_soon_body':
    'Visste du att de flesta fakturor kan delbetalas utan ränta – om du vill sprida ut kostnaden.',
  'banner.payments.partpay_promo': 'Dela upp kostnaden för dina köp',
  'banner.payments.partpay_promo_body':
    'Köp över 1 000 kr kan delbetalas utan ränta — tryck på ett för att komma igång.',

  // Detail — snooze info
  'snooze.prev': 'Tidigare förfallodatum',
  'snooze.new': 'Nytt förfallodatum',
  'snooze.cost': 'Kostnad för uppskjutning',
  'snooze.length': 'Uppskjutningens längd',
  'snooze.days': (n: number) => n + ' dagar',

  // Detail — loan block
  'detail.payment_n_of': (n: number, t: number) => 'Betalning ' + n + ' av ' + t,
  'detail.loan_amount': 'Lånebelopp',
  'detail.remaining': 'Återstående skuld',
  'detail.remaining_debt': 'Återstående skuld',
  'detail.remaining_balance': 'Återstående saldo',

  // Detail — breakdown descriptions
  'desc.loan': (amt: string | number) => 'Den här fakturan avser ditt lån på ' + amt + ' kr.',
  'desc.partpay': (amt: string | number, name: string) =>
    'Den här fakturan är en delbetalning på ditt köp på ' +
    amt +
    ' kr hos ' +
    name +
    '. Köpdetaljer finns på din ursprungliga faktura.',
  'desc.statement': (name: string) =>
    'Den här fakturan avser förra månadens köp med ' +
    name +
    ' samt månadsbeloppet för eventuella pågående delbetalningsplaner från tidigare fakturor.',
  'desc.account': (name: string) => 'Den här fakturan avser dina senaste köp hos ' + name + '.',
  'desc.invoice': (amt: string | number, name: string) =>
    'Den här fakturan avser ditt köp på ' + amt + ' kr hos ' + name + '.',

  // Detail — payment info
  'payinfo.title': 'Betalningsinformation',
  'payinfo.ocr': 'OCR',
  'payinfo.bankgiro': 'Bankgiro',
  'payinfo.due': 'Förfallodatum',
  'payinfo.pdf': 'Visa PDF-faktura',

  // Detail — services
  'svc.title': 'Tjänster',
  'svc.snooze': 'Skjut upp',
  'svc.snooze_sub': 'Flytta förfallodatumet framåt',
  'svc.product': 'Produktsida',
  'svc.report': 'Rapportera ett problem',

  // Promo card
  'promo.loan.label': 'Privatlån',
  'promo.loan.headline': 'När större utgifter\nkommer på en gång',
  'promo.loan.desc': 'Sprid större kostnader till hanterbara månadsbetalningar.',
  'promo.loan.cta': 'Se dina alternativ',

  // Monthly deposits flow
  'md.funds_note': 'Pengar dras från ditt Nordea-konto (****1234) via autogiro.',
  'md.deposit_amount': 'Insättningsbelopp',
  'md.amount_placeholder': 'Ange månatligt insättningsbelopp',
  'md.deposit_date': 'Insättningsdatum',
  'md.day_of_month': 'Dag i månaden',
  'md.on_the': 'Den',
  'md.range': '(1–28)',
  'md.done': 'Klar',
  'md.cancel': 'Avbryt',
  'md.set_up': 'Skapa insättning',
  'md.update': 'Uppdatera insättning',
  'md.stop_row': 'Stoppa månadsinsättning',
  'md.repeat': (r: string) => 'Din insättning upprepas ' + r + '.',
  'md.upcoming': (d: string) => 'Nästa insättning: ' + d,
  'md.opt.direct': 'Direktinsättning',
  'md.opt.direct_sub': 'Direkt överföring med open banking',
  'md.opt.bank': 'Bankinsättning',
  'md.opt.bank_sub': 'Manuell överföring, 1 bankdag',
  'md.opt.monthly': 'Månadsinsättningar',
  'md.opt.monthly_sub': 'Automatiska insättningar med autogiro',
  'md.title.options': 'Hur vill du sätta in dina pengar?',
  'md.title.setup': 'Månadsinsättningar',
  'md.title.edit': 'Redigera månadsinsättning',
  'md.title.bank': 'Bankinsättning',
  'md.bank.intro':
    'Överför pengar från din egen bank till bankgirot nedan. Lägg till referensen så att vi kan matcha betalningen mot ditt sparkonto. Pengarna kommer normalt fram inom 1 bankdag.',
  'md.bank.recipient': 'Mottagare',
  'md.bank.recipient_val': 'Resurs Bank AB',
  'md.bank.bankgiro': 'Bankgiro',
  'md.bank.reference': 'Referens',
  'md.bank.account': 'Sparkonto',
  'md.bank.copied': 'Kopierat',
  'md.bank.done': 'Klar',
  'md.success.title': 'Månadsinsättning aktiverad',
  'md.success.body': (amt: string, date: string, r: string) =>
    'Din automatiska insättning på ' + amt + ' startar den ' + date + ' och upprepas ' + r + '.',
  'md.success.note':
    'Du kan ändra eller avbryta insättningen när som helst i sparkontoöversikten.',
  'md.summary.permonth': (amt: string) => amt + ' / månad',
  'md.summary.every': (e: string) => 'Varje ' + e + ' · från Nordea',
  'md.stop.title': 'Stoppa månadsinsättning?',
  'md.stop.body': (amt: string, r: string) =>
    'Detta stoppar alla framtida automatiska insättningar på ' + amt + ' schemalagda ' + r + '.',
  'md.stop.keep': 'Behåll insättning',
  'md.stop.confirm': 'Stoppa insättning',

  // My Resurs tab
  'mr.account': 'Konto',
  'mr.title': 'Mitt Resurs',
  'mr.support_subtitle': 'Din profil, meddelanden och inställningar.',
  'mr.chat': 'Chatt',
  'mr.profile_sub': 'Redigera din kontaktinformation',
  'mr.messages': 'Meddelanden',
  'mr.messages_sub': 'Meddelanden från banken',
  'mr.messages_q3': 'Meddelanden från banken',
  'mr.messages_q3_sub': 'Senaste nyheter och meddelanden',
  'mr.unread': (n: number) => n + ' olästa',
  'mr.documents': 'Dokument',
  'mr.documents_sub': 'Begärda dokument, avtal och kontrakt',
  'mr.documents_q3': 'Mina dokument',
  'mr.documents_q3_sub': 'Avtal och kontrakt',
  'mr.new': (n: number) => n + ' nya',
  'mr.knowledge': 'Kundkännedom',
  'mr.knowledge_sub': 'Uppdatera dina svar',
  'mr.cancel_agreement': 'Säg upp kreditavtal',
  'mr.cancel_agreement_sub': 'Så använder du din ångerrätt',
  'mr.section.support': 'Support',
  'mr.support_desc':
    'Du omdirigeras till en extern sida. Kom ihåg att logga ut från appen/internetbanken.',
  'mr.faq': 'Vanliga frågor',
  'mr.faq_sub': 'Vanliga frågor och svar.',
  'mr.send_msg': 'Skicka ett meddelande',
  'mr.send_msg_sub': 'Vi svarar inom 3–4 bankdagar.',
  'mr.tickets': 'Mina supportärenden',
  'mr.tickets_sub': 'Visa och följ dina supportärenden.',
  'mr.section.payment': 'Betalningsinställningar',
  'mr.connect_bank': 'Anslut bankkonto',
  'mr.connect_bank_sub': 'Lägg till bankkonto för att betala fakturor',
  'mr.section.general': 'Allmänna inställningar',
  'mr.notifications': 'Aviseringar',
  'mr.notifications_sub': 'Inställningar för påminnelser och kommunikation',
  'mr.theme': 'Tema',
  'mr.theme_light': 'Ljust läge',
  'mr.language': 'Språk',
  'mr.language_value': 'Svenska',
  'mr.logout': 'Logga ut',
  'help.title': 'Behöver du hjälp?',
  'help.sub': 'Chatta med oss eller läs vanliga frågor',
  'help.chat': 'Öppna chatt',
  'help.chat_sub': 'Öppettider mån-fre 8-16',

  // ── Close-account / terminate-agreement flow ──
  'ca.cancel': 'Avbryt',
  'ca.svc.hint': (l: string) => 'Tryck på “' + l + '” för att starta flödet',
  'ca.ins.hint': (l: string) => 'Tryck på “' + l + '” för att öppna informationen',
  'ca.svc.title': 'Tjänster',
  'ca.svc.close': 'Avsluta konto',
  'ca.svc.pay_extra': 'Betala extra',
  'ca.svc.change_limit': 'Ändra kreditgräns',
  'ca.svc.deposit': 'Sätt in',
  'ca.svc.withdraw': 'Ta ut',
  'ca.svc.manage': 'Hantera försäkring',
  'ca.info.title': 'Uppsägning av avtal',
  'ca.info.intro': 'Vad händer när du säger upp ditt avtal:',
  'ca.info.happens.b1':
    'Inget sägs upp förrän du bekräftar uppsägningen. Du kan avbryta när som helst.',
  'ca.info.happens.b2':
    'När uppsägningen har behandlats och avtalet är avslutat förlorar du tillgång till tjänsten. Det innebär att kortet och krediten som är kopplad till avtalet inte längre kan användas. En ny ansökan krävs om du vill använda tjänsten igen.',
  'ca.info.oblig.title': 'Dina skyldigheter kvarstår:',
  'ca.info.oblig.b1':
    'Eventuell utestående skuld måste återbetalas i enlighet med avtalets villkor. Ränta och avgifter kan tas ut tills skulden är helt återbetald.',
  'ca.info.oblig.b2':
    'Utestående transaktioner gäller fortfarande. Köp och andra transaktioner som har gjorts men ännu inte bokförts kan därför fortfarande debiteras kontot.',
  'ca.info.before.title': 'Innan du avslutar ditt konto',
  'ca.info.before.sub': 'Vänligen gå igenom följande viktiga information',
  'ca.info.before.b1': 'Eventuella förmåner och bonusar kopplade till avtalet upphör.',
  'ca.info.before.b2': 'Eventuell försäkring kopplad till tjänsten sägs upp.',
  'ca.info.footer':
    'Säkerställ att eventuell utestående skuld kan återbetalas till Resurs Bank i enlighet med avtalets villkor. Fullständiga villkor finns i de allmänna villkoren, som du hittar under ditt konto.',
  'ca.info.cta': 'Fortsätt med uppsägning av avtal',
  'ca.info.placeholder': 'Information för den här produkten läggs till här.',
  'ca.back': 'Tillbaka',
  'ca.info.title.loan': 'Uppsägning av lån',
  'ca.info.intro.loan': 'Det här händer när du säger upp ditt låneavtal:',
  'ca.info.footer.short':
    'Fullständiga villkor finns i de allmänna villkoren som du hittar under ditt konto.',
  'ca.know.title': 'Viktigt att veta',
  'ca.before2.title': 'Innan du fortsätter',
  'ca.dep.happens.b1':
    'När uppsägningen har hanterats avslutas kontot. Det innebär att du inte längre kan använda kontot eller de tjänster som är kopplade till kontot. En ny ansökan krävs om du vill ha tjänsten på nytt.',
  'ca.dep.happens.b2':
    'Eventuellt innestående belopp och ränta betalas ut till ditt föranmälda utbetalningskonto enligt avtalsvillkoren.',
  'ca.dep.happens.b3':
    'Inget avslutas innan du bekräftar uppsägningen. Du kan avbryta när som helst.',
  'ca.dep.know.b1':
    'Ränta beräknas enligt avtalsvillkoren fram till dess att kontot avslutas och pengarna betalas ut.',
  'ca.dep.know.b2':
    'För vissa sparkonton kan särskilda villkor gälla, till exempel villkor om bindningstid, uttag eller avgifter.',
  'ca.dep.before.sub': 'Valfritt - men rekommenderat. Det hindrar inte att avtalet sägs upp.',
  'ca.dep.before.b1': 'Kontrollera vilket konto pengarna ska betalas ut till.',
  'ca.dep.before.b2': 'Säkerställ att du inte behöver kontot för framtida sparande.',
  'ca.loan.happens.b1': 'När du går vidare skickas en begäran om att säga upp lånet.',
  'ca.loan.happens.b2':
    'Lånet avslutas först när hela den kvarvarande skulden har betalats tillbaka enligt avtalet och tillämpliga villkor.',
  'ca.loan.happens.b3':
    'Inget sker innan du bekräftar uppsägningen. Du kan avbryta när som helst.',
  'ca.loan.know.b1':
    'Du har rätt att betala tillbaka hela lånet i förtid. På begäran får du uppgift om det belopp som ska betalas för att lösa lånet i dess helhet.',
  'ca.loan.know.b2':
    'Om lånet inte löses i sin helhet fortsätter återbetalningen enligt din betalningsplan.',
  'ca.loan.know.b3': 'Ränta och eventuella avgifter debiteras till dess att lånet är helt återbetalt.',
  'ca.loan.rights.title': 'Rättigheter som upphör',
  'ca.loan.rights.b1': 'Du kan inte göra ändringar på lånet',
  'ca.loan.rights.b2': 'Eventuella förmåner eller villkor kopplade till lånet upphör',
  'ca.otc.happens.b1':
    'Inget avslutas innan du bekräftar uppsägningen. Du kan avbryta när som helst.',
  'ca.otc.happens.b2': 'När uppsägningen har hanterats är avtalet uppsagt.',
  'ca.otc.happens.b3': 'Eventuella kampanjer eller erbjudanden kopplade till krediten kan upphöra.',
  'ca.otc.oblig.title': 'Din skyldighet kvarstår',
  'ca.otc.oblig.b1': 'Eventuell skuld ska betalas enligt avtalsvillkoren.',
  'ca.otc.oblig.b2': 'Ränta och avgifter kan debiteras till dess att skulden är helt återbetald.',
  'ca.otc.before.sub': 'Valfritt - men rekommenderat. Det här påverkar inte din uppsägning.',
  'ca.otc.before.b1':
    'Se till att eventuell skuld kan betalas till Resurs Bank enligt avtalsvillkoren.',
  'ca.ins.section': 'Försäkringar',
  'ca.ins.name': 'Betalningsskydd',
  'ca.ins.cancel_cta': 'Säg upp betalningsskydd',
  'ca.ins.dialog_placeholder': 'Försäkringsinformation visas här.',
  'ca.ins.title': 'Säg upp avtal om betalningsskydd',
  'ca.ins.intro': 'Vad innebär en uppsägning?',
  'ca.ins.p1': 'Inget händer innan du bekräftar uppsägningen. Du kan avbryta när som helst.',
  'ca.ins.p2':
    'När uppsägningen har hanterats sägs försäkringen upp i enlighet med försäkringsvillkoren.',
  'ca.ins.lead': 'Det innebär bland annat att:',
  'ca.ins.card.b1':
    'Du omfattas inte längre av försäkringen för händelser som inträffar efter att försäkringen har upphört.',
  'ca.ins.card.b2':
    'Rätten till eventuell ersättning för händelser som inträffat innan försäkringen sades upp bedöms i enlighet med försäkringsvillkoren. Bedömningen kan bland annat bero på när den ersättningsgrundande händelsen inträffade.',
  'ca.ins.card.b3': 'Eventuell kvarvarande premie debiteras i enlighet med försäkringsvillkoren.',
  'ca.ins.before.sub': 'Följande är valfritt och hindrar dig inte från att fortsätta:',
  'ca.ins.before.b1': 'Kontrollera om du kommer att behöva försäkringsskyddet framöver.',
  'ca.ins.before.b2': 'Jämför med eventuellt annat försäkringsskydd du kan ha.',
  'ca.ins.footer': 'Fullständiga villkor finns i försäkringsvillkoren.',
  'ca.verify.title': 'Verifiera e-post',
  'ca.verify.intro':
    'För att säga upp ditt avtal behöver vi bekräfta att e-postadressen vi har är din. Vi skickar en 6-siffrig kod via e-post.',
  'ca.verify.card.title': 'Verifiera din email för att gå vidare',
  'ca.verify.card.sub': 'Vi skickar din bekräftelse till adressen nedan.',
  'ca.verify.email_label': 'Email',
  'ca.verify.verify': 'Verifiera',
  'ca.verify.verified': 'Verifierad',
  'ca.verify.change': 'Ändra e-post',
  'ca.email.title': 'Ändra e-postadress',
  'ca.email.label': 'E-postadress',
  'ca.email.sub':
    'Ange den e-postadress dit vi ska skicka din bekräftelse. Du behöver verifiera den nya adressen.',
  'ca.email.save': 'Spara e-post',
  'ca.email.invalid': 'Ange en giltig e-postadress.',
  'ca.verify.continue': 'Fortsätt',
  'ca.code.title': 'Ange koden',
  'ca.code.sub': 'Ange den 6-siffriga koden vi skickade till din e-post.',
  'ca.code.resend': 'Skicka koden igen',
  'ca.reason.intro':
    'Din begäran om att säga upp avtalet och avsluta tillhörande konto kommer att registrerats som ett ärende under Mina supportärenden. Du får ett mejl när det finns något nytt att läsa i ditt ärende.',
  'ca.reason.acct_title': 'Kontoinformation',
  'ca.reason.label': 'Anledning till uppsägning',
  'ca.reason.placeholder': 'Välj en anledning i listan *',
  'ca.reason.processing': 'Handläggningstid: Vi hanterar ditt ärende normalt inom 1-3 bankdagar',
  'ca.reason.confirm':
    'Jag bekräftar att jag vill säga upp avtalet ovan och att jag har tagit del av informationen om vad uppsägningen innebär.',
  'ca.reason.submit': 'Skicka begäran',
  'ca.reason.opt1': 'Jag behöver inte den här produkten längre',
  'ca.reason.opt2': 'Avgifterna/kostnaden är för höga',
  'ca.reason.opt3': 'Jag hade en dålig kundupplevelse',
  'ca.reason.opt4': 'Jag hittade ett bättre alternativ någon annanstans',
  'ca.reason.opt5': 'Min personliga situation har förändrats',
  'ca.reason.opt6': 'Jag är inte nöjd med produkten',
  'ca.reason.opt7': 'Annat',
  'ca.acct.debt': 'Skuld',
  'ca.acct.credit_limit': 'Kreditgräns',
  'ca.acct.balance': 'Saldo',
  'ca.acct.remaining': 'Återstående skuld',
  'ca.acct.product': 'Produkt',
  'ca.success.title': 'Begäran om uppsägning av avtal skickad',
  'ca.success.case': 'Ärende skapat',
  'ca.success.product': 'Produkt',
  'ca.success.processing': 'Handläggningstid',
  'ca.success.processing_val': '1-3 bankdagar',
  'ca.success.track':
    'Följ ärendet under Mina supportärenden. Du får ett mejl när det finns en uppdatering i ditt ärende.',
  'ca.success.close': 'Stäng',

  // ── Right of withdrawal flow ──────────────────────────────────────
  'wd.menu.section': 'Mina avtal',
  'wd.menu.cancel': 'Säg upp kreditavtal',
  'wd.menu.cancel_sub': 'Utnyttja din ångerrätt',
  'wd.menu.hint': 'Tryck på ”Säg upp kreditavtal” för att starta flödet',
  'wd.title': 'Ångra ett avtal',
  'wd.overview.intro1':
    'Som privatperson har du rätt att ångra ditt avtal inom 14 dagar från det datum då avtalet ingicks.',
  'wd.overview.intro2':
    'Du utnyttjar din ångerrätt genom att meddela Resurs Bank. När ångerrätten har utnyttjats upphör avtalet att gälla. Det som redan har utförts enligt avtalet ska återföras och regleras i enlighet med de villkor som gäller för respektive avtal.',
  'wd.overview.return':
    'Om du vill returnera en vara men inte ångra ditt avtal behöver du kontakta butiken där du gjorde ditt köp.',
  'wd.overview.select': 'Välj det avtal du vill ångra:',
  'wd.overview.hint': 'Tryck på ett avtal för att öppna dess ångersida',
  'wd.overview.empty': 'Du har för närvarande inga avtal som kan ångras.',
  'wd.chip.processing': 'Behandlas',
  'wd.info.cta': 'Bekräfta',
  'wd.verify.title': 'Verifiera din e-post',
  'wd.verify.card.title': 'Verifiera din e-post för att gå vidare',
  'wd.verify.card.sub': 'Vi skickar din bekräftelse till adressen nedan.',
  'wd.verify.email_label': 'E-post',
  'wd.verify.verify': 'Verifiera',
  'wd.verify.verified': 'Verifierad',
  'wd.verify.change': 'Ändra e-post',
  'wd.email.title': 'Ändra e-postadress',
  'wd.email.label': 'E-postadress',
  'wd.email.sub':
    'Ange den e-postadress dit vi ska skicka din bekräftelse. Du behöver verifiera den nya adressen.',
  'wd.email.save': 'Spara e-post',
  'wd.email.invalid': 'Ange en giltig e-postadress.',
  'wd.code.title': 'Ange koden',
  'wd.code.sub': 'Ange den 6-siffriga koden vi skickade till din e-post.',
  'wd.code.resend': 'Skicka koden igen',
  'wd.agr.title': 'Avtalet du ångrar:',
  'wd.agr.product': 'Produkt',
  'wd.agr.provider': 'Kreditgivare',
  'wd.agr.provider_val': 'Resurs Bank',
  'wd.agr.date': 'Datum',
  'wd.agr.credit_limit': 'Kreditgräns',
  'wd.agr.purchase_amount': 'Köpbelopp',
  'wd.agr.store': 'Butik',
  'wd.confirm':
    'Jag bekräftar att jag vill utnyttja min ångerrätt för avtalet ovan och att jag är betalningsskyldig i enlighet med avtalet och tillämpliga villkor.',
  'wd.credit.title': 'När du ångrar ditt avtal',
  'wd.credit.p1':
    'När du meddelar Resurs Bank att du vill utnyttja din ångerrätt upphör avtalet att gälla.',
  'wd.credit.p2':
    'Ångerrätten gäller det ingångna avtalet och omfattar inte enskilda uttag, betalningar, transaktioner, överföringar eller andra tjänster som utförts under avtalets löptid. Ångerrätten gäller inte heller åtgärder som Resurs Bank redan utfört på din begäran innan du meddelade din ånger.',
  'wd.credit.p3_b': 'Har du använt krediten?',
  'wd.credit.p3':
    ' En slutfaktura utfärdas då för det belopp du har använt, samt den upplupna räntan för den period då krediten tillhandahölls och fram till dess att återbetalning sker.',
  'wd.credit.p4': 'Återbetalning ska ske inom 30 dagar från det datum du meddelade Resurs Bank.',
  'wd.credit.p5':
    'Resurs Bank återbetalar eventuella avgifter du har betalat inom 30 dagar, förutom avgifter som Resurs Bank har laglig rätt att behålla.',
  'wd.credit.p6_b': 'Har du betalningsskydd kopplat till din avbetalningsplan?',
  'wd.credit.p6':
    ' När du utnyttjar din ångerrätt upphör även försäkringsavtalet att gälla. Betalda försäkringspremier återbetalas med avdrag för den tid försäkringen varit i kraft. Eventuell obetald premie för motsvarande period debiteras på slutfakturan.',
  'wd.sav.p3':
    'Eventuella medel på kontot betalas ut till ditt föranmälda utbetalningskonto inom 30 dagar från det datum du meddelar Resurs Bank, om inte annat anges i avtalet eller följer av tillämplig lag.',
  'wd.loan.q1_b': 'Har lånet betalats ut?',
  'wd.loan.q1':
    ' En slutfaktura utfärdas då för det utbetalda lånebeloppet, samt den upplupna räntan för den period då krediten tillhandahölls och fram till dess att återbetalning sker. Återbetalning ska ske inom 30 dagar från det datum du meddelade Resurs Bank.',
  'wd.loan.q2_b': 'Har du betalningsskydd kopplat till ditt lån?',
  'wd.loan.q2':
    ' När du utnyttjar din ångerrätt upphör även försäkringsavtalet att gälla. Betalda försäkringspremier återbetalas med avdrag för den tid försäkringen varit i kraft. Eventuell obetald försäkringspremie för motsvarande period debiteras på slutfakturan.',
  'wd.otc.notcov_b': 'Krediter som inte omfattas av ångerrätten',
  'wd.otc.notcov':
    'Ångerrätten gäller inte räntefria kontokrediter som inte är förenade med mer än en obetydlig avgift och som ska återbetalas inom tre månader, eller kontokrediter som ska återbetalas på begäran eller inom tre månader.',
  'wd.ins.p1':
    'När du meddelar Resurs Bank att du vill utnyttja din ångerrätt upphör försäkringsavtalet att gälla.',
  'wd.ins.q1_b': 'Har du betalat försäkringspremien?',
  'wd.ins.q1':
    ' Eventuell betald premie återbetalas med avdrag för den tid försäkringen varit i kraft. Återbetalningen sker inom 30 dagar från det datum du meddelade Resurs Bank.',
  'wd.ins.q2_b': 'Har du inte betalat försäkringspremien?',
  'wd.ins.q2':
    ' Premien för den period då försäkringen varit i kraft debiteras genom att en slutfaktura utfärdas. Betalning ska ske inom 30 dagar från det datum du meddelade Resurs Bank.',
  'wd.ins.notcov_b': 'Försäkringar som inte omfattas av ångerrätten.',
  'wd.ins.notcov':
    ' Ångerrätten gäller inte försäkringsavtal med en avtalad löptid på en månad eller kortare.',
  'wd.success.title': 'Begäran skickad',
  'wd.success.sub':
    'Detta är din bekräftelse på att vi har tagit emot din begäran om att utnyttja din ångerrätt.',
  'wd.success.track':
    'Du får en bekräftelse via e-post med en länk till ditt ärende. Du kan även följa ditt ärende under Mina supportärenden i Mitt Resurs.',
  'wd.success.close': 'Stäng',
  'wd.proc.title': 'Din ångerbegäran behandlas',
  'wd.proc.body':
    'Ditt ärende hanteras. Du får ett mejl när ditt ärende uppdateras. Du kan följa ärendet under Mina supportärenden i Mitt Resurs.',
  'wd.proc.close': 'Stäng',
  'wd.cancel': 'Avbryt',

  // activity screens
  'activity.empty_intro':
    'Om du nyligen ansökt om en produkt eller gjort ett köp kan det ta en liten stund innan det visas här. Utforska våra produkter nedan under tiden.',
  'activity.sub.savings': 'Sparöversikt',
  'activity.sub.latest_purchase': 'Senaste köp',
  'activity.sub.topay': 'Att betala',
  'activity.support.empty': 'Dina fakturor och köp visas här.',
  'activity.support.purchases': (n: number) => 'Du har gjort ' + n + ' köp denna vecka',
  'activity.support.invoices': (n: number) =>
    'Du har ' + n + (n === 1 ? ' faktura' : ' fakturor') + ' att hantera',
  'summary.total_label': 'Totalt belopp att hantera',
  'summary.hint': 'Se fler betalningsalternativ under varje faktura',
  'section.start': 'Kom igång med Resurs',
  'section.popular': 'Populära butiker',
  'section.handled_short': 'Hanterade',
  'merchant.upto_months': (m: number) => 'Upp till ' + m + ' månaders delbetalning',
  'empty.topay.title': 'Inget att betala just nu',
  'empty.topay.desc': 'När du har fakturor visas de här.',
  'empty.purchases.title': 'Inga köp ännu',
  'empty.purchases.desc': 'Kortköp och butiksfakturor visas här.',
  'explore.savings.title': 'Sparkonto',
  'explore.savings.sub': 'Upp till 4,05 % ränta, fria uttag',
  'explore.loan.title': 'Privatlån',
  'explore.loan.sub': 'Från 5,95 % — ingen säkerhet krävs',
  'explore.card.title': 'Resurs Mastercard',
  'explore.card.sub': 'Betala nu eller senare — du väljer',
  'inv.partpay_n_of': (n: number, tot: number) => 'Delbetalning ' + n + ' av ' + tot,
  'inv.includes_overdue': 'Inkluderar förfallet saldo',
  'detail.original_amount': 'Ursprungligt belopp',
  'detail.principal': 'Amortering',
  'detail.interest': 'Ränta',
  'detail.this_payment': 'Denna betalning',
  'detail.total': 'Totalt',
  'detail.awaiting_invoice':
    'Vi väntar på en faktura från butiken. Betalningsuppgifter visas här när den har tagits emot.',
  'ah.subtitle': 'Aktivitet',
  'ah.support.clear': 'Inget att betala just nu — du är i fas.',
  'ah.support.overdue': (n: number) =>
    n + (n > 1 ? ' fakturor förfallna' : ' faktura förfallen') + ' — åtgärd krävs',
  'ah.support.count': (n: number) =>
    n + (n !== 1 ? ' fakturor' : ' faktura') + ' att hantera',
  'ah.label.overdue': 'Förfallet',
  'ah.label.tohandle': 'Att hantera',
  'ah.sub.options': 'Betalningsalternativ tillgängliga',
  'ah.section.needs': 'Kräver åtgärd',
  'ah.section.explore': 'Utforska',
  'ah.empty.future': 'Framtida fakturor visas här',
  'ah.promo.cta': 'Utforska hur det fungerar',
  'ihb.label.savings': 'Sparande',
  'ihb.label.overdue': 'Förfallet',
  'ihb.label.topay': 'Att betala',
  'ihb.label.invoices': 'Fakturor',
  'ihb.savings_sub': 'Totalt sparat · 4,05 % ränta',
  'ihb.clear': 'Ser bra ut!',
  'ihb.sub.count_next': (c: number, when: string) =>
    c + (c === 1 ? ' faktura' : ' fakturor') + ' · nästa förfaller ' + when,
  'ihb.when.today': 'idag',
  'ihb.when.tomorrow': 'imorgon',
  'ihb.when.in_days': (n: number) => 'om ' + n + ' dagar',
  'ihb.sub.history': 'Allt betalt — se din historik',
  'ihb.sub.nothing': 'Inget att betala just nu',
  'ihb.go.handle': 'Hantera fakturor',
  'ihb.go.view': 'Visa fakturor',
  'ph.sub.week': (n: number) => n + ' köp denna vecka',
  'ph.sub.latest': (m: string) => 'Senaste: ' + m,
  'ph.sub.none': 'Ingen ny aktivitet',
  'ph.go': 'Visa köp',
  'car.explore.label': 'Utforska',
  'car.explore.body': 'Se dig omkring och upptäck vad Resurs kan hjälpa dig med.',
  'car.section.products': 'Mina produkter',
  'car.show_more': (n: number) => 'Visa ' + n + ' till',
  'car.show_less': 'Visa färre',
  'sg.title': 'Sparande',
  'sg.total': 'Totalt sparande',
  'sg.accounts': 'Konton',
  'sg.interest': (r: string | number) => r + ' % ränta',
  'sg.locked': (d: string) => 'låst till ' + d,
  'il.title': 'Fakturor',
  'pl.title': 'Köp',
  'plc.purchases_month': (n: number, amt: string) => n + ' köp denna månaden · ' + amt + ' kr',
  'plc.no_tx': 'Inga transaktioner',
  'plc.no_tx_since': (d: string) => 'Inga transaktioner sedan ' + d,

  // shell screens — login / my-resurs tweaks entry / tweaks screen / inbox / notifications
  'mr.section.tweaks': 'Prototyp',
  'mr.tweaks': 'Tweak-inställningar',
  'mr.tweaks_sub': 'Personas, layouter och demodata',

  'login.hero1': 'Lån, betalningar,',
  'login.hero2': 'sparande och kort.',
  'login.sub': 'Samlat i en bank. Flexibelt och med kontroll.',
  'login.bankid_open': 'Öppna BankID-appen',
  'login.bankid_hint': 'Starta BankID-appen och tryck på QR-ikonen.',
  'login.cancel': 'Avbryt',
  'login.cta': 'Logga in',
  'login.more': 'Fler alternativ och cookies',

  'profile.title': 'Min profil',
  'profile.contact_section': 'Kontaktuppgifter',
  'profile.customer_id': 'Kund-ID',
  'profile.preferred_name': 'Tilltalsnamn',
  'profile.email': 'E-post',
  'profile.phone': 'Telefon',

  'docs.title': 'Dokument',
  'docs.empty': 'Inga dokument i den här kategorin.',
  'docs.filter.all': 'Alla',
  'docs.filter.reminder': 'Betalningspåminnelse',
  'docs.filter.requested': 'Begärt av dig',
  'docs.filter.contracts': 'Avtal',
  'docs.filter.news': 'Nyheter',
  'msgs.empty': 'Inga meddelanden.',
  'msg.title': 'Meddelande',

  'doctype.LEGAL/FINANCIAL': 'Juridiskt / finansiellt',
  'doctype.AGREEMENT': 'Avtal',
  'doctype.TERMS': 'Villkor',
  'doctype.MESSAGE': 'Meddelande',
  'doctype.MARKETING': 'Marknadsföring',
  'doctype.REMINDER': 'Betalningspåminnelse',
  'doctype.REQUEST': 'Begärt av dig',
  'doctype.DEPOSIT_INSURANCE': 'Insättningsgaranti',
  'doctype.SAVINGS_COMMON_TERMS_NATURAL': 'Sparande — allmänna villkor (privat)',
  'doctype.SAVINGS_COMMON_TERMS_LEGAL': 'Sparande — allmänna villkor (företag)',
  'doctype.SAVINGS_SPECIAL_TERMS': 'Sparande — särskilda villkor',
  'doctype.DEFAULT_SEKKI': 'Standardiserad kreditinformation (SEKKI)',
  'doctype.INDIVIDUAL_SEKKI': 'Individuell kreditinformation (SEKKI)',
  'doctype.CREDIT_AGREEMENT': 'Kreditavtal',
  'doctype.CONSUMER_LOAN_AGREEMENT': 'Konsumentlåneavtal',
  'doctype.COMMON_TERMS': 'Allmänna villkor',
  'doctype.SAVINGS_ACCOUNT_APPLICATION': 'Ansökan om sparkonto',
  'doctype.ANNUAL_STATEMENT_SAVINGS_ACCOUNT': 'Årsbesked — sparkonto',
  'doctype.ANNUAL_STATEMENT_PRIVATE_LOAN_ACCOUNT': 'Årsbesked — privatlån',
  'doctype.ANNUAL_STATEMENT_OF_FEES': 'Årsbesked avgifter',
  'doctype.PAYMENT_PROTECTION_INSURANCE': 'Betalskydd',

  'notif.title': 'Aviseringar',
  'notif.mark_all': 'Markera alla som lästa',
  'notif.rates_title': 'Uppdaterade räntor',
  'notif.rates_desc': 'Nya spar- och utlåningsräntor gäller från 1 dec 2025.',
  'notif.hours_title': 'Öppettider under helgerna',
  'notif.hours_desc': 'Kundservice har begränsade öppettider under helgerna.',
  'notif.hours_when': 'för 2 dagar sedan',

  'tweaks.title': 'Tweaks',
  'tweaks.section.prototype': 'Prototyp',
  'tweaks.section.sandbox': 'Sandbox',
  'tweaks.section.session': 'Session',
  'tweaks.reset': 'Återställ',
  'tweaks.persona': 'Persona',
  'tweaks.invoice_status': 'Fakturastatus',
  'tweaks.language': 'Språk',
  'tweaks.family_version': 'Family-version',
  'tweaks.dark_theme': 'Mörkt tema',
  'tweaks.seed_deposit': 'Förifyllt månadssparande',
  'tweaks.confirm_pay': 'Bekräfta betalning',
  'tweaks.activity': 'Aktivitet',
  'tweaks.wallet_layout': 'Wallet-layout',
  'tweaks.login_layout': 'Inloggningslayout',
  'tweaks.back_to_login': '← Tillbaka till inloggning',
  'tweaks.persona.John':
    'John — Resurs Family (Superkonto), butikskort hos Bauhaus & NetOnNet, sparande + billån. Fakturor att betala OCH hanterade fakturor. Familjekonto med partner och barn.',
  'tweaks.persona.Bill': 'Bill — Inga fakturor att betala, har sparkonto.',
  'tweaks.persona.Kim': 'Kim — En faktura att betala, inga hanterade fakturor.',
  'tweaks.persona.Eva': 'Eva — Inga produkter ännu.',
  'tweaks.persona.Maja': 'Maja — Har gjort köp men det finns ingen faktura att betala.',
  'tweaks.persona.Alex': 'Alex — Två fakturor att betala, inga hanterade.',
  'tweaks.persona.Lena': 'Lena — Två hanterade fakturor.',

  // flows — bonus checks
  'bc.title': 'Bonuscheckar',
  'bc.tab.active': 'Aktiva',
  'bc.tab.used': 'Använda',
  'bc.expires': (d: string) => 'Går ut ' + d,
  'bc.usedline': (d: string) => 'Använd ' + d,
  'bc.valid_until': (d: string) => 'Giltig till ' + d,
  'bc.reference': (r: string) => 'Referensnr: ' + r,
  'bc.sheet.title': 'Bonuscheck',
  'bc.sheet.title_n': (i: number, n: number) => 'Bonuscheck (' + i + '/' + n + ')',
  'bc.download': 'Ladda ner',
  'bc.the_partner': 'partnern',
  'bc.empty.active.title': 'Inga aktiva bonuscheckar',
  'bc.empty.active.body': 'När du får en bonuscheck visas den här.',
  'bc.empty.used.title': 'Inga använda bonuscheckar ännu',
  'bc.empty.used.body': 'När du har använt en bonuscheck visas den här.',
  'bc.terms.p1': (partner: string) =>
    'Denna bonuscheck gäller som betalningsmedel hos ' +
    partner +
    ' och kan endast användas i sin helhet vid ett köptillfälle.',
  'bc.terms.p2': 'Utgångna eller använda bonuscheckar ersätts inte.',
  'bc.terms.p3':
    'Om du har frågor om bonuspoäng eller bonuscheckar kan du enkelt chatta med våra handläggare via Resurs-appen eller i internetbanken på resursbank.se.',

  // payment sheet
  'rc.select_amount': 'Välj belopp',
  'rc.change_amount': 'Ändra belopp',
  'rc.confirm_payment': 'Bekräfta betalning',
  'rc.fallback_product': 'Resurs-konto',
  'rc.stop.min': 'Minimum',
  'rc.stop.m12': '12 månader',
  'rc.stop.m6': '6 månader',
  'rc.stop.m3': '3 månader',
  'rc.stop.full': 'Hela beloppet',
  'rc.tier.plan.full': (full: string) =>
    'Betalar hela fakturan på ' +
    full +
    ' kr nu. Ingen ränta och ingen betalplan — köpet är avklarat.',
  'rc.tier.plan.months': (amount: string, rest: string, months: number) =>
    'Betala ' +
    amount +
    ' kr nu och dela upp resterande ' +
    rest +
    ' kr på en betalplan på ' +
    months +
    ' månader, räntefritt. Aviavgift 39 kr per månad.',
  'rc.tier.plan.min': (amount: string, rest: string, rate: number) =>
    'Betalar ' +
    amount +
    ' kr nu. Resterande ' +
    rest +
    ' kr flyttas till en plan med ' +
    rate +
    ' % ränta tills den är betald.',
  'rc.tier.custom.title': 'Valfritt belopp',
  'rc.tier.fixed.body': (fixed: string) =>
    'Justera beloppet vid behov. Den avtalade delbetalningen är ' +
    fixed +
    ' kr. Betalar du mer minskar din kvarvarande skuld snabbare.',
  'rc.tier.min.title': 'Lägsta betalning',
  'rc.tier.min.body': (min: string, rest: string, rate: number) =>
    'Täcker månadens lägsta belopp på ' +
    min +
    ' kr. Resterande ' +
    rest +
    ' kr flyttas till en plan med ' +
    rate +
    ' % ränta — du betalar ränta på den obetalda delen varje månad tills den är betald.',
  'rc.tier.slow.body': (rest: string, rate: number) =>
    'Betalar mer än minimum men mindre än en sjättedel av avin. Obetalda ' +
    rest +
    ' kr flyttas till en plan med ' +
    rate +
    ' % ränta och räntan löper varje månad tills skulden är betald.',
  'rc.tier.sixmo.title': '6 månader',
  'rc.tier.sixmo.body': (sixmo: string) =>
    'Täcker pågående betalplaner och delar upp förra månadens utgifter i 6 lika stora månadsbetalningar på ' +
    sixmo +
    ' kr utan ränta. Uppläggningsavgift 0 kr, aviavgift 39 kr per månad.',
  'rc.tier.partial.body': (amount: string, rest: string) =>
    'Täcker pågående betalplaner plus ' +
    amount +
    ' kr av förra månadens utgifter. Resterande ' +
    rest +
    ' kr delas upp i lika stora månadsbelopp under 6 månader utan ränta.',
  'rc.tier.full.title': 'Betala allt',
  'rc.tier.full.body': (balance: string) =>
    'Betalar hela avin på ' +
    balance +
    ' kr för denna period. Ingen ränta, ingen betalplan, och din kredit är fortsatt öppen för nya köp.',
  'rc.tier.topup.title': 'Fyll på',
  'rc.tier.topup.body': (extra: string) =>
    'Betalar hela avin plus ytterligare ' +
    extra +
    ' kr av kredit som redan använts denna period.',
  'rc.tier.allused.title': 'All använd kredit',
  'rc.tier.allused.body': (top: string) =>
    'Betalar allt du har använt — ' +
    top +
    ' kr — inklusive eventuella kommande debiteringar från denna period.',
  'rc.cta.minimum': (min: string) => 'Lägsta belopp är ' + min + ' SEK',
  'rc.cta.pay': (amt: string) => 'Betala ' + amt + ' SEK',
  'rc.cta.use': (amt: string) => 'Använd ' + amt + ' SEK',
  // Legally-styled consumer-credit warning — Swedish-only by design (verbatim).
  'rc.warning.title': 'Att låna kostar pengar!',
  'rc.warning.body':
    'Om du inte kan betala tillbaka skulden i tid riskerar du en betalningsanmärkning. ' +
    'Det kan leda till svårigheter att få hyra bostad, teckna abonnemang och få nya lån. ' +
    'För stöd, vänd dig till budget- och skuldrådgivningen i din kommun. Kontaktuppgifter finns på ',
  'rc.warning.link': 'konsumentverket.se',
  'rc.dial.type': 'Ange',
  'rc.dial.done': 'Klar',
  'rc.cfs.amount_label': 'Belopp att betala',
  'rc.cfs.change': 'Ändra',
  'rc.cfs.changed_from': (amt: string) => 'Ändrat från ' + amt + ' SEK',
  'rc.cfs.relates_to': 'Avser',
  'rc.cfs.from_account': 'Från konto',
  'rc.cfs.payment_date': 'Betalningsdag',
  'rc.from.nordea': 'Nordea *345',
  'rc.from.savings': 'Sparande · Flexibelt',
  'rc.date.today': 'Idag',
  'rc.date.tomorrow': 'Imorgon',
  'rc.date.due': 'På förfallodagen',
  'rc.date.other': 'Annat',
  'rc.confirm.bankid': 'Bekräfta med BankID',
  'rc.success.title': 'Betalning skickad',
  'rc.success.body': 'Din betalning är på väg. Det kan ta upp till en bankdag innan den syns.',
  'rc.success.product': 'Produkt',
  'rc.success.reference': 'Referens',
  'rc.success.done': 'Klar',
  'rc.ppi.title': 'Betalskydd',
  'rc.ppi.price': '39 kr/mån',
  'rc.ppi.body':
    'Täcker dina månadsbetalningar om du inte kan arbeta på grund av sjukdom eller ofrivillig arbetslöshet.',
  'rc.ppi.add': 'Lägg till skydd',
  'rc.ppi.added': 'Tillagt — tryck för att ta bort',
  // wallet+discover screens
  'wallet.empty.title': 'Inga produkter än',
  'wallet.empty.desc': 'Öppna ett sparkonto, ansök om ett lån eller betala hos en partnerbutik.',
  'wallet.empty.cta': 'Utforska produkter',
  'wallet.section.products': 'Mina produkter',
  'wallet.show_hidden': (n: number) => 'Visa ' + n + ' dolda',
  'wallet.hide_hidden': 'Dölj',
  'wallet.hide': 'Dölj',
  'wallet.unhide': 'Visa',
  'wallet.no_credit_used': 'Ingen kredit utnyttjad',
  'wallet.purchases_month': (n: number, amt: string) =>
    n + ' köp denna månad · ' + amt + ' kr',
  'wallet.rollup_purchases': (amt: string) => 'Köp denna månad ' + amt + ' kr',
  'wallet.pay_remaining': 'Betala återstående saldo',
  'wallet.paid_on': (d: string) => 'Betald ' + d,
  'wallet.purchased': (d: string) => 'Köpt ' + d,
  'wallet.original_loan': (amt: string) => 'Ursprungligt lån ' + amt + ' kr',
  'wallet.interest_ctx': (r: string) => 'Ränta ' + r + '%',
  'wallet.interest_range': (lo: string, hi: string) => 'Ränta ' + lo + '%–' + hi + '%',
  'wallet.locked_to': (d: string) => 'låst till ' + d,
  'wallet.accounts_count': (n: number) => n + (n === 1 ? ' konto' : ' konton'),
  'wallet.needs_attention': (n: number) => n + ' kräver åtgärd',
  'disc.empty.title': 'Det finns inga erbjudanden just nu',
  'disc.empty.sub':
    'Personliga erbjudanden visas här när du kommit igång. Utforska under tiden Resurs sparande, lån och Resurs kreditkort — flexibla vardagsprodukter utan dolda avgifter.',
  'disc.start.savings.t': 'Sparkonto',
  'disc.start.savings.s': 'Upp till 4,05 % ränta',
  'disc.start.loan.t': 'Privatlån',
  'disc.start.loan.s': 'Från 5,95 % — ingen säkerhet krävs',
  'disc.start.card.t': 'Resurs kreditkort',
  'disc.start.card.s': 'Betala nu eller senare — du väljer',
  'disc.offer.cta': 'Se dina alternativ',
  'disc.sheet.note': (label: string) =>
    'Detta är en platshållarskärm — hela ' + label + '-flödet är inte byggt än.',

  // detail screens
  'detail.not_found_title': 'Hittades inte',
  'detail.not_found_desc': 'Vi kunde inte hitta det du letar efter.',
  'setting.placeholder_desc':
    'Den här skärmen är inte en del av prototypen än. Den är en platshållare så att flödet förblir klickbart.',
  'setting.back': 'Gå tillbaka',
  'common.edit': 'Ändra',
  'common.total': 'Totalt',
  'acct.no_tx': 'Inga transaktioner än.',
  'acct.creation_date': 'Kontots startdatum',
  'acct.owner_val': 'Kontoägare',
  'acct.rate_type': 'Räntetyp',
  'acct.rate_variable': 'Rörlig ränta',
  'acct.rate_date': 'Räntedatum',
  'acct.limit': 'Gräns',
  'hero.total_savings': 'Totalt sparande',
  'hero.earned_this_year': 'Intjänat i år',
  'hero.pts': 'p',
  'hero.credit': 'Kredit',
  'hero.buffer': 'Buffert',
  'hero.used': 'utnyttjat',
  'hero.saved': 'sparat',
  'pd.qa.pay': 'Betala',
  'pd.qa.move': 'Flytta',
  'pd.qa.card': 'Kort',
  'pd.qa.help': 'Hjälp',
  'pd.budget.over': (a: string | number) => a + ' kr över budget',
  'pd.budget.under': (a: string | number) => a + ' kr under budget',
  'pd.budget.days_left': (n: number) => n + ' dagar kvar',
  'pd.empty.merchant': (name: string) =>
    'Betala hos ' + name + ' med Resurs för att se dina köp här.',
  'pd.empty.generic': 'Använd ditt konto för att se aktivitet här.',
  'pd.family_credit': 'Familjekredit',
  'pd.family_buffer': 'Familjebuffert',
  'pd.total_saved': 'Totalt sparat',
  'pd.no_offers': 'Inga erbjudanden just nu.',
  'fam.years_old': (n: number) => n + ' år',
  'fam.add': 'Lägg till familjemedlem',
  'fam.add_sub': 'Du kan lägga till familjemedlemmar när som helst',
  'fam.profile_title': 'Användarprofil',
  'fam.back_coordinator': 'Samordnarkonto',
  'fam.back_overview': 'Resurs Family-översikt',
  'fam.edit_name': 'Ändra familjenamn',
  'fam.name_label': 'Vad ska vi kalla er familj? (valfritt)',
  'fam.name_help': 'Till exempel Andersson eller Bergström',
  'fam.edit_member': 'Ändra familjemedlem',
  'fam.enter_name': 'Ange namn',
  'fam.dob': 'Födelsedatum',
  'fam.ssn': 'Personnummer',
  'fam.label': 'Lägg till etikett (valfritt)',
  'fam.avatar': 'Välj avatar',
  'fam.delete': 'Ta bort användarprofil',
  'fam.child.title': 'Digitalt kort för barn',
  'fam.child.coming': '(kommer senare)',
  'fam.child.body': 'När ditt barn fyllt 13 kan du ge hen ett digitalt kort.',
  'fam.child.bullet1': 'Du sätter en köpgräns',
  'fam.child.bullet2': 'Du ser transaktioner i realtid',
  'fam.save': 'Spara ändringar',
  'fbp.period': 'Period',
  'fbp.period_line': (range: string, n: number) => range + ' · ' + n + ' dagar kvar',
  'fbp.spent_so_far': 'Spenderat hittills',
  'fbp.avg_per_day': (n: string | number) => 'Snitt per dag: ' + n + ' kr',
  'fbp.forecast': 'Prognos',
  'fbp.at_end': 'vid periodens slut',
  'fbp.compare_lower': (n: string | number) =>
    'Snitt per dag jämfört med förra perioden: ' + n + ' kr lägre',
  'ppi.linked_to': 'Kopplad till',
  'ppi.insurer': 'Försäkringsgivare',
  'ppi.when_title': 'När kan försäkringen ge ersättning?',
  'ppi.when_intro':
    'Försäkringen kan ge ersättning i enlighet med villkoren om du till exempel:',
  'ppi.bullet1': 'Är sjukskriven till minst 50 %.',
  'ppi.bullet2': 'Blir ofrivilligt arbetslös till minst 50 %.',
  'ppi.bullet3': 'Är inlagd på sjukhus i mer än 5 dagar.',
  'ppi.bullet4': 'Avlider till följd av en olycka.',
  'ppi.compensation':
    'För vissa ersättningsgrundande händelser kan ersättning betalas ut i upp till 12 månader. Vid dödsfall till följd av olycka kan upp till 50 000 kr betalas ut till dödsboet.',
  'ppi.full_terms': 'Fullständiga villkor finns i försäkringsvillkoren.',
  'ppi.cancel_insurance': 'Säg upp betalskyddet',
  'fins.headline': 'Trygghet när det oväntade händer',
  'fins.intro':
    'Inbyggda försäkringar som skyddar familjen när livet tar en oväntad vändning. Hur du använder försäkringarna nedan framgår av Resurs Family-avtalet som är kopplat till produkten.',
  'fins.home_title': 'Självriskskydd för hemförsäkring',
  'fins.home_help': 'Täcker självrisken vid skador på din hemförsäkring',
  'fins.home_amount': 'Upp till 10 000 kr i självriskskydd',
  'fins.food_title': 'Matförsäkring',
  'fins.food_help':
    'Hjälper om du förlorar jobbet. Förutsatt att kortet använts för matinköp under de senaste 3 månaderna.',
  'fins.food_amount': 'En engångsersättning på 3 000 kr',
  'fins.travel_title': 'Reseförsäkring',
  'fins.travel_help':
    'Ersätter förbetalda kostnader (flyg, hotell, utflykter) om du måste avboka innan resan börjar. Ersätter nödvändiga inköp om ditt flyg eller bagage är försenat.',
  'fins.travel_amount': 'Upp till 5 000 kr per händelse',
  'fins.included': 'Ingår',
  'pr.sub.partial': (paid: string, d: string) => paid + ' betalt den ' + d,
  'pr.sub.paid': (d: string) => 'Betald den ' + d,
  'pr.sub.scheduled': (d: string) => 'Schemalagd till ' + d,
  'pr.banner.partial':
    'Ett lägre belopp betalades, vilket leder till en ny betalplan. Om det inte var din avsikt, se till att komma ikapp på nästa faktura.',
  'pr.banner.paid': 'Betalningen är genomförd.',
  'pr.banner.scheduled':
    'En betalningsbegäran initieras mot Nordea *34-kontot. För en lyckad betalning, se till att det finns pengar på transaktionsdagen.',
  'pr.desc.delbetalning':
    'Detta är en månatlig delbetalning för dina Flex-köp i augusti, som sprider kostnaden i lika stora delbetalningar.',
  'pr.desc.laneavi':
    'Detta är en månatlig avbetalning på ditt lån som täcker en del av kapitalet plus ränta. Restskulden minskar med varje betalning.',
  'pr.desc.faktura': (name: string) =>
    'Denna faktura avser köp gjorda hos ' +
    name +
    ' i november. Betala hela beloppet före förfallodagen eller dela upp det i en delbetalningsplan.',
  'pr.desc.manadsavi':
    'Denna faktura avser köp gjorda förra månaden samt eventuella pågående betalplaner från tidigare avier.',
  'pr.original_debt': 'Ursprunglig skuld',
  'pr.last_month': 'Förra månaden',
  'pr.purchases_count': (n: number) => n + ' köp',
  'pr.items_count': (n: number) => n + (n === 1 ? ' artikel' : ' artiklar'),
  'pr.july': 'Juli',
  'tx.resursone_pitch':
    'Aktivera ResursOne — betala snabbare överallt, få kickback på dina köp och dela upp din faktura i räntefria delbetalningar.',
  'tx.partpay_active': (n: number) =>
    'Detta köp delbetalas över ' + n + ' månader och faktureras som en delbetalning i december.',
  'tx.date_time': 'Datum & tid',
  'tx.type_ecom': 'E-handel',
  'tx.type_instore': 'Kortköp i butik',
  'tx.pp.title': 'Delbetalningsalternativ',
  'tx.pp.desc': (amt: string, merchant: string) =>
    'Dela upp ditt köp på ' + amt + ' hos ' + merchant + ' i lika stora månadsbetalningar.',
  'tx.pp.months': (n: number) => n + ' månader',
  'tx.pp.interest_free': 'Räntefritt',
  'tx.pp.interest': (r: string | number) => r + ' % ränta',
  'tx.pp.fee': (fee: string) => fee + '/mån i avgift',
  'tx.pp.per_month': (amt: string, cur: string) => amt + ' ' + cur + '/mån',
  'tx.pp.confirm': 'Bekräfta delbetalning',
  'tx.pp.done_title': 'Delbetalning aktiverad',
  'tx.pp.done_body': (amt: string, merchant: string, months: number) =>
    'Ditt köp på ' +
    amt +
    ' hos ' +
    merchant +
    ' betalas nu över ' +
    months +
    ' månader. Det visas som en delbetalningsfaktura med förfallodag 31 dec 2025.',
  'invpdf.note':
    'Detta är en prototypfaktura. I produktion genereras denna PDF av kärnsystemet.',
};
