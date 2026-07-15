// Entity resolution — detail routes carry ids only; screens resolve the
// live objects from the active persona (usePersona()).

import type {
  Account,
  FamilyMember,
  Invoice,
  PaymentRequest,
  Persona,
  Product,
  Purchase,
} from '@/src/data';

export function findProduct(persona: Persona, productId?: string | null): Product | null {
  if (!productId) return null;
  return persona.products.find((p) => p.id === productId) ?? null;
}

/** Find an account by id; when productId is given, prefer that product. */
export function findAccount(
  persona: Persona,
  accountId?: string | null,
  productId?: string | null,
): { account: Account; product: Product } | null {
  if (!accountId) return null;
  const scoped = findProduct(persona, productId);
  if (scoped) {
    const a = scoped.accounts.find((x) => x.id === accountId);
    if (a) return { account: a, product: scoped };
  }
  for (const p of persona.products) {
    const a = p.accounts.find((x) => x.id === accountId);
    if (a) return { account: a, product: p };
  }
  return null;
}

export function findPaymentRequest(
  persona: Persona,
  prId?: string | null,
): { pr: PaymentRequest; product: Product } | null {
  if (!prId) return null;
  for (const p of persona.products) {
    const pr = p.paymentRequests.find((x) => x.id === prId);
    if (pr) return { pr, product: p };
  }
  return null;
}

/** Ledger rows live on product.purchases AND on deposit accounts' transactions. */
export function findTransaction(
  persona: Persona,
  txId?: string | null,
  productId?: string | null,
): { tx: Purchase; product: Product } | null {
  if (!txId) return null;
  const search = (p: Product): Purchase | undefined => {
    const fromProduct = p.purchases.find((x) => x.id === txId);
    if (fromProduct) return fromProduct;
    for (const a of p.accounts) {
      if (a.type === 'depositAccount') {
        const hit = (a.transactions ?? []).find((x) => x.id === txId);
        if (hit) return hit;
      }
    }
    return undefined;
  };
  const scoped = findProduct(persona, productId);
  if (scoped) {
    const tx = search(scoped);
    if (tx) return { tx, product: scoped };
  }
  for (const p of persona.products) {
    const tx = search(p);
    if (tx) return { tx, product: p };
  }
  return null;
}

export function findInvoice(
  persona: Persona,
  invId?: string | null,
  productId?: string | null,
): { inv: Invoice; product: Product } | null {
  if (!invId) return null;
  const scoped = findProduct(persona, productId);
  if (scoped) {
    const inv = scoped.invoices.find((x) => x.id === invId);
    if (inv) return { inv, product: scoped };
  }
  for (const p of persona.products) {
    const inv = p.invoices.find((x) => x.id === invId);
    if (inv) return { inv, product: p };
  }
  return null;
}

export function findFamilyMember(persona: Persona, memberId?: string | null): FamilyMember | null {
  if (!memberId) return null;
  for (const p of persona.products) {
    const m = (p.familyMembers ?? []).find((x) => x.id === memberId);
    if (m) return m;
  }
  return null;
}
