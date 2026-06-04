import React from 'react';
import { View } from 'react-native';
import MediCareText from '../../components/Text/MediCareText';
import { makeStyles } from '../../hooks/makeStyle';
import { useTheme } from '@react-navigation/native';

const InsightsHeader = () => {
    const styles = useStyle();
    const theme = useTheme();

    return (
        <View style={styles.header}>
            <View style={{ paddingTop: 20 }}>
                <MediCareText
                    tag="h2"
                    weight="Bold"
                    color={theme.white}
                    style={{ fontSize: 24, marginBottom: 8 }}
                >
                    AI Health Insights
                </MediCareText>
                <MediCareText
                    tag="body"
                    color={theme.whiteTransparent}
                    style={{ lineHeight: 20 }}
                >
                    Personalized analysis of your medication history
                </MediCareText>
            </View>
        </View>
    );
};

const useStyle = makeStyles((theme) => ({
    header: {
        backgroundColor: '#10B981', // Custom Green from design image
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 50,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
}));

export default InsightsHeader;
