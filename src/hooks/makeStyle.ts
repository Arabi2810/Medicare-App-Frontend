import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { CustomTheme } from '../theme/theme';

export const makeStyles =
    <T extends StyleSheet.NamedStyles<T> | StyleSheet.NamedStyles<any>, V>(
        styles: T | ((theme: CustomTheme, props: V) => T),
    ) =>
    (props: V = {} as any): T => {
        const theme = useTheme();

        return useMemo(() => {
            const css =
                typeof styles === 'function' ? styles(theme, props) : styles;
            return StyleSheet.create(css);
        }, [props, theme]);
    };
