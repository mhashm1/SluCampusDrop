# 📡 CampusDrop

Cross-platform AirDrop-style app for campus file sharing.

### 🧩 Features
- P2P file transfer with WebRTC DataChannel
- QR-code device pairing
- SHA-256 file verification
- (Stretch) Presence via Node.js server + TURN fallback

### 🧱 Tech Stack
- React Native (Expo Dev Client)
- WebRTC
- Node.js (optional signaling)
- coturn (optional TURN server)

### 🚀 Getting Started
```bash
cd client
npm install
npx expo start --web

mobile support to be added
npx expo run:android
