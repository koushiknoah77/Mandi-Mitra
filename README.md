# 🌾 Mandi Mitra (मंडी मित्र)
> **Voice-First Multilingual Agricultural Trade Platform**

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Gemini](https://img.shields.io/badge/AI-Google_Gemini-orange?logo=google-gemini&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Version](https://img.shields.io/badge/Version-1.5.0-blue)](package.json)

---

## 🌟 Overview

**Mandi Mitra** is a revolutionary agricultural marketplace designed to bridge the gap between farmers (sellers) and buyers across India. By leveraging **Voice-First interaction** and **AI-powered negotiation**, it breaks down language barriers and technical hurdles, making agricultural trade accessible to everyone, regardless of their proficiency with digital interfaces.

Built for the next billion users, Mandi Mitra supports **23 languages** and works seamlessly even in low-connectivity areas.

---

## ✨ Key Features

### 🎙️ Voice-First Multilingual Interface
- **Hands-Free Operation**: Create listings and negotiate entirely through voice.
- **23 Languages**: Seamless support for 22 Indian languages plus English.
- **Real-time Translation**: Break language barriers between buyers and sellers instantly.

### 🤖 AI-Powered Trading Intelligence
- **Smart Negotiation**: Gemini AI acts as a personal assistant to help finalize deals.
- **Live Market Prices**: Real-time mandi price fetching via AI searching web sources.
- **Content Moderation**: Built-in AI protection against scams and inappropriate content.
- **Listing Extraction**: Automatically converts voice/text into structured market data.

### 📱 Modern Marketplace Experience
- **Dual Dashboards**: Tailored experiences for both **Sellers (Farmers)** and **Buyers**.
- **Analytics Dashboard**: Track revenue, deals, and market trends with visual charts.
- **Rating & Reviews**: Build trust through a transparent 5-star rating system.
- **Invoice Generation**: Automatic PDF invoice creation for completed transactions.
- **Favorites & Sharing**: Save top listings and share them via WhatsApp or SMS.

### 🔒 Robust & Reliable
- **Offline Sync**: Actions are queued when offline and automatically synced when back online.
- **Persistent History**: Full access to past conversations and transaction records.

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v20 or later)
- **Google Gemini API Key** ([Get it here](https://aistudio.google.com/app/apikey))

### Installation
1. **Clone & Enter**
   ```bash
   git clone <repository-url>
   cd mandi-mitra
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   Create a `.env.local` file in the root:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

---

## 🛠️ Technology Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | [React 19](https://react.dev/) (Vite) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **AI Engine** | [Google Gemini AI](https://ai.google.dev/) (@google/genai) |
| **Voice** | Browser Web Speech API (Recognition & Synthesis) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) |
| **State** | React Context API & Custom Hooks |
| **Storage** | Browser LocalStorage (with 24h persistence) |

---

## 📁 Project Structure

```text
mandi-mitra/
├── components/          # UI Components (Dashboard, Negotiation, Voice UI)
├── services/           # AI (Gemini), Mandi Prices, & Translation services
├── contexts/           # Global state management for Listings & History
├── hooks/              # Custom logic (useVoiceAssistant, useAnalytics, etc.)
├── utils/              # 24-language translations, PDF export, & location logic
├── data/               # Local mock data and initial states
├── types.ts            # Project-wide TypeScript definitions
└── App.tsx             # Main application entry point
```

---

## 🌍 Supported Languages

Supporting the linguistic diversity of India with **23 languages**:
- **North**: Hindi, Punjabi, Dogri, Kashmiri, Maithili
- **South**: Telugu, Tamil, Kannada, Malayalam
- **West**: Marathi, Gujarati, Konkani, Sindhi
- **East/NE**: Bengali, Odia, Assamese, Manipuri, Bodo, Santali
- **Classical/Other**: Sanskrit, Nepali, Urdu, English

---

## 🔧 Recent Updates (v1.5.0)

- ✅ **Delete Listings**: Added listing management for sellers with confirmation workflows.
- ✅ **Back Navigation**: Enhanced UX with intuitive back buttons in all deep-view headers.
- ✅ **Bengali/Devanagari Numerals**: Full support for native script price/quantity extraction.
- ✅ **Improved Negotiation Logic**: Refined AI roles for more realistic buyer/seller interactions.
- ✅ **Fallback Systems**: Robust pattern-matching system ensuring functionality even without AI.

---

## 🐛 Troubleshooting

| Issue | Solution |
| :--- | :--- |
| **Microphone Blocked** | Click the lock icon 🔒 in the address bar and set Microphone to **Allow**. |
| **AI Quota Exceeded** | The app will automatically fall back to pattern-matching and cached data. |
| **Old Content Loading** | Clear `dist/` folder and perform a hard refresh (`Ctrl + Shift + R`). |
| **Numerals Not Detected** | Ensure you are using the latest v1.5.0 which supports multi-script numerals. |

---

## 📜 License

This project is licensed under the **MIT License**.

---

<div align="center">
  <p>Made with ❤️ for Indian farmers and agricultural traders</p>
  <b>Mandi Mitra - Your Market Friend</b>
</div>
