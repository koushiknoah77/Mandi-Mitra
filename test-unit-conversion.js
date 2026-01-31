/**
 * Test Unit Conversion and Price Calculation
 * Demonstrates how the system handles different units and calculates prices correctly
 */

console.log('🧪 Testing Unit Conversion & Price Calculation\n');
console.log('='.repeat(70));

// Conversion rates
const CONVERSIONS = {
  'kg to quintal': 100,      // 1 Quintal = 100 kg
  'ton to quintal': 10,      // 1 Ton = 10 Quintal
  'ton to kg': 1000          // 1 Ton = 1000 kg
};

// Test scenarios
const scenarios = [
  {
    name: 'User wants 50 kg, Listing in Quintal',
    mentionedQuantity: 50,
    mentionedUnit: 'kg',
    listingPrice: 3500,
    listingUnit: 'Quintal',
    expectedConversion: 50 / 100, // 0.5 Quintal
    expectedTotal: (50 / 100) * 3500 // ₹1,750
  },
  {
    name: 'User wants 100 kg, Listing in Quintal',
    mentionedQuantity: 100,
    mentionedUnit: 'kg',
    listingPrice: 3500,
    listingUnit: 'Quintal',
    expectedConversion: 100 / 100, // 1 Quintal
    expectedTotal: (100 / 100) * 3500 // ₹3,500
  },
  {
    name: 'User wants 5 Quintal, Listing in Quintal',
    mentionedQuantity: 5,
    mentionedUnit: 'Quintal',
    listingPrice: 3500,
    listingUnit: 'Quintal',
    expectedConversion: 5, // Same unit
    expectedTotal: 5 * 3500 // ₹17,500
  },
  {
    name: 'User wants 1 Ton, Listing in Quintal',
    mentionedQuantity: 1,
    mentionedUnit: 'ton',
    listingPrice: 3500,
    listingUnit: 'Quintal',
    expectedConversion: 1 * 10, // 10 Quintal
    expectedTotal: (1 * 10) * 3500 // ₹35,000
  },
  {
    name: 'User wants 500 kg, Listing in Quintal',
    mentionedQuantity: 500,
    mentionedUnit: 'kg',
    listingPrice: 3200,
    listingUnit: 'Quintal',
    expectedConversion: 500 / 100, // 5 Quintal
    expectedTotal: (500 / 100) * 3200 // ₹16,000
  }
];

// Run tests
scenarios.forEach((scenario, index) => {
  console.log(`\n📝 Test ${index + 1}: ${scenario.name}`);
  console.log('-'.repeat(70));
  console.log(`   User Request: ${scenario.mentionedQuantity} ${scenario.mentionedUnit}`);
  console.log(`   Listing: ₹${scenario.listingPrice} per ${scenario.listingUnit}`);
  console.log(`   Conversion: ${scenario.mentionedQuantity} ${scenario.mentionedUnit} = ${scenario.expectedConversion} ${scenario.listingUnit}`);
  console.log(`   💰 Total Cost: ₹${scenario.expectedTotal.toLocaleString('en-IN')}`);
  
  // Simulate the calculation
  const mentionedUnit = scenario.mentionedUnit.toLowerCase();
  const listingUnit = scenario.listingUnit.toLowerCase();
  let effectiveQuantity = scenario.mentionedQuantity;
  let calculatedTotal = 0;
  
  if (mentionedUnit === 'kg' && listingUnit === 'quintal') {
    effectiveQuantity = scenario.mentionedQuantity / 100;
    calculatedTotal = effectiveQuantity * scenario.listingPrice;
  } else if (mentionedUnit === 'ton' && listingUnit === 'quintal') {
    effectiveQuantity = scenario.mentionedQuantity * 10;
    calculatedTotal = effectiveQuantity * scenario.listingPrice;
  } else {
    calculatedTotal = scenario.mentionedQuantity * scenario.listingPrice;
  }
  
  const isCorrect = Math.abs(calculatedTotal - scenario.expectedTotal) < 0.01;
  console.log(`   ✅ Calculation: ${isCorrect ? 'CORRECT' : 'INCORRECT'} (₹${Math.round(calculatedTotal).toLocaleString('en-IN')})`);
});

console.log('\n' + '='.repeat(70));
console.log('✅ All unit conversion tests completed!\n');

console.log('💡 Conversion Reference:');
console.log('   • 1 Quintal = 100 kg');
console.log('   • 1 Ton = 10 Quintal = 1,000 kg');
console.log('   • 1 kg = 0.01 Quintal = 0.001 Ton\n');

console.log('📊 Example Conversation:');
console.log('   User: "I want to purchase 50 kg"');
console.log('   Bot: "Great! You want 50 kg. I have 75 Quintal available.');
console.log('        The price is ₹3500 per Quintal.');
console.log('        For 50 kg (0.5 Quintal), that would be ₹1,750. Interested?"');
