import { useState } from 'react';
import { Linking } from 'react-native';

const INSTAGRAM_USER = 'fbla_pbl';
const INSTAGRAM_WEB_URL = `https://www.instagram.com/${INSTAGRAM_USER}/`;
const INSTAGRAM_APP_URL = `instagram://user?username=${INSTAGRAM_USER}`;

export function useSocialHubViewModel() {
  const [webViewLoading, setWebViewLoading] = useState(true);
  const [webViewError, setWebViewError] = useState(false);

  async function openInApp() {
    try {
      const supported = await Linking.canOpenURL(INSTAGRAM_APP_URL);
      if (supported) {
        await Linking.openURL(INSTAGRAM_APP_URL);
      } else {
        await Linking.openURL(INSTAGRAM_WEB_URL);
      }
    } catch (_) {
      await Linking.openURL(INSTAGRAM_WEB_URL);
    }
  }

  return {
    webUrl: INSTAGRAM_WEB_URL,
    webViewLoading,
    setWebViewLoading,
    webViewError,
    setWebViewError,
    openInApp,
  };
}
