// AccountOverviewSections — renders the Q3 account-detail OVERVIEW body from
// the canonical structure (src/data/accountSpec.ts STRUCTURE). Port of
// details.jsx AccountOverviewSections + AcctServicesCard +
// AcctInvoiceHistoryCard. The host page supplies real data + handlers;
// tabs are host-owned.

import React from 'react';
import { Pressable, View } from 'react-native';

import { KvCopyRow, KvRow, RyButton, RyCard, RyIcon, SectionTitle, ServiceRow } from '@/src/components/ry';
import {
  PRIMARY,
  SERVICES,
  STRUCTURE,
  type Account,
  type AccountKind,
  type Invoice,
  type MonthlyDepositConfig,
  type Product,
  type ServiceAction,
  type SpecCardRow,
  type SpecSection,
} from '@/src/data';
import { MonthlyDepositSummaryCard } from '@/src/features/flows/monthly-deposits/MonthlyDepositsFlow';
import { useT } from '@/src/i18n';
import { useRyTheme } from '@/src/theme/useRyTheme';

import { BonusCheckEntryRow, CardRow, InvoiceRow, LinkRow } from './rows';

/* ============================================================
 * AcctServicesCard — the shared Q3 "Services" card.
 * ============================================================ */

export function AcctServicesCard({
  kind,
  runAcctAction,
  onOpenPlaceholder,
}: {
  kind: AccountKind;
  runAcctAction?: (action: ServiceAction | undefined, label: string) => void;
  onOpenPlaceholder?: (title: string) => void;
}) {
  const { tCard } = useT();
  const rows = SERVICES[kind] || [];
  if (rows.length === 0) return null;
  return (
    <>
      <SectionTitle>{tCard('Services')}</SectionTitle>
      <RyCard>
        {rows.map((act, j) => (
          <ServiceRow
            key={j}
            icon={act.icon}
            title={act.label}
            danger={act.danger}
            last={j === rows.length - 1}
            onPress={() =>
              runAcctAction ? runAcctAction(act.action, act.label) : onOpenPlaceholder?.(act.label)
            }
          />
        ))}
      </RyCard>
    </>
  );
}

/* ============================================================
 * AcctInvoiceHistoryCard — the shared Q3 "Invoice history" card.
 * ============================================================ */

export function AcctInvoiceHistoryCard({
  invoices,
  product,
  onOpenInvoice,
}: {
  invoices: Invoice[];
  product: Product;
  onOpenInvoice?: (inv: Invoice, p: Product) => void;
}) {
  const { tCard } = useT();
  const invs = (invoices || []).slice(0, 3);
  if (invs.length === 0) return null;
  return (
    <>
      <SectionTitle>{tCard('Invoice history')}</SectionTitle>
      <RyCard>
        {invs.map((inv, i) => (
          <InvoiceRow
            key={inv.id}
            inv={inv}
            last={i === invs.length - 1}
            onPress={() => onOpenInvoice?.(inv, product)}
          />
        ))}
      </RyCard>
    </>
  );
}

/* ============================================================
 * AccountOverviewSections
 * ============================================================ */

export type AccountOverviewSectionsProps = {
  kind: AccountKind;
  account: Account;
  product: Product;
  onOpenInvoice?: (inv: Invoice, p: Product) => void;
  onOpenPlaceholder?: (title: string) => void;
  runAcctAction?: (action: ServiceAction | undefined, label: string) => void;
  onInsurance?: (title: string) => void;
  onOpenBonusChecks?: (a: Account, p: Product) => void;
  onOpenCard?: (card: SpecCardRow, a: Account, p: Product) => void;
  /** Info-row (value null + info flag) tap — e.g. the Cashback explainer. */
  onInfo?: (label: string) => void;
  mdDeposit?: MonthlyDepositConfig | null;
  onEditDeposit?: () => void;
};

