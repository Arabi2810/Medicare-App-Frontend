import React, { useEffect } from 'react';
import StackNavigation from './Stack';
import { useAppDispatch, useAppSelector } from '@src/redux/store';
import { initAuth } from '@src/redux/features/user/authSlice';
import { ActivityIndicator, View } from 'react-native';

const Root = () => {
  const dispatch = useAppDispatch();
  const hydrated = useAppSelector(state => state.auth.hydrated);

  useEffect(() => {
    dispatch(initAuth());
  }, []);

  if (!hydrated) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return <StackNavigation />;
};

export default Root;