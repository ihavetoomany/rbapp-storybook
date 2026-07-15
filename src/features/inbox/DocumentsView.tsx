// DocumentsView — port of tabs.jsx DocumentsView: CompactHeader, filter
// chips (`.ry-doc-chip` with the overflow fade hint), and the document
// list (`.ry-doc-row`: unread dot, title/meta lines, open-in-new icon).
// Arriving with `highlightId` scrolls the target row into view and
// flashes it (`.ry-doc-row.flash`).

import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

import {
  CompactHeader,
  RyIcon,
  useCompactHeaderOffset,
  useStickyHeaderScroll,
} from '@/src/components/ry';
import { ryFont } from '@/src/components/ry/typography';
import type { RyDocument } from '@/src/data';
import { useT } from '@/src/i18n';
import { useRyTheme } from '@/src/theme/useRyTheme';
import { usePersona } from '@/src/tweaks/TweaksProvider';

import { DOC_FILTERS, docMatchesFilter, docTypeLabelKey, type DocFilterId } from './docTypes';
import { useReadState } from './ReadStateProvider';

export type DocumentsViewProps = {
  title?: string;
  initialFilter?: string;
  /** Which filter chips to show, in order (defaults to all). */
  chips?: string[];
  noChips?: boolean;
  /** Scroll this document into view and flash it (notification deep link). */
  highlightId?: string;
};

