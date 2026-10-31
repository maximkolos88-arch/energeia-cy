import React, { useState, useRef, useEffect } from 'react';
import { ExternalLink, Maximize2, Minimize2, Radio } from 'lucide-react';

export const TerminalScreen: React.FC = () => {
  const [iframeLoaded, setIframeLoaded] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
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

  const toggleFullscreen = () => {
    setIsFullscreen(prev => !prev);
  };

  return (
    <div className={`w-full relative flex flex-col bg-[#0b1120] overflow-hidden ${
      isFullscreen 
        ? 'fixed inset-0 z-50 h-screen w-screen' 
        : 'h-[calc(100dvh-4rem)]'
    }`}>
      {/* Floating Mission Control Pill (Top-Right) */}
      <aside aria-label="Terminal Controls" className="absolute top-3 right-4 z-30 pointer-events-none flex items-center justify-end gap-2">
        <div className="pointer-events-auto flex items-center gap-1.5 p-1 rounded-full bg-[#131314]/85 backdrop-blur-md border border-[#333537] shadow-lg">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 text-[11px] font-mono text-[#8AB4F8] border-r border-[#333537]">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" aria-hidden="true" />
            <span>EARTH AI GIS</span>
          </div>

          <a
            href="/helios/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-[#C4C7C5] hover:text-white hover:bg-[#282A2C] transition-colors"
            title="Open Standalone Helios Terminal in New Tab"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#8AB4F8]" aria-hidden="true" />
            <span className="hidden sm:inline">Standalone</span>
          </a>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-[#C4C7C5] hover:text-white hover:bg-[#282A2C] transition-colors cursor-pointer"
            title={isFullscreen ? 'Exit Full Screen' : 'Full View'}
            aria-label={isFullscreen ? 'Exit Full Screen' : 'Full View'}
          >
            {isFullscreen ? (
              <>
                <Minimize2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">Exit</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">Full View</span>
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Loading state indicator */}
      {!iframeLoaded && (
        <div 
          className="absolute inset-0 flex flex-col items-center justify-center bg-[#0b1120] text-emerald-400 gap-3 z-20 pointer-events-none transition-opacity duration-300"
          aria-hidden={iframeLoaded}
        >
          <div className="w-8 h-8 border-2 border-[#8AB4F8] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-mono tracking-wider text-neutral-400">CONNECTING TO HELIOS EARTH AI 3D GIS...</p>
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
