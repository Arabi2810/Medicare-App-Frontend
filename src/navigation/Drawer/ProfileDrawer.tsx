import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';
import { DrawerContentScrollView, DrawerContentComponentProps } from '@react-navigation/drawer';
import { useTheme } from '@react-navigation/native';
import { useAppSelector } from '@src/redux/store';
import { makeStyles } from '@src/hooks/makeStyle';
import MediCareText, { FontWeight } from '@src/components/Text/MediCareText';
import { nameInitials } from '@src/helper/nameInitials';
import { CloseSvg } from '@src/utils/icons';
import { useGetProfileQuery } from '@src/redux/features/user/userApi';

const ProfileDrawer: React.FC<DrawerContentComponentProps> = props => {
  const theme = useTheme();
  const styles = useStyles();
  const user = useAppSelector(state => state.auth).user;
  const { data } = useGetProfileQuery({});
  const profile = data?.data?.profile || data?.profile;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => props.navigation.closeDrawer()} style={styles.closeButton}>
          <CloseSvg stroke={theme.white} width={24} height={24} />
        </TouchableOpacity>

        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            {profile?.profilePhoto ? (
              <Image source={{ uri: profile.profilePhoto }} style={styles.avatarImage} />
            ) : (
              <MediCareText tag="h2" weight={FontWeight.Bold} color={theme.white}>
                {nameInitials(user?.fullName ?? '')}
              </MediCareText>
            )}
          </View>
          <MediCareText tag="h3" weight={FontWeight.SemiBold} color={theme.white} style={{ marginTop: 12 }}>
            {user?.fullName}
          </MediCareText>
          <MediCareText tag="body" color={theme.whiteTransparent}>
            {user?.email}
          </MediCareText>

          {/* Blood Group Badge */}
          {profile?.bloodGroup && (
            <View style={styles.bloodGroupBadge}>
              <MediCareText tag="body" weight={FontWeight.Bold} color={theme.white}>
                🩸 {profile.bloodGroup}
              </MediCareText>
            </View>
          )}
        </View>
      </View>

      <DrawerContentScrollView {...props} contentContainerStyle={styles.content}>
        {/* Medical Info Cards */}
        {profile?.allergies?.length > 0 && (
          <View style={styles.infoCard}>
            <MediCareText tag="body" weight={FontWeight.SemiBold} color={theme.text[110]}>
              ⚠️ Allergies
            </MediCareText>
            <MediCareText tag="body" color={theme.text[80]} style={{ marginTop: 4 }}>
              {profile.allergies.join(', ')}
            </MediCareText>
          </View>
        )}

        {profile?.chronicConditions?.length > 0 && (
          <View style={styles.infoCard}>
            <MediCareText tag="body" weight={FontWeight.SemiBold} color={theme.text[110]}>
              🏥 Chronic Conditions
            </MediCareText>
            <MediCareText tag="body" color={theme.text[80]} style={{ marginTop: 4 }}>
              {profile.chronicConditions.join(', ')}
            </MediCareText>
          </View>
        )}

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          {profile?.height && (
            <View style={styles.statCard}>
              <MediCareText tag="h3" weight={FontWeight.Bold} color={theme.colors.primary}>
                {profile.height}
              </MediCareText>
              <MediCareText tag="body" color={theme.text[80]}>Height (cm)</MediCareText>
            </View>
          )}
          {profile?.weight && (
            <View style={styles.statCard}>
              <MediCareText tag="h3" weight={FontWeight.Bold} color={theme.colors.primary}>
                {profile.weight}
              </MediCareText>
              <MediCareText tag="body" color={theme.text[80]}>Weight (kg)</MediCareText>
            </View>
          )}
        </View>

        {/* Edit Profile Button */}
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => {
            props.navigation.closeDrawer();
            props.navigation.navigate('Profile' as never);
          }}
        >
          <MediCareText tag="body" weight={FontWeight.SemiBold} color={theme.white}>
            Edit Profile
          </MediCareText>
        </TouchableOpacity>
      </DrawerContentScrollView>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  container: {
    flex: 1,
    backgroundColor: theme.white,
  },
  header: {
    backgroundColor: theme.colors.primary,
    paddingTop: 50,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: 4,
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.background[110],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: theme.white,
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  bloodGroupBadge: {
    marginTop: 8,
    backgroundColor: '#dc2626',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
  },
  content: {
    padding: 16,
  },
  infoCard: {
    backgroundColor: theme.background[70],
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: theme.background[70],
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
}));

export default ProfileDrawer;