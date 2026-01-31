/**
 * Comprehensive Test Suite for Enhanced Fallback System
 * Tests all patterns, unit conversions, and multilingual support
 */

import { getFallbackResponse, extractPriceFromMessage, extractQuantityFromMessage, extractUnitFromMessage, shouldFinalizeDeal } from './utils/fallbackResponses.js';

console.log('🧪 COMPREHENSIVE FALLBACK SYSTEM TEST\n');
console.log('=' .repeat(80));

// Test context
const testContext = {
  listingPrice: 3500,
  marketPrice: 3200,
  quantity: 75,
  unit: 'Quintal',
  agreedPrice: 3500
};

// Test cases organized by category
const testCases = [
  {
    category: '💬 GREETINGS',
    tests: [
      { input: 'hello', lang: 'en', expectMatch: true },
      { input: 'namaste', lang: 'hi', expectMatch: true },
      { input: 'hey there', lang: 'en', expectMatch: true },
      { input: 'hi', lang: 'en', expectMatch: true }
    ]
  },
  {
    category: '💰 PRICE INQUIRIES',
    tests: [
      { input: 'what is the price?', lang: 'en', expectMatch: true },
      { input: 'kitna hai?', lang: 'hi', expectMatch: true },
      { input: 'price kya hai?', lang: 'hi', expectMatch: true },
      { input: 'cost batao', lang: 'hi', expectMatch: true }
    ]
  },
  {
    category: '🔢 QUANTITY WITH "HOW MUCH"',
    tests: [
      { input: 'how much for 50 kg?', lang: 'en', expectMatch: true, expectCalc: true },
      { input: 'how much for 100 kg?', lang: 'en', expectMatch: true, expectCalc: true },
      { input: '50 kg kitna?', lang: 'hi', expectMatch: true, expectCalc: true },
      { input: 'what price for 2 quintal?', lang: 'en', expectMatch: true, expectCalc: true },
      { input: '75 quintal ka rate?', lang: 'hi', expectMatch: true, expectCalc: true }
    ]
  },
  {
    category: '🛒 "I WANT" PATTERNS',
    tests: [
      { input: 'i want 50 kg', lang: 'en', expectMatch: true, expectCalc: true },
      { input: 'i need 100 kg', lang: 'en', expectMatch: true, expectCalc: true },
      { input: 'mujhe 50 kg chahiye', lang: 'hi', expectMatch: true, expectCalc: true },
      { input: '75 quintal lena hai', lang: 'hi', expectMatch: true, expectCalc: true },
      { input: 'i want to buy 200 kg', lang: 'en', expectMatch: true, expectCalc: true }
    ]
  },
  {
    category: '📦 CASUAL QUANTITY MENTIONS',
    tests: [
      { input: '50 kg', lang: 'en', expectMatch: true, expectCalc: true },
      { input: '100 quintal', lang: 'en', expectMatch: true, expectCalc: true },
      { input: '2 ton', lang: 'en', expectMatch: true, expectCalc: true },
      { input: '75 kg', lang: 'hi', expectMatch: true, expectCalc: true }
    ]
  },
  {
    category: '💬 "TELL ME" VARIATIONS',
    tests: [
      { input: 'tell me price for 50 kg', lang: 'en', expectMatch: true, expectCalc: true },
      { input: 'bata do 100 kg ka', lang: 'hi', expectMatch: true, expectCalc: true },
      { input: 'let me know for 75 quintal', lang: 'en', expectMatch: true, expectCalc: true }
    ]
  },
  {
    category: '❓ "CAN I GET" VARIATIONS',
    tests: [
      { input: 'can i get 50 kg?', lang: 'en', expectMatch: true, expectCalc: true },
      { input: 'can i have 100 quintal?', lang: 'en', expectMatch: true, expectCalc: true },
      { input: '50 kg mil sakta hai?', lang: 'hi', expectMatch: true, expectCalc: true }
    ]
  },
  {
    category: '🔍 "LOOKING FOR" VARIATIONS',
    tests: [
      { input: 'looking for 50 kg', lang: 'en', expectMatch: true, expectCalc: true },
      { input: 'searching for 100 quintal', lang: 'en', expectMatch: true, expectCalc: true },
      { input: '75 kg dhund raha hun', lang: 'hi', expectMatch: true, expectCalc: true }
    ]
  },
  {
    category: '🤔 "WHAT ABOUT" VARIATIONS',
    tests: [
      { input: 'what about 50 kg?', lang: 'en', expectMatch: true, expectCalc: true },
      { input: 'how about 100 quintal?', lang: 'en', expectMatch: true, expectCalc: true },
      { input: '75 kg kya hai?', lang: 'hi', expectMatch: true, expectCalc: true }
    ]
  },
  {
    category: '💡 "INTERESTED IN" VARIATIONS',
    tests: [
      { input: 'interested in 50 kg', lang: 'en', expectMatch: true, expectCalc: true },
      { input: 'want to know about 100 quintal', lang: 'en', expectMatch: true, expectCalc: true }
    ]
  },
  {
    category: '🤝 "WILL TAKE" VARIATIONS',
    tests: [
      { input: 'will take 50 kg', lang: 'en', expectMatch: true, expectCalc: true },
      { input: "i'll buy 100 quintal", lang: 'en', expectMatch: true, expectCalc: true },
      { input: '75 kg le lunga', lang: 'hi', expectMatch: true, expectCalc: true }
    ]
  },
  {
    category: '✅ AGREEMENT PATTERNS',
    tests: [
      { input: 'yes', lang: 'en', expectMatch: true },
      { input: 'ok', lang: 'en', expectMatch: true },
      { input: 'han', lang: 'hi', expectMatch: true },
      { input: 'thik hai', lang: 'hi', expectMatch: true },
      { input: 'bilkul', lang: 'hi', expectMatch: true },
      { input: 'agree', lang: 'en', expectMatch: true }
    ]
  },
  {
    category: '🎯 FINALIZATION PATTERNS',
    tests: [
      { input: 'finalize the deal', lang: 'en', expectMatch: true },
      { input: 'confirm order', lang: 'en', expectMatch: true },
      { input: 'pakka kar do', lang: 'hi', expectMatch: true },
      { input: 'deal done', lang: 'en', expectMatch: true },
      { input: 'book it', lang: 'en', expectMatch: true }
    ]
  },
  {
    category: '💵 NUMERIC PRICE OFFERS',
    tests: [
      { input: '3200', lang: 'en', expectMatch: true },
      { input: '3500', lang: 'hi', expectMatch: true },
      { input: '3000', lang: 'en', expectMatch: true }
    ]
  },
  {
    category: '📊 AVAILABILITY CHECKS',
    tests: [
      { input: 'is it available?', lang: 'en', expectMatch: true },
      { input: 'stock hai?', lang: 'hi', expectMatch: true },
      { input: 'quantity kitni hai?', lang: 'hi', expectMatch: true }
    ]
  },
  {
    category: '⭐ QUALITY INQUIRIES',
    tests: [
      { input: 'what is the quality?', lang: 'en', expectMatch: true },
      { input: 'kaisa hai?', lang: 'hi', expectMatch: true },
      { input: 'quality acchi hai?', lang: 'hi', expectMatch: true }
    ]
  },
  {
    category: '💸 DISCOUNT REQUESTS',
    tests: [
      { input: 'can you give discount?', lang: 'en', expectMatch: true },
      { input: 'kam karo', lang: 'hi', expectMatch: true },
      { input: 'chhoot milegi?', lang: 'hi', expectMatch: true }
    ]
  },
  {
    category: '🚚 DELIVERY QUESTIONS',
    tests: [
      { input: 'delivery kab hogi?', lang: 'hi', expectMatch: true },
      { input: 'can you deliver?', lang: 'en', expectMatch: true },
      { input: 'shipping available?', lang: 'en', expectMatch: true }
    ]
  },
  {
    category: '💳 PAYMENT QUESTIONS',
    tests: [
      { input: 'payment kaise?', lang: 'hi', expectMatch: true },
      { input: 'how to pay?', lang: 'en', expectMatch: true },
      { input: 'cash or online?', lang: 'en', expectMatch: true }
    ]
  },
  {
    category: '❌ REJECTION',
    tests: [
      { input: 'no', lang: 'en', expectMatch: true },
      { input: 'nahi', lang: 'hi', expectMatch: true },
      { input: 'not interested', lang: 'en', expectMatch: true }
    ]
  },
  {
    category: '🙏 THANK YOU',
    tests: [
      { input: 'thank you', lang: 'en', expectMatch: true },
      { input: 'thanks', lang: 'en', expectMatch: true },
      { input: 'dhanyavad', lang: 'hi', expectMatch: true }
    ]
  }
];

