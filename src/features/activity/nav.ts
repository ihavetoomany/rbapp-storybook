// nav — typed-route escape hatch for routes owned by other Phase C agents
// (payment-request/, transaction/, product/) that may not exist yet when
// this feature typechecks. The pathnames follow the agreed route table in
// PHASE_C_CONTRACTS; once those route files land the casts are inert.

import { router, type Href } from 'expo-router';

export function pushRoute(pathname: string, params?: Record<string, string>): void {
  router.push({ pathname, params } as unknown as Href);
}
