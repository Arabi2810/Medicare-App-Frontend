import React, { useState } from 'react';
import { View, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { makeStyles } from '@src/hooks/makeStyle';
import MediCareText, { FontWeight } from '@src/components/Text/MediCareText';
import Checkbox from '@src/components/Input/Checkbox';
import MediCareInput from '@src/components/Input/MediCareInput';
import StarRating from '@src/components/Input/StarRating';
import { CloseSvg } from '@src/utils/icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '@src/navigation/Screens';
import { useCompletePrescriptionMutation } from '@src/redux/pescription/pescription';
import { showError } from '@src/helper/alert';
import MediCareButton from '@src/components/Button/MediCareButton';

const CompleteHistory: React.FC<
    NativeStackScreenProps<RootStackParamList, 'CompleteHistory'>
> = ({ route }) => {
    const styles = useStyle();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const { prescriptionId, userId } = route.params;

    const [completePrescription, { isLoading }] = useCompletePrescriptionMutation();

    const [overallImprovement, setOverallImprovement] = useState(0);
    const [symptomRelief, setSymptomRelief] = useState(0);
    const [medicationEffectiveness, setMedicationEffectiveness] = useState(0);
    const [sideEffects, setSideEffects] = useState(0);
    const [healthConditionNow, setHealthConditionNow] = useState('');
    const [wasHelpful, setWasHelpful] = useState(false);
    const [sideEffectsDescription, setSideEffectsDescription] = useState('');
    const [additionalComments, setAdditionalComments] = useState('');
    const [wouldRecommend, setWouldRecommend] = useState(false);

    const handleSubmit = async () => {
        const surveyData = {
            prescriptionId,
            userId,
            overallImprovement,
            symptomRelief,
            medicationEffectiveness,
            sideEffects,
            healthConditionNow,
            wasHelpful,
            sideEffectsDescription,
            additionalComments,
            wouldRecommend,
        };

        try {
            const res = await completePrescription(surveyData).unwrap();
            if ('data' in res) {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'DrawerNavigation', params: { screen: 'Dashboard', params: { screen: 'History' } } }],
                });
            } else {
                throw res.error;
            }
        } catch (error) {
            showError(error);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
                    <CloseSvg width={24} height={24} color={styles.closeIcon.color as string} />
                </TouchableOpacity>
                <MediCareText tag="h3" weight={FontWeight.Bold} style={styles.headerTitle}>
                    Complete Prescription
                </MediCareText>
                <View style={{ width: 40 }} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>

                    <Section title="Overall Improvement">
                        <StarRating rating={overallImprovement} onRatingChange={setOverallImprovement} />
                    </Section>

                    <Section title="Symptom Relief">
                        <StarRating rating={symptomRelief} onRatingChange={setSymptomRelief} />
                    </Section>

                    <Section title="Medication Effectiveness">
                        <StarRating rating={medicationEffectiveness} onRatingChange={setMedicationEffectiveness} />
                    </Section>

                    <Section title="Side Effects Rating">
                        <StarRating rating={sideEffects} onRatingChange={setSideEffects} />
                    </Section>

                    <MediCareInput
                        label="Health Condition Now"
                        value={healthConditionNow}
                        onChangeText={setHealthConditionNow}
                        placeholder="How are you feeling now?"
                        containerStyle={styles.inputContainer}
                    />

                    <Checkbox
                        label="Was this helpful?"
                        value={wasHelpful}
                        onChangeValue={setWasHelpful}
                    />

                    <MediCareInput
                        label="Side Effects Description (Optional)"
                        value={sideEffectsDescription}
                        onChangeText={setSideEffectsDescription}
                        placeholder="Describe any side effects..."
                        multiline
                        numberOfLines={3}
                        style={{ height: 100, textAlignVertical: 'top', paddingTop: 12 }}
                        containerStyle={styles.inputContainer}
                    />

                    <MediCareInput
                        label="Additional Comments (Optional)"
                        value={additionalComments}
                        onChangeText={setAdditionalComments}
                        placeholder="Any other feedback?"
                        multiline
                        numberOfLines={3}
                        style={{ height: 100, textAlignVertical: 'top', paddingTop: 12 }}
                        containerStyle={styles.inputContainer}
                    />

                    <Checkbox
                        label="Would you recommend?"
                        value={wouldRecommend}
                        onChangeValue={setWouldRecommend}
                    />

                    <MediCareButton
                        title="Submit Feedback"
                        onPress={handleSubmit}
                        isLoading={isLoading}
                        style={styles.submitButton}
                    />

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
    const styles = useStyle();
    return (
        <View style={styles.section}>
            <MediCareText tag="body" weight={FontWeight.Medium} style={styles.sectionTitle}>
                {title}
            </MediCareText>
            {children}
        </View>
    );
}

const useStyle = makeStyles((theme) => ({
    safeArea: {
        flex: 1,
        backgroundColor: theme.background[70],
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: theme.white,
        borderBottomWidth: 1,
        borderBottomColor: theme.border[90],
    },
    closeButton: {
        padding: 8,
    },
    closeIcon: {
        color: theme.text[110],
    },
    headerTitle: {
        color: theme.text[110],
    },
    container: {
        padding: 20,
        paddingBottom: 40,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        marginBottom: 10,
        color: theme.text[110],
    },
    inputContainer: {
        marginBottom: 20,
    },
    submitButton: {
        marginTop: 20,
    },
}));

export default CompleteHistory;
