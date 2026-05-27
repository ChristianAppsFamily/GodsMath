import * as TrackingTransparency from 'expo-tracking-transparency';
import { Platform } from 'react-native';

/** Request ATT after splash, before AdMob loads ads on the main screen. */
export async function requestTrackingPermission(): Promise<boolean> {
  if (Platform.OS !== 'ios') return true;

  try {
    const { status: current } =
      await TrackingTransparency.getTrackingPermissionsAsync();
    if (current === TrackingTransparency.PermissionStatus.UNDETERMINED) {
      const { status } = await TrackingTransparency.requestTrackingPermissionsAsync();
      return status === TrackingTransparency.PermissionStatus.GRANTED;
    }
    return current === TrackingTransparency.PermissionStatus.GRANTED;
  } catch (err) {
    console.warn('[ATT] Permission request failed:', err);
    return false;
  }
}
