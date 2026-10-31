# AgroSmart AI – Intelligent Crop Recommendation & Decision Support System

[![Problem ID](https://img.shields.io/badge/Problem%20ID-HACK--P302-brightgreen)](https://github.com)
[![Category](https://img.shields.io/badge/Category-Agriculture%20%26%20Precision%20Farming-blue)](https://github.com)
[![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Node%20%7C%20TypeScript%20%7C%20Prisma%20%7C%20PostgreSQL-darkgreen)](https://github.com)
[![Status](https://img.shields.io/badge/Prototype-Production%20Ready-success)](https://github.com)

> **Tagline:** *Grow Smarter, Farm Better.*  
> **Problem ID:** HACK-P302  
> **Target Users:** Farmers, Agricultural Students, Extension Specialists, AgTech Evaluators

---

## 🌾 Project Overview

**AgroSmart AI** is a full-stack, transparent, explainable decision-support web application that empowers farmers and agricultural learners to identify suitable crops based on soil chemistry, primary nutrient levels, environmental trends, and cropping seasons.

Rather than relying on uninterpretable black-box models or keyword matching, AgroSmart AI utilizes a **deterministic multi-factor weighted agronomic engine** calibrated against documented suitability benchmarks from the **Indian Council of Agricultural Research (ICAR)** and the **Food and Agriculture Organization (FAO)**.

---

## 🚀 Key Features

1. **Deterministic Multi-Factor Recommendation Engine**
   - Evaluates 9 agronomic factors: Soil texture, Soil pH, Nitrogen (N), Phosphorus (P), Potassium (K), Temperature, Rainfall, Relative Humidity, and Cultivation Season.
   - Calculates continuous trapezoidal suitability scores (0–100%) and categorizes crops into *Highly Suitable*, *Moderately Suitable*, *Marginally Suitable*, or *Not Recommended*.
2. **Explainable AI (XAI)**
   - Decomposes every crop recommendation into positive contributing factors, limiting constraints, and missing-data warnings.
   - Optional natural language synthesis powered by the Google Gemini API with seamless deterministic fallback.
3. **Interactive What-If Climate & Soil Simulator**
   - Live sliders for temperature, precipitation, and soil pH that re-calculate and re-rank crop recommendations instantaneously (0 ms latency).
4. **Side-by-Side Multi-Crop Comparison**
   - Compare up to 4 crops simultaneously.
   - Interactive Recharts **Agronomic Resilience Radar Chart** evaluating drought tolerance, thermal hardiness, soil versatility, nutrient efficiency, and growing duration.
5. **Crop Knowledge Encyclopedia (15 Crops)**
   - Searchable and filterable reference library for: Rice, Wheat, Maize, Cotton, Sugarcane, Groundnut, Soybean, Potato, Tomato, Onion, Chickpea, Mustard, Sorghum, Pearl Millet, and Sunflower.
6. **Input Quality Checker**
   - Real-time sanity checker alerting farmers to extreme acidity (pH < 4.5), excess alkalinity (pH > 8.5), missing NPK readings, and thermal stress.
7. **One-Click Downloadable PDF Advisory Reports**
   - Generates formatted, field-ready PDF summaries complete with input readings, ranked crops, suitability percentages, agronomic explanations, and disclaimers.
8. **Multilingual Support (3 Languages)**
   - Human-reviewed localization in **English**, **Telugu (తెలుగు)**, and **Hindi (हिन्दी)**.
9. **Guest & Authenticated History**
   - Standalone browser cache persistence for guest demo evaluations, with PostgreSQL persistence via Prisma for authenticated users.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, TypeScript, Tailwind CSS, Lucide React, Recharts, jsPDF |
| **Backend** | Node.js, Express.js, TypeScript, REST APIs, Zod, Helmet, Morgan |
| **Database** | PostgreSQL (Neon DB hosted), Prisma ORM (with seamless embedded fallback) |
| **Recommendation Engine** | Deterministic Weighted Agro-Suitability Engine (Trapezoidal continuous curves) |
| **Machine Learning (Ext.)** | Optional Python / Scikit-Learn prototype script (`ml_crop_recommendation.py`) |
| **GenAI (Optional)** | Google Gemini 1.5 Flash for natural language simplification |

---

## 📁 Monorepo Folder Structure

```
agrosmart-ai/
├── client/                     # Frontend Application (React + Vite + TS)
│   ├── src/
│   │   ├── components/         # Navbar, Footer, CropCard, Simulator, Radar, Modals
│   │   ├── pages/              # Landing, Dashboard, Form, Results, Compare, Library, History, About
│   │   ├── contexts/           # LanguageContext (EN, TE, HI)
│   │   ├── i18n/               # Multi-language translation dictionaries
│   │   ├── services/           # API client and local storage guest persistence
│   │   ├── utils/              # PDF generator (jsPDF)
│   │   ├── App.tsx             # Route management
│   │   └── main.tsx            # Entrypoint
│   ├── package.json
│   ├── tailwind.config.js      # Curated agricultural color palette
│   └── vite.config.ts
├── server/                     # Backend API (Node.js + Express + TS)
│   ├── src/
│   │   ├── controllers/        # Crop & Recommendation handlers
│   │   ├── routes/             # REST endpoints (/api/crops, /api/recommendations)
│   │   ├── services/           # RecommendationEngine, Explainer, Weather, DB Repository
│   │   ├── validators/         # Zod schemas & agronomic input quality evaluator
│   │   ├── data/               # 15 documented crop profiles & 5 test scenarios
│   │   ├── scripts/            # Optional scikit-learn ML prototype
│   │   ├── tests/              # Automated unit and integration test suite
│   │   └── index.ts            # Express server initialization
│   ├── prisma/
│   │   ├── schema.prisma       # PostgreSQL models (Users, Crops, Requests, Results)
│   │   └── seed.ts             # Database seeding script
│   └── package.json
├── shared/                     # Shared TypeScript interfaces & types
│   ├── src/index.ts
│   └── package.json
├── docs/                       # Architecture, Methodology, and Demo script
│   ├── architecture.md
│   ├── methodology.md
│   └── demo-script.md
├── .env.example                # Sample environment variables
├── package.json                # Root monorepo scripts
└── README.md
```

---

## ⚙️ Installation & Local Setup

### Prerequisites
- **Node.js** v18+ (tested on Node v24)
- **npm** v9+ (tested on npm v11)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/agrosmart-ai.git
cd agrosmart-ai

# Install root, client, server, and shared dependencies
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
*(Note: The core application works 100% out-of-the-box offline without any external API keys).*

### 3. Build Shared Packages
```bash
npm run build --workspace=shared
```

### 4. Run Both Frontend and Backend Concurrently
```bash
npm run dev
```

- **Frontend Client:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:5000](http://localhost:5000)
- **API Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🧪 Running Automated Tests

Run the comprehensive unit and integration test suite covering input validation, mathematical boundary guarantees, repeatability, and scenario ranking:

```bash
npm test
```

### What is Tested:
- Input validation & schema conformity.
- Rejection of impossible inputs (e.g., pH < 3.0 or > 11.0).
- Repeatability (identical inputs guarantee identical scores).
- Mathematical boundaries ($0 \le \text{Suitability Score} \le 100$).
- Handling of incomplete/missing inputs with confidence reduction.
- Agronomic scenario validity (Floodplain favors Rice; Winter favors Wheat).

---

## 🌍 Optional Machine Learning Prototype

To run the optional Scikit-Learn Random Forest prototype demonstrating probabilistic vs. deterministic comparison:
```bash
python server/src/scripts/ml_crop_recommendation.py
```

---

## 🚀 Deployment Instructions

### 1. Frontend Deployment (Vercel)
1. Push this repository to GitHub.
2. Link the repository on [Vercel](https://vercel.com).
3. Set **Root Directory** to `client`.
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Add Environment Variable:
   - `VITE_API_URL`: Your deployed Render backend URL (e.g. `https://agrosmart-server.onrender.com`).

### 2. Backend Deployment (Render)
1. Create a new **Web Service** on [Render](https://render.com).
2. Connect your repository.
3. Set **Root Directory** to `server`.
4. Build Command: `npm install && npm run build`
5. Start Command: `npm start`
6. Add Environment Variables:
   - `PORT`: `5000`
   - `NODE_ENV`: `production`
   - `CLIENT_URL`: Your Vercel frontend URL
   - `DATABASE_URL`: Your hosted Neon PostgreSQL connection string

### 3. Hosted Database (Neon PostgreSQL)
1. Create a free serverless PostgreSQL instance on [Neon](https://neon.tech).
2. Copy the pooled connection string into `.env` as `DATABASE_URL`.
3. Push schema and run migrations:
   ```bash
   npm run prisma:generate --workspace=server
   npm run prisma:migrate --workspace=server
   npm run prisma:seed --workspace=server
   ```

---

## 📚 Agronomic Data Sources & Citations

1. **Indian Council of Agricultural Research (ICAR)** – Handbook of Agriculture, 6th Edition (2022).
2. **FAO EcoCrop Suitability Database** – Food and Agriculture Organization of the United Nations.
3. **TNAU Agritech Portal** – Department of Agronomy, Tamil Nadu Agricultural University.
4. **National Food Security Mission (NFSM)** – Coarse Cereals & Pulses Production Bulletins.

---

## ⚖️ Official Advisory Disclaimer

> **ADVISORY GUIDANCE NOTICE:**  
> The recommendations produced by AgroSmart AI are scientific decision-support estimates derived from mathematical suitability rules. They do not constitute an agronomic or commercial guarantee of harvest success. Real farm outcomes depend upon local microclimate variations, soil depth, seed viability, drainage, and pest management. Farmers are strongly advised to consult certified agronomists or their local **Krishi Vigyan Kendra (KVK)** before planting.
