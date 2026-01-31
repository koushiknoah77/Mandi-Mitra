# Bengali Numeral Support Fix

## Problem
User was getting "নিষ্কাশন ত্রুটি" (Extraction Error) when trying to create a listing in Bengali:
- Input: "৩০০০ টাকায় ৫০ কুইন্টাল চাল বিক্রি"
- Translation: "3000 taka for 50 quintal rice sale"

The fallback extraction system was failing because:
1. Bengali numerals (৩০০০, ৫০) were not being recognized
2. Regex patterns only matched Arabic numerals (0-9), not Bengali numerals (০-৯)

## Solution Implemented

### 1. Number Normalization Function
Added `normalizeNumbers()` function to convert Bengali and Devanagari numerals to Arabic numerals:

```typescript
function normalizeNumbers(text: string): string {
  const bengaliToArabic: Record<string, string> = {
    '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
    '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
  };
  
  const devanagariToArabic: Record<string, string> = {
    '०': '0', '१': '1', '२': '2', '३': '3', '४': '4',
    '५': '5', '६': '6', '७': '7', '८': '8', '९': '9'
  };
  
  // Convert all numerals to Arabic
  // ...
}
```

### 2. Enhanced Extraction Logic
- Normalize text before pattern matching
- Added console logging for debugging
- Better error messages showing what data is missing

### 3. Pattern Improvements
- Added "বিক্রি" (sale) to rice pattern for better Bengali detection
- All patterns now work on normalized text with Arabic numerals

## How It Works Now

1. User enters: "৩০০০ টাকায় ৫০ কুইন্টাল চাল বিক্রি"
2. System normalizes: "3000 টাকায় 50 কুইন্টাল চাল বিক্রি"
3. Price pattern matches: "3000 টাকায়" → price = 3000
4. Quantity pattern matches: "50 কুইন্টাল" → quantity = 50, unit = quintal
5. Produce pattern matches: "চাল" → produceName = Rice
6. Listing created successfully!

## Supported Numeral Systems
- **Bengali**: ০১২৩৪৫৬৭৮৯
- **Devanagari (Hindi)**: ०१२३४५६७८९
- **Arabic (default)**: 0123456789

## Testing
Build successful: 635 KB (was 625 KB)

## Files Modified
- `utils/fallbackListingExtraction.ts` - Added number normalization and logging

## Impact
- Bengali users can now create listings with Bengali numerals
- Hindi users can use Devanagari numerals
- Better debugging with console logs
- More reliable extraction across all Indian languages