export function AccountOverviewSections({
  kind,
  account: a,
  product: p,
  onOpenInvoice,
  onOpenPlaceholder,
  runAcctAction,
  onInsurance,
  onOpenBonusChecks,
  onOpenCard,
  onInfo,
  mdDeposit,
  onEditDeposit,
}: AccountOverviewSectionsProps) {
  const { colors } = useRyTheme();
  const { t, tCard } = useT();
  const structure = STRUCTURE[kind];
  if (!structure) return null;

  const acctInvoices = (p.invoices || []).filter((inv) => inv.accountId === a.id);
  const invs = (acctInvoices.length ? acctInvoices : p.invoices || []).slice(0, 3);

  const render = (sec: SpecSection, i: number): React.ReactNode => {
    switch (sec.t) {
      case 'cta': {
        const btn = PRIMARY[kind];
        if (!btn) return null;
        return (
          <RyButton
            key={i}
            title={tCard(btn.label)}
            icon={btn.icon}
            variant="primary"
            block
            style={{ marginTop: 8, marginBottom: 12 }}
            onPress={() => runAcctAction?.(btn.action, btn.label)}
          />
        );
      }
      case 'monthlyDeposit':
        if (!mdDeposit) return null;
        return (
          <View key={i}>
            <SectionTitle>{tCard('Monthly deposit')}</SectionTitle>
            <MonthlyDepositSummaryCard deposit={mdDeposit} onClick={onEditDeposit} />
          </View>
        );
      case 'cards':
        return (
          <View key={i}>
            <SectionTitle>{tCard('Cards')}</SectionTitle>
            <RyCard>
              {sec.rows.map((c, j) => (
                <CardRow
                  key={c.last4}
                  img={sec.img}
                  thumbVariant="contain"
                  title={`${c.holder} ····${c.last4}`}
                  sub={`${tCard(c.extra ? 'Extra card' : 'Main card')} · ${tCard('Exp.')} ${c.exp}`}
                  last={j === sec.rows.length - 1}
                  onPress={() =>
                    onOpenCard
                      ? onOpenCard(c, a, p)
                      : onOpenPlaceholder?.(c.extra ? 'Extra card' : 'Main card')
                  }
                />
              ))}
            </RyCard>
          </View>
        );
      case 'details':
        return (
          <View key={i}>
            <SectionTitle>{tCard('Account details')}</SectionTitle>
            <RyCard>
              {sec.rows.map((r, j) => {
                const [label, value, opts] = r;
                const last = j === sec.rows.length - 1;
                if (value == null) {
                  // Info-only row (e.g. Cashback explainer) — label + info icon.
                  return (
                    <View
                      key={j}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 6,
                        paddingVertical: 10,
                        paddingHorizontal: 16,
                        borderBottomWidth: last ? 0 : 1,
                        borderBottomColor: colors.borderSubtle,
                      }}>
                      <KvRow
                        label={tCard(label)}
                        value=""
                        last
                        style={{ flex: 1, paddingVertical: 0, paddingHorizontal: 0, borderBottomWidth: 0 }}
                      />
                      <Pressable
                        accessibilityLabel={`About ${label}`}
                        hitSlop={8}
                        onPress={() => onInfo?.(label)}>
                        <RyIcon name="fa-circle-info" size={15} color={colors.iconMuted} />
                      </Pressable>
                    </View>
                  );
                }
                return (
                  <KvCopyRow
                    key={j}
                    label={tCard(label)}
                    value={tCard(value)}
                    mono={!!opts?.mono}
                    copy={!!opts?.copy}
                    last={last}
                  />
                );
              })}
            </RyCard>
          </View>
        );
      case 'bonusProgram':
        return (
          <View key={i}>
            <SectionTitle>{tCard('Resurs Bonus Shop')}</SectionTitle>
            <RyCard>
              <ServiceRow
                variant="explore"
                icon="fa-gift"
                title="Go to bonus shop"
                sub={sec.points ? `${tCard('Available bonus points')} ${sec.points}` : undefined}
                last
                onPress={() => onOpenPlaceholder?.('Go to bonus shop')}
              />
            </RyCard>
          </View>
        );
      case 'bonusChecks': {
        const checks =
          a.type === 'creditAccount' && a.bonusChecks ? a.bonusChecks.active || [] : [];
        return (
          <View key={i}>
            <SectionTitle>{tCard('Bonus checks')}</SectionTitle>
            <BonusCheckEntryRow count={checks.length} onPress={() => onOpenBonusChecks?.(a, p)} />
          </View>
        );
      }
      case 'insurances':
        if (!sec.rows || sec.rows.length === 0) return null;
        return (
          <View key={i}>
            <SectionTitle>{tCard('Insurances')}</SectionTitle>
            <RyCard>
              {sec.rows.map((r, j) => (
                <ServiceRow
                  key={j}
                  variant="explore"
                  icon={r.icon}
                  title={r.title}
                  last={j === sec.rows.length - 1}
                  onPress={() =>
                    onInsurance ? onInsurance(r.title) : onOpenPlaceholder?.(r.title)
                  }
                />
              ))}
            </RyCard>
          </View>
        );
      case 'services':
        return (
          <AcctServicesCard
            key={i}
            kind={kind}
            runAcctAction={runAcctAction}
            onOpenPlaceholder={onOpenPlaceholder}
          />
        );
      case 'invoices':
        return (
          <AcctInvoiceHistoryCard key={i} invoices={invs} product={p} onOpenInvoice={onOpenInvoice} />
        );
      case 'documents':
        return (
          <View key={i}>
            <SectionTitle>{tCard('Documents and agreements')}</SectionTitle>
            <RyCard>
              {sec.rows.map((r, j) => (
                <LinkRow
                  key={j}
                  icon={r.icon}
                  title={r.title}
                  sub={r.sub}
                  last={j === sec.rows.length - 1}
                  onPress={() => onOpenPlaceholder?.(r.title)}
                />
              ))}
            </RyCard>
          </View>
        );
      default:
        return null; // tabs are rendered by the host
    }
  };

  void t;

  return <>{structure.map(render)}</>;
}
