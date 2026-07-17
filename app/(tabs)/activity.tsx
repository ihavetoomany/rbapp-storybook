// Activity tab — switches variant on the sandboxActivity tweak
// (app.jsx lines ~624-660, Q3 branch only).

import React from 'react';

import {
  ActivityActionHero,
  ActivityCarousel,
  ActivityCurrent,
  ActivityInvoiceModel,
} from '@/src/features/activity';
import { useTweaks } from '@/src/tweaks/TweaksProvider';

export default function ActivityTab() {
  const { tweaks } = useTweaks();
  switch (tweaks.sandboxActivity) {
    case 'Carousel':
      return <ActivityCarousel />;
    case 'Wallet Hero · Bjarne':
      return <ActivityActionHero />;
    case 'Current Activity':
      return <ActivityCurrent />;
    case 'invoice card model - Sara':
    default:
      return <ActivityInvoiceModel />;
  }
}
