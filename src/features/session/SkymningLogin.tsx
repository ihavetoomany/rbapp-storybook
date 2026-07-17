// SkymningLogin — port of login.jsx (BankID login screen, 'Natt'/'Dag'
// variants; the variant comes from the loginLayout tweak).
//
// The design's background photos (images/cabin.jpg / images/day.png) are
// NOT available — per the porting guide they are replaced with gradient
// placeholders (dark #1c1c1b→#060810 for Natt, a light sky gradient for
// Dag), with the design's overlay gradients kept on top.
//
// Flow: form → (BankID button) → waiting (spinner, 1850ms) → done
// (fade out 450ms) → useSession().login() + replace('/(tabs)/activity').

import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, {
  Defs,
  Ellipse,
  Path,
  RadialGradient,
  Rect,
  Stop,
  LinearGradient as SvgLinearGradient,
} from 'react-native-svg';

import { ryFont } from '@/src/components/ry/typography';
import { useT } from '@/src/i18n';
import { useSession, useTweaks } from '@/src/tweaks/TweaksProvider';

import { ResursWordmark, SKBankIDLogo, SKFlag } from './logos';

const SK_COUNTRIES = [
  { code: 'SE', name: 'Sverige' },
  { code: 'NO', name: 'Norge' },
  { code: 'FI', name: 'Suomi' },
  { code: 'DK', name: 'Danmark' },
];

/* Background gradient placeholder (photo not available). */
function LoginBackground({ day }: { day: boolean }) {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* Base gradient */}
      <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
        <Defs>
          {day ? (
            <SvgLinearGradient id="skBase" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#A9C6D9" />
              <Stop offset="0.55" stopColor="#D8CDBD" />
              <Stop offset="1" stopColor="#EFE8DD" />
            </SvgLinearGradient>
          ) : (
            <SvgLinearGradient id="skBase" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#1C1C1B" />
              <Stop offset="1" stopColor="#060810" />
            </SvgLinearGradient>
          )}
          {/* Overlay gradients from login.jsx */}
          {day ? (
            <SvgLinearGradient id="skOverlay" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#080A10" stopOpacity="0.12" />
              <Stop offset="0.38" stopColor="#080A10" stopOpacity="0" />
              <Stop offset="0.7" stopColor="#080A10" stopOpacity="0.42" />
              <Stop offset="1" stopColor="#06080C" stopOpacity="0.88" />
            </SvgLinearGradient>
          ) : (
            <SvgLinearGradient id="skOverlay" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor="#080A10" stopOpacity="0.3" />
              <Stop offset="0.3" stopColor="#080A10" stopOpacity="0.12" />
              <Stop offset="0.72" stopColor="#080A10" stopOpacity="0.45" />
              <Stop offset="1" stopColor="#06080C" stopOpacity="0.82" />
            </SvgLinearGradient>
          )}
          <RadialGradient id="skVignette" cx="50%" cy="50%" rx="62%" ry="48%">
            <Stop offset="0.42" stopColor="#06080C" stopOpacity="0" />
            <Stop offset="1" stopColor="#06080C" stopOpacity="0.45" />
          </RadialGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#skBase)" />
        <Rect x="0" y="0" width="100%" height="100%" fill="url(#skOverlay)" />
        {!day ? <Ellipse cx="50%" cy="50%" rx="100%" ry="100%" fill="url(#skVignette)" /> : null}
      </Svg>
    </View>
  );
}