export function DocumentsView({
  title,
  initialFilter = 'all',
  chips,
  noChips = false,
  highlightId,
}: DocumentsViewProps): React.JSX.Element {
  const { t } = useT();
  const { colors } = useRyTheme();
  const persona = usePersona();
  const router = useRouter();
  const { readItems, markRead } = useReadState();
  const { scrollY, scrollHandler } = useStickyHeaderScroll();
  const topOffset = useCompactHeaderOffset();

  const heading = title || t('docs.title');
  const [filter, setFilter] = useState<string>(initialFilter);
  const [flashId, setFlashId] = useState<string | null>(null);
  const [moreRight, setMoreRight] = useState(false);

  const scrollRef = useRef<ScrollView>(null);
  const rowY = useRef<Record<string, number>>({});
  const filtersMetrics = useRef({ x: 0, viewW: 0, contentW: 0 });

  const docs = persona.documents || [];
  // Preserve the order given by the `chips` param (falls back to all filters).
  const shownFilters = useMemo(
    () =>
      chips
        ? chips
            .map((id) => DOC_FILTERS.find((f) => f.id === (id as DocFilterId)))
            .filter((f): f is (typeof DOC_FILTERS)[number] => !!f)
        : DOC_FILTERS,
    [chips],
  );
  const visible = docs.filter((d) => docMatchesFilter(d, filter));

  const isUnread = (d: RyDocument) => d.unread && !readItems.has(d.id);
  const openDoc = (d: RyDocument) => markRead(d.id);

  const updateMore = () => {
    const { x, viewW, contentW } = filtersMetrics.current;
    setMoreRight(x + viewW < contentW - 4);
  };

  // Arriving from a notification: scroll the targeted document into view
  // and flash it (design: 350ms delay, 1.6s flash).
  useEffect(() => {
    if (!highlightId) return;
    const timer = setTimeout(() => {
      const y = rowY.current[highlightId];
      if (y != null) {
        scrollRef.current?.scrollTo({ y: Math.max(0, y - 160), animated: true });
      }
      setFlashId(highlightId);
      const t2 = setTimeout(() => setFlashId(null), 1600);
      return () => clearTimeout(t2);
    }, 350);
    return () => clearTimeout(timer);
  }, [highlightId]);

  return (
    <View style={[styles.screen, { backgroundColor: colors.bgDefault }]}>
      <Animated.ScrollView
        ref={(r: unknown) => {
          scrollRef.current = r as ScrollView | null;
        }}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingTop: topOffset }}>
        {/* Filter chips */}
        {!noChips ? (
          <View style={styles.filterBar}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filters}
              onLayout={(e) => {
                filtersMetrics.current.viewW = e.nativeEvent.layout.width;
                updateMore();
              }}
              onContentSizeChange={(w) => {
                filtersMetrics.current.contentW = w;
                updateMore();
              }}
              onScroll={(e) => {
                filtersMetrics.current.x = e.nativeEvent.contentOffset.x;
                updateMore();
              }}
              scrollEventThrottle={32}>
              {shownFilters.map((f) => {
                const active = filter === f.id;
                return (
                  <Pressable
                    key={f.id}
                    onPress={() => setFilter(f.id)}
                    style={[
                      styles.chip,
                      active
                        ? { backgroundColor: colors.fgPrimary, borderColor: colors.fgPrimary }
                        : { backgroundColor: 'transparent', borderColor: colors.grey400 },
                    ]}>
                    <Text
                      style={[
                        ryFont('500'),
                        styles.chipText,
                        { color: active ? colors.bgPaper : colors.grey700 },
                      ]}>
                      {t(f.labelKey)}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
            {moreRight ? (
              <View style={styles.fade} pointerEvents="none">
                <Svg style={StyleSheet.absoluteFill}>
                  <Defs>
                    <LinearGradient id="docFade" x1="0" y1="0" x2="1" y2="0">
                      <Stop offset="0" stopColor={colors.bgDefault} stopOpacity="0" />
                      <Stop offset="0.65" stopColor={colors.bgDefault} stopOpacity="1" />
                    </LinearGradient>
                  </Defs>
                  <Rect x="0" y="0" width="100%" height="100%" fill="url(#docFade)" />
                </Svg>
                <RyIcon name="fa-chevron-right" size={13} color={colors.fgSecondary} />
              </View>
            ) : null}
          </View>
        ) : null}

        {/* List */}
        <View style={[styles.list, noChips && styles.listNoChips]}>
          {visible.length === 0 ? (
            <Text style={[ryFont('400'), styles.empty, { color: colors.fgSecondary }]}>
              {t('docs.empty')}
            </Text>
          ) : (
            visible.map((d, i) => {
              const unread = isUnread(d);
              return (
                <Pressable
                  key={d.id}
                  onLayout={(e) => {
                    rowY.current[d.id] = e.nativeEvent.layout.y;
                  }}
                  onPress={() => openDoc(d)}
                  style={({ pressed }) => [
                    styles.docRow,
                    { borderBottomColor: colors.borderSubtle },
                    i === visible.length - 1 && styles.docRowLast,
                    flashId === d.id && {
                      backgroundColor: colors.infoLight,
                      borderRadius: 12,
                    },
                    pressed && { backgroundColor: colors.bgSubtle },
                  ]}>
                  <View
                    style={[
                      styles.dot,
                      { backgroundColor: unread ? colors.primaryMain : 'transparent' },
                    ]}
                  />
                  <View style={styles.body}>
                    <Text
                      style={[
                        ryFont(unread ? '700' : '400'),
                        styles.docTitle,
                        { color: colors.fgPrimary },
                      ]}>
                      {d.title}
                    </Text>
                    <Text style={[ryFont('400'), styles.docMeta, { color: colors.fgSecondary }]}>
                      {t(docTypeLabelKey(d.type))}
                    </Text>
                    <Text style={[ryFont('400'), styles.docMeta, { color: colors.fgSecondary }]}>
                      {d.date}
                    </Text>
                  </View>
                  <RyIcon
                    name="fa-arrow-up-from-bracket"
                    size={18}
                    color={colors.iconMuted}
                    style={styles.openIcon}
                  />
                </Pressable>
              );
            })
          )}
        </View>
      </Animated.ScrollView>
      <CompactHeader title={heading} onBack={() => router.back()} scrollY={scrollY} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  filterBar: { position: 'relative' },
  // `.ry-doc-filters` — padding 4 16 14, gap 8.
  filters: {
    flexDirection: 'row',
    gap: 8,
    paddingTop: 4,
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  // `.ry-doc-chip` — 40px pill, 1px grey-400 border, 13/500.
  chip: {
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipText: { fontSize: 13, lineHeight: 13 },
  // `.ry-doc-fade` — 52px right-edge gradient + chevron.
  fade: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 14,
    width: 52,
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 12,
  },
  // `.ry-doc-list` — padding 0 16 24.
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  listNoChips: { paddingTop: 8 },
  // `.ry-doc-row` — 18px vertical padding, hairline separator, gap 10.
  docRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 18,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  docRowLast: { borderBottomWidth: 0 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    marginTop: 7,
    flexShrink: 0,
  },
  body: { flex: 1, minWidth: 0 },
  docTitle: { fontSize: 16, lineHeight: 24 },
  docMeta: { fontSize: 14, lineHeight: 24 },
  openIcon: { marginTop: 4 },
  // `.ry-doc-empty` — centered secondary body2.
  empty: {
    paddingVertical: 48,
    paddingHorizontal: 8,
    textAlign: 'center',
    fontSize: 14,
    lineHeight: 24,
  },
});
