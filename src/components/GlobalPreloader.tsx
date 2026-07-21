'use client';

import { useEffect } from 'react';
import {
  getPublicRooms,
  getRoomTypes,
  getRoomSettings,
  getActivities,
  getActivityCategories,
  getActivitySettings,
  getTickets,
  getFaqs,
  getSettings,
  getAbout
} from '@/services/api';

export default function GlobalPreloader() {
  useEffect(() => {
    // Only prefetch if we're in the browser and idle
    const prefetchData = async () => {
      try {
        // Fetch non-blocking in background
        await Promise.allSettled([
          getPublicRooms(),
          getRoomTypes(),
          getRoomSettings(),
          getActivities(),
          getActivityCategories(),
          getActivitySettings(),
          getTickets(),
          getFaqs(),
          getSettings(),
          getAbout()
        ]);
        console.log('[Preloader] Application caches warmed up!');
      } catch (err) {
        console.warn('[Preloader] Error during warm up:', err);
      }
    };

    // Use requestIdleCallback if available to prevent blocking main thread during FCP
    if (typeof window !== 'undefined') {
      if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => prefetchData(), { timeout: 2000 });
      } else {
        setTimeout(prefetchData, 1000);
      }
    }
  }, []);

  return null;
}
