import { useEffect } from 'react';
import { useLocation } from 'react-router';

/**
 * Scrolls to the element matching the URL hash on navigation, or to the top of
 * the page when there is no hash. Call once from the layout so every route
 * honours in-page anchors (`/#about`) consistently.
 */
export const useHashScroll = () => {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }

    window.requestAnimationFrame(() => {
      document.getElementById(hash.slice(1))?.scrollIntoView();
    });
  }, [hash, pathname]);
};
