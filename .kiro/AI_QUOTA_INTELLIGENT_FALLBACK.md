# AI Quota Intelligent Fallback Fix

## Problem
When Gemini API quota was exceeded (429 error), the negotiation system returned the same generic fallback message repeatedly, ignoring user input. This made the system appear broken and unresponsive.

## Root Cause
The `negotiate()` method in `geminiService.ts` had a basic fallback that returned a static message without processing the user's input. It didn't utilize the intelligent fallback system already built in `utils/fallbackResponses.ts`.

## Solution
Enhanced the error handling in `geminiService.negotiate()` to:

1. **Import Fallback Utilities**: Dynamically import the intelligent fallback system when AI fails
2. **Process User Input**: Use pattern matching to understand user intent (price offers, greetings, agreements, etc.)
3. **Extract Data**: Pull out mentioned prices and quantities from user messages
4. **Context-Aware Responses**: Generate appropriate responses based on:
   - User's language preference
   - Detected intent (price offer, finalization, inquiry)
   - Extracted price vs listing price comparison
   - Deal status (ongoing vs agreed)

## Key Features

### Pattern Matching
The fallback system recognizes:
- Numeric price offers (e.g., "1500", "2000 rupees")
- Greetings (hello, namaste, vanakkam)
- Price inquiries (kitna, kya daam)
- Availability questions (milega, hai kya)
- Agreement keywords (yes, okay, han, thik hai)
- Deal finalization (pakka kar, deal done)
- Rejections (no, nahi)

### Multilingual Support
Fallback responses available in all 24 supported languages with culturally appropriate phrases.

### Smart Price Handling
When user mentions a price:
- Compares with listing price
- Suggests counter-offer if too low
- Confirms if acceptable
- Responds in user's language

## Example Flow

**User Input**: "1500 rupess" (with typo, during quota limit)

**Old Behavior**: 
```
"The price is ₹2200 per Quintal. What would you like to offer?"
(repeated for every message)
```

**New Behavior**:
```
"Your offer is ₹1500. The listed price is ₹2200. Can you increase your offer?"
(processes the actual offer and responds contextually)
```

## Technical Implementation

```typescript
catch (error) {
  console.warn("🔄 Using intelligent fallback system");
  
  // Import fallback utilities
  const { getFallbackResponse, shouldFinalizeDeal, extractPriceFromMessage } 
    = await import('../utils/fallbackResponses');
  
  // Process user input
  const fallbackText = getFallbackResponse(userMessage, language);
  const shouldFinalize = shouldFinalizeDeal(userMessage);
  const mentionedPrice = extractPriceFromMessage(userMessage);
  
  // Build context-aware response
  if (mentionedPrice && mentionedPrice !== listing.pricePerUnit) {
    // Generate price comparison response in user's language
    responseText = priceResponses[language];
  }
  
  return {
    text: responseText,
    status: shouldFinalize ? 'agreed' : 'ongoing',
    proposedPrice: mentionedPrice || lastOffer.price,
    proposedQuantity: lastOffer.quantity
  };
}
```

## Benefits

1. **Seamless Experience**: Users don't notice when AI is unavailable
2. **Intelligent Processing**: Understands and responds to user intent
3. **Multilingual**: Works in all 24 supported languages
4. **Price Negotiation**: Can continue negotiations without AI
5. **Deal Completion**: Can finalize deals using pattern matching
6. **No Breaking Changes**: Graceful degradation from AI to fallback

## Testing

To test the fallback system:
1. Exhaust API quota (20 requests/day on free tier)
2. Try negotiating with various inputs:
   - Price offers: "1500", "2000 rupees"
   - Greetings: "hello", "namaste"
   - Agreements: "yes", "okay", "han"
   - Finalization: "deal done", "pakka kar"
3. Verify responses are contextual and in correct language

## Related Files
- `services/geminiService.ts` - Main negotiation logic
- `utils/fallbackResponses.ts` - Pattern matching and responses
- `components/NegotiationView.tsx` - UI handling
