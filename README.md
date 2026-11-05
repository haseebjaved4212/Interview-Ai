# Interview AI: Career Preparation and Strategy Platform

> An intelligent, AI-driven career acceleration platform that evaluates candidate resumes against target job descriptions, produces role-specific technical and behavioral interview preparation roadmaps, calculates candidate-role match scores, identifies skill gaps, and compiles customized ATS-friendly PDF resumes.

---

## Visual Showcase: Light Editorial Studio

Designed with a calm, tactile, publication-grade **Light Editorial Studio** aesthetic. Built upon warm paper surfaces (`#F6F2EA`), crisp ink typography, Fraunces display serif, Manrope interface grotesk, and focused cobalt (`#2D3FE0`) actions.

### 1. Asymmetric Authentication Split

| Desktop View (1440×900) | Mobile View (390×844) |
| :---: | :---: |
| ![User Registration Desktop](docs/screenshots/01_desktop_register.png) | ![User Registration Mobile](docs/screenshots/01_mobile_register.png) |
| *Editorial brand statement panel alongside responsive form controls with visible focus states and WCAG AA contrast.* | *Fluid single-column stack with generous touch targets and tactile hairline dividers.* |

| User Login (Desktop) | User Login (Mobile) |
| :---: | :---: |
| ![User Login Desktop](docs/screenshots/02_desktop_login.png) | ![User Login Mobile](docs/screenshots/02_mobile_login.png) |
| *Tactile paper card surface with warm terracotta error alerts and custom focus rings.* | *Clean mobile form view with instant link to registration.* |

---

### 2. Considered Workspace and Multi-Stage Generation

| Clean Workspace Hero | Form Inputs Filled |
| :---: | :---: |
| ![Workspace Desktop](docs/screenshots/03_desktop_home.png) | ![Workspace Filled](docs/screenshots/04_desktop_home_filled.png) |
| *Fraunces display typography, tactile resume dropzone with hover and success states, and live character counter.* | *Focused textarea inputs with cobalt glow-free focus borders and focal generation CTA button.* |

#### Multi-Stage Generation State (No Generic Spinner)
![Generation Loader](docs/screenshots/05_desktop_loading_stage.png)
*Real-time rotating progress stages ("Reading the job description", "Mapping your profile", "Drafting questions", "Calibrating preparation roadmap") with hairline sweep animation.*

---

### 3. Interview Strategy Intelligence: 3-Column Report View

#### Technical Questions Intelligence
| Desktop View (1440×900) | Mobile View (390×844) |
| :---: | :---: |
| ![Technical Questions Desktop](docs/screenshots/06_desktop_report_technical.png) | ![Technical Questions Mobile](docs/screenshots/06_mobile_report_technical.png) |
| *Collapsible accordion cards with typographic numbering (Q1, Q2), interviewer intention rationale, and model answers.* | *Sticky navigation bar with horizontal section tabs and responsive content stack.* |

#### Behavioral Questions and Preparation Roadmap
| Behavioral Questions Intelligence | Structured 5-Day Roadmap Timeline |
| :---: | :---: |
| ![Behavioral Questions Desktop](docs/screenshots/07_desktop_report_behavioral.png) | ![Roadmap Timeline Desktop](docs/screenshots/08_desktop_report_roadmap.png) |
| *STAR-method behavioral inquiries tailored to leadership signals and real-world system resilience.* | *Refined timeline with hairline rules, delicate ring nodes, and day-by-day actionable syllabus.* |

#### Match Score and Skill Gaps Hero Moment
![Sidebar Close-up](docs/screenshots/09_sidebar_score_gaps.png)
*Hero match score moment with large Fraunces numerals, refined circular arc, and ranked skill gap cards categorized by semantic severity.*

---

### 4. Saved Reports History
![Recent Reports Grid](docs/screenshots/10_desktop_home_recent_reports.png)
*Persistent historical grid allowing candidates to review previous custom interview strategies anytime.*

---

## Architecture and Tech Stack

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

### Full-Stack Technologies

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Frontend** | React 19, React Router 8, Vite 8, Sass (SCSS) | Light Editorial Studio aesthetic, 7-1 SCSS architecture, zero inline styles, fluid clamp type scale |
| **Backend** | Node.js 20+, Express 5, Mongoose 9 | RESTful API, in-memory PDF parsing, JWT authentication with token blacklist |
| **AI Engine** | Google GenAI SDK (`@google/genai`) | Native OpenAPI Type schema enforcement with automated multi-model fallback |
| **PDF Generation** | Puppeteer and Headless Chrome | Server-side compilation of semantic HTML into ATS-friendly A4 PDF resumes |
| **Database** | MongoDB Atlas | User credentials, TTL token blacklist index (24h), and persistent interview reports |

---

## SCSS Architecture (7-1 Pattern)

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
│   ├── _navigation.scss     # Sticky left rail, section pills, dashboard back button
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
    └── _interview.scss      # Questions, roadmap timeline, report layout
```

---

## Getting Started

### Prerequisites
- **Node.js** >= 18.x installed
- **MongoDB** instance running locally or on MongoDB Atlas
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

### 2. Installation and Running

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

### 3. Running Automated Tests and Builds

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

Distributed under the MIT License.
