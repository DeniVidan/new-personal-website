import React, { useState, useEffect } from "react";

const CookieBanner = () => {
  const [cookiesAccepted, setCookiesAccepted] = useState(false);

  useEffect(() => {
    const cookieConsent = localStorage.getItem("cookiesAccepted");
    if (cookieConsent === "true") {
      setCookiesAccepted(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookiesAccepted", "true");
    setCookiesAccepted(true);

    // Example of setting a test cookie
    document.cookie = "testCookie=true; path=/; secure; samesite=none";
  };

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
