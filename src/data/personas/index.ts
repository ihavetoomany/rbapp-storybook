// src/data/personas/index.ts — RY_PERSONAS assembly (design: window.RY_PERSONAS).

import type { Persona, PersonaId } from '../types';
import { alex } from './alex';
import { bill } from './bill';
import { eva } from './eva';
import { john } from './john';
import { kim } from './kim';
import { lena } from './lena';
import { maja } from './maja';

export const RY_PERSONAS: Record<PersonaId, Persona> = { john, bill, kim, eva, maja, alex, lena };

export { john, bill, kim, eva, maja, alex, lena };
export { RY_NOTIF } from './notifications';
export { themes, makeDeposit, makeLoan, makeDocuments, makeMessages, byNewest } from './shared';
export type { MakeDepositOpts } from './shared';
