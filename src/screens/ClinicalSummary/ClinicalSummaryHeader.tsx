import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import MediCareText, { FontWeight } from '@src/components/Text/MediCareText';
import { CloseSvg, DownloadSvg } from '@src/utils/icons';
import { makeStyles } from '@src/hooks/makeStyle';
import Config from 'react-native-config';
import { useAppSelector } from '@src/redux/store';
import ReactNativeBlobUtil from 'react-native-blob-util';
import { showAlert, successAlert } from '@src/helper/alert';
import usePermission from '@src/hooks/usePermission';

interface Props {
  isSuccess: boolean;
}

const ClinicalSummaryHeader: React.FC<Props> = ({ isSuccess }) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const styles = useStyles();
  const token = useAppSelector(state => state.auth).token;
  const { storagePermission } = usePermission();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPdf = async () => {
    const hasPermission = await storagePermission();
    if (!hasPermission) {
      return;
    }

    setIsDownloading(true);

    try {
      const date = new Date();
      const fileName = `ClinicalSummary_${Math.floor(
        date.getTime() / 1000,
      )}.pdf`;
      const fileUrl = `${Config.API_BASE_URL}/api/prescriptions/clinical-summary/pdf`;

      const { dirs } = ReactNativeBlobUtil.fs;
      const downloadPath = `${
        Platform.OS === 'ios' ? dirs.DocumentDir : dirs.DownloadDir
      }/${fileName}`;

      ReactNativeBlobUtil.config({
        fileCache: true,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path: downloadPath,
          description: 'Downloading Clinical Summary PDF',
          mime: 'application/pdf',
          mediaScannable: true,
        },
        path: downloadPath,
      })
        .fetch('GET', fileUrl, {
          Authorization: `Bearer ${token}`,
        })
        .then(res => {
          console.log('Download Result:', res.path());
          successAlert('PDF downloaded successfully');
          setIsDownloading(false);
        })
        .catch(err => {
          console.error('Download Error:', err);
          showAlert('Failed to download PDF');
          setIsDownloading(false);
        });
    } catch (error) {
      console.error('Download setup error:', error);
      showAlert('Failed to start download');
      setIsDownloading(false);
    }
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.headerButton}
      >
        <CloseSvg stroke={theme.black} width={24} height={24} />
      </TouchableOpacity>
      <MediCareText tag="h2" weight={FontWeight.Bold} color={theme.black}>
        Clinical Summary
      </MediCareText>
      <View style={styles.actionsContainer}>
        {isSuccess && (
          <TouchableOpacity
            style={styles.headerButton}
            onPress={handleDownloadPdf}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <ActivityIndicator size="small" color={theme.colors.primary} />
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
  actionsContainer: {
    flexDirection: 'row',
  },
}));

export default ClinicalSummaryHeader;
