// FamilyMemberView — port of details.jsx: the family-member edit page.
// Layout identical across roles; functionality differs (coordinator locked,
// partner removable, child editable + digital-card notice).
//
// Deviation: the role <select> opens a BaseDialog option list (no native
// select in RN).

import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { BaseDialog, RyCard, RyIcon } from '@/src/components/ry';
import { ryTints } from '@/src/components/ry/tints';
import { ryFont } from '@/src/components/ry/typography';
import type { FamilyMember } from '@/src/data';
import { useT } from '@/src/i18n';
import { useRyTheme } from '@/src/theme/useRyTheme';

import { DetailScreen } from './DetailScreen';

const FAMILY_AVATARS = [
  { icon: 'fa-user', bg: '#CFE3D4' },
  { icon: 'fa-user', bg: '#C7DDDB' },
  { icon: 'fa-child', bg: '#F2D2E0' },
  { icon: 'fa-baby', bg: '#F5DFCC' },
  { icon: 'fa-user', bg: '#DFD5ED' },
  { icon: 'fa-user-tie', bg: '#D5DDE1' },
];

const FAMILY_ROLE_OPTIONS = ['Coordinator', 'Partner', 'Little sister', 'Little brother', 'Family member'];

/** `.ry-pf-box` — field box (module-level so TextInputs keep focus). */
function FieldBox({
  locked = false,
  children,
  style,
}: {
  locked?: boolean;
  children: React.ReactNode;
  style?: object;
}) {
  const { colors } = useRyTheme();
  return (
    <View
      style={[
        styles.pfBox,
        locked
          ? { backgroundColor: colors.bgSubtle, borderColor: colors.borderSubtle }
          : { backgroundColor: colors.bgPaper, borderColor: colors.borderStrong },
        style,
      ]}>
      {children}
    </View>
  );
}

