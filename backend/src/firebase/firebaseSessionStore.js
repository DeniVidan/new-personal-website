const db = require("../utils/firebaseAdmin"); // Firebase Admin SDK

const sessionsCollection = db.collection("sessions");
const SESSION_EXPIRY_MINUTES = 3; // Adjust expiry to 3 minutes

/**
 * Retrieve session data. Throws if not found or expired.
 */
async function getSessionData(sessionToken) {
    const sessionRef = sessionsCollection.doc(sessionToken);
    const sessionDoc = await sessionRef.get();
  
    if (!sessionDoc.exists) {
      throw new Error("Session not found.");
    }
  
    const sessionData = sessionDoc.data();
  
    if (Date.now() > sessionData.expiryTime) {
      await sessionRef.delete();
      throw new Error("Session has expired.");
    }
  
    return sessionData;
  }
/**
 * Update the session in Firestore (merge).
 */
async function updateSessionData(sessionToken, updatedSession) {
  const docRef = sessionsCollection.doc(sessionToken);
  await docRef.set(updatedSession, { merge: true });
}

/**
 * Delete a session (optional utility).
 */
async function clearSession(sessionToken) {
  const docRef = sessionsCollection.doc(sessionToken);
  await docRef.delete();
}

/**
 * Create or update session with expiry.
 */
async function createOrUpdateSession(sessionToken, sessionData) {
    const sessionRef = sessionsCollection.doc(sessionToken);
  
    await sessionRef.set(
      {
        ...sessionData,
        expiryTime: Date.now() + SESSION_EXPIRY_MINUTES * 60 * 1000,
      },
      { merge: true }
    );
  }
  

module.exports = {
  getSessionData,
  updateSessionData,
  clearSession,
  createOrUpdateSession,
};
