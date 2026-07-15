// /close-account — CloseAccountLiveFlow route (params: productId, accountId?).
// Resolves the product name + account figures from usePersona(); when the
// account is a credit account its debt/limit feed the reason step's account
// card, otherwise the design's default rows apply. Cancel/close pops the stack.

import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';

import { rfmt } from '@/src/data';
import { CloseAccountLiveFlow, type CloseAccountAcctRow } from '@/src/features/flows';
import { usePersona } from '@/src/tweaks/TweaksProvider';

export default function CloseAccountRoute() {
  const router = useRouter();
  const params = useLocalSearchParams<{ productId?: string; accountId?: string }>();
  const persona = usePersona();

  const product = persona.products.find((p) => p.id === params.productId);
  const account = params.accountId
    ? product?.accounts.find((a) => a.id === params.accountId)
    : undefined;

  let acct: CloseAccountAcctRow[] | undefined;
  if (account && account.type === 'creditAccount') {
    acct = [
      { l: 'ca.acct.debt', v: `${rfmt(account.usedCredit)} kr` },
      { l: 'ca.acct.credit_limit', v: `${rfmt(account.creditLimit)} kr` },
    ];
  } else if (account && (account.type === 'invoiceAccount' || account.type === 'loanAccount')) {
    acct = [{ l: 'ca.acct.remaining', v: `${rfmt(account.remainingBalance)} kr` }];
  } else if (account && account.type === 'depositAccount') {
    acct = [{ l: 'ca.acct.balance', v: `${rfmt(account.balance)} kr` }];
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <CloseAccountLiveFlow
        productName={product?.name}
        acct={acct}
        onExit={() => router.back()}
      />
    </>
  );
}
