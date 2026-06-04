import AsyncStorage from '@react-native-async-storage/async-storage';

export enum StorageKeys {
  User = 'user',
}

export const storage = AsyncStorage;