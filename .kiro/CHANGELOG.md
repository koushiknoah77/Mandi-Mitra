# Changelog

All notable changes to Mandi Mitra project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.5.0] - 2026-01-31

### Added
- **Delete Listings**: Sellers can now delete their own listings with confirmation dialog
- **Back Navigation**: Added back buttons in NegotiationView and SupportChatbot headers
- **Bengali Numeral Support**: System now extracts Bengali (৩০০০) and Devanagari (०१२) numerals
- **Multilingual Labels**: Added translations for `deleteListing`, `confirmDelete`, and `back` in 12+ languages

### Fixed
- Fixed Bengali numeral extraction in listing creation
- Fixed translation file structure and duplicate content
- Improved pattern matching for listing extraction
- Enhanced error messages in user's language

### Changed
- Updated build size to 638 KB (168 KB gzipped)
- Improved fallback extraction system with better logging
- Enhanced user feedback for all operations

## [1.4.0] - 2026-01-30

### Added
- **Fallback Response System**: Chat works without AI using pattern matching
- **Deal Completion Without AI**: Users can finalize deals even when AI is unavailable
- **Price Extraction**: Automatic price extraction from messages (₹50, 50 rupees, etc.)
- **Quantity Extraction**: Automatic quantity extraction (50 quintal, 100 kg, etc.)
- **Multilingual Fallbacks**: Responses in 8+ Indian languages

### Fixed
- Fixed UserRole import error in AnalyticsDashboard
- Improved error handling in negotiation flow
- Better fallback chain: AI → Pattern matching → Default → Error message

### Changed
- Enhanced NegotiationView with fallback support
- Updated SupportChatbot with pattern-based responses
- Improved error messages across all components

## [1.3.0] - 2026-01-29

### Added
- **Rating System**: Rate users after deals (1-5 stars with optional review)
- **Favorites/Bookmarks**: Save and filter favorite listings
- **Share Listings**: Share via Web Share API, WhatsApp, or SMS
- **PDF Export**: Download invoices as PDF or HTML
- **Analytics Dashboard**: View deals, revenue, and activity charts
- **Offline Queue**: Queue actions when offline, auto-sync when online

### Components Added
- `hooks/useRatings.ts` - Rating management hook
- `hooks/useFavorites.ts` - Favorites management hook
- `hooks/useAnalytics.ts` - Analytics data hook
- `hooks/useOfflineQueue.ts` - Offline queue management
- `components/RatingModal.tsx` - Rating UI component
- `components/AnalyticsDashboard.tsx` - Analytics visualization
- `utils/pdfExport.ts` - PDF export utility
- `utils/shareUtils.ts` - Share functionality utility

### Changed
- Enhanced `ListingCard.tsx` with favorite and share buttons
- Updated `BuyerDashboard.tsx` with favorites filter and analytics button
- Improved `NegotiationView.tsx` with rating prompt after deals
- Build size increased to 625 KB due to new features

## [1.2.0] - 2026-01-28

### Added
- **Profile & History Dashboard**: View transaction and conversation history
- **Conversation Reopening**: Continue previous negotiations from history
- **Transaction Tracking**: Complete history of all deals
- **Multilingual Support**: All history features in 24 languages

### Components Added
- `components/ProfileHistory.tsx` - Profile and history dashboard
- Enhanced `contexts/ListingsContext.tsx` with conversation and transaction storage

### Changed
- Updated navigation to include profile access via avatar
- Improved data persistence in localStorage
- Enhanced user profile management

## [1.1.0] - 2026-01-27

### Added
- **AI-Powered Live Prices**: Real-time mandi price fetching using Gemini AI
- **Smart Price Caching**: 1-hour cache to minimize API calls
- **Live Market Ticker**: Scrolling ticker with current market rates
- **Price Comparison**: Show market price vs listing price

### Components Added
- `services/mandiService.ts` - Market price service with AI integration
- `components/LiveMarketTicker.tsx` - Live price ticker component
- `components/MandiPulse.tsx` - Price comparison widget

### Changed
- Integrated Gemini AI for Google Search-based price fetching
- Improved caching strategy for better performance
- Enhanced listing cards with market price indicators

## [1.0.0] - 2026-01-26

