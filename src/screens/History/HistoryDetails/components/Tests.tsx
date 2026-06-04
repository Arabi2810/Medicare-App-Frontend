import { View, TouchableOpacity } from 'react-native';
import React from 'react';
import { useTheme } from '@react-navigation/native';
import MediCareText from '../../../../components/Text/MediCareText';
import { makeStyles } from '../../../../hooks/makeStyle';
import UploadIcon from '../../../../assets/icons/upload.svg';

interface Test {
    name: string;
}

interface Props {
    tests: Test[];
}

const Tests: React.FC<Props> = ({ tests }) => {
    const theme = useTheme();
    const styles = useStyle();

    if (!tests || tests.length === 0) return null;

    return (
        <View style={styles.card}>
            <MediCareText tag="h3" weight="Bold" color={theme.black} style={styles.cardTitle}>
                Prescribed Tests
            </MediCareText>

            {tests.map((test, index) => (
                <View key={index} style={styles.testCard}>
                    <View style={styles.testHeader}>
                        <MediCareText tag="body" weight="SemiBold" color={theme.black} style={{ flex: 1 }}>
                            {test.name}
                        </MediCareText>
                        <View style={styles.pendingBadge}>
                            <MediCareText tag="body2" color={theme.yellow[800] || '#854D0E'}>pending</MediCareText>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.uploadButton}>
                        <UploadIcon width={20} height={20} color={theme.white} />
                        <MediCareText tag="body2" weight="SemiBold" color={theme.white} style={{ marginLeft: 8 }}>
                            Upload Test Report
                        </MediCareText>
                    </TouchableOpacity>
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
    testCard: {
        backgroundColor: theme.background[90],
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    testHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    pendingBadge: {
        backgroundColor: theme.yellow[100] || '#FEF9C3', // Light yellow
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },
    uploadButton: {
        backgroundColor: theme.blue[500] || '#3B82F6', // Blue-500
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: 8,
    },
}));

export default Tests;
