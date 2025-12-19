import React, { useEffect, useRef } from 'react';
import { AppState, Platform, Alert, Linking } from 'react-native';
import { Redirect } from 'expo-router';
import * as Application from 'expo-application';

import useAuth from '@/hooks/useAuth';
import { isUpdateRequired } from '@/libs/utils';

const IOS_APP_ID = '6751399674';
const ANDROID_PACKAGE = 'com.sceseqr';

const IOS_STORE_URL = `https://apps.apple.com/app/id${IOS_APP_ID}`;
const ANDROID_STORE_URL = `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE}`;

const Index = () => {
  const { isUserLoggedIn } = useAuth();
  const appState = useRef(AppState.currentState);

  const getLatestAndroidVersion = async (): Promise<string | null> => {
    try {
      const response = await fetch(
        `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE}&hl=en&gl=US`
      );
      const text = await response.text();
      const match = text.match(/\[\[\["([0-9.]+)"\]\]/);
      return match?.[1] ?? null;
    } catch {
      return null;
    }
  };

  const getLatestIOSVersion = async (): Promise<string | null> => {
    try {
      const res = await fetch(
        `https://itunes.apple.com/lookup?id=${IOS_APP_ID}&country=IN`
      );
      const json = await res.json();
      return json?.results?.[0]?.version ?? null;
    } catch {
      return null;
    }
  };

  const getApplicationVersion = async () => {
    try {
      const latestVersion =
        Platform.OS === 'ios'
          ? await getLatestIOSVersion()
          : await getLatestAndroidVersion();

      const currentVersion = Application.nativeApplicationVersion;

    //   console.log(currentVersion, "currentVersion");
    //   console.log(latestVersion, "latestVersion");
      

      if (
        isUpdateRequired(currentVersion, latestVersion)
      ) {
        Alert.alert(
          'Update Required',
          'A new version of the app is available. Please update to continue using the app.',
          [
            {
              text: 'Update Now',
              onPress: () => {
                const url =
                  Platform.OS === 'ios'
                    ? IOS_STORE_URL
                    : ANDROID_STORE_URL;

                Linking.openURL(url);
              },
            },
          ],
          { cancelable: false }
        );
      }
    } catch (error) {
      console.error('Version check failed:', error);
    }
  };

  useEffect(() => {
    getApplicationVersion();
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextState === 'active'
      ) {
        getApplicationVersion();
      }
      appState.current = nextState;
    });

    return () => subscription.remove();
  }, []);

  if (isUserLoggedIn) {
    return <Redirect href="/home" />;
  }

  return <Redirect href="/welcome" />;
};

export default Index;
