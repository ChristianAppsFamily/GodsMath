import { useEffect } from 'react';
import { Platform } from 'react-native';
import { maybeRequestAppReview, recordAppVisit } from '@/lib/appRating';
import { maybePromptForNotifications } from '@/lib/notifications';

const PROMPT_DELAY_MS = 2000;

/** Rating and notification prompts after ATT and ads initialize. */
export function AppEngagement() {
  useEffect(() => {
    if (Platform.OS === 'web') return;

    let cancelled = false;

    const run = async () => {
      await new Promise((resolve) => setTimeout(resolve, PROMPT_DELAY_MS));
      if (cancelled) return;

      await recordAppVisit();
      await maybeRequestAppReview();

      await new Promise((resolve) => setTimeout(resolve, 1200));
      if (cancelled) return;

      await maybePromptForNotifications();
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
