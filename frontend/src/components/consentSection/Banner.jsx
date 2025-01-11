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
    <div className="cookie-banner">
      <p>We use cookies to enhance your experience. By continuing, you accept our cookie policy.</p>
      <button onClick={acceptCookies}>Accept Cookies</button>
    </div>
  );
};

export default CookieBanner;
