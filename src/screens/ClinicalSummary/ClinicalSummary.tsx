// src/screens/ClinicalSummary/ClinicalSummary.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  TouchableOpacity,
  Animated,
} from 'react-native';
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

type TabType = 'summary' | 'sideEffects' | 'analytics' | 'healthRecord';

interface TabConfig {
  key: TabType;
  label: string;
  banner: string;
}

const TABS: TabConfig[] = [
  {
    key: 'summary',
    label: '📋 Summary',
    banner: 'Your overall health picture based on all prescriptions.',
  },
  {
    key: 'sideEffects',
    label: '⚠️ Side Effects',
    banner: 'Possible effects and interactions from your current medicines.',
  },
  {
    key: 'analytics',
    label: '📈 Analytics',
    banner: 'Health trends and patterns from your prescription history.',
  },
  {
    key: 'healthRecord',
    label: '📄 Health Record',
    banner: 'A complete health record you can share with any doctor.',
  },
];

const ClinicalSummary = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useStyles(insets);
  const [activeTab, setActiveTab] = useState<TabType>('summary');
  const [bannerText, setBannerText] = useState<string>(TABS[0].banner);
  const [showBanner, setShowBanner] = useState(false);
  const bannerOpacity = useRef(new Animated.Value(0)).current;
  const bannerTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const summaryQuery = useGetClinicalSummaryQuery({});
  const sideEffectsQuery = useGetSideEffectsQuery({}, { skip: activeTab !== 'sideEffects' });
  const analyticsQuery = useGetHealthTimelineQuery({}, { skip: activeTab !== 'analytics' });
  const healthRecordQuery = useGetCaseDocumentationQuery({}, { skip: activeTab !== 'healthRecord' });

  const getActiveQuery = () => {
    switch (activeTab) {
      case 'summary':
        return {
          data: summaryQuery.data?.data?.aiNarrative,
          isLoading: summaryQuery.isLoading,
          isError: summaryQuery.isError,
        };
      case 'sideEffects':
        return {
          data: sideEffectsQuery.data?.data,
          isLoading: sideEffectsQuery.isLoading,
          isError: sideEffectsQuery.isError,
        };
      case 'analytics':
        return {
          data: analyticsQuery.data?.data,
          isLoading: analyticsQuery.isLoading,
          isError: analyticsQuery.isError,
        };
      case 'healthRecord':
        return {
          data: healthRecordQuery.data?.data,
          isLoading: healthRecordQuery.isLoading,
          isError: healthRecordQuery.isError,
        };
    }
  };

  const handleTabChange = (tab: TabType) => {
    if (tab === activeTab) return;
    setActiveTab(tab);

    const config = TABS.find(t => t.key === tab);
    if (!config) return;

    // Clear any existing timer
    if (bannerTimer.current) clearTimeout(bannerTimer.current);

    // Show banner
    setBannerText(config.banner);
    setShowBanner(true);
    Animated.timing(bannerOpacity, { toValue: 1, duration: 200, useNativeDriver: true }).start();

    // Auto-hide after 3 seconds
    bannerTimer.current = setTimeout(() => {
      Animated.timing(bannerOpacity, { toValue: 0, duration: 300, useNativeDriver: true }).start(
        () => setShowBanner(false),
      );
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (bannerTimer.current) clearTimeout(bannerTimer.current);
    };
  }, []);

  const activeQuery = getActiveQuery();
  const { data: narrative, isLoading, isError } = activeQuery;
  const currentTabData: string | null =
    narrative && typeof narrative === 'string' ? narrative : null;

  const loadingMessages: Record<TabType, string> = {
    summary: 'Loading your health summary...',
    sideEffects: 'Analyzing your medicines...',
    analytics: 'Building your health analytics...',
    healthRecord: 'Generating your health record...',
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={theme.primary} />
          <MediCareText style={styles.statusText}>{loadingMessages[activeTab]}</MediCareText>
        </View>
      );
    }

    if (isError) {
      return (
        <View style={styles.center}>
          <MediCareText style={styles.errorText}>Failed to load. Please try again.</MediCareText>
        </View>
      );
    }

    if (!narrative) {
      return (
        <View style={styles.center}>
          <MediCareText style={styles.statusText}>No data available yet.</MediCareText>
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
      <ClinicalSummaryHeader
        isSuccess={summaryQuery.isSuccess || !!narrative}
        activeTab={activeTab}
        tabData={currentTabData}
      />

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {TABS.map(tab => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.activeTab]}
              onPress={() => handleTabChange(tab.key)}
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

      {/* Info Banner — 3-second disappearing message */}
      {showBanner && (
        <Animated.View style={[styles.banner, { opacity: bannerOpacity }]}>
          <MediCareText tag="body2" style={styles.bannerText}>
            ℹ️  {bannerText}
          </MediCareText>
        </Animated.View>
      )}

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
    borderBottomColor: theme.primary,
  },
  tabText: {
    color: theme.text[80],
    fontSize: 13,
  },
  activeTabText: {
    color: theme.primary,
  },
  banner: {
    backgroundColor: '#eff6ff',
    borderBottomWidth: 1,
    borderBottomColor: '#bfdbfe',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  bannerText: {
    color: '#1e40af',
    fontSize: 13,
    lineHeight: 18,
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