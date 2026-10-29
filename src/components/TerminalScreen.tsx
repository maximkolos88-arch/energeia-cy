import React, { useState, useRef, useEffect } from 'react';

export const TerminalScreen: React.FC = () => {
  const [iframeLoaded, setIframeLoaded] = useState<boolean>(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe) {
      try {
        if (iframe.contentDocument && (iframe.contentDocument.readyState === 'complete' || iframe.contentDocument.readyState === 'interactive')) {
          setIframeLoaded(true);
        }
      } catch {
        // Fallback for cross-origin or security restrictions
      }

      const handleLoad = () => setIframeLoaded(true);
      iframe.addEventListener('load', handleLoad);

      // Failsafe timer: ensure overlay always dismisses once the page is interactive
      const timer = setTimeout(() => {
        setIframeLoaded(true);
      }, 400);

      return () => {
        iframe.removeEventListener('load', handleLoad);
        clearTimeout(timer);
      };
    }
  }, []);

  return (
    <div className="w-full relative flex flex-col bg-[#0b1120] overflow-hidden h-[calc(100dvh-4rem)]">
      {/* Loading state indicator */}
      {!iframeLoaded && (
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center bg-[#0b1120] text-emerald-400 gap-3 z-20 pointer-events-none transition-opacity duration-300"
          aria-hidden={iframeLoaded}
        >
          <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-mono tracking-wider text-neutral-400">CONNECTING TO HELIOS 3D GRID TERMINAL...</p>
        </div>
      )}

      {/* Embedded Terminal Frame */}
      <iframe
        ref={iframeRef}
        src="/helios/"
        title="Helios Eye Cyprus Grid Terminal"
        className="w-full h-full border-0 relative z-10"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        onLoad={() => setIframeLoaded(true)}
      />
    </div>
  );
};
