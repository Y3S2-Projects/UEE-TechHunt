# 📱 **TechHunt – Skill Building & Micro Job Marketplace**

> Empowering youth and small businesses through skill-building, micro-jobs, and digital inclusion.
> *Developed with React Native (Expo) | SDG 8: Decent Work and Economic Growth*

---

## 🌍 **Overview**

**TechHunt** is a cross-platform mobile application designed to connect job seekers, freelancers, and training organizations with small businesses and startups. The platform combines **skill development resources** with a **micro-job marketplace**, promoting sustainable employment and economic growth aligned with **UN SDG Goal 8 – Decent Work and Economic Growth**.

---

## 👥 **Stakeholders**

* 🎓 **Job Seekers / Students** – Find micro-jobs and skill-building opportunities.
* 💼 **Small Businesses / Startups** – Post jobs and hire affordable talent.
* 🎨 **Freelancers / Informal Workers** – Showcase skills, bid on projects, and get paid securely.
* 🏢 **Training Organizations** – Offer courses and track learner progress.

---

## 🧩 **Core Features & Components**

### **1️⃣ User Onboarding & Profile Management**

**Developer:** Ransara N.S (Team Lead / Project Manager)

#### ✨ Features

* AI-powered adaptive onboarding quiz (dynamic forms & conditional rendering).
* Blockchain-inspired profile verification with digital badges.
* Personalized dashboards for each user type.

#### 🧠 Technologies

* `react-navigation`, `react-native-elements`, `AsyncStorage`, `react-native-animatable`, `react-native-vector-icons`, `expo-document-picker`

#### 💡 UX Impact

Dynamic onboarding adapts to user goals (student, employer, freelancer, or trainer) — making the experience personal, efficient, and trustworthy.

---

### **2️⃣ Skill Development Module**

**Developer:** Kumarasinghe P.A.N.D (Content Strategist / UI Support)

#### ✨ Features

* AI-driven personalized learning paths.
* AR-based interactive skill simulations.
* Progress tracking and content uploads for training organizations.

#### 🧠 Technologies

* `react-native-progress`, `expo-camera`, `react-native-vision-camera`, `react-native-elements`, `FlatList`, `FileSystem`

#### 💡 UX Impact

Immersive learning through AR-like experiences and personalized recommendations keeps users engaged, inclusive, and motivated.

---

### **3️⃣ Micro-Job Marketplace**

**Developer:** Chamudi K.S.I (UI/UX Designer)

#### ✨ Features

* AI-driven job matching and smart filtering.
* Real-time ML-powered chatbot for user guidance.
* Job posting, browsing, and bidding interfaces.

#### 🧠 Technologies

* `react-native-gifted-chat`, `FlatList`, `AsyncStorage`, `react-native-elements`

#### 💡 UX Impact

Simplifies hiring and job discovery with conversational UI and tailored job feeds, ensuring intuitive, human-centered interaction.

---

### **4️⃣ Payment, Feedback & Analytics System**

**Developer:** Senarathne S.M.B.V.B (UX Researcher)

#### ✨ Features

* Blockchain-inspired micropayment simulation.
* Visual payment confirmations and transaction logs.
* Interactive analytics dashboards for performance insights.
* Feedback and rating system for transparency.

#### 🧠 Technologies

* `react-native-animatable`, `react-native-chart-kit`, `FlatList`, `react-native-elements`

#### 💡 UX Impact

Enhances transparency and trust through animated payments and visual analytics, empowering users with clear progress feedback.

---

## 🧱 **Architecture**

```mermaid
graph TD
A[React Native (Expo)] --> B[User Onboarding]
A --> C[Skill Development]
A --> D[Job Marketplace]
A --> E[Payment & Analytics]
B --> F[AsyncStorage (Local Data)]
C --> F
D --> F
E --> F
```

---

## ⚙️ **Tech Stack**

| Layer                         | Technology                                       |
| ----------------------------- | ------------------------------------------------ |
| **Frontend Framework**        | React Native (Expo)                              |
| **UI Libraries**              | React Native Elements, React Native Vector Icons |
| **Animation & Visualization** | React Native Animatable, Chart Kit, Progress     |
| **Local Storage**             | AsyncStorage                                     |
| **Camera & File System**      | Expo Camera, Document Picker                     |
| **Chat & Interaction**        | React Native Gifted Chat                         |
| **State Management**          | React Context / Hooks                            |
| **Build Tools**               | Expo CLI, Metro Bundler                          |

---

## 👨‍💻 **Team Members**

| Name                     | Role                            | Student ID |
| ------------------------ | ------------------------------- | ---------- |
| **Ransara N.S**          | Team Lead / Project Manager     | IT22102096 |
| **Kumarasinghe P.A.N.D** | Content Strategist / UI Support | IT22294784 |
| **Chamudi K.S.I**        | UI/UX Designer                  | IT22147950 |
| **Senarathne S.M.B.V.B** | UX Researcher                   | IT22372444 |

---

## 📲 **App Flow Summary**

1. **User Registration & Onboarding**
   → AI-powered quiz → Profile creation → Dashboard setup

2. **Skill Learning**
   → Course recommendations → AR-based training → Progress tracking

3. **Job Marketplace**
   → Job posting / browsing → Chatbot-assisted navigation → Secure bidding

4. **Payment & Feedback**
   → Blockchain-style payment → Visual analytics → Feedback and insights

---

## 🔐 **UX Principles Applied**

* **Personalization:** Each flow adapts dynamically to the user role.
* **Trust & Transparency:** Visual verification and blockchain simulation.
* **Accessibility:** Intuitive UIs with consistent navigation patterns.
* **Engagement:** Animated, immersive interactions to sustain user attention.
* **Simplicity:** Clear, minimal UI design focusing on user goals.

---

## 🖯️ **Project Goal (SDG 8 Alignment)**

TechHunt contributes to **Sustainable Development Goal 8: “Decent Work and Economic Growth”** by:

* Providing job access to youth and freelancers.
* Empowering small businesses with affordable skilled workers.
* Enabling continuous learning and upskilling.
* Encouraging fair digital labor practices and transparency.

---

## 🚀 **Getting Started**

### **Prerequisites**

* Node.js ≥ 18.x
* Expo CLI installed globally
* Android/iOS emulator or physical device

### **Installation**

```bash
# Clone the repository
git clone https://github.com/your-org/techhunt.git
cd techhunt

# Install dependencies
npm install

# Start the development server
npx expo start
```

---

## 🧪 **Testing**

* Use **Expo Go** on mobile to preview changes instantly.
* Run **lint checks** with:

```bash
npm run lint
```

* Run basic tests:

```bash
npm test
```

---

## 🏠 **Future Enhancements**

* Real AI integration for onboarding and job matching.
* Blockchain-based credential and payment system.
* Real-time chat and push notifications.
* Cloud database integration (Firebase / Supabase).
* Admin analytics dashboard (Web version).

---

## 🏁 **License**

This project is licensed under the **MIT License**.
© 2025 TechHunt Team – All Rights Reserved.