// Unit conversion test cases
const unitConversionTests = [
  {
    input: 'how much for 50 kg?',
    context: { ...testContext, unit: 'Quintal', listingPrice: 3500 },
    expectedTotal: 1750, // 50 kg = 0.5 Quintal × 3500 = 1750
    description: '50 kg → Quintal conversion'
  },
  {
    input: 'i want 100 kg',
    context: { ...testContext, unit: 'Quintal', listingPrice: 3500 },
    expectedTotal: 3500, // 100 kg = 1 Quintal × 3500 = 3500
    description: '100 kg → Quintal conversion'
  },
  {
    input: 'how much for 200 kg?',
    context: { ...testContext, unit: 'Quintal', listingPrice: 3500 },
    expectedTotal: 7000, // 200 kg = 2 Quintal × 3500 = 7000
    description: '200 kg → Quintal conversion'
  },
  {
    input: 'i need 5 quintal',
    context: { ...testContext, unit: 'kg', listingPrice: 35 },
    expectedTotal: 17500, // 5 Quintal = 500 kg × 35 = 17500
    description: '5 Quintal → kg conversion'
  },
  {
    input: 'how much for 1 ton?',
    context: { ...testContext, unit: 'Quintal', listingPrice: 3500 },
    expectedTotal: 35000, // 1 Ton = 10 Quintal × 3500 = 35000
    description: '1 Ton → Quintal conversion'
  },
  {
    input: 'i want 2 ton',
    context: { ...testContext, unit: 'kg', listingPrice: 35 },
    expectedTotal: 70000, // 2 Ton = 2000 kg × 35 = 70000
    description: '2 Ton → kg conversion'
  }
];

