import React, { useEffect, useState } from "react";
import { gsap } from "gsap";

const LoadingScreen = ({ setLoaded }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate asset loading
    const interval = setInterval(() => {
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
    }, 300); // Adjust duration as needed

    return () => clearInterval(interval);
  }, [setLoaded]);

  return (
    <div
      id="loading-screen"
      className="fixed inset-0 flex flex-col items-center justify-center bg-black text-white z-50"
    >
      <h1 className="text-2xl font-bold mb-4">Loading...</h1>
      <div className="bg-gray-700 w-64 h-2 rounded">
        <div
          className="h-2 rounded"
          style={{
            width: `${progress}%`,
            background: `linear-gradient(to right, theme('colors.pink.500'), orange)`,
          }}
        ></div>
      </div>
    </div>
  );
};

export default LoadingScreen;
