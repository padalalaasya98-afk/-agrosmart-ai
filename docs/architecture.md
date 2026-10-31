# AgroSmart AI – Architecture & System Design

**Project Name:** AgroSmart AI – Intelligent Crop Recommendation & Decision Support System  
**Problem ID:** HACK-P302  
**Version:** 1.2.0  

---

## 1. System Architecture Diagram

```mermaid
graph TD
    subgraph Client["Frontend Client (React + TypeScript + Vite + Tailwind CSS)"]
        UI["Landing Page / Dashboard / Crop Form"]
        QualityChecker["Input Quality Checker"]
        Simulator["What-If Interactive Simulator"]
        ChartModule["Recharts Radar & Bar Module"]
        PDFGen["jsPDF Export Engine"]
        GuestStore["Local Storage History Cache"]
    end

    subgraph Server["Backend API (Node.js + Express + TypeScript)"]
        Router["Express REST Router (/api)"]
        ZodVal["Zod Validation & Sanity Guards"]
        Engine["Deterministic Agro Recommendation Engine"]
        Explainer["Explainable AI & Natural Language Generator"]
        Weather["Weather Integration (Live & Regional Normal)"]
        Repo["Database Repository Layer"]
    end

    subgraph Data["Database & External Services"]
        Postgres["PostgreSQL / Neon Database"]
        Prisma["Prisma ORM"]
        Dataset["ICAR / FAO 15-Crop Documented Dataset"]
        GeminiAPI["Optional Google Gemini API"]
        WeatherAPI["Optional OpenWeather API"]
    end

    UI --> QualityChecker
    UI --> Router
    Router --> ZodVal
    ZodVal --> Engine
    Engine --> Dataset
    Engine --> Explainer
    Explainer -.-> GeminiAPI
    Router --> Weather
    Weather -.-> WeatherAPI
    Engine --> Repo
    Repo --> Prisma
    Prisma --> Postgres
    Router --> UI
    UI --> Simulator
    UI --> ChartModule
    UI --> PDFGen
    UI --> GuestStore
```

---

## 2. Component Design & Information Flow

### Step 1: Input Ingestion & Quality Guard
- Farmer inputs soil texture, pH, NPK, temperature, rainfall, and season.
- The **Input Quality Checker** assesses values in real-time, warning against extreme acidity (pH < 4.5), excess alkalinity (pH > 8.5), missing NPK data, and thermal stress.
- Zod schemas on the backend enforce structural constraints.

### Step 2: Deterministic Suitability Evaluation
- The recommendation engine loads verified agronomic bands for each crop.
- Trapezoidal continuous scoring functions compute a factor score $S_i \in [0.0, 1.0]$.
- Categorical attributes (soil texture, cropping season) apply verified compatibility multipliers.
- Incomplete inputs are gracefully omitted from the denominator, and an Input Completeness metric is reported.

### Step 3: Explainability & Natural Language Generation
- The engine decomposes the final score into:
  - Favorable contributing factors
  - Bottlenecks or limiting factors
  - Missing data uncertainties
- A deterministic template provides a consistent explanation. If a `GEMINI_API_KEY` is provided, Gemini rewrites the points into simple farmer-friendly language without modifying scores or inventing readings.

### Step 4: Visualizations & Interactive Modeling
- Recharts generates multi-axis Radar charts for resilience benchmarking.
- The **What-If Simulator** allows instant slider adjustments for temperature, rainfall, and soil pH with immediate re-ranking.
- One-click PDF generation compiles a complete field advisory report.
