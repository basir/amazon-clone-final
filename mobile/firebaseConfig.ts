import { initializeApp } from 'firebase/app';
// @ts-ignore
import { initializeAuth, getReactNativePersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const platform = Platform.OS // 'ios' | 'android' | 'web'

const firebaseConfig = {
    apiKey:
        platform === 'web'
            ? process.env.EXPO_PUBLIC_FIREBASE_API_KEY_WEB
            : platform === 'ios'
                ? process.env.EXPO_PUBLIC_FIREBASE_API_KEY_IOS
                : process.env.EXPO_PUBLIC_FIREBASE_API_KEY_ANDROID,

    appId:
        platform === 'web'
            ? process.env.EXPO_PUBLIC_FIREBASE_APP_ID_WEB
            : platform === 'ios'
                ? process.env.EXPO_PUBLIC_FIREBASE_APP_ID_IOS
                : process.env.EXPO_PUBLIC_FIREBASE_APP_ID_ANDROID,

    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
}

export const app = initializeApp(firebaseConfig);

export const auth = Platform.OS === 'web'
    ? initializeAuth(app, { persistence: browserLocalPersistence })
    : initializeAuth(app, { persistence: getReactNativePersistence(ReactNativeAsyncStorage) });

export const db = getFirestore(app);
