import React, { useState, useEffect } from "react";

const CookieBanner = () => {
  const [cookiesAccepted, setCookiesAccepted] = useState(false);

  useEffect(() => {
    // Check if user previously accepted cookies
    const cookieConsent = localStorage.getItem("cookiesAccepted");
    if (cookieConsent === "true") {
      setCookiesAccepted(true);
    }
  }, []);

  const acceptCookies = () => {
    // Store the user preference in localStorage
    localStorage.setItem("cookiesAccepted", "true");
    setCookiesAccepted(true);

    // Also set an actual browser cookie (for reference/testing)
    // 'secure' + 'sameSite=none' require HTTPS in production
    // 'max-age=31536000' => 1 year in seconds
    document.cookie =
      "cookieConsent=accepted; path=/; max-age=31536000; samesite=none; secure";
  };

  // If already accepted, hide the banner
  if (cookiesAccepted) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-gray-800 text-white p-4 shadow-md z-50 flex items-center justify-center">
      <p className="text-sm sm:text-base">
        We use cookies to enhance your experience. By continuing, you accept our cookie policy.
      </p>
      <button
        onClick={acceptCookies}
        className="ml-4 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded shadow"
      >
        Accept Cookies
      </button>
    </div>
  );
};

export default CookieBanner;
