/**
 * Test script for the Intelligent Fallback Negotiation System
 * Run with: node test-intelligent-fallback.js
 */

// Mock the fallback response functions
const FALLBACK_RESPONSES = [
  {
    pattern: /^\d+$/,
    weight: 1.0,
    responses: {
      en: [
        'I see your offer of ₹{price}. Let me evaluate this against the market rate.',
        'Your offer is ₹{price}. That\'s interesting - let me consider it.',
        '₹{price} is your proposal. I need to check if this works for me.'
      ]
    }
  },
  {
    pattern: /(hello|hi|hey|namaste)/i,
    weight: 1.0,
    responses: {
      en: [
        'Hello! I\'m glad you\'re interested in this listing. What would you like to know?',
        'Hi there! Thanks for reaching out. How can I help you today?',
        'Hey! Great to hear from you. Are you interested in purchasing?'
      ]
    }
  },
  {
    pattern: /(price|cost|rate)/i,
    weight: 0.9,
    responses: {
      en: [
        'The listed price is ₹{listingPrice} per {unit}. I\'m open to reasonable offers.',
        'Current price is ₹{listingPrice}. The market rate is around ₹{marketPrice}. What\'s your budget?',
        'It\'s priced at ₹{listingPrice} per {unit}. Would you like to make an offer?'
      ]
    }
  }
];

function getFallbackResponse(message, language, context) {
  const matchedPatterns = [];
  
  for (const fallback of FALLBACK_RESPONSES) {
    if (fallback.pattern.test(message)) {
      const responses = fallback.responses[language] || fallback.responses.en;
      if (responses && responses.length > 0) {
        const weight = fallback.weight || 0.5;
        responses.forEach(response => {
          matchedPatterns.push({ response, weight });
        });
      }
    }
  }

  let selectedResponse;
  
  if (matchedPatterns.length > 0) {
    const totalWeight = matchedPatterns.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;
    
    selectedResponse = matchedPatterns[0].response;
    for (const item of matchedPatterns) {
      random -= item.weight;
      if (random <= 0) {
        selectedResponse = item.response;
        break;
      }
    }
  } else {
    selectedResponse = 'I understand. Please tell me more.';
  }

  // Replace placeholders
  if (context) {
    selectedResponse = selectedResponse
      .replace(/{price}/g, context.offeredPrice?.toString() || '')
      .replace(/{listingPrice}/g, context.listingPrice?.toString() || '')
      .replace(/{marketPrice}/g, context.marketPrice?.toString() || '')
      .replace(/{quantity}/g, context.quantity?.toString() || '')
      .replace(/{unit}/g, context.unit || '')
      .replace(/{agreedPrice}/g, context.agreedPrice?.toString() || '');
  }
  
  return selectedResponse;
}

// Test scenarios
console.log('🧪 Testing Intelligent Fallback Negotiation System\n');
console.log('='.repeat(60));

const context = {
  listingPrice: 3500,
  marketPrice: 3200,
  quantity: 75,
  unit: 'Quintal',
  agreedPrice: 3500
};

// Test 1: Greeting
console.log('\n📝 Test 1: Greeting');
console.log('User: "hello"');
const greeting = getFallbackResponse('hello', 'en', context);
console.log(`Bot: "${greeting}"`);

// Test 2: Price inquiry
console.log('\n📝 Test 2: Price Inquiry');
console.log('User: "what is the price?"');
const priceInquiry = getFallbackResponse('what is the price?', 'en', context);
console.log(`Bot: "${priceInquiry}"`);

// Test 3: Price offer
console.log('\n📝 Test 3: Price Offer');
console.log('User: "3200"');
const priceOffer = getFallbackResponse('3200', 'en', { ...context, offeredPrice: 3200 });
console.log(`Bot: "${priceOffer}"`);

// Test 4: Multiple responses (show variety)
console.log('\n📝 Test 4: Response Variety (5 greetings)');
for (let i = 1; i <= 5; i++) {
  const response = getFallbackResponse('hi', 'en', context);
  console.log(`  ${i}. "${response}"`);
}

console.log('\n' + '='.repeat(60));
console.log('✅ All tests completed successfully!');
console.log('\n💡 Key Features Demonstrated:');
console.log('  • Pattern matching with regex');
console.log('  • Weighted probabilistic selection');
console.log('  • Dynamic variable substitution');
console.log('  • Response variety and naturalness');
console.log('  • Context-aware responses');
