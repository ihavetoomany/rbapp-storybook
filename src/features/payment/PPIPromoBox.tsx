// PPIPromoBox — Payment Protection Insurance add-on promo.
// Port of PPIPromoBox in design-reference/revolving-credit-pay.jsx; shown in
// the 'PPI version' tweak variant of ConfirmScreenFixed. The design's subtle
// CSS gradients are approximated with their midpoint solid colors, and the
// box keeps its fixed light-mint palette in dark mode (as in the design).

import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { RyIcon } from '@/src/components/ry';
import { ryFont } from '@/src/components/ry/typography';
import { useT } from '@/src/i18n';

// Fixed palette (design fallback values — the box is always light-tinted).
const ACCENT = '#1f6b56';
const TITLE = '#14201d';
const BODY = '#5a6b65';

export function PPIPromoBox() {
  const { t } = useT();
  const [added, setAdded] = useState(false);

  return (
    <View
      style={[
        styles.box,
        added
          ? { backgroundColor: '#d6ebe5', borderColor: '#7bbfae' }
          : { backgroundColor: '#edf8f4', borderColor: '#c4ddd7' },
      ]}>
      <View style={styles.row}>
        <View style={[styles.icon, { backgroundColor: ACCENT }]}>
          <RyIcon name="fa-shield-halved" size={17} color="#FFFFFF" />
        </View>
        <View style={styles.textCol}>
          <View style={styles.titleRow}>
            <Text style={[ryFont('700'), styles.title]}>{t('rc.ppi.title')}</Text>
            <Text style={[ryFont('700'), styles.price]}>{t('rc.ppi.price')}</Text>
          </View>
          <Text style={[ryFont('400'), styles.body]}>{t('rc.ppi.body')}</Text>
        </View>
      </View>
      <Pressable
        onPress={() => setAdded((v) => !v)}
        accessibilityRole="button"
        style={[
          styles.btn,
          added
            ? { backgroundColor: ACCENT }
            : { borderWidth: 1.5, borderColor: ACCENT, backgroundColor: 'transparent' },
        ]}>
        <RyIcon name={added ? 'fa-check' : 'fa-plus'} size={12} color={added ? '#FFFFFF' : ACCENT} />
        <Text style={[ryFont('600'), styles.btnLabel, { color: added ? '#FFFFFF' : ACCENT }]}>
          {added ? t('rc.ppi.added') : t('rc.ppi.add')}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    borderWidth: 1.5,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginTop: 32,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCol: {
    flex: 1,
    minWidth: 0,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  title: {
    fontSize: 14,
    lineHeight: 14 * 1.2,
    color: TITLE,
  },
  price: {
    fontSize: 12,
    color: ACCENT,
    backgroundColor: 'rgba(31,107,86,0.1)',
    borderRadius: 999,
    paddingVertical: 3,
    paddingHorizontal: 8,
    overflow: 'hidden',
    flexShrink: 0,
  },
  body: {
    fontSize: 12.5,
    color: BODY,
    marginTop: 4,
    lineHeight: 12.5 * 1.45,
  },
  btn: {
    width: '100%',
    marginTop: 12,
    borderRadius: 999,
    paddingVertical: 9,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },
  btnLabel: {
    fontSize: 14,
  },
});
