import { isUpdateRequired } from "@/libs/utils";
import { Alert, Linking, Platform } from "react-native";
import * as Application from 'expo-application';

const IOS_APP_ID = process.env.EXPO_PUBLIC_IOS_APP_ID;
const ANDROID_PACKAGE = process.env.EXPO_PUBLIC_ANDROID_PACKAGE;

const IOS_STORE_URL = `https://apps.apple.com/app/id${IOS_APP_ID}`;
const ANDROID_STORE_URL = `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE}`;


	export const getLatestAndroidVersion = async (): Promise<string | null> => {
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


    export	const getLatestIOSVersion = async (): Promise<string | null> => {
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

    export const getApplicationVersion = async () => {
            try {
                const latestVersion =
                    Platform.OS === 'ios'
                        ? await getLatestIOSVersion()
                        : await getLatestAndroidVersion();
    
                const currentVersion = Application.nativeApplicationVersion;
    
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
    
                                    // // Reset flag so alert can show again
                                    // setTimeout(() => {
                                    // 	isAlertVisible.current = false;
                                    // }, 1000);
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