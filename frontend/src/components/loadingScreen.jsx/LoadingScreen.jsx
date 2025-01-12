import React, { useEffect, useState } from "react";
import { gsap } from "gsap";

const LoadingScreen = ({ setLoaded, loadFonts = false }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleLoad = async () => {
      if (loadFonts && document.fonts) {
        // Wait for fonts to load if `loadFonts` is true
        await document.fonts.ready;
      }

      let interval = setInterval(() => {
        setProgress((prev) => {
          const nextProgress = prev + 10;
          if (nextProgress >= 100) {
            clearInterval(interval);

            // Animate loading screen out
            gsap.to("#loading-screen", {
              opacity: 0,
              duration: 1,
              onComplete: () => setLoaded(true),
            });
          }
          return nextProgress;
        });
      }, 100); // Increment progress smoothly
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => {
      window.removeEventListener("load", handleLoad);
    };
  }, [setLoaded, loadFonts]);

  return (
    <div
      id="loading-screen"
      className="fixed inset-0 flex flex-col items-center justify-center bg-black text-white z-50"
    >
      <h1 className="text-2xl font-bold mb-4">Loading...</h1>
      <div className="bg-gray-700 w-64 h-2 rounded">
        <div
          className={`h-2 rounded bg-gradient-to-r from-pink-500 to-orange-500`}
          style={{
            width: `${progress}%`,
          }}
        ></div>
      </div>
    </div>
  );
};

export default LoadingScreen;
