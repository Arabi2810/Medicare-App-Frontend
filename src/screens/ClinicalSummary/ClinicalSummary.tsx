import React, { useState } from 'react';
import { View, ScrollView, StatusBar, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { makeStyles } from '@src/hooks/makeStyle';
import { useSafeAreaInsets, EdgeInsets } from 'react-native-safe-area-context';
import MediCareText from '@src/components/Text/MediCareText';
import {
  useGetClinicalSummaryQuery,
  useGetSideEffectsQuery,
  useGetHealthTimelineQuery,
  useGetCaseDocumentationQuery,
} from '@src/redux/pescription/pescription';
import ClinicalSummaryHeader from './ClinicalSummaryHeader';
import ClinicalSummaryContent from './ClinicalSummaryContent';

type TabType = 'summary' | 'sideEffects' | 'timeline' | 'caseDoc';

const TABS = [
  { key: 'summary' as TabType, label: '📋 Summary' },
  { key: 'sideEffects' as TabType, label: '⚠️ Side Effects' },
  { key: 'timeline' as TabType, label: '📈 Timeline' },
  { key: 'caseDoc' as TabType, label: '📄 Case Doc' },
];

const ClinicalSummary = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useStyles(insets);
  const [activeTab, setActiveTab] = useState<TabType>('summary');

  const summaryQuery = useGetClinicalSummaryQuery({});
  const sideEffectsQuery = useGetSideEffectsQuery({}, { skip: activeTab !== 'sideEffects' });
  const timelineQuery = useGetHealthTimelineQuery({}, { skip: activeTab !== 'timeline' });
  const caseDocQuery = useGetCaseDocumentationQuery({}, { skip: activeTab !== 'caseDoc' });

  const getActiveQuery = () => {
    switch (activeTab) {
      case 'summary': return { data: summaryQuery.data?.data?.aiNarrative, isLoading: summaryQuery.isLoading, isError: summaryQuery.isError };
      case 'sideEffects': return { data: sideEffectsQuery.data?.data, isLoading: sideEffectsQuery.isLoading, isError: sideEffectsQuery.isError };
      case 'timeline': return { data: timelineQuery.data?.data, isLoading: timelineQuery.isLoading, isError: timelineQuery.isError };
      case 'caseDoc': return { data: caseDocQuery.data?.data, isLoading: caseDocQuery.isLoading, isError: caseDocQuery.isError };
    }
  };

  const { data: narrative, isLoading, isError } = getActiveQuery();

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <MediCareText style={styles.statusText}>
            {activeTab === 'sideEffects' && 'Analyzing your medicines...'}
            {activeTab === 'timeline' && 'Building your health timeline...'}
            {activeTab === 'caseDoc' && 'Generating case documentation...'}
            {activeTab === 'summary' && 'Loading summary...'}
          </MediCareText>
        </View>
      );
    }

    if (isError) {
      return (
        <View style={styles.center}>
          <MediCareText style={styles.errorText}>
            Failed to load. Please try again.
          </MediCareText>
        </View>
      );
    }

    if (!narrative) {
      return (
        <View style={styles.center}>
          <MediCareText style={styles.statusText}>
            No data available.
          </MediCareText>
        </View>
      );
    }

    return (
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ClinicalSummaryContent narrative={narrative} />
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.background[70]} />
      <ClinicalSummaryHeader isSuccess={summaryQuery.isSuccess} />

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.activeTab]}
              onPress={() => setActiveTab(tab.key)}
            >
              <MediCareText
                tag="body"
                weight={activeTab === tab.key ? 'SemiBold' : 'Regular'}
                style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}
              >
                {tab.label}
              </MediCareText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {renderContent()}
    </View>
  );
};

const useStyles = makeStyles((theme, insets: EdgeInsets) => ({
  container: {
    flex: 1,
    backgroundColor: theme.background[70],
    paddingTop: insets.top,
  },
  tabContainer: {
    backgroundColor: theme.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.border[80],
    paddingHorizontal: 12,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 4,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: theme.colors.primary,
  },
  tabText: {
    color: theme.text[80],
    fontSize: 13,
  },
  activeTabText: {
    color: theme.colors.primary,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  statusText: {
    marginTop: 12,
    color: theme.text[110],
  },
  errorText: {
    color: '#FF3B30',
    textAlign: 'center',
  },
}));

export default ClinicalSummary;