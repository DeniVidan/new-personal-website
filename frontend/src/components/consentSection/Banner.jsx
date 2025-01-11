import React, { useState, useEffect } from "react";
import CookieConsent from "react-cookie-consent";

/**
 * Using react-cookie-consent for the banner,
 * plus a manual approach to store localStorage + set a test cookie.
 */
const CookieBanner = () => {
  const [cookiesAccepted, setCookiesAccepted] = useState(false);

  useEffect(() => {
    // Check if user previously accepted cookies
    const cookieConsent = localStorage.getItem("cookiesAccepted");
    if (cookieConsent === "true") {
      setCookiesAccepted(true);
    }
  }, []);

  const handleAccept = () => {
    // Mark user consent in localStorage
    localStorage.setItem("cookiesAccepted", "true");
    setCookiesAccepted(true);

    // Also set an actual cookie for demonstration or server use
    // 'secure' + 'sameSite=none' require HTTPS in production
    // 'max-age=31536000' => 1 year
    document.cookie =
      "cookieConsent=accepted; path=/; max-age=31536000; samesite=none; secure";
  };

  // If cookies are accepted, we can hide the banner entirely
  if (cookiesAccepted) return null;

  return (
    <CookieConsent
      location="bottom"
      buttonText="Accept All"
      declineButtonText="Decline"
      enableDeclineButton
      onAccept={handleAccept}
      cookieName="cookieConsent"      // react-cookie-consent will also store this
      style={{ background: "#2B373B", zIndex: 9999 }}
      buttonStyle={{ background: "#f4e04d", color: "#000", fontSize: "14px" }}
      declineButtonStyle={{ background: "#ff5733", color: "#fff", fontSize: "14px" }}
      expires={365}                   // 365 days
    >
      We use cookies to enhance your experience. By continuing, you accept our cookie policy.
    </CookieConsent>
  );
};

export default CookieBanner;
