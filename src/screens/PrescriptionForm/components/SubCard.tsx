import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { makeStyles } from '@src/hooks/makeStyle';
import FormCard from './FormCard';
import MediCareText from '@src/components/Text/MediCareText';

interface SubCardProps {
    items: any[];
    formatLabel?: (key: string) => string;
    onUpdate?: (updatedArray: any[]) => void;
    placeholders?: Record<string, string>;
    allowDelete?: boolean;
    itemLabel?: string;
}

const SubCard: React.FC<SubCardProps> = ({
    items,
    formatLabel,
    onUpdate,
    placeholders,
    allowDelete = true,
    itemLabel = 'Item',
}) => {
    const styles = useStyles();

    const handleItemUpdate = (index: number, fieldKey: string, value: string) => {
        if (!onUpdate) return;
        const updatedItems = items.map((item, i) =>
            i === index ? { ...item, [fieldKey]: value } : item
        );
        onUpdate(updatedItems);
    };

    const handleDelete = (index: number) => {
        if (!onUpdate) return;
        onUpdate(items.filter((_, i) => i !== index));
    };

    return (
        <>
            {items.map((item, index) => {
                const hiddenFields = [
                    '_id', 'id', 'userId', 'prescriptionId',
                    'status', 'processingStatus',
                    'completedDate', 'reportUrl', 'resultSummary', 'notes',
                    'testDefinition', 'patientRelevance', 'validityLevel',
                    'createdAt', 'updatedAt', 'uploadedAt', 'parsedAt',
                ];
                const filteredItem = Object.entries(item).reduce((acc, [key, value]) => {
                    if (!hiddenFields.includes(key)) {
                        acc[key] = value ?? '';
                    }
                    return acc;
                }, {} as Record<string, any>);

                if (Object.keys(filteredItem).length === 0) return null;

                return (
                    <View key={index} style={styles.subCard}>
                        {/* Item header with name and delete icon */}
                        <View style={styles.itemHeader}>
                            <MediCareText tag="body" weight="SemiBold" color="#374151" style={styles.itemName}>
                                {item.name || `${itemLabel} ${index + 1}`}
                            </MediCareText>
                            {allowDelete && (
                                <TouchableOpacity
                                    onPress={() => handleDelete(index)}
                                    style={styles.deleteIcon}
                                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                                >
                                    <MediCareText tag="body" color="#EF4444">🗑</MediCareText>
                                </TouchableOpacity>
                            )}
                        </View>
                        <FormCard
                            data={filteredItem}
                            formatLabel={formatLabel}
                            onUpdate={(fieldKey, value) => handleItemUpdate(index, fieldKey, value)}
                            placeholders={placeholders}
                        />
                    </View>
                );
            })}
        </>
    );
};

export default SubCard;

const useStyles = makeStyles((theme) => ({
    subCard: {
        backgroundColor: theme.background[70],
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: theme.border[80],
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    itemName: {
        flex: 1,
        marginRight: 8,
    },
    deleteIcon: {
        padding: 2,
    },
}));