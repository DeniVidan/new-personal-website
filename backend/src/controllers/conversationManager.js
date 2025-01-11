const transporter = require("../utils/emailTransporter");
const pricingData = require("../data/pricing_data.json");
const {
  getSessionData,
  updateSessionData,
  clearSession,
  createOrUpdateSession,
} = require("../firebase/firebaseSessionStore");
require("dotenv").config();

class ConversationManager {
  constructor() {
    this.pricingData = pricingData;
  }

  /**
   * processInput:
   * 1) Use GPT to classify userInput -> { type, value, valid }
   * 2) handleProcessedInput(...) -> next polite message
   * 3) Return { aiMessage, updatedSession }
   */
  async processInput(userInput, openai, sessionData, sessionToken) {
    const userData = sessionData.userData;
    const step = sessionData.step;

    // --- FIRST GPT CALL: Classification ---
    const classificationPrompt = `
You are an AI assistant collecting 3 pieces of data: name, email, and service interest.
Currently, we STILL need: ${step}
Already have: ${JSON.stringify(userData)}

User said: "${userInput}"

Instructions:
1) Return ONLY JSON in format: { "type": "name|email|service", "value": string, "valid": boolean }.
2) If user mentions "website", "web design", "logo", "seo", "maintenance" etc., set "type":"service".
3) If user says "I am John" or "My name is Mary," set "type":"name", "valid":true, "value":"John" or "Mary".
4) If it looks like "someone@domain.com", "type":"email", "valid":true. If not valid, "valid":false.
5) Return ONLY that JSON, no extra text.
    `;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: classificationPrompt },
          { role: "user", content: userInput },
        ],
      });

      const rawResponse = response.choices[0].message.content || "";
      console.log("Classification raw:", rawResponse);

      const parsedResponse = JSON.parse(
        rawResponse.replace(/```json|```/g, "").trim()
      );

      // --- Route to the second GPT call for a polite message ---
      const aiMessage = await this.handleProcessedInput(
        parsedResponse,
        sessionData,
        openai,
        sessionToken
      );

      return { aiMessage, updatedSession: sessionData };
    } catch (error) {
      console.error("Error parsing classification:", error);
      return "Sorry, I didn’t understand that. Could you please repeat?";
    }
  }

  /**
   * handleProcessedInput:
   * Decide next step based on classification results
   * Then call generatePoliteReply(...) for the actual user-facing message.
   */
  async handleProcessedInput(parsed, sessionData, openai, sessionToken) {
    const { type, value, valid } = parsed;
    const userData = sessionData.userData;
    let step = sessionData.step;

    // If user typed a valid piece of data out of order, let's store it anyway:
    if (type === "service" && valid) userData.interest = value;
    if (type === "email" && valid) userData.email = value;
    if (type === "name" && valid) userData.name = value;

    // Now handle each step, checking what we still need:
    switch (step) {
      case "name":
        if (userData.name) {
          // We have name, move on to email or skip to service if email is known
          if (userData.email) {
            // If we also have service, done
            if (userData.interest) {
              sessionData.step = "complete";
              await this.sendOffer(openai, sessionData, sessionToken);
              return await this.generatePoliteReply(
                {
                  scenario: "allDataCollected",
                  userData,
                },
                openai
              );
            } else {
              sessionData.step = "service";
              return await this.generatePoliteReply(
                {
                  scenario: "askService",
                  userData,
                },
                openai
              );
            }
          } else {
            sessionData.step = "email";
            return await this.generatePoliteReply(
              {
                scenario: "gotNameNeedEmail",
                userData,
              },
              openai
            );
          }
        }
        // If no valid name found:
        return await this.generatePoliteReply(
          {
            scenario: "invalidOrMissingName",
            userData,
          },
          openai
        );

      case "email":
        if (userData.email) {
          // If we have service & name, done
          if (userData.interest && userData.name) {
            sessionData.step = "complete";
            await this.sendOffer(openai, sessionData, sessionToken);
            return await this.generatePoliteReply(
              {
                scenario: "allDataCollected",
                userData,
              },
              openai
            );
          }
          // If missing service, ask for it
          if (!userData.interest) {
            sessionData.step = userData.name ? "service" : "name";
            if (sessionData.step === "service") {
              return await this.generatePoliteReply(
                {
                  scenario: "askService",
                  userData,
                },
                openai
              );
            } else {
              return await this.generatePoliteReply(
                {
                  scenario: "needNameButHaveEmail",
                  userData,
                },
                openai
              );
            }
          }
          // If missing name but user typed service first, handle that
          if (!userData.name) {
            sessionData.step = "name";
            return await this.generatePoliteReply(
              {
                scenario: "needNameButHaveEmail",
                userData,
              },
              openai
            );
          }
        }
        // No valid email found
        return await this.generatePoliteReply(
          {
            scenario: "invalidOrMissingEmail",
            userData,
          },
          openai
        );

      case "service":
        if (userData.interest) {
          // If we have name & email => done
          if (userData.name && userData.email) {
            sessionData.step = "complete";
            await this.sendOffer(openai, sessionData, sessionToken);
            return await this.generatePoliteReply(
              {
                scenario: "allDataCollected",
                userData,
              },
              openai
            );
          }
          // Missing name or email
          if (!userData.name && !userData.email) {
            sessionData.step = "name";
            return await this.generatePoliteReply(
              {
                scenario: "missingNameEmail",
                userData,
              },
              openai
            );
          }
          if (!userData.name) {
            sessionData.step = "name";
            return await this.generatePoliteReply(
              {
                scenario: "askNameButHaveService",
                userData,
              },
              openai
            );
          }
          if (!userData.email) {
            sessionData.step = "email";
            return await this.generatePoliteReply(
              {
                scenario: "askEmailButHaveService",
                userData,
              },
              openai
            );
          }
        }
        // No valid service
        return await this.generatePoliteReply(
          {
            scenario: "invalidService",
            userData,
          },
          openai
        );

      default:
        // Step "complete" or unknown
        return "This conversation is complete or in an unknown state. Try again in a few minutes.";
    }
  }

  /**
   * sendOffer:
   * 1) Check matched services vs fallback
   * 2) Compose & send email to user + admin
   */
  async sendOffer(openai, sessionData, sessionToken) {
    const userData = sessionData.userData;
    const { matchedServices, fallbackNeeded } = this.getMatchedServicesOrFallback(
      userData.interest
    );

    if (!userData.email) {
      console.error("Error: No user email—cannot send offer.");
      return;
    }

    if (!fallbackNeeded) {
      // Normal Offer
      const prompt = `
You are a professional service offer generator. The user is interested in: "${userData.interest}".
Customer Data:
Name: ${userData.name}
Email: ${userData.email}

We have the following matched services (with exact pricing):
${matchedServices
  .map((s) => `${s.name} (${s.price}) - ${s.description}`)
  .join("\n")}

Write an email in JSON only:
{
  "subject": "...",
  "body": "..."
}

Requirements:
1) Greet the user by name
2) Mention the matched service + EXACT price
3) Show what's included
4) Mention next steps (timeline, discovery call, etc.)
5) Sign off:
   Best regards,
   Deni Vidan
   VIDAN LIMITED d.o.o
      `;

      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are a professional service offer generator. Return JSON only.",
            },
            { role: "user", content: prompt },
          ],
        });

        let raw = completion.choices[0].message.content;
        raw = raw.replace(/```json/g, "").replace(/```/g, "");
        const emailContent = JSON.parse(raw);

        // Send to user & admin
        await Promise.all([
          transporter.sendMail({
            from: process.env.EMAIL,
            to: userData.email,
            subject: emailContent.subject,
            text: emailContent.body,
          }),
          transporter.sendMail({
            from: process.env.EMAIL,
            to: process.env.ADMIN_EMAIL || "denividan@gmail.com",
            subject: `New Lead: ${userData.name}`,
            text: `
User Name: ${userData.name}
User Email: ${userData.email}
Service Needed: ${userData.interest}

--- AI Message Sent to User ---
${emailContent.body}
`,
          }),
        ]);

        console.log(
          `Offer for ${userData.name} about "${userData.interest}" sent successfully!`
        );
      } catch (error) {
        console.error("Error sending normal offer:", error);
      }
    } else {
      // Fallback Offer
      const fallbackPrompt = `
User wants: "${userData.interest}"
We only have:
${Object.values(this.pricingData.services)
  .map((s) => `- ${s.name} at ${s.price}`)
  .join("\n")}

Write an email in JSON only:
{
  "subject": "...",
  "body": "..."
}

Requirements:
1) Greet them by name
2) Mention we don't have an exact package for their request
3) Suggest a custom quote or meeting
4) Sign off:
   Best regards,
   Deni Vidan
   VIDAN LIMITED d.o.o
      `;

      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content:
                "You are a fallback generator for custom or complex services. Return JSON only.",
            },
            { role: "user", content: fallbackPrompt },
          ],
        });

        let raw = completion.choices[0].message.content;
        raw = raw.replace(/```json/g, "").replace(/```/g, "");
        const fallbackEmail = JSON.parse(raw);

        await Promise.all([
          transporter.sendMail({
            from: process.env.EMAIL,
            to: userData.email,
            subject: fallbackEmail.subject,
            text: fallbackEmail.body,
          }),
          transporter.sendMail({
            from: process.env.EMAIL,
            to: process.env.ADMIN_EMAIL,
            subject: `New Custom Request: ${userData.name}`,
            text: `
User Name: ${userData.name}
User Email: ${userData.email}
Service Needed: ${userData.interest}

--- AI Message Sent to User ---
${fallbackEmail.body}
`,
          }),
        ]);

        console.log(`Fallback email for ${userData.name} sent successfully!`);
      } catch (error) {
        console.error("Error sending fallback offer:", error);
      }
    }
  }

  /**
   * getMatchedServicesOrFallback:
   * Returns matched services or indicates fallback if none match
   */
  getMatchedServicesOrFallback(interest) {
    const lower = (interest || "").toLowerCase();
    const matchedServices = Object.values(this.pricingData.services).filter(
      (srv) => srv.keywords.some((kw) => lower.includes(kw.toLowerCase()))
    );

    if (matchedServices.length > 0) {
      return { matchedServices, fallbackNeeded: false };
    }
    return { matchedServices: [], fallbackNeeded: true };
  }

  /**
   * generatePoliteReply:
   * SECOND GPT CALL that creates a friendly, polite message for the user
   * based on the scenario. We pass userData if needed for personalization.
   */
  async generatePoliteReply(context, openai) {
    const systemPrompt = `
You are a friendly, polite AI assistant.
You have partial user data: ${JSON.stringify(context.userData, null, 2)}
Scenario: "${context.scenario}"

You must write a single short message to the user, using a kind and polite tone.
Reference any data we already have (like their name if we know it).
Request only the missing piece of data (if needed).

Examples:
- If scenario="serviceProvidedInsteadOfName", you might say:
  "I understand you would like {userData.interest}, but I didn’t catch your name. Could you please share it with me so we can proceed?"
- If scenario="gotNameNeedEmail", you might say:
  "Nice to meet you, {userData.name}! Could I please have your email address so we can proceed?"
- If scenario="askService", you might say:
  "Thanks, {userData.name}! What service are you interested in?"
- If scenario="allDataCollected", you might say:
  "Fantastic, {userData.name}! I've sent the details to your email, please check it."

Keep it short, polite, and direct. Return ONLY the text. No JSON, no code fences.
    `;

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: systemPrompt },
                {
                    role: "user",
                    content: `Please produce one polite message for scenario "${context.scenario}".`,
                },
            ],
        });

        let rawText = completion.choices[0].message.content;
        return rawText.replace(/```/g, "").trim();
    } catch (err) {
        console.error("Error generating polite reply:", err);
        return "Sorry, I'm having trouble with that request.";
    }
}

}

module.exports = ConversationManager;
