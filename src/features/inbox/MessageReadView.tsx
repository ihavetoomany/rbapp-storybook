// MessageReadView — port of tabs.jsx MessageReadView: CompactHeader
// "Message", subject as page title, sender/date meta line and the
// dark-mode-safe HTML body (`.ry-msg-body`).
//
// The Message Admin Portal bodies only use a small HTML subset
// (<p>, <strong>, <a>, <br>, and inline-styled <div> callouts), so a tiny
// purpose-built renderer keeps the port dependency-free.

import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';

import {
  CompactHeader,
  EmptyState,
  RyPage,
  useCompactHeaderOffset,
  useStickyHeaderScroll,
} from '@/src/components/ry';
import { ryFont } from '@/src/components/ry/typography';
import { useT } from '@/src/i18n';
import { useRyTheme } from '@/src/theme/useRyTheme';
import { usePersona } from '@/src/tweaks/TweaksProvider';

/* ── Mini HTML-body renderer ─────────────────────────────────── */

type InlineSeg = { text: string; bold?: boolean; link?: boolean };
type BodyBlock = { type: 'p' | 'callout'; bg?: string; fg?: string; segs: InlineSeg[] };

const stripTags = (s: string): string =>
  s
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/[ \t\r]*\n[ \t\r]*/g, '\n')
    .replace(/[ \t]+/g, ' ');

function parseInline(html: string): InlineSeg[] {
  const segs: InlineSeg[] = [];
  const re = /<strong>([\s\S]*?)<\/strong>|<a[^>]*>([\s\S]*?)<\/a>/gi;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    if (m.index > last) segs.push({ text: stripTags(html.slice(last, m.index)) });
    if (m[1] != null) segs.push({ text: stripTags(m[1]), bold: true });
    else segs.push({ text: stripTags(m[2] ?? ''), link: true });
    last = re.lastIndex;
  }
  if (last < html.length) segs.push({ text: stripTags(html.slice(last)) });
  // Trim the outer edges but keep inter-segment spacing intact.
  if (segs.length > 0) {
    segs[0] = { ...segs[0], text: segs[0].text.replace(/^\s+/, '') };
    const li = segs.length - 1;
    segs[li] = { ...segs[li], text: segs[li].text.replace(/\s+$/, '') };
  }
  return segs.filter((s) => s.text.length > 0);
}

function parseBody(html: string): BodyBlock[] {
  const blocks: BodyBlock[] = [];
  const re = /<p>([\s\S]*?)<\/p>|<div\s+style="([^"]*)"[^>]*>([\s\S]*?)<\/div>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    if (m[1] != null) {
      blocks.push({ type: 'p', segs: parseInline(m[1]) });
    } else {
      const style = m[2] ?? '';
      const bg = /background:\s*([^;"]+)/i.exec(style)?.[1]?.trim();
      const fg = /(?:^|;)\s*color:\s*([^;"]+)/i.exec(style)?.[1]?.trim();
      blocks.push({ type: 'callout', bg, fg, segs: parseInline(m[3] ?? '') });
    }
  }
  return blocks.filter((b) => b.segs.length > 0);
}

/* ── Screen ──────────────────────────────────────────────────── */

export function MessageReadView({ msgId }: { msgId: string }): React.JSX.Element {
  const { t } = useT();
  const { colors, dark } = useRyTheme();
  const persona = usePersona();
  const router = useRouter();
  const { scrollY, scrollHandler } = useStickyHeaderScroll();
  const topOffset = useCompactHeaderOffset();

  const message = (persona.messages || []).find((m) => m.id === msgId);
  const blocks = useMemo(
    () => (message ? parseBody(message.bodyHtml) : []),
    [message],
  );

  // `.ry-msg-body a` — #1A56DB light / #7FB0FF dark.
  const linkColor = dark ? '#7FB0FF' : '#1A56DB';

  const renderSegs = (segs: InlineSeg[], baseColor: string) =>
    segs.map((s, i) => (
      <Text
        key={i}
        style={[
          s.bold ? ryFont('700') : ryFont(s.link ? '600' : '400'),
          { color: s.link ? linkColor : baseColor },
          s.link && styles.link,
        ]}>
        {s.text}
      </Text>
    ));

  return (
    <View style={[styles.screen, { backgroundColor: colors.bgDefault }]}>
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingTop: topOffset }}>
        <RyPage style={styles.page}>
          {!message ? (
            <EmptyState icon="fa-envelope" title={t('msg.title')} desc={t('msgs.empty')} />
          ) : (
            <>
              <Text style={[ryFont('700'), styles.pageTitle, { color: colors.fgPrimary }]}>
                {message.subject}
              </Text>
              <Text style={[ryFont('400'), styles.meta, { color: colors.fgSecondary }]}>
                {message.sender} · {message.date}
              </Text>
              {blocks.map((b, i) =>
                b.type === 'callout' ? (
                  <View
                    key={i}
                    style={[styles.callout, { backgroundColor: b.bg ?? colors.bgSubtle }]}>
                    <Text style={[ryFont('400'), styles.bodyText]}>
                      {renderSegs(b.segs, b.fg ?? colors.fgPrimary)}
                    </Text>
                  </View>
                ) : (
                  <Text key={i} style={[ryFont('400'), styles.bodyText, styles.para]}>
                    {renderSegs(b.segs, colors.fgPrimary)}
                  </Text>
                ),
              )}
            </>
          )}
        </RyPage>
      </Animated.ScrollView>
      <CompactHeader title={t('msg.title')} onBack={() => router.back()} scrollY={scrollY} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  page: { paddingTop: 0 },
  pageTitle: {
    fontSize: 34,
    lineHeight: 34 * 1.05,
    letterSpacing: 34 * -0.02,
    marginBottom: 20,
  },
  // `.ry-msg-meta` — body2 secondary, margin -10 0 18.
  meta: {
    fontSize: 14,
    lineHeight: 24,
    marginTop: -10,
    marginBottom: 18,
  },
  // `.ry-msg-body` — body1 (16/24); paragraphs 14px apart.
  bodyText: { fontSize: 16, lineHeight: 24 },
  para: { marginBottom: 14 },
  // Inline-styled callout <div> — radius 12, padding 14/16, margin 14 0.
  callout: {
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  link: { textDecorationLine: 'underline' },
});
