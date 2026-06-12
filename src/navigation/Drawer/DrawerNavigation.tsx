// src/navigation/Drawer/DrawerNavigation.tsx
import { createDrawerNavigator } from '@react-navigation/drawer';
import { DrawerParamList } from '../Screens';
import CustomDrawer from './CustomDrawer';
import BottomTab from '../BottomTab/BottomTab';
import PendingTests from '../../screens/PendingTests/PendingTests';
import ClinicalSummary from '../../screens/ClinicalSummary/ClinicalSummary';
import Profile from '../../screens/Profile/Profile';
import Settings from '../../screens/Settings/Settings';

const RightDrawer = createDrawerNavigator<DrawerParamList>();

const DrawerNavigation = () => {
  return (
    <RightDrawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerPosition: 'right',
        drawerType: 'front',
        swipeEnabled: false,
      }}
      drawerContent={props => <CustomDrawer {...props} />}
    >
      <RightDrawer.Screen name="Dashboard" component={BottomTab} />
      <RightDrawer.Screen name="PendingTests" component={PendingTests} />
      <RightDrawer.Screen name="ClinicalSummary" component={ClinicalSummary} />
      <RightDrawer.Screen name="Settings" component={Settings} />
      <RightDrawer.Screen name="Profile" component={Profile} />
    </RightDrawer.Navigator>
  );
};

export default DrawerNavigation;