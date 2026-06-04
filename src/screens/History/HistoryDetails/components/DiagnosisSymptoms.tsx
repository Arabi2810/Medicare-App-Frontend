import { View } from 'react-native';
import React from 'react';
import { useTheme } from '@react-navigation/native';
import MediCareText from '../../../../components/Text/MediCareText';
import { makeStyles } from '../../../../hooks/makeStyle';

interface Props {
    symptoms?: string[];
    diagnosis?: string[];
}

const DiagnosisSymptoms: React.FC<Props> = ({ symptoms, diagnosis }) => {
    const theme = useTheme();
    const styles = useStyle();

    const hasSymptoms = symptoms && symptoms.length > 0;
    const hasDiagnosis = diagnosis && diagnosis.length > 0;

    if (!hasSymptoms && !hasDiagnosis) {
        return null;
    }

    return (
        <View style={styles.card}>
            {hasSymptoms && (
                <View style={styles.section}>
                    <MediCareText tag="h3" weight="Bold" color={theme.black} style={styles.title}>
                        Symptoms
                    </MediCareText>
                    <View style={styles.chipContainer}>
                        {symptoms.map((symptom, index) => (
                            <View key={index} style={styles.chip}>
                                <MediCareText tag="body2" color={theme.text[100]}>
                                    {symptom}
                                </MediCareText>
                            </View>
                        ))}
                    </View>
                </View>
            )}

            {hasSymptoms && hasDiagnosis && <View style={styles.divider} />}

            {hasDiagnosis && (
                <View style={styles.section}>
                    <MediCareText tag="h3" weight="Bold" color={theme.black} style={styles.title}>
                        Diagnosis
                    </MediCareText>
                    <View style={styles.chipContainer}>
                        {diagnosis.map((diag, index) => (
                            <View key={index} style={styles.chip}>
                                <MediCareText tag="body2" color={theme.text[100]}>
                                    {diag}
                                </MediCareText>
                            </View>
                        ))}
                    </View>
                </View>
            )}
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
    section: {
        // Container for each section
    },
    title: {
        marginBottom: 12,
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8, // Using gap for spacing between chips
    },
    chip: {
        backgroundColor: theme.background[70], // Light grey background for chips
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        marginRight: 8, // Fallback if gap is not supported on older RN versions
        marginBottom: 8,
    },
    divider: {
        height: 1,
        backgroundColor: theme.border[80],
        marginVertical: 16,
    },
}));

export default DiagnosisSymptoms;
