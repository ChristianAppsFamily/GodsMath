import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { Alert, Linking, Platform } from 'react-native';

const NOTIFICATIONS_PREF_KEY = 'godmath_notifications_enabled';
const NOTIFICATIONS_PROMPTED_KEY = 'godmath_notifications_prompted';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function getNotificationsPreference(): Promise<boolean> {
  const value = await AsyncStorage.getItem(NOTIFICATIONS_PREF_KEY);
  return value === 'true';
}

export async function setNotificationsPreference(enabled: boolean): Promise<void> {
  await AsyncStorage.setItem(NOTIFICATIONS_PREF_KEY, enabled ? 'true' : 'false');
}

export function isNotificationPermissionGranted(
  status: Notifications.NotificationPermissionsStatus,
): boolean {
  if (status.granted) return true;
  if (
    Platform.OS === 'ios' &&
    status.ios?.status === Notifications.IosAuthorizationStatus.AUTHORIZED
  ) {
    return true;
  }
  return false;
}

export async function requestSystemNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'web') return false;

  const existing = await Notifications.getPermissionsAsync();
  if (isNotificationPermissionGranted(existing)) return true;

  if (
    Platform.OS === 'ios' &&
    existing.ios?.status === Notifications.IosAuthorizationStatus.DENIED
  ) {
    return false;
  }

  const result = await Notifications.requestPermissionsAsync({
    ios: { allowAlert: true, allowBadge: true, allowSound: true },
  });

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('daily-verse', {
      name: 'Daily Verse Reminders',
      importance: Notifications.AndroidImportance.DEFAULT,
      sound: 'default',
    });
  }

  return isNotificationPermissionGranted(result);
}

function showOpenSettingsAlert(): void {
  Alert.alert(
    'Turn On Notifications',
    "God's Math can send a gentle morning reminder with today's verse about God's provision. Enable notifications in Settings.",
    [
      { text: 'Not Now', style: 'cancel' },
      { text: 'Open Settings', onPress: () => void Linking.openSettings() },
    ],
  );
}

export async function scheduleDailyVerseReminder(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "God's Math",
      body: "Today's verse on God's provision is ready. Open the app to read and calculate with faith.",
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 8,
      minute: 0,
    },
  });
}

export async function enableDailyNotifications(): Promise<boolean> {
  const granted = await requestSystemNotificationPermission();
  if (!granted) {
    showOpenSettingsAlert();
    await setNotificationsPreference(false);
    return false;
  }
  await scheduleDailyVerseReminder();
  await setNotificationsPreference(true);
  return true;
}

export async function disableDailyNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
  await setNotificationsPreference(false);
}

export async function promptForNotificationPermission(): Promise<void> {
  if (Platform.OS === 'web') return;

  const existing = await Notifications.getPermissionsAsync();
  if (isNotificationPermissionGranted(existing)) {
    const enabled = await getNotificationsPreference();
    if (!enabled) await enableDailyNotifications();
    return;
  }

  if (
    Platform.OS === 'ios' &&
    existing.ios?.status === Notifications.IosAuthorizationStatus.DENIED
  ) {
    showOpenSettingsAlert();
    return;
  }

  Alert.alert(
    'Daily Verse Reminders',
    "God's Math would like to remind you each morning with a verse about God's provision and faithful math. You'll see the system permission next.",
    [
      { text: 'Not Now', style: 'cancel' },
      {
        text: 'Continue',
        onPress: () => {
          void (async () => {
            const granted = await requestSystemNotificationPermission();
            if (!granted) {
              await setNotificationsPreference(false);
              showOpenSettingsAlert();
              return;
            }
            await scheduleDailyVerseReminder();
            await setNotificationsPreference(true);
          })();
        },
      },
    ],
  );
}

export async function maybePromptForNotifications(): Promise<void> {
  if (Platform.OS === 'web') return;
  const alreadyPrompted = await AsyncStorage.getItem(NOTIFICATIONS_PROMPTED_KEY);
  if (alreadyPrompted === 'true') return;
  await AsyncStorage.setItem(NOTIFICATIONS_PROMPTED_KEY, 'true');
  await promptForNotificationPermission();
}
