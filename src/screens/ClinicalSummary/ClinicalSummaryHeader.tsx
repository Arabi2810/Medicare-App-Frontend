import React, { useState } from 'react';
import { View, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import MediCareText, { FontWeight } from '@src/components/Text/MediCareText';
import { CloseSvg, DownloadSvg } from '@src/utils/icons';
import { makeStyles } from '@src/hooks/makeStyle';
import Config from 'react-native-config';
import { useAppSelector } from '@src/redux/store';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { showAlert, successAlert } from '@src/helper/alert';

type TabType = 'summary' | 'sideEffects' | 'analytics' | 'healthRecord';

interface Props {
  isSuccess: boolean;
  activeTab: TabType;
  tabData: string | null;
}
const stripMarkdown = (text: string): string => {
  return text
    .replace(/^## (.*)$/gm, '\n$1\n' + '='.repeat(40))
    .replace(/^### (.*)$/gm, '\n$1\n' + '-'.repeat(30))
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/^\* /gm, '• ')
    .replace(/^- /gm, '• ')
    .trim();
};

const TAB_FILENAMES: Record<TabType, string> = {
  summary: 'ClinicalSummary',
  sideEffects: 'SideEffects',
  analytics: 'Analytics',
  healthRecord: 'HealthRecord',
};

const TAB_PDF_ENDPOINTS: Record<TabType, string> = {
  summary: '/api/prescriptions/clinical-summary/pdf',
  sideEffects: '/api/prescriptions/side-effects/pdf',
  analytics: '/api/prescriptions/health-timeline/pdf',
  healthRecord: '/api/prescriptions/case-documentation/pdf',
};

const ClinicalSummaryHeader: React.FC<Props> = ({ isSuccess, activeTab, tabData }) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const styles = useStyles();
  const token = useAppSelector(state => state.auth.token);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!tabData) {
      showAlert('No content to download yet');
      return;
    }

// All tabs now download a styled PDF from the backend
    setIsDownloading(true);
    try {
      const date = new Date();
      const baseName = TAB_FILENAMES[activeTab];
      const fileName = `${baseName}_${Math.floor(date.getTime() / 1000)}.pdf`;
      const fileUrl = `${Config.API_BASE_URL}${TAB_PDF_ENDPOINTS[activeTab]}`;
      const { dirs } = ReactNativeBlobUtil.fs;
      const downloadPath = `${Platform.OS === 'ios' ? dirs.DocumentDir : dirs.DownloadDir}/${fileName}`;
      await ReactNativeBlobUtil.config({
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path: downloadPath,
          description: `Downloading ${baseName} PDF`,
          mime: 'application/pdf',
          mediaScannable: true,
        },
        path: downloadPath,
      }).fetch('GET', fileUrl, { Authorization: `Bearer ${token}` });
      successAlert(`${baseName} downloaded successfully`);
    } catch (err) {
      showAlert('Failed to download');
    } finally {
      setIsDownloading(false);
    }
  };

  const canDownload = isSuccess && !!tabData;

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
        <CloseSvg stroke={theme.black} width={24} height={24} />
      </TouchableOpacity>
      <MediCareText tag="h2" weight={FontWeight.Bold} color={theme.black}>
        Clinical Summary
      </MediCareText>
      <View style={styles.actionsContainer}>
        {canDownload && (
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleDownload}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <ActivityIndicator size="small" color={theme.primary} />
            ) : (
              <DownloadSvg stroke={theme.black} width={24} height={24} />
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const useStyles = makeStyles(theme => ({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: theme.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.border[80],
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionsContainer: { flexDirection: 'row' },
}));

export default ClinicalSummaryHeader;