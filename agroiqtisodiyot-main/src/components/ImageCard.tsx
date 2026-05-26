import { useState, useEffect } from 'react';
import { Blurhash } from 'react-blurhash';

interface ImageCardProps {
  src: string | null;
  alt: string;
  className?: string;
}

export function ImageCard({ src, alt, className = '' }: ImageCardProps) {
  // Extract Telegram fileId from the src URL
  const getFileId = (url: string | null) => {
    if (!url) return null;
    if (url.includes('/api/file/')) {
      const parts = url.split('/api/file/');
      return parts[parts.length - 1];
    }
    return null;
  };

  const fileId = getFileId(src);

  // Load from localStorage cache instantly for 0ms startup time
  const getCachedMetadata = () => {
    if (!fileId) return null;
    try {
      const cached = localStorage.getItem(`blurhash:${fileId}`);
      return cached ? JSON.parse(cached) : null;
    } catch (e) {
      return null;
    }
  };

  const [metadata, setMetadata] = useState<{ blurhash: string; width: number; height: number } | null>(getCachedMetadata);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [metaLoading, setMetaLoading] = useState(false);

  // Determine backend base URL dynamically
  const getBackendUrl = () => {
    const envUrl = import.meta.env.VITE_BACKEND_URL;
    if (envUrl) return envUrl;
    return import.meta.env.DEV ? 'http://localhost:3000' : '';
  };

  useEffect(() => {
    if (!fileId) {
      setMetadata(null);
      return;
    }

    // If metadata is already cached in state, don't trigger fetch (saves network requests)
    if (metadata && metadata.blurhash !== 'UDL=8;IBrXMx2sVqyFR+qE?sp0x^0gwEV?tT') {
      return;
    }

    const controller = new AbortController();
    const fetchMetadata = async () => {
      setMetaLoading(true);
      try {
        const backendUrl = getBackendUrl();
        const response = await fetch(`${backendUrl}/api/file/metadata/${fileId}`, {
          signal: controller.signal,
        });
        if (response.ok) {
          const data = await response.json();
          setMetadata(data);
          // Cache in localStorage for subsequent visits
          localStorage.setItem(`blurhash:${fileId}`, JSON.stringify(data));
        } else {
          // Fallback metadata if API fails
          setMetadata({
            blurhash: 'UDL=8;IBrXMx2sVqyFR+qE?sp0x^0gwEV?tT',
            width: 400,
            height: 300,
          });
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.error('Error fetching image metadata:', err);
          setMetadata({
            blurhash: 'UDL=8;IBrXMx2sVqyFR+qE?sp0x^0gwEV?tT',
            width: 400,
            height: 300,
          });
        }
      } finally {
        setMetaLoading(false);
      }
    };

    fetchMetadata();

    return () => {
      controller.abort();
    };
  }, [fileId]);

  // If no source is provided, show a neutral skeleton loader
  if (!src) {
    return (
      <div className="absolute inset-0 w-full h-full bg-slate-900 animate-pulse flex items-center justify-center">
        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">No Image</span>
      </div>
    );
  }

  // Define default blurhash keying (custom cover signature layout)
  const blurhashString = metadata?.blurhash || 'UDL=8;IBrXMx2sVqyFR+qE?sp0x^0gwEV?tT';

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-slate-950">
      {/* Blurhash Placeholder (fades out when the real image loads) */}
      <div
        className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-out z-10 ${
          imageLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <Blurhash
          hash={blurhashString}
          width="100%"
          height="100%"
          resolutionX={32}
          resolutionY={32}
          punch={1}
        />
      </div>

      {/* Actual Optimized Image */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setImageLoaded(true)}
        className={`${className} transition-all duration-700 ease-out ${
          imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      />
    </div>
  );
}
