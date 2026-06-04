import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@react-navigation/native';
import MediCareText, { FontWeight } from '@src/components/Text/MediCareText';

import { makeStyles } from '@src/hooks/makeStyle';

interface ClinicalSummaryContentProps {
    narrative: string;
}

const ClinicalSummaryContent: React.FC<ClinicalSummaryContentProps> = ({
    narrative,
}) => {
    const theme = useTheme();
    const styles = useStyles();

    const renderInlineMarkdown = (text: string) => {
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return (
                    <MediCareText
                        key={index}
                        weight={FontWeight.Bold}
                        style={{ color: theme.text?.[110] ?? '#000' }}
                    >
                        {part.slice(2, -2)}
                    </MediCareText>
                );
            }
            return part;
        });
    };

    const renderMarkdown = (text: string) => {
        const lines = text.split('\n');
        return lines.map((line, index) => {
            // Handle Headers
            if (line.startsWith('## ')) {
                return (
                    <MediCareText
                        key={index}
                        tag="h2"
                        weight={FontWeight.Bold}
                        style={styles.h2}
                    >
                        {line.replace('## ', '')}
                    </MediCareText>
                );
            }
            if (line.startsWith('### ')) {
                return (
                    <MediCareText
                        key={index}
                        tag="h3"
                        weight={FontWeight.SemiBold}
                        style={styles.h3}
                    >
                        {line.replace('### ', '')}
                    </MediCareText>
                );
            }

            // Handle Bullet Points
            if (line.trim().startsWith('* ')) {
                return (
                    <View key={index} style={styles.listItem}>
                        <MediCareText style={styles.bullet}>•</MediCareText>
                        <MediCareText style={styles.listText}>
                            {renderInlineMarkdown(line.trim().replace('* ', ''))}
                        </MediCareText>
                    </View>
                );
            }

            // Plain Text / Paragraphs
            if (line.trim() === '') {
                return <View key={index} style={styles.spacer} />;
            }

            return (
                <MediCareText key={index} tag="body" style={styles.paragraph}>
                    {renderInlineMarkdown(line)}
                </MediCareText>
            );
        });
    };

    return <View style={styles.card}>{renderMarkdown(narrative)}</View>;
};

const useStyles = makeStyles(theme => ({
    card: {
        backgroundColor: theme.white,
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 3,
        borderWidth: 1,
        borderColor: theme.border[80],
    },
    h2: {
        marginTop: 24,
        marginBottom: 12,
        color: theme.colors.primary,
    },
    h3: {
        marginTop: 18,
        marginBottom: 8,
        color: theme.text[110],
    },
    paragraph: {
        marginBottom: 12,
        lineHeight: 22,
        color: theme.text[110],
    },
    listItem: {
        flexDirection: 'row',
        marginBottom: 8,
        paddingLeft: 4,
    },
    bullet: {
        marginRight: 8,
        fontSize: 18,
        color: theme.colors.primary,
    },
    listText: {
        flex: 1,
        lineHeight: 22,
        color: theme.text[110],
    },
    spacer: {
        height: 8,
    },
}));

export default ClinicalSummaryContent;
