<div align="center">
  <img src="readme-assets/HireCraft-Banner-Image.jfif" alt="HireCraft-Banner-Image" width="100%" />
</div>

<div align="center">

# HireCraft: Targeted Interview Intelligence & Career Strategy Platform

> An intelligent, AI-driven career acceleration platform that evaluates candidate resumes against target job descriptions, produces role-specific technical and behavioral interview preparation roadmaps, calculates candidate-role match scores, identifies skill gaps, and compiles customized ATS-friendly PDF resumes.

[![React 19](https://img.shields.io/badge/React-19.x-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite 8](https://img.shields.io/badge/Vite-8.x-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express 5](https://img.shields.io/badge/Express-5.x-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![Google Gemini AI](https://img.shields.io/badge/Google_Gemini-3_Flash-4285F4?style=flat-square&logo=google&logoColor=white)](https://ai.google.dev/)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Puppeteer](https://img.shields.io/badge/Puppeteer-PDF_Engine-00D8A2?style=flat-square&logo=puppeteer&logoColor=black)](https://pptr.dev/)
[![SCSS 7-1](https://img.shields.io/badge/Sass-7--1_Pattern-CC6699?style=flat-square&logo=sass&logoColor=white)](https://sass-lang.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![UI Showcase](https://img.shields.io/badge/%F0%9F%8E%A8_UI_Showcase-Explore_Screenshots-2D3FE0?style=flat-square)](UI-SHOWCASE.md)

</div>

---

## Table of Contents

- [HireCraft: Targeted Interview Intelligence \& Career Strategy Platform](#hirecraft-targeted-interview-intelligence--career-strategy-platform)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Key Features](#key-features)
  - [System Architecture](#system-architecture)
  - [Full-Stack Technologies](#full-stack-technologies)
  - [SCSS Architecture (7-1 Pattern)](#scss-architecture-7-1-pattern)
  - [API Reference](#api-reference)
    - [Authentication Endpoints (`/api/auth`)](#authentication-endpoints-apiauth)
    - [Interview Intelligence Endpoints (`/api/interview`)](#interview-intelligence-endpoints-apiinterview)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [1. Environment Setup](#1-environment-setup)
    - [2. Installation \& Running](#2-installation--running)
      - [Start Backend](#start-backend)
      - [Start Frontend](#start-frontend)
    - [3. Running Tests and Production Builds](#3-running-tests-and-production-builds)
      - [Backend Test Suite](#backend-test-suite)
      - [Frontend Production Build](#frontend-production-build)
  - [License](#license)

---

## Overview

**HireCraft** transforms the interview preparation journey by replacing generic question lists with tailored role intelligence. By parsing candidate resumes in-memory against specific job descriptions, HireCraft applies structured AI analysis via Google Gemini to generate:
- **Calibrated Technical Questions**: With interviewer rationale and comprehensive model answers.
- **STAR-Method Behavioral Scenarios**: Focusing on real-world system resilience and leadership signals.
- **5-Day Actionable Preparation Syllabus**: Breaking down topics from core architecture to simulation.
- **Candidate-Job Match Percentage & Ranked Skill Gaps**: Visualizing role readiness with semantic gap categorization.
- **ATS-Optimized PDF Resume Generator**: Compiling tailored resumes formatted cleanly for automated screening and human recruiters.

---

## Key Features

- **In-Memory Resume Ingestion**: Secure 3MB capped PDF parsing with zero disk residue using `pdf-parse` and Multer memory storage.
- **Multi-Model Google Gemini Fallback Engine**: Native OpenAPI Type schema enforcement with automated fallback between `gemini-3-flash-preview` and `gemini-flash-lite-latest`.
- **Non-Generic Multi-Stage Generation State**: Eliminates generic spinners in favor of rotating progress stages ("Reading job description", "Mapping profile", "Drafting questions", "Calibrating preparation roadmap") with hairline sweep animations.
- **Light Editorial Studio Aesthetic**: Warm tactile paper canvas (`#F6F2EA`), crisp ink typography, Fraunces serif display, Manrope interface grotesk, and focused cobalt (`#2D3FE0`) actions.
- **Server-Side Headless PDF Engine**: Puppeteer-driven rendering of ATS-friendly A4 PDF resumes with exact typography and page-break controls.
- **Strict JWT Token Blacklisting**: Secure authentication with 24-hour TTL MongoDB index for invalidated session tokens upon logout.

---


## System Architecture

```mermaid
flowchart TD
    Client["Client Browser (React 19 + Vite 8)"]

    subgraph Backend_App ["Express.js API (:3000)"]
        direction TB
        AuthRouter["/api/auth (Login / Register / Logout / Get-Me)"]
        InterviewRouter["/api/interview (Report Generation / History / PDF)"]
        Multer["Multer (In-Memory 3MB Cap)"]
        PDFExtract["pdf-parse (Raw Text Extraction)"]
        AIService["AI Service (Google GenAI)"]
        PuppeteerEngine["Puppeteer (Headless Chrome PDF Engine)"]
    end

    subgraph Storage ["Persistent Database"]
        MongoDB[("MongoDB Atlas")]
    end

    subgraph Google_AI ["Google Gemini AI"]
        Gemini3Flash["gemini-3-flash-preview"]
        GeminiFlashLite["gemini-flash-lite-latest"]
        GeminiFallback["Automated Multi-Model Fallback Engine"]
    end

    Client -->|HTTP/Cookies| AuthRouter
    Client -->|Multipart/Form-Data| Multer
    Multer --> InterviewRouter
    InterviewRouter --> PDFExtract
    PDFExtract --> AIService
    AIService --> GeminiFallback
    GeminiFallback --> Gemini3Flash
    GeminiFallback --> GeminiFlashLite
    InterviewRouter --> MongoDB
    InterviewRouter --> PuppeteerEngine
    PuppeteerEngine -->|A4 ATS PDF Blob| Client
```

---

## Full-Stack Technologies

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Frontend** | React 19, React Router 7, Vite 8, Sass (SCSS) | Light Editorial Studio aesthetic, 7-1 SCSS architecture, zero inline styles, fluid clamp type scale |
| **Backend** | Node.js 20+, Express 5, Mongoose 9 | RESTful API, in-memory PDF parsing, JWT authentication with token blacklist |
| **AI Engine** | Google GenAI SDK (`@google/genai`) | Native OpenAPI Type schema enforcement with automated multi-model fallback |
| **PDF Generation** | Puppeteer and Headless Chrome | Server-side compilation of semantic HTML into ATS-friendly A4 PDF resumes |
| **Database** | MongoDB Atlas | User credentials, TTL token blacklist index (24h), and persistent interview reports |

---

## SCSS Architecture (7-1 Pattern)

The stylesheet structure strictly complies with the classic 7-1 pattern without CSS modules or utility frameworks:

```
Frontend/src/styles/
├── main.scss                # Global entry point (@use only)
├── abstracts/
│   ├── _index.scss          # @forward all abstracts
│   ├── _tokens.scss         # Paper, ink, cobalt, terracotta, sage tokens & CSS vars
│   ├── _typography.scss     # Fraunces, Manrope, JetBrains Mono, clamp type scale
│   ├── _motion.scss         # Mechanical easings, durations, reduced-motion mixin
│   ├── _mixins.scss         # Elevation, focus ring, hairline rule, grain, breakpoints
│   └── _functions.scss      # Space and rem calculation helpers
├── base/
│   ├── _reset.scss          # Box-sizing, margin and padding reset
│   └── _base.scss           # Paper canvas, selection, custom scrollbar styling
├── layout/
│   ├── _grid.scss           # Asymmetric split auth, 3-column workspace grid
│   ├── _navigation.scss     # Sticky navigation, header pills, dashboard return
│   └── _rail.scss           # Right rail: score arc and skill gaps container
├── components/
│   ├── _buttons.scss        # Primary cobalt button, secondary tactile outline button
│   ├── _inputs.scss         # Textareas, dropzone (drag-over, success), text inputs
│   ├── _cards.scss          # Paper cards, accordion question cards, timeline
│   ├── _badges.scss         # Sage, butter, terracotta semantic tags
│   ├── _score.scss          # Match score ring and Fraunces numerals
│   └── _loader.scss         # Multi-stage generation loader with hairline sweep
└── pages/
    ├── _auth.scss           # Login and Register asymmetric split styling
    ├── _home.scss           # Workspace hero, dual-panel inputs, history grid
    ├── _landing.scss        # Landing hero, workflow, feature cards, and footer
    └── _interview.scss      # Questions, roadmap timeline, report layout
```

---

## API Reference

### Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Description | Request Body |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new user account | `{ username, email, password }` |
| `POST` | `/api/auth/login` | Authenticate existing user | `{ email, password }` |
| `GET` | `/api/auth/logout` | Invalidate token and blacklist | *(Bearer Token)* |
| `GET` | `/api/auth/get-me` | Retrieve authenticated user profile | *(Bearer Token)* |

### Interview Intelligence Endpoints (`/api/interview`)

| Method | Endpoint | Description | Request Format |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/interview/generate` | Generate interview report & roadmap | `multipart/form-data` (`resume` PDF, `jobDescription`) |
| `GET` | `/api/interview/history` | Retrieve user's historical reports | *(Bearer Token)* |
| `GET` | `/api/interview/:id` | Fetch specific report details | *(Bearer Token)* |
| `POST` | `/api/interview/generate-pdf`| Compile ATS-friendly A4 resume PDF | `{ reportId }` |

---

## Getting Started

### Prerequisites
- **Node.js** >= 18.x installed (Node.js 20+ recommended)
- **MongoDB** instance running locally or on [MongoDB Atlas](https://www.mongodb.com/atlas)
- **Google Gemini API Key** from [Google AI Studio](https://aistudio.google.com/)

---

### 1. Environment Setup

Inside `Backend/.env`:
```env
PORT=3000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/interview-master
JWT_SECRET=your_jwt_super_secret_key_here
GOOGLE_GENAI_API_KEY=your_google_gemini_api_key_here
```

---

### 2. Installation & Running

#### Start Backend
```bash
cd Backend
npm install
npm run dev
# Server runs on http://localhost:3000
```

#### Start Frontend
```bash
cd Frontend
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

---

### 3. Running Tests and Production Builds

#### Backend Test Suite
```bash
npm test --prefix Backend
```
*Validates JWT auth middleware, login/registration controllers, token blacklist TTL, multer file caps, and Mongoose schema constraints.*

#### Frontend Production Build
```bash
npm run build --prefix Frontend
```
*Compiles the modular SCSS and React 19 application without errors or warnings.*

---

## License

Distributed under the MIT License. See `LICENSE` for more information.
