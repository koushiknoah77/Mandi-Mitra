---
inclusion: fileMatch
fileMatchPattern: "components/{BuyerDashboard,SellerDashboard,NegotiationView,ListingCard}*"
---

# Marketplace Features Guide

## Seller Dashboard
**Component**: `components/SellerDashboard.tsx`

### Features
- Create new listings (voice or manual)
- View active listings (synced globally via ListingsContext)
- Manage inventory
- Track negotiations
- View AI-powered live market prices with 1-hour caching
- Access profile & history dashboard via navbar avatar
- View listing history and past conversations
- Access analytics

### Listing Creation Flow
1. Voice input or manual form
2. AI extracts structured data (Gemini)
3. Upload images (Cloudinary)
4. Set pricing with market insights
5. Publish listing

## Buyer Dashboard
**Component**: `components/BuyerDashboard.tsx`

### Features
- Browse available listings (mock + user-created via shared state)
- Filter by commodity, location, price
- View AI-powered live market trends with smart caching
- Initiate negotiations
- Complete purchases
- Track orders
- Access profile & history dashboard via navbar avatar
- View transaction history and past conversations
- Reopen and continue previous negotiations

### Purchase Flow
1. Browse listings
2. View details and images
3. Check market price comparison
4. Start negotiation
5. Agree on terms
6. Complete deal
7. Generate invoice

## Negotiation System
**Component**: `components/NegotiationView.tsx`

### Features
- Real-time messaging
- Voice message support
- Auto-translation between languages
- AI intent detection
- Price suggestion
- Deal closure

### Negotiation Flow
```
Buyer: Makes offer
  ↓
AI: Detects intent, moderates content
  ↓
Seller: Receives translated message
  ↓
Seller: Counter-offers
  ↓
AI: Analyzes price deviation
  ↓
Buyer: Accepts/rejects
  ↓
Deal: Completed or continues
```

### AI Moderation
- Detects inappropriate content
- Flags price deviations (>20% from market)
- Identifies scam risks
- Provides advisory messages

## Market Data Integration
**Service**: `services/mandiService.ts`

### Features
- **AI-Powered Live Prices**: Uses Gemini AI to search Google for current mandi prices
- **Smart Caching**: 1-hour cache in localStorage to minimize API calls
- **Reliable Sources**: Fetches from AGMARKNET, government portals, agricultural websites
- **Fallback Chain**: AI fetch → Cached data → Mock data (always works)
- Price trends and analytics
- Commodity comparisons
- Location-based pricing

### Usage
```typescript
// Fetches live price with AI (cached for 1 hour)
const marketPrice = await mandiService.getMarketPrice(commodity, location);

// Get multiple live rates for ticker
const liveRates = await mandiService.getLiveRates();

// Clear cache (for testing or forcing refresh)
mandiService.clearCache();
```

### AI Price Fetching
The service uses Gemini AI with Google Search to fetch real-time prices:
1. Checks cache first (1-hour expiration)
2. If expired, asks AI to search for current prices
3. AI returns structured JSON with price data from reliable sources
4. Caches result for 1 hour
5. Falls back to mock data if AI fails

No extra API keys needed - uses existing Gemini API key!

## Image Management
**Service**: `services/cloudinaryService.ts`

### Features
- Multi-image upload
- Image optimization
- Thumbnail generation
- CDN delivery

### Best Practices
- Compress images before upload
- Use responsive image sizes
- Implement lazy loading
- Provide alt text for accessibility

## Listing Card
**Component**: `components/ListingCard.tsx`

### Display Elements
- Product image gallery
- Commodity name and quality
- Quantity and unit
- Price per unit
- Seller information
- Location
- Market price comparison
- Action buttons

## Deal Completion
**Service**: `services/invoiceService.ts`

### Features
- Generate PDF invoices
- Include deal details
- Buyer and seller information
- Payment terms
- Delivery information

## Analytics
**Service**: `services/analyticsService.ts`

### Tracked Events
- User login/logout
- Listing creation
- Negotiation started
- Deal completed
- Language changes
- Voice interactions

### Usage
```typescript
analyticsService.logEvent('event_name', userId, properties);
```

## Profile & History Dashboard
**Component**: `components/ProfileHistory.tsx`

### Features
- **Transaction History Tab**: View all completed deals (buying/selling)
- **Conversation History Tab**: View all past negotiations
- **User-Specific Filtering**: Shows only relevant data for current user
- **Conversation Reopening**: Click any conversation to continue negotiating
- **Deal Status Tracking**: Completed, ongoing, rejected deals
- **Multilingual Support**: All labels translated to user's language

### Access
- Click navbar avatar (showing last 2 digits of phone number)
- Or click "Profile & History" text button on desktop

### Data Structure
```typescript
interface ConversationHistory {
  id: string;
  listingId: string;
  listingTitle: string;
  otherPartyName: string;
  lastMessage: string;
  timestamp: Date;
  dealStatus: 'ongoing' | 'completed' | 'rejected';
  messages: Message[];
}
```

## Shared Listings System
**Context**: `contexts/ListingsContext.tsx`

### Features
- **Global State Management**: React Context API for app-wide state
- **Real-Time Sync**: Seller creates listing → immediately visible to all buyers
- **Persistent Storage**: localStorage with automatic save/load
- **Combined Data**: Merges mock listings with user-created listings
- **Transaction Tracking**: Stores all completed deals
- **Conversation History**: Stores all negotiation messages

### Usage
```typescript
const { 
  listings,           // All listings (mock + user-created)
  addListing,         // Add new listing
  updateListing,      // Update existing listing
  transactions,       // All completed deals
  addTransaction,     // Record new transaction
  conversations,      // All conversation history
  addConversation,    // Add new conversation
  updateConversation  // Update existing conversation
} = useListings();
```

### Data Flow
```
Seller creates listing
  ↓
addListing() called
  ↓
ListingsContext updates state
  ↓
localStorage saves data
  ↓
All components re-render with new data
  ↓
Buyer sees new listing immediately
```

## Live Market Ticker
**Component**: `components/LiveMarketTicker.tsx`

### Features
- **AI-Powered Prices**: Fetches live prices using Gemini AI
- **Auto-Scrolling**: Infinite horizontal scroll animation
- **Price Trends**: Shows up/down/stable indicators with percentage change
- **Smart Caching**: Uses 1-hour cached data from mandiService
- **Fallback Data**: Shows mock data if AI fetch fails
- **Hover to Pause**: Animation pauses on hover for better readability

### Display Elements
- Commodity name
- Market location
- Modal price (₹/quintal)
- Price range (min-max)
- Trend indicator (▲▼—)
- Percentage change

## Best Practices

### Performance
- Lazy load listing images
- Paginate listing results
- Cache market data
- Debounce search inputs

### User Experience
- Show loading states
- Provide feedback for actions
- Handle errors gracefully
- Support offline browsing

### Security
- Validate user inputs
- Sanitize messages
- Verify deal authenticity
- Protect user data

### Accessibility
- Keyboard navigation
- Screen reader support
- High contrast mode
- Focus indicators
