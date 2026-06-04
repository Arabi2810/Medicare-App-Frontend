import React from 'react';
import { View, Pressable } from 'react-native';
import { makeStyles } from '@src/hooks/makeStyle';
import { StarSvg } from '@src/utils/icons';

interface Props {
    rating: number;
    onRatingChange: (rating: number) => void;
    maxRating?: number;
}

const StarRating: React.FC<Props> = ({ rating, onRatingChange, maxRating = 5 }) => {
    const styles = useStyle();

    return (
        <View style={styles.container}>
            {Array.from({ length: maxRating }, (_, index) => index + 1).map((item) => (
                <Pressable
                    key={item}
                    onPress={() => onRatingChange(item)}
                    style={styles.starContainer}
                >
                    <StarSvg
                        width={32}
                        height={32}
                        color={item <= rating ? '#FFD700' : '#E0E0E0'}
                        fill={item <= rating ? '#FFD700' : 'none'}
                    />
                </Pressable>
            ))}
        </View>
    );
};

export default StarRating;

const useStyle = makeStyles((theme) => ({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    starContainer: {
        marginRight: 8,
    },
}));
