// AccountTransactionsView — port of details.jsx: the "See all" page for an
// account. Search bar + filter button, a preselected latest-month date chip,
// the full merged transaction list, and the product-adaptive filter dialog
// (users / date range / type chips / amount range).
//
// Deviation: the date-range fields are plain YYYY-MM-DD text inputs (RN has
// no native <input type="date">).

import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { BaseDialog, RyButton, RyCard, RyIcon, TransactionRow } from '@/src/components/ry';
import { ryFont } from '@/src/components/ry/typography';
import { RY_TODAY, type Account, type Product, type Purchase } from '@/src/data';
import { useT } from '@/src/i18n';
import { useRyTheme } from '@/src/theme/useRyTheme';

import { CashbackNote } from './rows';
import { DetailScreen } from './DetailScreen';
import * as nav from './nav';
import { txTypeConfig, type TxCategory } from './txTypeConfig';

type Filters = {
  dateFrom: string;
  dateTo: string;
  types: TxCategory[];
  amtMin: string;
  amtMax: string;
  users: string[];
};

/** `.ry-fil-field` — bordered label + input box (module-level so the
 *  TextInput keeps focus across re-renders). */
function FilterField({
  label,
  value,
  placeholder,
  numeric = false,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  numeric?: boolean;
  onChange: (v: string) => void;
}) {
  const { colors } = useRyTheme();
  return (
    <View style={[styles.filField, { borderColor: colors.borderSubtle, backgroundColor: colors.bgPaper }]}>
      <Text style={[ryFont('400'), styles.filFieldLabel, { color: colors.fgSecondary }]}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.fgDisabled}
        keyboardType={numeric ? 'numeric' : 'default'}
        style={[ryFont('400'), styles.filFieldInput, { color: colors.fgPrimary }]}
      />
    </View>
  );
}

