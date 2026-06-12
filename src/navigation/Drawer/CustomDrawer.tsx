// src/navigation/Drawer/CustomDrawer.tsx
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import {
  DrawerContentScrollView,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { useTheme } from '@react-navigation/native';
import { CloseSvg, PulseSvg, DocumentSvg } from '@src/utils/icons';
import { useAppDispatch, useAppSelector } from '@src/redux/store';
import { logout } from '@src/redux/features/user/authSlice';
import { apiSlice } from '@src/redux/features/api/apiSlice';
import MediCareText, { FontWeight } from '@src/components/Text/MediCareText';
import { makeStyles } from '@src/hooks/makeStyle';
import { nameInitials } from '@src/helper/nameInitials';
import auth from '@react-native-firebase/auth';

const CustomDrawer: React.FC<DrawerContentComponentProps> = props => {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth).user;
  const styles = useStyles();

  const handleLogout = async () => {
    try { await auth().signOut(); } catch (_) {}
    dispatch(logout());
    dispatch(apiSlice.util.resetApiState());
    props.navigation.reset({ index: 0, routes: [{ name: 'SignIn' }] });
  };

  const menuItems = [
    {
      id: 'pendingTests',
      label: 'Pending Tests',
      icon: PulseSvg,
      onPress: () => {
        props.navigation.closeDrawer();
        props.navigation.navigate('PendingTests');
      },
    },
    {
      id: 'clinicalSummary',
      label: 'Clinical Summary',
      icon: DocumentSvg,
      onPress: () => {
        props.navigation.closeDrawer();
        props.navigation.navigate('ClinicalSummary');
      },
    },
    {
      id: 'settings',
      label: 'Settings',
      emoji: '⚙️',
      onPress: () => {
        props.navigation.closeDrawer();
        props.navigation.navigate('Settings');
      },
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header — tapping opens Profile */}
      <TouchableOpacity
        style={styles.header}
        onPress={() => {
          props.navigation.closeDrawer();
          props.navigation.navigate('Profile');
        }}
        activeOpacity={0.85}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerTop}>
            <MediCareText tag="h2" weight={FontWeight.SemiBold} color={theme.white}>
              Menu
            </MediCareText>
            <TouchableOpacity
              onPress={() => props.navigation.closeDrawer()}
              style={styles.closeButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <CloseSvg stroke={theme.white} width={24} height={24} />
            </TouchableOpacity>
          </View>

          <View style={styles.profileSection}>
            <View style={styles.avatar}>
              <MediCareText tag="h2" weight={FontWeight.SemiBold} color={theme.white}>
                {nameInitials(user?.fullName ?? '')}
              </MediCareText>
            </View>
            <View style={styles.userInfo}>
              <MediCareText tag="h4" weight={FontWeight.SemiBold} color={theme.white}>
                {user?.fullName}
              </MediCareText>
              <MediCareText tag="body" weight={FontWeight.Regular} color={theme.whiteTransparent} style={styles.userEmail}>
                {user?.email}
              </MediCareText>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      {/* Menu Items */}
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.menuContent}
        showsVerticalScrollIndicator={false}
      >
        {menuItems.map(item => (
          <TouchableOpacity key={item.id} style={styles.menuItem} onPress={item.onPress}>
            {item.icon ? (
              <item.icon width={24} height={24} stroke="#000000" />
            ) : (
              <MediCareText tag="body" style={styles.menuEmoji}>{item.emoji}</MediCareText>
            )}
            <MediCareText tag="h4" weight={FontWeight.Regular} color={theme.text[110]}>
              {item.label}
            </MediCareText>
          </TouchableOpacity>
        ))}
      </DrawerContentScrollView>

      {/* Bottom — Sign Out only */}
      <View style={styles.bottomSection}>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.actionButton} onPress={handleLogout}>
          <MediCareText tag="body" style={styles.icon}>🚪</MediCareText>
          <MediCareText tag="h4" weight={FontWeight.Medium} color={theme.error[90]}>
            Sign Out
          </MediCareText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  container: { flex: 1, backgroundColor: theme.white },
  header: {
    paddingTop: 50,
    backgroundColor: theme.colors.primary,
  },
  headerContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    marginBottom: 24,
  },
  closeButton: { padding: 4 },
  profileSection: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.background[110],
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: { flex: 1 },
  userEmail: { marginTop: 4 },
  menuContent: { paddingTop: 24, paddingHorizontal: 20 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 16,
  },
  menuEmoji: { fontSize: 22, width: 24, textAlign: 'center' },
  bottomSection: {
    paddingHorizontal: 20,
    paddingBottom: 36,
    backgroundColor: theme.white,
  },
  divider: {
    height: 1,
    backgroundColor: theme.border[80],
    marginBottom: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 16,
  },
  icon: { fontSize: 20 },
}));

export default CustomDrawer;