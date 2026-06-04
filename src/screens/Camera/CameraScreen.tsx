/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  StyleSheet,
  View,
  Pressable,
  Animated,
  ActivityIndicator,
} from 'react-native';
import React, { useState, useRef } from 'react';
import { makeStyles } from '@src/hooks/makeStyle';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import { useNavigation, useTheme } from '@react-navigation/native';
import {
  EdgeInsets,
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { CloseSvg } from '@src/utils/icons';
import MediCareText from '@src/components/Text/MediCareText';
import { sleep } from '@src/helper/sleep';
import { showAlert } from '@src/helper/alert';
import ImagePreview from './ImagePreview';

type FlashMode = 'off' | 'on' | 'auto';

const CameraScreen = () => {
  const insets = useSafeAreaInsets();
  const styles = useStyle(insets);
  const theme = useTheme();
  const navigation = useNavigation();
  const device = useCameraDevice('back');
  const camera = useRef<Camera>(null);
  const [flash, setFlash] = useState<FlashMode>('off');
  const [capturedPhoto, setCapturedPhoto] = useState<string>();
  const [isProcessing, setIsProcessing] = useState(false);
  const flashOpacity = useRef(new Animated.Value(0)).current;

  const toggleFlash = () => {
    setFlash(prev => {
      if (prev === 'off') return 'on';
      return 'off';
    });
  };

  const takePhoto = async () => {
    if (camera.current && device && !isProcessing) {
      try {
        // Trigger flash/flick effect
        if (flash === 'off') {
          Animated.sequence([
            Animated.timing(flashOpacity, {
              toValue: 1,
              duration: 50,
              useNativeDriver: true,
            }),
            Animated.timing(flashOpacity, {
              toValue: 0,
              duration: 100,
              useNativeDriver: true,
            }),
          ]).start();
        }

        await sleep(500);
        flash === 'off' && setIsProcessing(true);

        // Take the photo
        const photo = await camera.current.takePhoto({
          flash: flash,
        });

        // Set the captured photo
        setCapturedPhoto(`file://${photo.path}`);
      } catch (error) {
        showAlert('Error taking photo');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleClose = () => {
    navigation.goBack();
  };

  const getFlashLabel = () => {
    if (flash === 'off') return 'OFF';
    return 'ON';
  };

  // Show loading state while processing
  if (isProcessing) {
    return (
      <View style={styles.container}>
        <Camera
          ref={camera}
          style={StyleSheet.absoluteFill}
          device={device!}
          isActive={true}
          photo={true}
        />
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={theme.white} />
          <MediCareText
            style={styles.loadingText}
            color={theme.white}
            weight="Medium"
          >
            Processing...
          </MediCareText>
        </View>
      </View>
    );
  }

  // Show photo preview
  if (capturedPhoto) {
    return (
      <ImagePreview
        capturedPhoto={capturedPhoto}
        setCapturedPhoto={setCapturedPhoto}
      />
    );
  }

  // Show camera view
  return (
    <View style={styles.container}>
      <Camera
        ref={camera}
        style={StyleSheet.absoluteFill}
        device={device!}
        isActive={true}
        photo={true}
      />
      {/* Flash/Flick overlay */}
      <Animated.View
        style={[styles.flick, { opacity: flashOpacity }]}
        pointerEvents="none"
      />
      <SafeAreaView style={styles.overlay} edges={['top']}>
        {/* Top controls */}
        <View style={styles.topControls}>
          <Pressable
            style={styles.iconButton}
            onPress={handleClose}
            disabled={isProcessing}
          >
            <CloseSvg width={24} height={24} stroke={theme.white} />
          </Pressable>
          <Pressable
            style={styles.iconButton}
            onPress={toggleFlash}
            disabled={isProcessing}
          >
            <MediCareText
              style={styles.flashIcon}
              color={theme.white}
              weight="Bold"
            >
              {getFlashLabel()}
            </MediCareText>
          </Pressable>
        </View>

        {/* Bottom controls */}
        <View style={styles.bottomControls}>
          <Pressable
            style={[
              styles.captureButton,
              isProcessing && styles.captureButtonDisabled,
            ]}
            onPress={takePhoto}
            disabled={isProcessing}
          >
            <View style={styles.captureButtonInner} />
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default CameraScreen;

const useStyle = makeStyles((theme, insets: EdgeInsets) => ({
  container: {
    flex: 1,
    backgroundColor: theme.black,
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flashIcon: {
    fontSize: 12,
  },
  bottomControls: {
    alignItems: 'center',
    paddingBottom: insets.bottom + 20,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: theme.white,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: theme.white,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  captureButtonDisabled: {
    opacity: 0.5,
  },
  flick: {
    ...StyleSheet.absoluteFill,
    backgroundColor: theme.white,
  },
}));
