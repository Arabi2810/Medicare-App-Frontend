import { View, Pressable } from 'react-native';
import React from 'react';
import { makeStyles } from '@src/hooks/makeStyle';
import { TickSvg } from '@src/utils/icons';
import MediCareText, { FontWeight } from '../Text/MediCareText';

interface Props {
    label: string;
    value?: boolean;
    onChangeValue?: (v: boolean) => void;
}

const Checkbox: React.FC<Props> = ({ label, value, onChangeValue }) => {
    const styles = useStyle();
    return (
        <Pressable
            style={styles.checkboxContainer}
            onPress={() => onChangeValue?.(!value)}
        >
            <View style={styles.checkbox}>
                {value && <TickSvg width={18} height={18} />}
            </View>
            <MediCareText
                tag="body"
                weight={FontWeight.Medium}
                style={styles.checkboxLabel}
            >
                {label}
            </MediCareText>
        </Pressable>
    );
};

export default Checkbox;

const useStyle = makeStyles((theme) => ({
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.white,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: theme.black,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: '#1EA34A',
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxLabel: {
        flex: 1,
        color: theme.text[110],
    },
}));