// Helper functions
function testExtraction() {
  console.log('\n📝 EXTRACTION FUNCTION TESTS\n');
  
  const extractionTests = [
    { fn: extractPriceFromMessage, input: '3200', expected: 3200, name: 'Price: "3200"' },
    { fn: extractPriceFromMessage, input: '₹3500', expected: 3500, name: 'Price: "₹3500"' },
    { fn: extractPriceFromMessage, input: 'offer 3000 rupees', expected: 3000, name: 'Price: "offer 3000 rupees"' },
    { fn: extractQuantityFromMessage, input: '50 kg', expected: 50, name: 'Quantity: "50 kg"' },
    { fn: extractQuantityFromMessage, input: '100 quintal', expected: 100, name: 'Quantity: "100 quintal"' },
    { fn: extractQuantityFromMessage, input: 'i want 75 kg', expected: 75, name: 'Quantity: "i want 75 kg"' },
    { fn: extractUnitFromMessage, input: '50 kg', expected: 'kg', name: 'Unit: "50 kg"' },
    { fn: extractUnitFromMessage, input: '100 quintal', expected: 'Quintal', name: 'Unit: "100 quintal"' },
    { fn: extractUnitFromMessage, input: '2 ton', expected: 'Ton', name: 'Unit: "2 ton"' }
  ];
  
  let passed = 0;
  let failed = 0;
  
  extractionTests.forEach(test => {
    const result = test.fn(test.input);
    const success = result === test.expected;
    
    if (success) {
      console.log(`✅ ${test.name}: ${result}`);
      passed++;
    } else {
      console.log(`❌ ${test.name}: Expected ${test.expected}, got ${result}`);
      failed++;
    }
  });
  
  console.log(`\n📊 Extraction Tests: ${passed} passed, ${failed} failed`);
}

