# 🚨 KSP IntelliCrime - Agentic AI Police Engine

![KSP IntelliCrime](https://img.shields.io/badge/Status-Datathon_Ready-brightgreen?style=for-the-badge)
![Tech Stack](https://img.shields.io/badge/Stack-React_|_TypeScript_|_Vite_|_Catalyst-blue?style=for-the-badge)

**KSP IntelliCrime** is a next-generation Agentic AI dashboard built for the Karnataka State Police. It leverages Google Gemini to process natural language queries (in both English and Kannada), parsing complex FIR datasets to instantly map suspect networks, analyze crime trends, and generate dynamic operational action plans.

## 🎯 Problem Statement
Law enforcement agencies currently face severe bottlenecks when navigating massive, decentralized State Crime Records Bureau (SCRB) databases. Officers manually filter through thousands of FIRs to identify repeat offenders, parse suspect linkages, or generate emergency action plans, delaying critical response times. 

**KSP IntelliCrime** solves this by unifying data access through a single intelligent interface that autonomously calculates crime severity, generates action plans, and silently routes emergency dispatch alerts to field officers in real-time.

---

## ✨ Key Features

- **Agentic AI Intelligence Assistant:** Powered by Google Gemini 3.5 Flash Lite, the embedded AI allows officers to type natural language queries (e.g., *"Show me the analytics for Jayanagar"*) and retrieves highly specific suspect profiles and network linkages.
- **Bilingual NLP Support:** Fully supports localized law enforcement operations by natively processing both English and Kannada queries.
- **Dynamic Case Prioritization:** Autonomously calculates a "Severity Priority Score" for all open FIRs and dynamically generates custom "Action Plans" based on crime type, repeat-offender flags, and current investigation stage.
- **Zero-Latency Emergency Dispatch:** Features a live alert dashboard that uses a CORS-proxied Twilio REST API integration to dispatch formatted SMS alerts instantly and silently to on-duty patrol officers.

*(Note: The data displayed in this prototype application is strictly **dummy data** populated for the Datathon presentation. No real highly-classified SCRB data is exposed.)*

---

## 🛠️ Technology Stack

- **Frontend Framework:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS (Glassmorphism & Tactical Dark Mode UI)
- **Icons:** Lucide React
- **Agentic AI:** Google Gemini 3.5 Flash Lite API (with fallback orchestration)
- **Hardware/Communications:** Twilio REST API (SMS Gateway)
- **Deployment & Hosting:** Zoho Catalyst Serverless Platform

---

## 🚀 Setup and Execution Instructions

To run this repository locally on your machine:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Md-javid/datathon-26.git
   cd datathon-26/ksp_intellicrime-ts
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add your Google Gemini API key:
   ```env
   VITE_GEMINI_API_KEY=YOUR_GEMINI_API_KEY
   ```

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   The application will be running at `http://localhost:3000`.

---

## ☁️ Deployment to Zoho Catalyst

This project is fully configured for deployment on the **Zoho Catalyst Serverless Platform**.

1. Ensure the Catalyst CLI is installed: `npm install -g zcatalyst-cli`
2. Login to your Catalyst account: `catalyst login`
3. Build the production application:
   ```bash
   npm run build
   ```
4. Deploy to Catalyst:
   ```bash
   catalyst deploy
   ```

---

## 🔮 Future Roadmap & Enhancements

While the current prototype handles critical parsing and communications, the vision for a production-level rollout includes:

- **Multi-Agent Orchestration:** Deploying concurrent, specialized AI sub-agents (e.g., a "Forensics Agent" and a "Financial Audit Agent") that simultaneously think, analyze, and debate suspect linkages in the background before presenting a final consolidated report to the officer.
- **Machine Learning Predictive Modeling:** Feeding historical SCRB data (once securely available) into a custom ML model to proactively predict spatial crime hotspots up to 72 hours in advance.
- **Automated Voice Dispatch Bot:** Upgrading the silent SMS dispatch to a synthesized automated voice bot (using Twilio Voice API). When an emergency alert is triggered, the bot will physically call the on-duty patrol officer, bypassing "Do Not Disturb" settings to dictate the suspect's description and exact GPS coordinates immediately.
