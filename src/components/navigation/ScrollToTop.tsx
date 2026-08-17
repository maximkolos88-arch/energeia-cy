'use client';

import { useEffect } from 'react';

interface ScrollToTopProps {
  trigger: any;
}

export default function ScrollToTop({ trigger }: ScrollToTopProps) {
  useEffect(() => {
    // 1. Instant scroll reset of global window
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' as ScrollBehavior,
    });

    // 2. Scroll reset of document root elements
    if (document.documentElement) {
      document.documentElement.scrollTop = 0;
    }
    if (document.body) {
      document.body.scrollTop = 0;
    }

    // 3. Scroll reset of any internal scroll-containers
    const scrollableContainers = document.querySelectorAll(
      'main, #__next, #app-root, [data-scroll-container], .main-content'
    );
    scrollableContainers.forEach((container) => {
      container.scrollTop = 0;
    });
  }, [trigger]);

  return null;
}
