import React from 'react';
import { View } from 'react-native';
import MediCareText from '../../components/Text/MediCareText';
import { makeStyles } from '../../hooks/makeStyle';
import { CommonSymptom } from '../../utils/types';

interface Props {
    data: CommonSymptom[];
}

const CommonSymptoms: React.FC<Props> = ({ data }) => {
    const styles = useStyle();
    const symptoms = data || [];

    const chipStyles = [
        { bg: '#EBF2FE', text: '#2563EB' }, // Blue
        { bg: '#F3E8FF', text: '#A855F7' }, // Purple
        { bg: '#E6F7ED', text: '#00B84A' }, // Green
        { bg: '#FEF3C7', text: '#D97706' }, // Orange
    ];

    return (
        <View style={styles.card}>
            <MediCareText tag="h3" weight="Bold" style={{ marginBottom: 16 }}>
                Common Symptoms
            </MediCareText>
            <View style={styles.chipsContainer}>
                {symptoms.map((item, index) => {
                    const style = chipStyles[index % chipStyles.length];
                    return (
                        <View
                            key={index}
                            style={[styles.chip, { backgroundColor: style.bg }]}
                        >
                            <MediCareText tag="body2" weight="Medium" color={style.text}>
                                {item.symptom}
                            </MediCareText>
                        </View>
                    );
                })}
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
    chipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    chip: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        marginRight: 10,
        marginBottom: 10,
    },
}));

export default CommonSymptoms;
