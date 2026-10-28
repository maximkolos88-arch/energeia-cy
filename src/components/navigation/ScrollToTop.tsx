'use client';

import { useEffect, useRef } from 'react';

interface ScrollToTopProps {
  trigger: any;
}

export default function ScrollToTop({ trigger }: ScrollToTopProps) {
  const isFirstMount = useRef(true);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      if (typeof window !== 'undefined' && window.scrollY === 0) {
        return;
      }
    }

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' as ScrollBehavior,
    });
  }, [trigger]);

  return null;
}
