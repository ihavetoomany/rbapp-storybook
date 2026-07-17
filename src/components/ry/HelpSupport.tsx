// HelpSupport — the "Need help?" footer card (components.jsx): a sand-
// tinted RyCard row that opens a BaseDialog with chat / FAQ / message
// rows. Strings via i18n (help.* / mr.* keys).

import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { useT } from '@/src/i18n';
import { useRyTheme } from '@/src/theme/useRyTheme';

import { BaseDialog } from './BaseDialog';
import { RyCard } from './RyCard';
import { RyIcon } from './RyIcon';
import { RyRow } from './RyRow';
import { ryTints } from './tints';
import { ryFont } from './typography';

export type HelpSupportProps = {
  style?: StyleProp<ViewStyle>;
};

export function HelpSupport({ style }: HelpSupportProps) {
  const { colors, dark } = useRyTheme();
  const { t } = useT();
  const [open, setOpen] = useState(false);
  const tints = ryTints(dark);

  // Dark mode: app.css overrides the sand-tinted card back to --bg-paper.
  const cardBg = dark ? colors.bgPaper : tints.sand50;

  return (
    <>
      <RyCard style={[{ marginTop: 16, backgroundColor: cardBg }, style]}>
        <Pressable
          onPress={() => setOpen(true)}
          style={({ pressed }) => [styles.row, pressed && { backgroundColor: colors.bgSubtle }]}>
          <View style={[styles.icon, { backgroundColor: tints.green50 }]}>
            <RyIcon name="fa-circle-question" size={15} color={colors.primaryMain} />
          </View>
          <View style={styles.body}>
            <Text style={[ryFont('500'), styles.title, { color: colors.fgPrimary }]}>
              {t('help.title')}
            </Text>
            <Text style={[ryFont('400'), styles.sub, { color: colors.fgSecondary }]}>
              {t('help.sub')}
            </Text>
          </View>
          <RyIcon name="fa-chevron-right" size={12} color={colors.fgDisabled} />
        </Pressable>
      </RyCard>

      <BaseDialog open={open} onClose={() => setOpen(false)} title={t('help.title')} size="medium">
        <RyCard>
          <RyRow
            variant="settings"
            icon="fa-comments"
            iconRegular
            title={t('help.chat')}
            sub={t('help.chat_sub')}
            chevron
            onPress={() => setOpen(false)}
          />
          <RyRow
            variant="settings"
            icon="fa-question"
            title={t('mr.faq')}
            sub={t('mr.faq_sub')}
            ext
            onPress={() => setOpen(false)}
          />
          <RyRow
            variant="settings"
            icon="fa-envelope"
            iconRegular
            title={t('mr.send_msg')}
            sub={t('mr.send_msg_sub')}
            ext
            last
            onPress={() => setOpen(false)}
          />
        </RyCard>
      </BaseDialog>
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    width: '100%',
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  body: { flex: 1, minWidth: 0 },
  title: { fontSize: 15, lineHeight: 20 },
  sub: { fontSize: 12, lineHeight: 16, marginTop: 2 },
});
