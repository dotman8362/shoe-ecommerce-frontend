import { useState, useEffect } from "react";

const CSS = `
  .spinner-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #0e0c0a;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    transition: opacity 0.5s ease, visibility 0.5s ease;
  }

  .spinner-overlay.fade-out {
    opacity: 0;
    visibility: hidden;
  }

  .spinner-container {
    text-align: center;
  }

  /* Main spinner */
  .spinner {
    width: 60px;
    height: 60px;
    margin: 0 auto 24px;
    position: relative;
    animation: rotate 2s linear infinite;
  }

  .spinner-circle {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 2px solid rgba(196,156,104,0.1);
    border-top-color: #c49c68;
    animation: spin 0.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  }

  /* Rings */
  .spinner-rings {
    position: relative;
    width: 80px;
    height: 80px;
    margin: 0 auto 32px;
  }

  .ring {
    position: absolute;
    border-radius: 50%;
    border: 1px solid transparent;
    animation: pulse-ring 1.5s ease-out infinite;
  }

  .ring-1 {
    width: 100%;
    height: 100%;
    border-top-color: #c49c68;
    border-right-color: rgba(196,156,104,0.3);
    animation-delay: 0s;
  }

  .ring-2 {
    width: 70%;
    height: 70%;
    top: 15%;
    left: 15%;
    border-bottom-color: #dbb98a;
    border-left-color: rgba(219,185,138,0.3);
    animation-delay: 0.3s;
  }

  .ring-3 {
    width: 40%;
    height: 40%;
    top: 30%;
    left: 30%;
    border-top-color: #7aab8a;
    border-right-color: rgba(122,171,138,0.3);
    animation-delay: 0.6s;
  }

  /* Loading text */
  .loading-text {
    font-family: 'Jost', sans-serif;
    font-size: 0.7rem;
    font-weight: 300;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: #8a8178;
    margin-top: 24px;
    animation: fadeInOut 2s ease-in-out infinite;
  }

  .loading-dots {
    display: inline-flex;
    gap: 4px;
    margin-left: 4px;
  }

  .dot {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: #c49c68;
    animation: bounce 1.4s ease-in-out infinite;
  }

  .dot:nth-child(1) { animation-delay: 0s; }
  .dot:nth-child(2) { animation-delay: 0.2s; }
  .dot:nth-child(3) { animation-delay: 0.4s; }

  /* Brand watermark */
  .spinner-brand {
    position: absolute;
    bottom: 40px;
    font-family: 'Cormorant Garamond', serif;
    font-size: 0.8rem;
    font-weight: 300;
    font-style: italic;
    color: rgba(196,156,104,0.3);
    letter-spacing: 0.1em;
  }

  /* Animations */
  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @keyframes pulse-ring {
    0% {
      transform: scale(0.8);
      opacity: 0.5;
    }
    50% {
      transform: scale(1);
      opacity: 0.2;
    }
    100% {
      transform: scale(1.2);
      opacity: 0;
    }
  }

  @keyframes fadeInOut {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }

  @keyframes bounce {
    0%, 80%, 100% { transform: scale(0.6); opacity: 0.3; }
    40% { transform: scale(1); opacity: 1; }
  }
`;

export default function LoadingSpinner({ isLoading }) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setFadeOut(true);
    }
  }, [isLoading]);

  if (!isLoading && fadeOut) {
    return null;
  }

  return (
    <>
      <style>{CSS}</style>
      <div className={`spinner-overlay ${fadeOut ? "fade-out" : ""}`}>
        <div className="spinner-container">
          {/* Animated rings */}
          <div className="spinner-rings">
            <div className="ring ring-1"></div>
            <div className="ring ring-2"></div>
            <div className="ring ring-3"></div>
          </div>

          {/* Main spinner */}
          <div className="spinner">
            <div className="spinner-circle"></div>
          </div>

          {/* Loading text */}
          <div className="loading-text">
            LOADING
            <span className="loading-dots">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </span>
          </div>
        </div>

        <div className="spinner-brand">
          Jofta Solemates
        </div>
      </div>
    </>
  );
}