export function FamilyMemberView({
  member,
  familyName,
}: {
  member: FamilyMember;
  familyName?: string;
}) {
  const { colors, dark } = useRyTheme();
  const { t, tCard } = useT();
  const tints = ryTints(dark);

  const isCoordinator = member.role === 'Coordinator';
  const isPartner = member.role === 'Partner';
  const isChild = member.roleTone === 'info';
  const showFamilyName = isCoordinator || isPartner;
  const identityLocked = isCoordinator || isPartner;
  const roleLocked = isCoordinator;
  const canDelete = !isCoordinator;
  const backLabel = isChild ? t('fam.back_coordinator') : t('fam.back_overview');

  const [famName, setFamName] = useState(familyName || '');
  const [name, setName] = useState(member.name);
  const [dob, setDob] = useState(member.dob || '');
  const [role, setRole] = useState(member.role);
  const [avatar, setAvatar] = useState(member.avatar || 0);
  const [rolePickerOpen, setRolePickerOpen] = useState(false);

  const rolePicker = (
    <BaseDialog open={rolePickerOpen} onClose={() => setRolePickerOpen(false)} title={t('fam.label')} size="small">
      {FAMILY_ROLE_OPTIONS.map((r, i) => (
        <Pressable
          key={r}
          onPress={() => {
            setRole(r);
            setRolePickerOpen(false);
          }}
          style={({ pressed }) => [
            styles.roleOption,
            { borderBottomColor: colors.borderSubtle },
            i === FAMILY_ROLE_OPTIONS.length - 1 && { borderBottomWidth: 0 },
            pressed && { backgroundColor: colors.bgSubtle },
          ]}>
          <Text style={[ryFont(role === r ? '700' : '400'), styles.roleText, { color: colors.fgPrimary }]}>
            {tCard(r)}
          </Text>
          {role === r ? <RyIcon name="fa-check" size={14} color={colors.primaryMain} /> : null}
        </Pressable>
      ))}
    </BaseDialog>
  );

  return (
    <DetailScreen title={backLabel} overlay={rolePicker}>
      <Text style={[ryFont('800'), styles.title, { color: colors.fgPrimary }]}>
        {t('fam.profile_title')}
      </Text>

      {/* Edit family name (adults only) */}
      {showFamilyName ? (
        <>
          <Text style={[ryFont('600'), styles.section, { color: colors.fgPrimary }]}>
            {t('fam.edit_name')}
          </Text>
          <FieldBox>
            <View style={styles.pfField}>
              <Text style={[ryFont('400'), styles.pfLabel, { color: colors.fgSecondary }]}>
                {t('fam.name_label')}
              </Text>
              <TextInput
                value={famName}
                onChangeText={setFamName}
                style={[ryFont('400'), styles.pfInput, { color: colors.fgPrimary }]}
              />
            </View>
          </FieldBox>
          <Text style={[ryFont('400'), styles.pfHelp, { color: colors.fgSecondary }]}>
            {t('fam.name_help')}
          </Text>
        </>
      ) : null}

      {/* Edit family member */}
      <Text style={[ryFont('600'), styles.section, { color: colors.fgPrimary }]}>
        {t('fam.edit_member')}
      </Text>
      <FieldBox locked={identityLocked}>
        <View style={styles.pfField}>
          <Text style={[ryFont('400'), styles.pfLabel, { color: colors.fgSecondary }]}>
            {t('fam.enter_name')}
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            editable={!identityLocked}
            style={[
              ryFont('400'),
              styles.pfInput,
              { color: identityLocked ? colors.fgSecondary : colors.fgPrimary },
            ]}
          />
        </View>
        <View style={[styles.pfDivider, { backgroundColor: colors.borderSubtle }]} />
        {isChild ? (
          <View style={styles.pfField}>
            <Text style={[ryFont('400'), styles.pfLabel, { color: colors.fgSecondary }]}>
              {t('fam.dob')}
            </Text>
            <TextInput
              value={dob}
              onChangeText={setDob}
              style={[ryFont('400'), styles.pfInput, { color: colors.fgPrimary }]}
            />
          </View>
        ) : (
          <View style={styles.pfField}>
            <Text style={[ryFont('400'), styles.pfLabel, { color: colors.fgSecondary }]}>
              {t('fam.ssn')}
            </Text>
            <TextInput
              value={member.ssn}
              editable={false}
              style={[ryFont('400'), styles.pfInput, { color: colors.fgSecondary }]}
            />
          </View>
        )}
      </FieldBox>

      {/* Label (role) */}
      <Pressable onPress={roleLocked ? undefined : () => setRolePickerOpen(true)}>
        <FieldBox locked={roleLocked} style={{ marginTop: 14 }}>
          <View style={[styles.pfField, { paddingRight: 44 }]}>
            <Text style={[ryFont('400'), styles.pfLabel, { color: colors.fgSecondary }]}>
              {t('fam.label')}
            </Text>
            <Text
              style={[
                ryFont('400'),
                styles.pfInput,
                { color: roleLocked ? colors.fgSecondary : colors.fgPrimary },
              ]}>
              {tCard(role)}
            </Text>
          </View>
          <View style={styles.pfChev}>
            <RyIcon
              name="fa-chevron-down"
              size={13}
              color={roleLocked ? colors.fgDisabled : colors.iconMuted}
            />
          </View>
        </FieldBox>
      </Pressable>

      {/* Avatar */}
      <Text style={[ryFont('600'), styles.section, { color: colors.fgPrimary }]}>
        {t('fam.avatar')}
      </Text>
      <RyCard style={styles.avatarGrid}>
        {FAMILY_AVATARS.map((av, i) => (
          <Pressable
            key={i}
            accessibilityLabel={`Avatar ${i + 1}`}
            onPress={() => setAvatar(i)}
            style={[
              styles.avatarPick,
              avatar === i && {
                borderColor: colors.infoMain,
                borderWidth: 2,
              },
            ]}>
            <View style={[styles.avatarDisc, { backgroundColor: av.bg }]}>
              <RyIcon name={av.icon} size={22} color="#5C6B66" />
            </View>
          </Pressable>
        ))}
      </RyCard>

      {/* Delete */}
      <Pressable
        disabled={!canDelete}
        onPress={canDelete ? () => {} : undefined}
        style={({ pressed }) => [
          styles.deleteRow,
          { backgroundColor: colors.bgPaper },
          pressed && canDelete && { backgroundColor: colors.bgSubtle },
        ]}>
        <Text
          style={[
            ryFont('700'),
            styles.deleteTitle,
            { color: canDelete ? colors.fgPrimary : colors.fgDisabled },
          ]}>
          {t('fam.delete')}
        </Text>
        <RyIcon name="fa-chevron-right" size={12} color={canDelete ? colors.iconMuted : colors.grey300} />
      </Pressable>

      {/* Children digital-card notice */}
      {isChild ? (
        <View style={[styles.childCard, { backgroundColor: tints.mint100 }]}>
          <Text style={[ryFont('400'), styles.childHd, { color: dark ? colors.fgPrimary : '#14463F' }]}>
            <Text style={ryFont('700')}>{t('fam.child.title')}</Text> {t('fam.child.coming')}
          </Text>
          <Text style={[ryFont('400'), styles.childP, { color: dark ? colors.fgPrimary : '#14463F' }]}>
            {t('fam.child.body')}
          </Text>
          <Text style={[ryFont('400'), styles.childLi, { color: dark ? colors.fgPrimary : '#14463F' }]}>
            {'•'} {t('fam.child.bullet1')}
          </Text>
          <Text style={[ryFont('400'), styles.childLi, { color: dark ? colors.fgPrimary : '#14463F' }]}>
            {'•'} {t('fam.child.bullet2')}
          </Text>
        </View>
      ) : null}

      {/* Save */}
      <Pressable
        onPress={() => {}}
        style={({ pressed }) => [
          styles.save,
          { borderColor: colors.primaryMain },
          pressed && { opacity: 0.7 },
        ]}>
        <Text style={[ryFont('700'), styles.saveText, { color: colors.primaryMain }]}>
          {t('fam.save')}
        </Text>
      </Pressable>
    </DetailScreen>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 30, letterSpacing: 30 * -0.02, marginTop: 4 },
  section: { fontSize: 20, letterSpacing: 20 * -0.01, marginTop: 24, marginBottom: 10 },
  pfBox: { borderWidth: 1, borderRadius: 14, overflow: 'hidden' },
  pfField: { paddingVertical: 7, paddingHorizontal: 14 },
  pfLabel: { fontSize: 12, marginBottom: 1 },
  pfInput: { fontSize: 17, lineHeight: 23, padding: 0 },
  pfDivider: { height: 1 },
  pfHelp: { fontSize: 13, marginTop: 8, marginHorizontal: 2 },
  pfChev: {
    position: 'absolute',
    right: 16,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  roleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
  },
  roleText: { fontSize: 16 },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    rowGap: 14,
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
  avatarPick: { borderRadius: 999, borderWidth: 2, borderColor: 'transparent', padding: 2 },
  avatarDisc: {
    width: 56,
    height: 56,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 14,
    padding: 16,
    marginTop: 14,
  },
  deleteTitle: { fontSize: 16 },
  childCard: { borderRadius: 14, paddingVertical: 16, paddingHorizontal: 18, marginTop: 18 },
  childHd: { fontSize: 16, marginBottom: 6 },
  childP: { fontSize: 14, lineHeight: 20, marginBottom: 4 },
  childLi: { fontSize: 14, lineHeight: 22, marginLeft: 4 },
  save: {
    marginTop: 22,
    paddingVertical: 15,
    borderRadius: 999,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  saveText: { fontSize: 16 },
});
