import React, { useState } from 'react';
import { View, TouchableOpacity, TextInput } from 'react-native';
import { makeStyles } from '@src/hooks/makeStyle';
import MediCareText, { FontWeight } from '@src/components/Text/MediCareText';

interface EditableListProps {
    items: string[];
    onUpdate?: (items: string[]) => void;
}

interface EditableListItem {
    value: string;
    isEditing: boolean;
}

const EditableList: React.FC<EditableListProps> = ({ items, onUpdate }) => {
    const styles = useStyles();
    const [listItems, setListItems] = useState<EditableListItem[]>(
        items.map(value => ({ value, isEditing: false }))
    );

    const toggleEditMode = (index: number) => {
        setListItems(prev =>
            prev.map((item, i) =>
                i === index ? { ...item, isEditing: !item.isEditing } : item
            )
        );
    };

    const updateItem = (index: number, newValue: string) => {
        const updatedItems = listItems.map((item, i) =>
            i === index ? { ...item, value: newValue } : item
        );
        setListItems(updatedItems);

        if (onUpdate) {
            onUpdate(updatedItems.map(item => item.value));
        }
    };

    return (
        <View style={styles.container}>
            {listItems.map((item, index) => (
                <View key={index} style={styles.listItem}>
                    {item.isEditing ? (
                        <TextInput
                            style={styles.input}
                            value={item.value}
                            onChangeText={text => updateItem(index, text)}
                            autoFocus
                        />
                    ) : (
                        <MediCareText tag="body" weight={FontWeight.Regular} style={styles.text}>
                            • {item.value}
                        </MediCareText>
                    )}
                    <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => toggleEditMode(index)}
                    >
                        <MediCareText tag="body2" weight={FontWeight.Medium} style={styles.editButtonText}>
                            {item.isEditing ? 'Done' : 'Edit'}
                        </MediCareText>
                    </TouchableOpacity>
                </View>
            ))}
        </View>
    );
};

export default EditableList;

const useStyles = makeStyles((theme) => ({
    container: {
        gap: 8,
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: theme.background[70],
        borderRadius: 8,
    },
    text: {
        flex: 1,
        color: theme.text[110],
    },
    input: {
        flex: 1,
        fontSize: 14,
        fontFamily: 'Gilroy-Regular',
        color: theme.text[110],
        paddingVertical: 4,
        paddingHorizontal: 8,
        backgroundColor: theme.white,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: theme.border[90],
    },
    editButton: {
        marginLeft: 12,
        paddingVertical: 4,
        paddingHorizontal: 12,
        backgroundColor: theme.primary,
        borderRadius: 6,
    },
    editButtonText: {
        color: theme.white,
    },
}));