function testFinalization() {
  console.log('\n🎯 FINALIZATION DETECTION TESTS\n');
  
  const finalizationTests = [
    { input: 'finalize the deal', expected: true },
    { input: 'confirm order', expected: true },
    { input: 'pakka kar do', expected: true },
    { input: 'deal done', expected: true },
    { input: 'yes finalize', expected: true },
    { input: 'i want to buy', expected: true },
    { input: 'just asking', expected: false },
    { input: 'maybe later', expected: false }
  ];
  
  let passed = 0;
  let failed = 0;
  
  finalizationTests.forEach(test => {
    const result = shouldFinalizeDeal(test.input);
    const success = result === test.expected;
    
    if (success) {
      console.log(`✅ "${test.input}": ${result}`);
      passed++;
    } else {
      console.log(`❌ "${test.input}": Expected ${test.expected}, got ${result}`);
      failed++;
    }
  });
  
  console.log(`\n📊 Finalization Tests: ${passed} passed, ${failed} failed`);
}

function testUnitConversions() {
  console.log('\n🔄 UNIT CONVERSION TESTS\n');
  
  let passed = 0;
  let failed = 0;
  
  unitConversionTests.forEach(test => {
    const response = getFallbackResponse(test.input, 'en', test.context);
    const hasTotal = response.includes(test.expectedTotal.toString());
    
    if (hasTotal) {
      console.log(`✅ ${test.description}: ₹${test.expectedTotal}`);
      console.log(`   Response: "${response.substring(0, 100)}..."`);
      passed++;
    } else {
      console.log(`❌ ${test.description}: Expected ₹${test.expectedTotal}`);
      console.log(`   Response: "${response}"`);
      failed++;
    }
  });
  
  console.log(`\n📊 Unit Conversion Tests: ${passed} passed, ${failed} failed`);
}

function runPatternTests() {
  console.log('\n🧪 PATTERN MATCHING TESTS\n');
  
  let totalPassed = 0;
  let totalFailed = 0;
  
  testCases.forEach(category => {
    console.log(`\n${category.category}`);
    console.log('-'.repeat(80));
    
    let categoryPassed = 0;
    let categoryFailed = 0;
    
    category.tests.forEach(test => {
      const context = test.expectCalc ? {
        ...testContext,
        mentionedQuantity: extractQuantityFromMessage(test.input),
        mentionedUnit: extractUnitFromMessage(test.input)
      } : testContext;
      
      const response = getFallbackResponse(test.input, test.lang, context);
      const hasResponse = response && response.length > 0;
      const hasCalculation = test.expectCalc ? response.includes('₹') : true;
      
      const success = hasResponse && hasCalculation;
      
      if (success) {
        console.log(`✅ "${test.input}" (${test.lang})`);
        console.log(`   → "${response.substring(0, 100)}${response.length > 100 ? '...' : ''}"`);
        categoryPassed++;
      } else {
        console.log(`❌ "${test.input}" (${test.lang})`);
        console.log(`   → "${response}"`);
        categoryFailed++;
      }
    });
    
    console.log(`\n   Category: ${categoryPassed} passed, ${categoryFailed} failed`);
    totalPassed += categoryPassed;
    totalFailed += categoryFailed;
  });
  
  console.log('\n' + '='.repeat(80));
  console.log(`\n📊 OVERALL RESULTS: ${totalPassed} passed, ${totalFailed} failed`);
  console.log(`   Success Rate: ${((totalPassed / (totalPassed + totalFailed)) * 100).toFixed(1)}%`);
}

// Run all tests
console.log('\n🚀 Starting Comprehensive Test Suite...\n');

testExtraction();
testFinalization();
testUnitConversions();
runPatternTests();

console.log('\n' + '='.repeat(80));
console.log('\n✨ TEST SUITE COMPLETE!\n');
