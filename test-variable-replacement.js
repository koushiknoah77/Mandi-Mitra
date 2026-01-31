// Test variable replacement in fallback responses
import { getFallbackResponse } from './utils/fallbackResponses.ts';

// Test context
const testContext = {
  listingPrice: 2200,
  marketPrice: 2100,
  quantity: 100,
  unit: 'Quintal',
  agreedPrice: 2200,
  offeredPrice: undefined,
  mentionedQuantity: undefined,
  mentionedUnit: undefined
};

console.log('=== Testing Variable Replacement ===\n');

// Test 1: Price inquiry
console.log('Test 1: Price inquiry');
const response1 = getFallbackResponse('price?', 'en', testContext);
console.log('Input: "price?"');
console.log('Response:', response1);
console.log('Should NOT contain {listingPrice} or {unit}\n');

// Test 2: Price inquiry in Hindi
console.log('Test 2: Price inquiry in Hindi');
const response2 = getFallbackResponse('kimat?', 'hi', testContext);
console.log('Input: "kimat?"');
console.log('Response:', response2);
console.log('Should NOT contain {listingPrice} or {unit}\n');

// Test 3: Quantity inquiry
console.log('Test 3: Quantity inquiry with mentioned quantity');
const contextWithQuantity = {
  ...testContext,
  mentionedQuantity: 50,
  mentionedUnit: 'kg'
};
const response3 = getFallbackResponse('how much for 50 kg?', 'en', contextWithQuantity);
console.log('Input: "how much for 50 kg?"');
console.log('Response:', response3);
console.log('Should show calculated total for 50 kg\n');

// Test 4: Deal finalization
console.log('Test 4: Deal finalization');
const response4 = getFallbackResponse('deal done', 'en', testContext);
console.log('Input: "deal done"');
console.log('Response:', response4);
console.log('Should show quantity, price, and total\n');

console.log('=== Test Complete ===');
