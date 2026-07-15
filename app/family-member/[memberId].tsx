import { useLocalSearchParams } from 'expo-router';
import React from 'react';

import { EntityFallback, FamilyMemberView, findFamilyMember } from '@/src/features/details';
import { usePersona } from '@/src/tweaks/TweaksProvider';

export default function FamilyMemberRoute() {
  const { memberId, familyName } = useLocalSearchParams<{ memberId: string; familyName?: string }>();
  const persona = usePersona();
  const member = findFamilyMember(persona, memberId);
  if (!member) return <EntityFallback />;
  return <FamilyMemberView key={member.id} member={member} familyName={familyName} />;
}
