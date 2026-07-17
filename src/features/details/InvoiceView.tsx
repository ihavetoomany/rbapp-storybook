// InvoiceView — port of details.jsx: the "PDF" invoice facsimile. The paper
// stays white in both themes (it emulates a printed document); its labels
// are the document's own bilingual strings and stay as-is by design.

import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

import { RyIcon } from '@/src/components/ry';
import { ryFont } from '@/src/components/ry/typography';
import { rfmt, rfmtDate, type Invoice, type Product } from '@/src/data';
import { useT } from '@/src/i18n';
import { shadowCard } from '@/src/theme/tokens';
import { useRyTheme } from '@/src/theme/useRyTheme';

import { DetailScreen } from './DetailScreen';

const MONO = Platform.select({ ios: 'Menlo', default: 'monospace' });
const PAPER_FG = '#111111';

export function InvoiceView({ inv, product: p }: { inv: Invoice; product: Product }) {
  const { colors } = useRyTheme();
  const { t } = useT();
  void p;

  const Line = ({ k, v, bold = false }: { k: string; v: string; bold?: boolean }) => (
    <View style={styles.line}>
      <Text style={[styles.mono, bold && styles.bold]}>{k}</Text>
      <Text style={[styles.mono, bold && styles.bold]}>{v}</Text>
    </View>
  );

  return (
    <DetailScreen
      title={inv.period}
      trailing={
        <View style={[styles.shareBtn, { borderColor: colors.borderSubtle, backgroundColor: colors.bgPaper }]}>
          <RyIcon name="fa-arrow-up-from-bracket" size={14} color={colors.fgPrimary} />
        </View>
      }>
      <View style={[styles.paper, shadowCard, { borderColor: colors.borderDefault }]}>
        <View style={styles.paperHead}>
          <View>
            <Text style={[ryFont('700'), styles.brand, { color: '#00594F' }]}>resurs</Text>
            <Text style={[styles.mono, { marginTop: 4 }]}>Resurs Bank AB</Text>
            <Text style={styles.mono}>Box 22209</Text>
            <Text style={styles.mono}>250 24 Helsingborg</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={[ryFont('700'), styles.docType]}>
              {inv.type === 'laneavi' ? 'LÅNEAVI' : inv.type === 'manadsavi' ? 'MÅNADSAVI' : 'FAKTURA'}
            </Text>
            <Text style={[styles.mono, { marginTop: 4 }]}>{inv.period}</Text>
          </View>
        </View>

        <View style={styles.block}>
          <Line k="Förfallodag (Due date)" v={rfmtDate(inv.due)} bold />
          <Line k="Att betala (Amount due)" v={`${rfmt(inv.amount)} ${inv.amount.currency}`} bold />
          <Line k="OCR" v={inv.ocr} />
          <Line k="Bankgiro" v="5827-9090" />
        </View>

        <View style={{ marginTop: 16 }}>
          <Text style={[ryFont('700'), styles.specTitle]}>Specifikation</Text>
          <Line k="Ingående saldo" v="2 850,00" />
          <Line k="Inbetalningar" v="− 1 650,00" />
          <Line k="Nya köp" v={`+ ${rfmt(inv.amount)}`} />
          <Line k="Ränta" v="+ 0,00" />
          <View style={[styles.line, styles.totalLine]}>
            <Text style={[styles.mono, styles.bold]}>Att betala</Text>
            <Text style={[styles.mono, styles.bold]}>
              {rfmt(inv.amount)} {inv.amount.currency}
            </Text>
          </View>
        </View>

        <Text style={styles.note}>{t('invpdf.note')}</Text>
      </View>
    </DetailScreen>
  );
}

const styles = StyleSheet.create({
  shareBtn: {
    width: 36,
    height: 36,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 12,
    padding: 32,
    marginVertical: 8,
  },
  paperHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  brand: { fontSize: 22 },
  docType: { fontSize: 16, color: PAPER_FG },
  mono: { fontFamily: MONO, fontSize: 12, lineHeight: 19, color: PAPER_FG },
  bold: { fontWeight: '700' },
  block: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#000000',
    paddingVertical: 12,
    marginVertical: 12,
  },
  line: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  totalLine: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#999999',
    paddingTop: 8,
  },
  specTitle: { fontSize: 13, marginBottom: 8, color: PAPER_FG },
  note: { marginTop: 32, fontSize: 10, color: '#666666', textAlign: 'center' },
});
