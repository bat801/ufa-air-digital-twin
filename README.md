<!-- Шапка с бейджами -->
<div align="center">
  <img src="https://img.shields.io/badge/Status-MVP-<COLOR>.svg?style=for-the-badge" alt="Status MVP"/>
  <img src="https://img.shields.io/badge/Grant-Student%20Startup%202026-FFD700?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDgwIDgwIj48Y2lyY2xlIGN4PSI0MCIgY3k9IjQwIiByPSIzNSIgZmlsbD0iI0ZGRDcwMCIvPjxwb2x5Z29uIHBvaW50cz0iNDAsMTAgNTAsMzAgNzAsMzUgNTUsNTAgNTgsNzAgNDAsNjAgMjIsNzAgMjUsNTAgMTAsMzUgMzAsMzAiIGZpbGw9IiNGRkZGRkYiLz48L3N2Zz4=" alt="Grant Winner"/>
  <img src="https://img.shields.io/badge/License-CC%20BY--NC--ND%204.0-lightgrey?style=for-the-badge" alt="License"/>
</div>

<br/>

<h1 align="center">🌍 Ufa Air Digital Twin</h1>

<p align="center">
  <strong>An interactive digital twin for monitoring urban air quality. From open data to actionable insights.</strong>
</p>

<p align="center">
  <a href="https://bat801.github.io/ufa-air-digital-twin/" target="_blank"><strong>🌐 View Live Demo (MVP)</strong></a> · 
  <a href="#-roadmap"><strong>📈 Roadmap</strong></a> · 
  <a href="#-about-the-project"><strong>📖 About</strong></a>
</p>

---

## 📜 About The Project

**Ufa Air Digital Twin** is a web-based platform designed to democratize access to environmental data. It solves the problem of fragmented official data (published in PDFs and unreadable tables) by aggregating, normalizing, and visualizing it on an interactive map with a clear Air Quality Index (AQI).

This project started as a research initiative and has evolved into a **commercial startup**, having won the **"Student Startup 2026" grant (RUB 1,000,000)** from the Russian Federation. 

The platform is designed for:
- **Authorities (B2G):** Operational monitoring and decision-making support.
- **Citizens (B2C):** Real-time air quality information for health-conscious living.
- **Industry (B2B):** Environmental auditing and background pollution control.

---

## 🎯 Key Features (Current MVP)

- **Interactive GIS Map:** Real-time visualization of monitoring stations with color-coded AQI indicators.
- **Aggregated AQI:** Custom Air Quality Index calculation adapted to Russian MPC (Maximum Permissible Concentrations).
- **Data Transparency:** Display of raw concentration data for 11 pollutants across 9 monitoring stations in Ufa.
- **Responsive UI:** Built with React and TypeScript for a smooth user experience.

---

## 🚀 Roadmap

This project is currently an MVP. The roadmap reflects the development plan for the next 12 months, aligning with the grant objectives.

| Phase | Focus | Status / Timeline | Key Deliverables |
| :--- | :--- | :--- | :--- |
| **Phase 1** | **Data Infrastructure** | ✅ **Completed (R&D)** | Data models designed; PostgreSQL/EF Core architecture prepared. |
| **Phase 2** | **Data Ingestion** | 🚧 **In Progress** | Development of automated C# parsers for Roshydromet, Ministry of Ecology, and Rospotrebnadzor. |
| **Phase 3** | **Backend & API** | 📅 **Q3-Q4 2026** | RESTful API (FastAPI/Node.js) integration; Full database migration to the cloud (Yandex Cloud / AWS). |
| **Phase 4** | **AI & Predictive Analytics** | 📅 **Q1 2027** | Integration of ML models (LSTM/GBM) for 72-hour air quality forecasting. |
| **Phase 5** | **Commercial Launch** | 📅 **Q2 2027** | Full B2G product release. Licensing to regional ministries. |

---

## ⚙️ Built With (Tech Stack)

- **Frontend:** [React](https://reactjs.org/) (TypeScript), [Vite](https://vitejs.dev/), [Leaflet](https://leafletjs.com/)
- **Backend (Planned):** [Python (FastAPI)](https://fastapi.tiangolo.com/) / [C# .NET 8](https://dotnet.microsoft.com/)
- **Database (Planned):** [PostgreSQL](https://www.postgresql.org/) (with TimescaleDB extension)
- **Data Parsing (Developed):** [C# .NET 8](https://dotnet.microsoft.com/), [HtmlAgilityPack](https://html-agility-pack.net/)
- **Deployment:** GitHub Pages (Frontend), Yandex Cloud / VPS (Backend)

---

## 🗂️ Repository Structure

```
ufa-air-digital-twin/
├── README.md                 # This file
├── LICENSE                   # CC BY-NC-ND 4.0
├── index.html                # Entry point
├── /src/                     # React/TypeScript application
│   ├── /components/          # UI components (Map, Sidebar, Charts)
│   ├── /data/                # Static mock data for MVP (to be replaced)
│   └── /utils/               # AQI calculation and helpers
├── /backend/                 # (Coming Soon) Data Parsers & API
│   └── /Parsers/             # C# .NET 8 console apps (Roshydromet source)
└── package.json
```

---

## 🚦 Getting Started (Local Development)

To run this MVP on your local machine:

1.  **Clone the repo:**
    ```bash
    git clone https://github.com/bat801/ufa-air-digital-twin.git
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run the dev server:**
    ```bash
    npm run dev
    ```
4.  Open `http://localhost:5173` to view it in the browser.

---

## ⚖️ License & Intellectual Property

This project is **not** open-source in the traditional sense. It is a commercial product currently under active development.

- **Source Code:** Published under the **Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0)** license.
  - ✅ You may view, fork, and study the code for educational/portfolio purposes.
  - ❌ Commercial use, distribution, or creation of derivative works is **strictly prohibited** without explicit written permission.
- **Patent Status:** The core algorithmic approach and data aggregation methods are being prepared for registration (Patent pending).

---

## 📫 Contact & Author

- **Author:** Batyr Nuriev
- **Role:** Founder & Lead Developer
- **Specialization:** GIS Engineering | AR/VR Development | Full-Stack Environmental Tech
- **Email:** [bat2003@mail.ru](mailto:bat2003@mail.ru)
- **GitHub:** [@bat801](https://github.com/bat801)
