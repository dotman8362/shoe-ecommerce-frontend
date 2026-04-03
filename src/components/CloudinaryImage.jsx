import { useState, useEffect, useRef } from "react";

const CloudinaryImage = ({ 
  src, 
  alt, 
  className,
  width = 500,
  height = 500,
  isPriority = false,
  onClick
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  // Generate different Cloudinary transformations
  const getOptimizedUrl = (quality = 'auto', blur = false) => {
    if (!src) return null;
    
    // Extract base Cloudinary URL
    let baseUrl = src;
    
    // Add transformations if not already present
    if (baseUrl.includes('cloudinary.com') && !baseUrl.includes('/upload/')) {
      baseUrl = baseUrl.replace('/upload/', '/upload/');
    }
    
    if (blur) {
      // Low quality placeholder (blurry, loads instantly)
      return baseUrl.replace(
        '/upload/',
        `/upload/w_20,h_20,c_fill,q_1,e_blur:500/`
      );
    }
    
    // High quality optimized image
    return baseUrl.replace(
      '/upload/',
      `/upload/w_${width},h_${height},c_fill,q_${quality},f_auto/`
    );
  };

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (isPriority || !imgRef.current) {
      setIsInView(true);
      return;
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observerRef.current?.disconnect();
          }
        });
      },
      { rootMargin: '200px', threshold: 0.01 }
    );

    observerRef.current.observe(imgRef.current);

    return () => observerRef.current?.disconnect();
  }, [isPriority]);

  const placeholderUrl = getOptimizedUrl('1', true);
  const actualUrl = getOptimizedUrl('auto');

  if (!src) {
    return (
      <div 
        className={className}
        style={{ 
          background: '#1a1714',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '200px'
        }}
      >
        <span style={{ color: '#8a8178', fontSize: '12px' }}>No image</span>
      </div>
    );
  }

  return (
    <div 
      ref={imgRef}
      className={`cloudinary-image-wrapper ${className || ''}`}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background: '#1a1714',
        cursor: onClick ? 'pointer' : 'default'
      }}
      onClick={onClick}
    >
      {/* Blur placeholder - loads instantly */}
      {isInView && (
        <img
          src={placeholderUrl}
          alt={`${alt} - placeholder`}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'blur(20px)',
            transform: 'scale(1.1)',
            opacity: isLoaded ? 0 : 1,
            transition: 'opacity 0.3s ease-out',
            pointerEvents: 'none'
          }}
        />
      )}

      {/* Actual high-quality image */}
      {isInView && (
        <img
          src={actualUrl}
          alt={alt}
          loading={isPriority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.4s ease-in-out',
            transform: isLoaded ? 'scale(1)' : 'scale(1.02)'
          }}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/500?text=No+Image';
          }}
        />
      )}
    </div>
  );
};

export default CloudinaryImage;