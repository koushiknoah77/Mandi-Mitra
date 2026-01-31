# Smart Unit Conversion & Price Calculation

## Overview
The intelligent fallback system now includes **automatic unit conversion** and **accurate price calculation** when users request quantities in different units than the listing.

## How It Works

### Unit Conversion Logic
The system automatically converts between:
- **kg ↔ Quintal** (1 Quintal = 100 kg)
- **Ton ↔ Quintal** (1 Ton = 10 Quintal)
- **kg ↔ Ton** (1 Ton = 1000 kg)

### Price Calculation
When a user mentions a quantity in a different unit:
1. **Extract** the quantity and unit from the message
2. **Convert** to the listing's unit
3. **Calculate** the total price accurately
4. **Display** both the requested quantity and the calculated total

## Examples

### Example 1: User wants 50 kg, Listing in Quintal
```
Listing: Rice (Ponni) - ₹3500 per Quintal

User: "I want to purchase 50 kg"

Conversion:
  50 kg ÷ 100 = 0.5 Quintal
  0.5 Quintal × ₹3500 = ₹1,750

Bot Response:
  "Great! You want 50 kg. I have 75 Quintal available.
   The price is ₹3500 per Quintal.
   For 50 kg (0.5 Quintal), that would be ₹1,750. Interested?"
```

### Example 2: User wants 500 kg, Listing in Quintal
```
Listing: Wheat - ₹3200 per Quintal

User: "need 500 kg"

Conversion:
  500 kg ÷ 100 = 5 Quintal
  5 Quintal × ₹3200 = ₹16,000

Bot Response:
  "Perfect! 500 kg is available. At ₹3200 per Quintal,
   that would be ₹16,000. Interested?"
```

### Example 3: User wants 1 Ton, Listing in Quintal
```
Listing: Rice - ₹3500 per Quintal

User: "want to buy 1 ton"

Conversion:
  1 Ton × 10 = 10 Quintal
  10 Quintal × ₹3500 = ₹35,000

Bot Response:
  "Excellent! I can sell you 1 ton. The rate is ₹3500 per Quintal.
   For 1 ton (10 Quintal), that would be ₹35,000. Would you like to proceed?"
```

### Example 4: Same Unit (No Conversion)
```
Listing: Rice - ₹3500 per Quintal

User: "want 5 quintal"

Calculation:
  5 Quintal × ₹3500 = ₹17,500

Bot Response:
  "Great! You want 5 Quintal. I have 75 Quintal available.
   The price is ₹3500 per Quintal. Does that work for you?"
```

## Conversion Reference

| From | To | Formula | Example |
|------|-------|---------|---------|
| kg | Quintal | kg ÷ 100 | 50 kg = 0.5 Quintal |
| Quintal | kg | Quintal × 100 | 5 Quintal = 500 kg |
| Ton | Quintal | Ton × 10 | 1 Ton = 10 Quintal |
| Quintal | Ton | Quintal ÷ 10 | 50 Quintal = 5 Ton |
| kg | Ton | kg ÷ 1000 | 500 kg = 0.5 Ton |
| Ton | kg | Ton × 1000 | 1 Ton = 1000 kg |

## Technical Implementation

### Unit Extraction
```typescript
extractUnitFromMessage(message: string): string | null
// Recognizes: kg, kgs, kilogram, quintal, quintals, ton, tons, tonne
// Normalizes to: "kg", "Quintal", "Ton"
```

### Conversion Logic
```typescript
if (mentionedUnit === 'kg' && listingUnit === 'quintal') {
  effectiveQuantity = mentionedQuantity / 100;
  estimatedTotal = effectiveQuantity * listingPrice;
}
// ... handles all 6 conversion combinations
```

### Price Display
```typescript
{estimatedTotal} → Automatically replaced with calculated total
// Example: ₹1,750 for 50 kg when listing is ₹3500/Quintal
```

## Benefits

✅ **Accurate Pricing**: No manual calculation needed
✅ **Unit Flexibility**: Users can request in any unit
✅ **Transparent**: Shows both requested quantity and converted amount
✅ **Intelligent**: Handles all common agricultural units
✅ **Multilingual**: Works in all 12+ supported languages

## Test Results

All unit conversions tested and verified:
- ✅ 50 kg → 0.5 Quintal → ₹1,750
- ✅ 100 kg → 1 Quintal → ₹3,500
- ✅ 500 kg → 5 Quintal → ₹16,000
- ✅ 1 Ton → 10 Quintal → ₹35,000
- ✅ Same unit (no conversion) → Direct calculation

---

**Status**: ✅ Implemented and Tested
**Build**: Successful
**Date**: January 31, 2026
**Impact**: Users can now request quantities in any unit and get accurate pricing automatically!