export function AccountTransactionsView({
  account: a,
  product: p,
  purchasesOnly = false,
}: {
  account: Account;
  product: Product;
  purchasesOnly?: boolean;
}) {
  const { colors } = useRyTheme();
  const { tCard } = useT();

  // Merge + de-dupe ledger rows from product.purchases and account.transactions.
  const allTx: Purchase[] = useMemo(() => {
    const fromProduct = (p.purchases || []).filter((tx) => tx.accountId === a.id);
    const fromAccount = a.type === 'depositAccount' ? a.transactions || [] : [];
    const seen = new Set<string>();
    let list = [...fromProduct, ...fromAccount]
      .filter((tx) => (seen.has(tx.id) ? false : (seen.add(tx.id), true)))
      .sort((x, y) => new Date(y.date).getTime() - new Date(x.date).getTime());
    if (purchasesOnly) list = list.filter((tx) => tx.type === 'purchase');
    return list;
  }, [a, p, purchasesOnly]);

  const cfg = txTypeConfig(a);

  // Total cashback — from the FULL set, never the filtered one.
  const cashbackTotal = useMemo(() => {
    const cred = (p.accounts || []).find((x) => x.type === 'creditAccount');
    const linked = cred
      ? (p.purchases || [])
          .filter((tx) => tx.accountId === cred.id && tx.type === 'purchase' && !tx.preliminary)
          .reduce((s, tx) => s + Math.floor((tx.amount?.amount || 0) / 100), 0)
      : 0;
    const ownTx = a.type === 'depositAccount' ? a.transactions || [] : [];
    const hasCbTx = ownTx.some((tx) => tx.subLabel === 'Cashback');
    if (a.type === 'depositAccount' && hasCbTx && cred) return linked;
    return allTx.reduce((s, tx) => s + cfg.cashbackOf(tx), 0);
  }, [a, p, allTx, cfg]);

  // Default date range — one month back up to today.
  const todayDate = new Date(RY_TODAY);
  const monthAgo = new Date(todayDate);
  monthAgo.setMonth(monthAgo.getMonth() - 1);
  const isoFmt = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const defFrom = isoFmt(monthAgo);
  const defTo = isoFmt(todayDate);

  const famCards =
    p.id === 'p-family' && a.type === 'creditAccount' && a.cards
      ? a.cards.filter((c): c is { id: string; name: string } => 'id' in c)
      : null;
  const mainHolder = famCards && famCards[0] ? famCards[0].name : '';
  const holderOf = (tx: Purchase): string | undefined =>
    famCards
      ? (tx.type === 'purchase' && tx.user && famCards.find((c) => c.id === tx.user)?.name) ||
        mainHolder
      : undefined;

  const [query, setQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const emptyFilters: Filters = { dateFrom: defFrom, dateTo: defTo, types: [], amtMin: '', amtMax: '', users: [] };
  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const { dateFrom, dateTo, types, amtMin, amtMax, users } = filters;

  const rangeLabel = `${dateFrom} – ${dateTo}`;
  const filtered = allTx.filter((tx) => {
    const q = query.trim().toLowerCase();
    const matchQ = !q || (tx.merchant || '').toLowerCase().includes(q);
    const d = new Date(tx.date);
    const matchDate = (!dateFrom || d >= new Date(dateFrom)) && (!dateTo || d <= new Date(dateTo));
    const matchType = types.length === 0 || types.some((k) => cfg.matches(tx, k));
    const matchUser = users.length === 0 || (tx.user != null && users.includes(tx.user));
    const amt = tx.amount ? tx.amount.amount : 0;
    const matchMin = !amtMin || amt >= Number(amtMin);
    const matchMax = !amtMax || amt <= Number(amtMax);
    return matchQ && matchDate && matchType && matchUser && matchMin && matchMax;
  });
  const clearFilters = () => setFilters(emptyFilters);
  const filtersActive =
    types.length > 0 || users.length > 0 || !!amtMin || !!amtMax || dateFrom !== defFrom || dateTo !== defTo;

  /* ── Filter dialog body ── */
  const set = (patch: Partial<Filters>) => setFilters((prev) => ({ ...prev, ...patch }));
  const toggleType = (key: TxCategory) =>
    set({ types: types.includes(key) ? types.filter((k) => k !== key) : [...types, key] });
  const typeCount = (key: TxCategory) => allTx.filter((tx) => cfg.matches(tx, key)).length;
  const present = new Set(allTx.map((tx) => cfg.classify(tx)));
  const hasCashback = present.has('cashback') || allTx.some((tx) => cfg.cashbackOf(tx) > 0);
  const visibleTypes: { key: TxCategory; label: string; icon: string }[] = (
    purchasesOnly
      ? (['purchase', 'cashback'] as TxCategory[])
      : cfg.order.filter(
          (k) => cfg.base.includes(k) || present.has(k) || (k === 'cashback' && hasCashback),
        )
  ).map((k) => ({ key: k, ...cfg.meta[k] }));
  const filterUsers = famCards && famCards.length > 1 ? famCards : [];
  const toggleUser = (id: string) =>
    set({ users: users.includes(id) ? users.filter((x) => x !== id) : [...users, id] });

  const SectionLabel = ({ children }: { children: string }) => (
    <Text style={[ryFont('700'), styles.filSectionLabel, { color: colors.fgPrimary }]}>
      {children}
    </Text>
  );

  const filterDialog = (
    <BaseDialog open={filterOpen} onClose={() => setFilterOpen(false)} title={tCard('Filter')} size="medium">
      {filterUsers.length > 0 ? (
        <>
          <SectionLabel>{tCard('Users')}</SectionLabel>
          <View
            style={[
              styles.filBox,
              { backgroundColor: colors.bgPaper, borderColor: colors.borderSubtle, paddingVertical: 2 },
            ]}>
            {filterUsers.map((u, i) => {
              const on = users.includes(u.id);
              return (
                <Pressable
                  key={u.id}
                  onPress={() => toggleUser(u.id)}
                  style={[
                    styles.filUser,
                    { borderBottomColor: colors.borderSubtle },
                    i === filterUsers.length - 1 && { borderBottomWidth: 0 },
                  ]}>
                  <View style={[styles.filUserAvatar, { backgroundColor: colors.primaryBackground }]}>
                    <RyIcon name="fa-user" size={13} color={colors.primaryMain} />
                  </View>
                  <Text style={[ryFont('500'), styles.filUserName, { color: colors.fgPrimary }]}>
                    {u.name}
                  </Text>
                  <View
                    style={[
                      styles.filCheck,
                      { borderColor: on ? colors.primaryMain : colors.borderDefault },
                    ]}>
                    {on ? <RyIcon name="fa-check" size={13} color={colors.primaryMain} /> : null}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </>
      ) : null}

      <SectionLabel>{tCard('Date range')}</SectionLabel>
      <View style={styles.filRow}>
        <FilterField label={tCard('From')} value={dateFrom} onChange={(v) => set({ dateFrom: v })} />
        <Text style={[styles.filSep, { color: colors.fgSecondary }]}>–</Text>
        <FilterField label={tCard('To')} value={dateTo} onChange={(v) => set({ dateTo: v })} />
      </View>

      <SectionLabel>{tCard('Transaction type')}</SectionLabel>
      <View style={styles.filTypes}>
        <Pressable
          onPress={() => set({ types: [] })}
          style={[
            styles.filType,
            {
              backgroundColor: colors.bgPaper,
              borderColor: types.length === 0 ? colors.primaryMain : colors.borderSubtle,
            },
          ]}>
          <View style={[styles.filTypeIcon, { backgroundColor: colors.grey200 }]}>
            <RyIcon name="fa-receipt" size={13} color={colors.fgSecondary} />
          </View>
          <Text style={[ryFont('400'), styles.filTypeText, { color: colors.fgPrimary }]}>
            {tCard('All')} <Text style={{ color: colors.fgSecondary }}>({allTx.length})</Text>
          </Text>
        </Pressable>
        {visibleTypes.map((vt) => (
          <Pressable
            key={vt.key}
            onPress={() => toggleType(vt.key)}
            style={[
              styles.filType,
              {
                backgroundColor: colors.bgPaper,
                borderColor: types.includes(vt.key) ? colors.primaryMain : colors.borderSubtle,
              },
            ]}>
            <View style={[styles.filTypeIcon, { backgroundColor: colors.grey200 }]}>
              <RyIcon name={vt.icon} size={13} color={colors.fgSecondary} />
            </View>
            <Text style={[ryFont('400'), styles.filTypeText, { color: colors.fgPrimary }]}>
              {tCard(vt.label)} <Text style={{ color: colors.fgSecondary }}>({typeCount(vt.key)})</Text>
            </Text>
          </Pressable>
        ))}
      </View>

      <SectionLabel>{tCard('Amount')}</SectionLabel>
      <View style={styles.filRow}>
        <FilterField label={tCard('Min')} value={amtMin} placeholder="0" numeric onChange={(v) => set({ amtMin: v })} />
        <Text style={[styles.filSep, { color: colors.fgSecondary }]}>–</Text>
        <FilterField label={tCard('Max')} value={amtMax} placeholder="—" numeric onChange={(v) => set({ amtMax: v })} />
      </View>

      <View style={styles.filFooter}>
        <RyButton title={tCard('Clear all filters')} variant="outlined" block onPress={clearFilters} />
        <RyButton title={tCard('Apply filters')} variant="primary" block onPress={() => setFilterOpen(false)} />
      </View>
    </BaseDialog>
  );

  return (
    <DetailScreen title={tCard(purchasesOnly ? 'Latest purchases' : 'Transactions')} overlay={filterDialog}>
      {/* Search row */}
      <View style={styles.searchRow}>
        <View style={[styles.search, { backgroundColor: colors.bgPaper, borderColor: colors.borderSubtle }]}>
          <RyIcon name="fa-magnifying-glass" size={14} color={colors.fgSecondary} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={tCard('Search transactions')}
            placeholderTextColor={colors.fgSecondary}
            style={[ryFont('400'), styles.searchInput, { color: colors.fgPrimary }]}
          />
          {query ? (
            <Pressable accessibilityLabel="Clear search" onPress={() => setQuery('')} hitSlop={8}>
              <RyIcon name="fa-xmark" size={14} color={colors.fgSecondary} />
            </Pressable>
          ) : null}
        </View>
        <Pressable
          accessibilityLabel={tCard('Filter')}
          onPress={() => setFilterOpen(true)}
          style={[
            styles.filterBtn,
            {
              backgroundColor: colors.bgPaper,
              borderColor: filtersActive ? colors.primaryMain : colors.borderSubtle,
            },
          ]}>
          <RyIcon
            name="fa-sliders"
            size={16}
            color={filtersActive ? colors.primaryMain : colors.fgPrimary}
          />
          {filtersActive ? (
            <View
              style={[
                styles.filterDot,
                { backgroundColor: colors.primaryMain, borderColor: colors.bgDefault },
              ]}
            />
          ) : null}
        </Pressable>
      </View>

      {/* Date chip */}
      <View style={styles.chips}>
        <Pressable
          onPress={() => setFilterOpen(true)}
          style={[styles.chip, { backgroundColor: colors.bgPaper, borderColor: colors.primaryMain }]}>
          <RyIcon name="fa-calendar" size={12} color={colors.fgSecondary} />
          <Text style={[ryFont('600'), styles.chipText, { color: colors.fgSecondary }]}>
            {rangeLabel}
          </Text>
        </Pressable>
      </View>

      {filtered.length > 0 ? (
        (() => {
          const prelim = filtered.filter((tx) => tx.preliminary);
          const reg = filtered.filter((tx) => !tx.preliminary);
          const rows = [...prelim, ...reg];
          return (
            <>
              {cashbackTotal > 0 ? (
                <CashbackNote>{`${tCard('Total cashback')}: ${cashbackTotal} kr`}</CashbackNote>
              ) : null}
              <RyCard>
                {rows.map((tx, i) => (
                  <TransactionRow
                    key={tx.id}
                    tx={tx}
                    hideIcon
                    absDate
                    cashback={cfg.cashbackOf(tx)}
                    holder={holderOf(tx)}
                    last={i === rows.length - 1}
                    onPress={() => nav.openTx(tx, p, true)}
                  />
                ))}
              </RyCard>
            </>
          );
        })()
      ) : (
        <RyCard style={{ padding: 20, alignItems: 'center' }}>
          <Text style={[ryFont('400'), { fontSize: 14, color: colors.fgSecondary, textAlign: 'center' }]}>
            {tCard('No transactions match your filter.')}
          </Text>
        </RyCard>
      )}
    </DetailScreen>
  );
}

const styles = StyleSheet.create({
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4, marginBottom: 12 },
  search: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    height: 44,
  },
  searchInput: { flex: 1, fontSize: 15, paddingVertical: 0, minWidth: 0 },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  filterDot: {
    position: 'absolute',
    top: -1,
    right: -1,
    width: 11,
    height: 11,
    borderRadius: 999,
    borderWidth: 2,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 999,
    borderWidth: 1,
  },
  chipText: { fontSize: 13 },
  // Filter dialog
  filSectionLabel: { fontSize: 15, marginTop: 18, marginBottom: 8, marginHorizontal: 2 },
  filBox: { borderWidth: 1, borderRadius: 14, paddingHorizontal: 16, marginBottom: 2 },
  filUser: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  filUserAvatar: {
    width: 30,
    height: 30,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  filUserName: { flex: 1, minWidth: 0, fontSize: 16 },
  filCheck: {
    width: 26,
    height: 26,
    borderRadius: 7,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  filRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  filSep: { fontSize: 18, lineHeight: 20, flexShrink: 0 },
  filField: {
    flex: 1,
    minWidth: 0,
    gap: 2,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  filFieldLabel: { fontSize: 12 },
  filFieldInput: { fontSize: 15, padding: 0 },
  filTypes: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  filType: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
    paddingLeft: 6,
    paddingRight: 16,
    borderRadius: 999,
    borderWidth: 1,
  },
  filTypeIcon: {
    width: 28,
    height: 28,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  filTypeText: { fontSize: 14 },
  filFooter: { gap: 10, marginTop: 40, marginBottom: 4 },
});
