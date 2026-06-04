import React from 'react';
import { View } from 'react-native';
import MediCareText from '../../components/Text/MediCareText';
import { makeStyles } from '../../hooks/makeStyle';
import { TreatmentStats as TreatmentStatsType } from '../../utils/types';
import { useTheme } from '@react-navigation/native';

interface Props {
    data: TreatmentStatsType;
}

const TreatmentStats: React.FC<Props> = ({ data }) => {
    const styles = useStyle();
    const theme = useTheme();

    if (!data) return null;

    return (
        <View style={styles.card}>
            <MediCareText tag="h3" weight="Bold" style={{ marginBottom: 16 }}>
                Treatment Stats
            </MediCareText>

            <View style={styles.statRow}>
                <MediCareText tag="body" color={theme.text[100]}>
                    Total prescriptions
                </MediCareText>
                <MediCareText tag="h3" weight="Bold">
                    {data.totalPrescriptions}
                </MediCareText>
            </View>
            <View style={styles.statRow}>
                <MediCareText tag="body" color={theme.text[100]}>
                    Active medications
                </MediCareText>
                <MediCareText tag="h3" weight="Bold">
                    {data.activeMedications}
                </MediCareText>
            </View>
            <View
                style={[styles.statRow, { borderBottomWidth: 0, paddingBottom: 0 }]}
            >
                <MediCareText tag="body" color={theme.text[100]}>
                    Doctors consulted
                </MediCareText>
                <MediCareText tag="h3" weight="Bold">
                    {data.doctorsConsulted}
                </MediCareText>
            </View>
        </View>
    );
};

const useStyle = makeStyles((theme) => ({
    card: {
        backgroundColor: theme.white,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
        shadowColor: theme.shadow[100],
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 2,
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: theme.border[80],
    },
}));

export default TreatmentStats;
