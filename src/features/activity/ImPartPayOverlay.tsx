// ImPartPayOverlay — port of the design's part-pay purchases bottom sheet
// (activity-invoice-model.jsx): pick purchases over 1 000 kr to break out
// into a separate part-payment plan. Rendered with BaseDialog (the shared
// `.ry-dialog` bottom-sheet port).

import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { BaseDialog, RyButton, RyCard, RyIcon, TransactionRow } from '@/src/components/ry';
import { ryFont } from '@/src/components/ry/typography';
import { useT } from '@/src/i18n';
import { useRyTheme } from '@/src/theme/useRyTheme';

import { famHolderOf, type PurchaseWithProduct } from './invoiceModel';

export type ImPartPayOverlayProps = {
  open: boolean;
  onClose: () => void;
  purchases: PurchaseWithProduct[];
};

export function ImPartPayOverlay({ open, onClose, purchases }: ImPartPayOverlayProps) {
  const { colors } = useRyTheme();
  const { t } = useT();
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  // Reset the selection every time the sheet opens (design behaviour).
  useEffect(() => {
    if (open) setSelected({});
  }, [open]);

  if (!purchases || purchases.length === 0) return null;

  const toggle = (id: string) => setSelected((s) => ({ ...s, [id]: !s[id] }));
  const count = Object.values(selected).filter(Boolean).length;

  return (
    <BaseDialog open={open} onClose={onClose} title={t('partpay_overlay.title')}>
      <Text style={[ryFont('400'), styles.desc, { color: colors.fgSecondary }]}>
        {t('partpay_overlay.desc')}
      </Text>
      <Text style={[ryFont('600'), styles.pick, { color: colors.fgPrimary }]}>
        {t('partpay_overlay.pick')}
      </Text>
      <RyCard>
        {purchases.map((tx, i) => (
          <Pressable
            key={tx.id}
            onPress={() => toggle(tx.id)}
            style={[
              styles.row,
              i > 0 && { borderTopWidth: 1, borderTopColor: colors.grey200 },
            ]}>
            <View style={styles.checkCol}>
              <View
                style={[
                  styles.checkbox,
                  selected[tx.id]
                    ? { backgroundColor: colors.primaryMain }
                    : { borderWidth: 2, borderColor: colors.grey400 },
                ]}>
                {selected[tx.id] ? <RyIcon name="fa-check" size={12} color="#FFFFFF" /> : null}
              </View>
            </View>
            <View style={styles.rowBody}>
              <TransactionRow
                tx={tx}
                partPay
                hideIcon
                hideThirdLine
                holder={famHolderOf(tx)}
                last
              />
            </View>
          </Pressable>
        ))}
      </RyCard>
      <View style={styles.footer}>
        <RyButton
          title={count === 0 ? t('partpay_overlay.confirm_none') : t('partpay_overlay.confirm', count)}
          variant="primary"
          block
          disabled={count === 0}
          onPress={onClose}
        />
      </View>
    </BaseDialog>
  );
}

const styles = StyleSheet.create({
  desc: {
    fontSize: 13,
    lineHeight: 13 * 1.45,
    marginBottom: 4,
  },
  pick: {
    fontSize: 13,
    lineHeight: 13 * 1.45,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkCol: {
    paddingLeft: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  rowBody: { flex: 1, minWidth: 0 },
  footer: {
    paddingTop: 4,
    paddingBottom: 8,
  },
});
