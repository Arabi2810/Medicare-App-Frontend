import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import MediCareText from '../../components/Text/MediCareText';
import { makeStyles } from '../../hooks/makeStyle';

const EmptyPendingTests: React.FC = () => {
    const theme = useTheme();
    const styles = useStyles();

    return (
        <View style={styles.emptyState}>
            <MediCareText tag="body" color={theme.text[100]}>
                No pending tests available
            </MediCareText>
        </View>
    );
};

const useStyles = makeStyles(theme => ({
    emptyState: {
        alignItems: 'center',
        marginTop: 40,
    },
}));

export default EmptyPendingTests;
