// featuredDiscover — the Activity tabs' cross-sell promo card data
// (the same object every Activity variant surfaces in the design).

import type { RyPromoCardData } from '@/src/components/ry';

type T = (key: string, ...args: (string | number)[]) => string;

export function featuredDiscoverCard(t: T, cta?: string): RyPromoCardData {
  return {
    key: 'act-discover-loan',
    label: t('promo.loan.label'),
    icon: 'fa-house-chimney',
    tint: '#9CC2BD',
    img: require('@/assets/design/promo-loan.png'),
    headline: t('promo.loan.headline'),
    desc: t('promo.loan.desc'),
    cta: cta ?? t('promo.loan.cta'),
  };
}
