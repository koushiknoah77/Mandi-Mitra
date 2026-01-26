---
inclusion: fileMatch
fileMatchPattern: "components/{BuyerDashboard,SellerDashboard,NegotiationView,ListingCard}*"
---

# Marketplace Features Guide

## Seller Dashboard
**Component**: `components/SellerDashboard.tsx`

### Features
- Create new listings (voice or manual)
- View active listings
- Manage inventory
- Track negotiations
- View market prices
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
- Browse available listings
- Filter by commodity, location, price
- View market trends
- Initiate negotiations
- Complete purchases
- Track orders

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
- Real-time mandi prices
- Price trends and analytics
- Commodity comparisons
- Location-based pricing

### Usage
```typescript
const marketPrice = await mandiService.getMarketPrice(commodity, location);
const trend = await mandiService.getPriceTrend(commodity, days);
```

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
