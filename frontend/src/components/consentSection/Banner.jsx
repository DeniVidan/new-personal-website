import React, { useState } from "react";
import CookieConsent, { Cookies } from "react-cookie-consent";

const CookieBanner = () => {
  const [cookiesAccepted, setCookiesAccepted] = useState(false);

  const handleAcceptCookies = () => {
    setCookiesAccepted(true);
  };

  return (
    <div>
      {/* Your chatbot and other page content */}
      <CookieConsent
        location="bottom"
        buttonText="Accept All"
        declineButtonText="Reject"
        enableDeclineButton
        onAccept={handleAcceptCookies}
        cookieName="userConsent"
        style={{ background: "#2B373B" }}
        buttonStyle={{
          color: "#4e503b",
          fontSize: "13px",
          background: "#f4e04d",
        }}
        declineButtonStyle={{
          color: "#ffffff",
          fontSize: "13px",
          background: "#ff5733",
        }}
        expires={365}
      >
        We use cookies to enhance your experience and provide our chatbot
        service. By clicking "Accept All", you consent to the use of cookies. Read our{" "}
        <a href="/cookie-policy" style={{ color: "#f4e04d" }}>
          Cookie Policy
        </a>
        .
      </CookieConsent>
      {cookiesAccepted && (
        <p style={{ color: "green" }}>Thank you for accepting cookies!</p>
      )}
    </div>
  );
};

export default CookieBanner;
