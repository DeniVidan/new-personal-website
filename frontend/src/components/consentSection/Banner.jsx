import React, { useState, useEffect } from "react";
import CookieConsent from "react-cookie-consent";

const CookieBanner = ({ forceShow, onAcceptCallback }) => {
  const [cookiesAccepted, setCookiesAccepted] = useState(false);

  useEffect(() => {
    // If user accepted before, mark as accepted
    const cookieConsent = localStorage.getItem("cookiesAccepted");
    if (cookieConsent === "true") {
      setCookiesAccepted(true);
    }
  }, []);

  // Also watch the "forceShow" prop: if it's "true", we want to show the banner again
  useEffect(() => {
    if (forceShow) {
      setCookiesAccepted(false); 
    }
  }, [forceShow]);

  const handleAccept = () => {
    localStorage.setItem("cookiesAccepted", "true");
    setCookiesAccepted(true);

    // Also set a test cookie
    document.cookie = "cookieConsent=accepted; path=/; samesite=none; secure; max-age=31536000";

    // If parent wants to do something additional, call onAcceptCallback
    if (onAcceptCallback) {
      onAcceptCallback();
    }
  };

  // If user previously accepted cookies and we're not forced to show, hide the banner
  if (cookiesAccepted && !forceShow) return null;

  return (
    <CookieConsent
      location="bottom"
      buttonText="Accept All"
      declineButtonText="Decline"
      enableDeclineButton
      onAccept={handleAccept}
      cookieName="cookieConsent"
      style={{ background: "#2B373B", zIndex: 9999 }}
      buttonStyle={{ background: "#f4e04d", color: "#000", fontSize: "14px" }}
      declineButtonStyle={{ background: "#ff5733", color: "#fff", fontSize: "14px" }}
      expires={365}
    >
      We use cookies to enhance your experience. By continuing, you accept our cookie policy.
    </CookieConsent>
  );
};

export default CookieBanner;
