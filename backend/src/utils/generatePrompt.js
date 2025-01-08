const fs = require('fs');
const path = require('path');

const loadPricingData = () => {
  const pricingPath = path.join(__dirname, '../data/pricing_data.json');
  const pricingData = JSON.parse(fs.readFileSync(pricingPath, 'utf-8'));
  return pricingData;
};

const generatePrompt = (name, request) => {
  const pricingData = loadPricingData();

  // Determine matching service
  const services = pricingData.services;
  const matchedService = Object.values(services).find((service) =>
    service.keywords.some((keyword) => request.toLowerCase().includes(keyword))
  );

  const serviceInfo = matchedService
    ? `${matchedService.description}\nPrice: ${matchedService.price}\n\n`
    : `We couldn't directly match your request, but here are some of our popular services:
      ${Object.values(services)
        .map(
          (service) =>
            `- ${service.name}: ${service.description} Price: ${service.price}`
        )
        .join('\n')}`;

  return `
You are an AI assistant creating professional offers for a web development company. Each email must be professional, clear, and include the specified closing salutation.

## Context:
Here are the available services:
${JSON.stringify(pricingData.services, null, 2)}

## Instructions:
1. Start with a warm greeting using the customer's name.
2. Mention the services matching their request.
3. Include pricing information: ${serviceInfo}
4. Offer optional add-ons or general services if no specific match is found.
5. Always end the email with the following exact salutation:

Best regards,  
Deni Vidan  

VIDAN LIMITED d.o.o

## Customer Information:
- Name: ${name}
- Request: ${request}

Now, generate the personalized offer email for the user. Avoid duplicating the example text.
  `;
};

module.exports = { generatePrompt };