export function SkymningLogin(): React.JSX.Element {
  const { t } = useT();
  const { tweaks } = useTweaks();
  const { login } = useSession();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const isDay = tweaks.loginLayout === 'Dag';
  const [step, setStep] = useState<'form' | 'waiting' | 'done'>('form');
  const [country, setCountry] = useState('SE');
  const [dropOpen, setDropOpen] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout);
    },
    [],
  );

  // Whole-screen fade-out on 'done' (design: opacity 0.45s ease).
  const fade = useSharedValue(1);
  const fadeStyle = useAnimatedStyle(() => ({ opacity: fade.value }));

  // BankID waiting spinner (sk-spin 0.9s linear infinite).
  const spin = useSharedValue(0);
  useEffect(() => {
    if (step === 'waiting') {
      spin.value = 0;
      spin.value = withRepeat(withTiming(360, { duration: 900, easing: Easing.linear }), -1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);
  const spinStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${spin.value}deg` }],
  }));

  const handleLogin = () => {
    setStep('waiting');
    timers.current.push(
      setTimeout(() => {
        setStep('done');
        fade.value = withTiming(0, { duration: 450, easing: Easing.inOut(Easing.ease) });
        timers.current.push(
          setTimeout(() => {
            login();
            router.replace('/(tabs)/activity');
          }, 450),
        );
      }, 1850),
    );
  };

  const isWaiting = step === 'waiting' || step === 'done';

  const padTop = Math.max(insets.top + 16, 64);
  const padBottom = Math.max(insets.bottom + 16, 40);
  const headerFg = isDay ? '#0A0A0A' : '#FFFFFF';

  return (
    <Animated.View style={[styles.screen, fadeStyle]}>
      <StatusBar style={isDay ? 'dark' : 'light'} />
      <LoginBackground day={isDay} />

      <View style={[styles.content, { paddingTop: padTop, paddingBottom: padBottom }]}>
        {/* Header row — wordmark + country selector */}
        <Animated.View entering={FadeInDown.duration(500)} style={styles.header}>
          <ResursWordmark height={16} fill={isDay ? '#1D1D1B' : '#FFFFFF'} />
          <Pressable onPress={() => setDropOpen((o) => !o)} style={styles.countryBtn}>
            <SKFlag code={country} />
            <Text style={[ryFont('700'), styles.countryCode, { color: headerFg }]}>{country}</Text>
            <Svg width={11} height={11} viewBox="0 0 12 12" fill="none">
              <Path
                d="M3 4.5L6 7.5L9 4.5"
                stroke={isDay ? '#0A0A0A' : '#D4D4D4'}
                strokeWidth={1.4}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </Pressable>
        </Animated.View>

        {/* Centre — hero copy or BankID waiting state */}
        {!isWaiting ? (
          <View style={styles.heroWrap}>
            <Animated.View entering={FadeInUp.duration(550).delay(100)} style={styles.heroBlock}>
              <Text style={[ryFont('700'), styles.heroLine, { color: '#FFFFFF' }]}>
                {t('login.hero1')}
              </Text>
              <Text
                style={[ryFont('700'), styles.heroLine, styles.heroLine2, { color: '#ABD3C6' }]}>
                {t('login.hero2')}
              </Text>
            </Animated.View>
            <Animated.Text
              entering={FadeInUp.duration(500).delay(250)}
              style={[ryFont('400'), styles.heroSub]}>
              {t('login.sub')}
            </Animated.Text>
          </View>
        ) : (
          <Animated.View entering={FadeIn.duration(300)} style={styles.waitingWrap}>
            <Animated.View style={[styles.spinner, spinStyle]} />
            <Text style={[ryFont('700'), styles.waitingTitle]}>{t('login.bankid_open')}</Text>
            <Text style={[ryFont('400'), styles.waitingHint]}>{t('login.bankid_hint')}</Text>
            {step === 'waiting' ? (
              <Pressable onPress={() => setStep('form')} style={styles.cancelBtn}>
                <Text style={[ryFont('600'), styles.cancelText]}>{t('login.cancel')}</Text>
              </Pressable>
            ) : null}
          </Animated.View>
        )}

        {/* Bottom — BankID button */}
        {!isWaiting ? (
          <Animated.View entering={FadeInUp.duration(500).delay(300)} style={styles.bottom}>
            <Pressable
              onPress={handleLogin}
              style={({ pressed }) => [styles.bankIdBtn, pressed && { opacity: 0.85 }]}>
              <SKBankIDLogo />
              <Text style={[ryFont('700'), styles.bankIdText]}>{t('login.cta')}</Text>
            </Pressable>
            <Pressable onPress={handleLogin} hitSlop={8}>
              <Text style={[ryFont('700'), styles.moreText]}>{t('login.more')}</Text>
            </Pressable>
          </Animated.View>
        ) : null}
      </View>

      {/* Country dropdown — scrim + glass menu (design z-40/z-50 layers) */}
      {dropOpen ? (
        <>
          <Pressable style={styles.dropScrim} onPress={() => setDropOpen(false)} />
          <View style={[styles.dropMenu, { top: padTop + 34 + 8 }]}>
            {SK_COUNTRIES.map((c) => {
              const active = c.code === country;
              return (
                <Pressable
                  key={c.code}
                  onPress={() => {
                    setCountry(c.code);
                    setDropOpen(false);
                  }}
                  style={[styles.dropItem, active && styles.dropItemActive]}>
                  <SKFlag code={c.code} />
                  <Text
                    style={[
                      ryFont('700'),
                      styles.dropName,
                      { color: active ? '#ABD3C6' : 'rgba(255,255,255,0.6)' },
                    ]}>
                    {c.name}
                  </Text>
                  {active ? <View style={styles.dropDot} /> : null}
                </Pressable>
              );
            })}
          </View>
        </>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#1C1C1B' },
  content: {
    flex: 1,
    paddingHorizontal: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0,
  },
  countryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  countryCode: { fontSize: 12, letterSpacing: 12 * -0.01 },
  heroWrap: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 48,
  },
  heroBlock: { width: '100%' },
  heroLine: {
    fontSize: 38,
    lineHeight: 46,
    letterSpacing: 38 * -0.02,
    textAlign: 'center',
  },
  heroLine2: { marginBottom: 14 },
  heroSub: {
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 16 * -0.01,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
  },
  waitingWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  spinner: {
    width: 52,
    height: 52,
    borderRadius: 999,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.15)',
    borderTopColor: '#FFFFFF',
  },
  waitingTitle: {
    fontSize: 18,
    letterSpacing: 18 * -0.02,
    color: '#FFFFFF',
  },
  waitingHint: {
    fontSize: 14,
    lineHeight: 14 * 1.5,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
  },
  cancelBtn: {
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 999,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginTop: 4,
  },
  cancelText: { fontSize: 14, color: 'rgba(255,255,255,0.75)' },
  bottom: {
    alignItems: 'center',
    flexShrink: 0,
  },
  bankIdBtn: {
    width: '100%',
    height: 56,
    backgroundColor: '#FAFAFA',
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 12,
  },
  bankIdText: {
    fontSize: 18,
    lineHeight: 28,
    letterSpacing: 18 * -0.01,
    color: '#0A0A0A',
  },
  moreText: {
    marginTop: 24,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 14 * -0.01,
    color: '#D4D4D4',
    textShadowColor: 'rgba(0,0,0,0.35)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 8,
  },
  dropScrim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 40,
  },
  dropMenu: {
    position: 'absolute',
    right: 32,
    width: 180,
    borderRadius: 18,
    overflow: 'hidden',
    zIndex: 50,
    backgroundColor: 'rgba(20,20,19,0.96)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.55,
    shadowRadius: 24,
    elevation: 16,
  },
  dropItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  dropItemActive: { backgroundColor: 'rgba(171,211,198,0.10)' },
  dropName: { flex: 1, fontSize: 13 },
  dropDot: {
    width: 6,
    height: 6,
    borderRadius: 999,
    backgroundColor: '#ABD3C6',
    flexShrink: 0,
  },
});
