// Document type catalogue — port of tabs.jsx DOC_TYPES + DOC_FILTERS.
// Labels resolve through i18n via the `doctype.<TYPE>` / `docs.filter.<id>`
// keys so the subtext localises with the language tweak.

import type { RyDocument } from '@/src/data';

export type DocGroup = 'contract' | 'news' | 'reminder' | 'requested';

/** Doc type → filter group (label lives in i18n as `doctype.<TYPE>`). */
export const DOC_TYPE_GROUPS: Record<string, DocGroup | undefined> = {
  'LEGAL/FINANCIAL': undefined,
  AGREEMENT: 'contract',
  TERMS: 'contract',
  MESSAGE: 'news',
  MARKETING: 'news',
  REMINDER: 'reminder',
  REQUEST: 'requested',
  // Resurs document catalogue
  DEPOSIT_INSURANCE: undefined,
  SAVINGS_COMMON_TERMS_NATURAL: 'contract',
  SAVINGS_COMMON_TERMS_LEGAL: 'contract',
  SAVINGS_SPECIAL_TERMS: 'contract',
  DEFAULT_SEKKI: undefined,
  INDIVIDUAL_SEKKI: undefined,
  CREDIT_AGREEMENT: 'contract',
  CONSUMER_LOAN_AGREEMENT: 'contract',
  COMMON_TERMS: 'contract',
  SAVINGS_ACCOUNT_APPLICATION: undefined,
  ANNUAL_STATEMENT_SAVINGS_ACCOUNT: undefined,
  ANNUAL_STATEMENT_PRIVATE_LOAN_ACCOUNT: undefined,
  ANNUAL_STATEMENT_OF_FEES: undefined,
  PAYMENT_PROTECTION_INSURANCE: undefined,
};

/** i18n key for a document type's label (falls back to the raw type). */
export const docTypeLabelKey = (type: string): string => 'doctype.' + type;

export type DocFilterId = 'all' | 'reminder' | 'requested' | 'contracts' | 'news';

export const DOC_FILTERS: { id: DocFilterId; labelKey: string }[] = [
  { id: 'all', labelKey: 'docs.filter.all' },
  { id: 'reminder', labelKey: 'docs.filter.reminder' },
  { id: 'requested', labelKey: 'docs.filter.requested' },
  { id: 'contracts', labelKey: 'docs.filter.contracts' },
  { id: 'news', labelKey: 'docs.filter.news' },
];

export const docMatchesFilter = (doc: RyDocument, f: string): boolean => {
  const g = DOC_TYPE_GROUPS[doc.type];
  switch (f) {
    case 'reminder':
      return g === 'reminder';
    case 'requested':
      return g === 'requested';
    case 'contracts':
      return g === 'contract';
    case 'news':
      return g === 'news';
    case 'all':
    default:
      return true;
  }
};
