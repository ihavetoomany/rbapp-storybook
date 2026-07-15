// i18n translations — ported 1:1 from design-reference/i18n.js.
// Values are either plain strings or functions that build a string from args
// (the design's ryT() called function values with the trailing arguments).

export type TranslationValue = string | ((...args: any[]) => string);
export type TranslationDict = Record<string, TranslationValue>;

export { en } from './translations.en';
export { sv } from './translations.sv';
