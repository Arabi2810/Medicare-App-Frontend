import { View } from 'react-native';
import React from 'react';
import { useTheme } from '@react-navigation/native';
import MediCareText from '../../../../components/Text/MediCareText';
import { makeStyles } from '../../../../hooks/makeStyle';

interface Medicine {
    name: string;
    dosage?: string | null;
    frequency?: string | null;
    duration?: string | null;
    instruction?: string | null;
    instructions?: string | null;
}

interface Props {
    medicines: Medicine[];
}

const Medicines: React.FC<Props> = ({ medicines }) => {
    const theme = useTheme();
    const styles = useStyle();

    if (!medicines || medicines.length === 0) return null;

    return (
        <View style={styles.card}>
            <MediCareText tag="h3" weight="Bold" color={theme.black} style={styles.cardTitle}>
                Prescribed Medicines
            </MediCareText>

            {medicines.map((med, index) => (
                <View key={index} style={styles.medicineCard}>
                    <View style={styles.medicineHeader}>
                        <MediCareText tag="h4" weight="Bold" color={theme.black}>
                            {med.name}
                        </MediCareText>
                        <View style={styles.activeBadgeSmall}>
                            <MediCareText tag="body2" color={theme.green[800] || '#166534'}>active</MediCareText>
                        </View>
                    </View>

                    <View style={styles.medDetailsGrid}>
                        <View style={styles.medDetailItem}>
                            <MediCareText tag="body2" color={theme.text[80]}>Dosage</MediCareText>
                            <MediCareText tag="body" weight="SemiBold" color={theme.black}>
                                {med.dosage || 'N/A'}
                            </MediCareText>
                        </View>
                        <View style={styles.medDetailItem}>
                            <MediCareText tag="body2" color={theme.text[80]}>Frequency</MediCareText>
                            <MediCareText tag="body" weight="SemiBold" color={theme.black}>
                                {med.frequency || 'N/A'}
                            </MediCareText>
                        </View>
                        <View style={styles.medDetailItem}>
                            <MediCareText tag="body2" color={theme.text[80]}>Duration</MediCareText>
                            <MediCareText tag="body" weight="SemiBold" color={theme.black}>
                                {med.duration || 'N/A'}
                            </MediCareText>
                        </View>
                        <View style={styles.medDetailItem}>
                            <MediCareText tag="body2" color={theme.text[80]}>Timing</MediCareText>
                            <MediCareText tag="body" weight="SemiBold" color={theme.black}>
                                {med.instruction || med.instructions || 'N/A'}
                            </MediCareText>
                        </View>
                    </View>
                </View>
            ))}
        </View>
    );
};

const useStyle = makeStyles((theme) => ({
    card: {
        backgroundColor: theme.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: theme.shadow[100],
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 3,
    },
    cardTitle: {
        marginBottom: 16,
    },
    medicineCard: {
        backgroundColor: theme.background[90], // Very light grey for inner card
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    medicineHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    activeBadgeSmall: {
        backgroundColor: theme.green[100] || '#DCFCE7', // Light green
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },
    medDetailsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    medDetailItem: {
        width: '50%',
        marginBottom: 12,
    },
}));

export default Medicines;
