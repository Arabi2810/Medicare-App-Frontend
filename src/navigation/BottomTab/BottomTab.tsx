import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomTabParamList } from '../Screens';
import Dashboard from '@src/screens/Dashboard/Dashboard';
import Reminders from '@src/screens/Reminders/Reminders';
import History from '@src/screens/History/History';
import Insights from '@src/screens/Insights/Insights';
import { makeStyles } from '@src/hooks/makeStyle';
import { useTheme } from '@react-navigation/native';
import {
  HomeSvg,
  NotificationSvg,
  InsightsSvg,
  HistorySvg,
} from '@src/utils/icons';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator<BottomTabParamList>();

const BottomTab = () => {
  const insets = useSafeAreaInsets();
  const styles = useStyles(insets);
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.text[100],
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tab.Screen
        name="Home"
        component={Dashboard}
        options={{
          tabBarIcon: ({ color }) => <HomeSvg color={color} />,
        }}
      />
      <Tab.Screen
        name="Reminders"
        component={Reminders}
        options={{
          tabBarIcon: ({ color }) => <NotificationSvg color={color} />,
        }}
      />
      <Tab.Screen
        name="History"
        component={History}
        options={{
          tabBarIcon: ({ color }) => <HistorySvg color={color} />,
        }}
      />
      <Tab.Screen
        name="Insights"
        component={Insights}
        options={{
          tabBarIcon: ({ color }) => <InsightsSvg color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

const useStyles = makeStyles((theme, insets: EdgeInsets) => ({
  tabBar: {
    backgroundColor: theme.white,
    borderTopWidth: 0,
    elevation: 20,
    shadowColor: theme.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    height: 70 + insets.bottom,
    paddingTop: 10,
    paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopRightRadius: 24,
    borderTopLeftRadius: 24,
  },
  tabBarLabel: {
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'Gilroy-Medium',
  },
}));

export default BottomTab;
