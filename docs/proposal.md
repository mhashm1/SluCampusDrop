# 📡 CampusDrop — Project Proposal

## Overview
We propose to build **CampusDrop**, a cross-platform *“AirDrop-style”* web and mobile application that enables students to securely share files with peers on the same Wi-Fi network using peer-to-peer (P2P) connections and lightweight discovery.

Currently, sharing files on campus is cumbersome — you can either email them, upload them to Google Drive, or use Apple AirDrop (which only works on Apple devices). That wastes time and makes it harder for people with different phones or laptops.

**CampusDrop** will make file sharing simple: open the app (web or mobile), see who’s nearby, and send or receive files instantly. It’s private (encrypted), requires consent (no spam), and works even on campus Wi-Fi.

---

## 🧩 Methods

### 1. MVP (Web-Based)
- **a.** Build a cross-platform app using **Expo** with **React + TypeScript**, initially targeting **Expo Web** for fast prototyping.  
- **b.** Implement file sharing through **WebRTC DataChannel**, which allows encrypted, direct browser-to-browser transfers.  
- **c.** Establish connections by scanning a **QR code** (sender shows, receiver scans).  
- **d.** Show real-time progress, speed, and ETA during file transfer.  
- **e.** Use **SHA-256 hashing** to verify file integrity after transfer.  
- **f.** Ensure privacy through manual connection approval (no unsolicited transfers).

### 2. Stretch Goals (Mobile Expansion)
- **a.** Add support for **mobile devices** using **Expo Dev Client**, allowing native WebRTC modules (`react-native-webrtc`) for full cross-platform compatibility.  
- **b.** Introduce a lightweight **Node.js + WebSocket signaling server** for discovery (“Who’s Nearby”).  
- **c.** Add a **TURN server** (coturn) so transfers still work when direct P2P is blocked on campus Wi-Fi.  
- **d.** Implement extended features like **trust lists** (auto-accept from friends), **block/report**, and “**drop to a room**” for group file sharing.  

### 3. Design Approach
- **a.** Develop the core MVP entirely in web form to simplify testing and debugging.  
- **b.** Transition seamlessly to mobile using Expo’s unified codebase (same React components).  
- **c.** Prioritize minimal setup — all transfers remain encrypted and user-approved.  

---

## 🗓️ Plan & Schedule (8 Weeks)

| Week | Focus |
|------|--------|
| **Week 1** | Learn basics of WebRTC file transfer. Design UI screens (Send, Receive, Progress). |
| **Week 2** | Set up Expo Web project and test WebRTC connections between browsers using QR codes. |
| **Week 3** | Implement file sending with chunking, progress tracking, and hash verification. |
| **Week 4** | Test across different networks (hotspot, campus Wi-Fi). Improve error handling. |
| **Week 5** | Add a lightweight Node.js + WebSocket signaling server for presence (“Who’s Online”). |
| **Week 6** | Expand to mobile using Expo Dev Client. Integrate `react-native-webrtc` for mobile transfers. |
| **Week 7** | Implement extra features (trust list, block/report, group sharing). Polish UI/UX. |
| **Week 8** | Final testing, deployment (web + mobile), and prepare demo with architecture diagrams and write-up. |

---

## ⚙️ Resources Needed

### 🧠 Software
- **Frontend:** Expo (React + TypeScript)  
- **WebRTC APIs** for P2P file transfer  
- **QR libraries:** `react-qr-reader`, `react-native-qrcode-svg`  
- **Backend:** Node.js + WebSocket (for presence and signaling)  
- **TURN/STUN:** coturn server for fallback connectivity  

### 📱 Hardware
- Laptop or desktop browser for initial web testing  
- Two smartphones (Android + iPhone) for mobile testing  
- Wi-Fi hotspot for controlled testing environment  

### ☁️ Optional Cloud
- Small cloud VM ($5–10/month) for hosting the signaling and TURN servers campus-wide.  

---

## 🚧 Risks and Mitigation
- **Campus Wi-Fi might block direct P2P connections.**  
  → We’ll use a TURN relay (coturn) as a fallback and demo on a hotspot if needed.  

- **Expo Go doesn’t support WebRTC.**  
  → We’ll use **Expo Web** for MVP and **Expo Dev Client** for mobile builds with native modules.  

- **Limited time for server features.**  
  → Focus first on direct WebRTC QR-based transfers, then expand to presence and TURN servers only if time allows.  

---

## 🎯 Expected Outcome
At the end of 8 weeks, we will have a functional **CampusDrop web app** that allows two users on the same Wi-Fi to share files directly through WebRTC, using a simple QR-based pairing system.  

Transfers will be **secure, fast, and cross-platform**, with progress tracking and verification.  
If time allows, the project will expand to include a **mobile version**, online presence list, and advanced sharing options — creating a truly **campus-wide, platform-agnostic file-sharing system**.

---

## 🧱 Tech Stack Diagram (Architecture Overview)

```mermaid
graph TD
    subgraph Client Side
        A1[💻 Web App (Expo Web)] -->|WebRTC DataChannel| B1
        A2[📱 Mobile App (Expo Dev Client)] -->|WebRTC DataChannel| B1
    end

    subgraph Network Layer
        B1[(🌐 Peer-to-Peer Connection)]
    end

    subgraph Optional Servers
        S1[🖥️ Node.js Signaling Server]
        S2[🔄 TURN/STUN Server (coturn)]
    end

    A1 -->|Signaling (WebSocket)| S1
    A2 -->|Signaling (WebSocket)| S1
    B1 -->|Relay if needed| S2
