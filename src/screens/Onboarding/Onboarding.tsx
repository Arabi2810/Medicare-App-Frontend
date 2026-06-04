import { View } from 'react-native';
import React from 'react';
import { makeStyles } from '@src/hooks/makeStyle';
import { PulseSvg } from '@src/utils/icons';
import {
  NavigationProp,
  useNavigation,
  useTheme,
} from '@react-navigation/native';
import MediCareText, { FontWeight } from '@src/components/Text/MediCareText';
import MediCareButton, {
  ButtonType,
} from '@src/components/Button/MediCareButton';
import { RootStackParamList } from '@src/navigation/Screens';

const Onboarding = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const theme = useTheme();
  const styles = useStyle();
  return (
    <View style={styles.cont}>
      <View style={styles.iconCont}>
        <PulseSvg stroke={theme.background[130]} height={80} width={80} />
      </View>
      <MediCareText
        tag="extraLarge"
        color={theme.white}
        weight={FontWeight.Bold}
      >
        MediCare
      </MediCareText>
      <MediCareText tag="h2" color={theme.white} weight={FontWeight.Medium}>
        Smart Prescription Management
      </MediCareText>
      <MediCareButton
        title="Get Started"
        type={ButtonType.Secondary}
        style={styles.button}
        onPress={() => navigation.navigate('SignIn')}
      />
    </View>
  );
};

export default Onboarding;

const useStyle = makeStyles(theme => ({
  cont: {
    flex: 1,
    backgroundColor: theme.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCont: {
    height: 150,
    width: 150,
    borderRadius: 100,
    backgroundColor: theme.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    borderRadius: 30,
    paddingHorizontal: 20,
    marginTop: 40,
  },
}));