### Added
- **Voice-First Interface**: 24 language support with Web Speech API
- **AI-Powered Negotiation**: Gemini AI for intent detection and moderation
- **Dual Dashboards**: Separate interfaces for sellers and buyers
- **Multilingual Support**: 23 Indian languages + English
- **Image Gallery**: Multi-image support for listings
- **Offline Support**: Works with limited connectivity
- **Session Management**: 24-hour persistence with localStorage

### Components Added
- `components/OnboardingFlow.tsx` - User onboarding
- `components/SellerDashboard.tsx` - Seller interface
- `components/BuyerDashboard.tsx` - Buyer interface
- `components/NegotiationView.tsx` - Chat and negotiation
- `components/ListingCard.tsx` - Listing display
- `components/VoiceIndicator.tsx` - Voice UI component
- `components/ImageGallery.tsx` - Image viewer
- `components/SupportChatbot.tsx` - AI support chat
- `components/ErrorBoundary.tsx` - Error handling

### Services Added
- `services/geminiService.ts` - Gemini AI integration
- `services/bhashiniService.ts` - Translation service
- `services/cloudinaryService.ts` - Image upload (mock)
- `services/invoiceService.ts` - Invoice generation
- `services/analyticsService.ts` - Event tracking

### Hooks Added
- `hooks/useVoiceAssistant.ts` - Voice recognition and synthesis
- `hooks/useOnlineStatus.ts` - Network status detection

### Utils Added
- `utils/translations.ts` - 24-language translation system
- `utils/location.ts` - Location utilities
- `utils/fallbackListingExtraction.ts` - Listing extraction fallback

### Infrastructure
- React 19 + TypeScript + Vite setup
- Tailwind CSS styling
- Context API for state management
- localStorage for persistence
- Error boundaries for stability

## [0.1.0] - 2026-01-25

### Added
- Initial project setup
- Basic project structure
- Development environment configuration
- TypeScript configuration
- Vite build setup
- Tailwind CSS integration

---

## Feature Status Summary

### ✅ Implemented (14 features)
1. Voice Interface (24 languages)
2. AI Negotiation
3. Live Market Prices
4. Listings Management
5. Profile & History
6. Rating System
7. Favorites/Bookmarks
8. Share Listings
9. PDF Export
10. Analytics Dashboard
11. Offline Queue
12. Delete Listings
13. Back Navigation
14. Bengali Numerals
15. Fallback Systems

### ❌ Not Implemented (7 features - require backend)
1. Push Notifications
2. Multi-device Sync
3. Phone OTP Authentication
4. Cloud Image Upload
5. Payment Gateway
6. Real-time Chat (WebSocket)
7. Email Notifications

---

## Build Information

- **Current Version**: 1.5.0
- **Build Size**: 638 KB (168 KB gzipped)
- **TypeScript Errors**: 0
- **Production Ready**: Yes
- **Last Updated**: January 31, 2026

---

## Migration Notes

### From 1.4.0 to 1.5.0
- No breaking changes
- New translation keys added: `deleteListing`, `confirmDelete`, `back`
- New function in ListingsContext: `removeListing()`
- localStorage schema unchanged

### From 1.3.0 to 1.4.0
- No breaking changes
- New utility files: `fallbackResponses.ts`
- Enhanced error handling in all components
- localStorage schema unchanged

### From 1.2.0 to 1.3.0
- New localStorage keys: `mandi_ratings`, `mandi_favorites_{userId}`, `mandi_offline_queue`
- New hooks available: `useRatings`, `useFavorites`, `useAnalytics`, `useOfflineQueue`
- No breaking changes to existing APIs

---

## Known Issues

### Current
- None

### Resolved
- ✅ Bengali numeral extraction (v1.5.0)
- ✅ UserRole import error (v1.4.0)
- ✅ Translation file structure (v1.5.0)

---

## Upcoming Features

### Planned for v2.0.0
- Backend integration
- User authentication
- Real-time chat
- Push notifications
- Payment gateway
- Cloud storage

### Under Consideration
- Advanced analytics
- Bulk operations
- Export/import data
- Admin dashboard
- Seller verification
- Buyer ratings display

---

## Contributors

- Development Team
- AI Integration: Gemini AI
- Voice: Web Speech API
- Styling: Tailwind CSS

---

## License

Proprietary - All rights reserved

---

## Support

For issues or questions:
1. Check documentation in `.kiro/` folder
2. Review code comments
3. Test in different browsers
4. Check console for errors

---

**Last Updated**: January 31, 2026  
**Version**: 1.5.0  
**Status**: Production Ready ✅
