# Modern Senior Software Engineer Portfolio & Targeted CV Platform

A high-performance, full-stack, and bilingual (**English / French**) Developer Portfolio and Targeted Interactive CV Application built with **React 18**, **TypeScript**, **Express.js**, **Vite**, and **Tailwind CSS**.

Designed specifically for senior software engineers, technical architects, and tech consultants to showcase multi-disciplinary engineering expertise (Backend, Frontend, QA Testing, Fullstack, and Systems/Infrastructure) with dynamic service-based profile filtering, verified email contact workflows, PDF export capabilities, technical blog publishing, and extensive unit & integration test coverage.

---

## 🏛️ System Architecture

The application is structured as a single-repository full-stack system combining a client SPA with an Express.js backend API proxy.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            Browser Client (React SPA)                       │
│  ┌─────────────┐  ┌─────────────┐  ┌───────────────┐  ┌──────────────────┐  │
│  │   CV Page   │  │  Services   │  │ Projects/Blog │  │   Contact Page   │  │
│  └──────┬──────┘  └──────┬──────┘  └──────┬────────┘  └────────┬─────────┘  │
│         │                │                │                    │            │
│         └────────────────┴───────┬────────┴────────────────────┘            │
│                                  │                                          │
│                         ┌────────┴────────┐                                 │
│                         │ Language Context│ (i18n EN / FR)                  │
│                         └────────┬────────┘                                 │
│                                  │                                          │
│                         ┌────────┴────────┐                                 │
│                         │ Service Layers  │ (portfolioService / blogService)│
│                         └────────┬────────┘                                 │
└──────────────────────────────────┼──────────────────────────────────────────┘
                                   │ HTTP API Requests
┌──────────────────────────────────▼──────────────────────────────────────────┐
│                            Express.js Server (/server.ts)                   │
│  ┌───────────────────────────┐         ┌─────────────────────────────────┐  │
│  │  /api/contact/send-otp    │         │  /api/contact/verify-otp        │  │
│  └─────────────┬─────────────┘         └────────────────┬────────────────┘  │
│                │                                        │                   │
│                └───────────────────┬────────────────────┘                   │
│                                    │                                        │
│                         ┌──────────▼──────────┐                             │
│                         │ Server-Side EmailJS │ (With Simulated Fallback)   │
│                         └─────────────────────┘                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1. Frontend Architecture
- **Framework & Runtime**: Built with **React 18** and **TypeScript** using modern functional component patterns without legacy `React.FC` type wrappers, enforcing explicit `children` prop interfaces where appropriate.
- **Client Routing**: Managed by **React Router v6** with SPA fallback handlers (`vercel.json` and Netlify `_redirects`).
- **Styling & UI Ergonomics**: Styled using **Tailwind CSS** with Material-inspired surfaces, subtle border variants, high-contrast dark/light elements, and mobile-first responsive layouts. Icons are powered by **Lucide React**.
- **State & i18n**: Global language preference is managed via React Context (`LanguageContext`), auto-detecting browser preferences, saving to `localStorage`, and providing typed translation lookups (`en` & `fr`).

### 2. Backend & API Proxy Architecture
- **Express Server**: An **Express.js** server (`server.ts`) operating on port `3000`.
- **Vite Middleware Integration**: In development mode, Vite runs as Express middleware (`createViteServer`), enabling rapid Hot Reloading while allowing full Express API route execution. In production, Express serves compiled static assets from `dist/`.
- **Transactional Email Engine**: Utilizes the **EmailJS REST API** server-side for sending verification OTP codes and forwarding client contact inquiries securely without exposing keys to the client browser.
- **Graceful Fallback Mode**: If `EMAILJS_SERVICE_ID` is missing or unconfigured, the backend automatically transitions to a simulated fallback mode, returning generated OTP codes directly to the frontend so contact testing can proceed uninterrupted.

### 3. Data Abstraction Layer
- **Decoupled JSON Repositories**: All profile content, work history, skill taxonomy, projects, and blog posts reside in structured JSON files (`src/data/portfolioData.json`, `src/data/blogPosts.json`, `src/data/servicesData.json`).
- **Typed Services**: Data access is sanitized and filtered through typed service abstractions (`portfolioService.ts`, `blogService.ts`).

### 4. Quality Assurance & Test Architecture
- **Test Runner**: Powered by **Vitest** with JSDOM environment and **Testing Library**.
- **Coverage**: Comprehensive test suite covering component rendering, user interactions, service logic, context providers, and page integration tests.

---

## 🌟 Comprehensive Functional Details

### 1. Interactive Service-Targeted CV Engine (`/`)
- **Default Landing Experience**: Loads directly onto the targeted Curriculum Vitae view.
- **Role & Specialty Filtering**: Users can filter the entire CV by target technical domain:
  - Backend Engineering (.NET / Java Spring Boot)
  - Frontend Engineering (Angular / React)
  - QA Testing & Automation
  - Fullstack Engineering
  - System & Infrastructure Management
- **Dynamic Content Adaptation**: Automatically updates work experiences, tech stack proficiency chips, linked projects, education, and certifications based on the active service selection.
- **Interactive Tech Stack Grid**: Filterable skills matrix categorized by Backend, Frontend, QA, and Infrastructure with real-time text search.

### 2. PDF & Print Export Engine
- **Custom CV Export Modal**: Provides options to customize layout themes before exporting:
  - **Executive Theme**: Minimalist, high-contrast layout suitable for senior leadership roles.
  - **Modern Theme**: Styled with modern pill badges and accent borders.
  - **Classic Theme**: Traditional structured resume layout.
- **Browser Print Optimization**: Includes dedicated `@media print` CSS rules ensuring high-density, multi-page printable layouts without UI distraction elements.

### 3. Engineer Overview & Quick Modal
- Accessible via the "Engineer Overview" button in the global navigation header.
- Displays high-level engineer bio, core tech stack highlights, current timezone status, and direct navigation actions.

### 4. Services & Consulting Offerings (`/services`)
- Outlines technical services provided by the consultant (Architectural Audits, Fullstack Development, Test Automation Setup, DevOps Pipeline Configuration).
- Features direct "View Targeted CV" links that navigate straight to the CV page pre-filtered to the relevant service domain.

### 5. Featured Deliverables & Project Showcase (`/projects`)
- Filterable portfolio gallery showcasing real-world projects, architectural achievements, client impact metrics, tech stack badges, GitHub repository links, and live demo buttons.

### 6. Engineering Blog Engine (`/blog` & `/blog/:slug`)
- Technical articles and case studies with estimated reading times, publication dates, category tags, and responsive reading layouts.

### 7. Verified Contact & OTP Workflow (`/contact`)
- **Two-Step Email Verification**: Users request a 6-digit OTP sent to their email address prior to submitting contact inquiries.
- **Backend Verification**: Validates OTP and processes contact submissions through the Express `/api/contact` endpoints.
- **Simulated Development Mode**: Displays warning notices and simulated codes when running without production email keys.

---

## 📁 Directory Structure

```
.
├── server.ts                    # Express.js backend server with Server-Side EmailJS & Vite middleware
├── src/
│   ├── App.tsx                  # Main React Router setup and layout layout frame
│   ├── main.tsx                 # Client entry point
│   ├── types.ts                 # Central TypeScript interfaces & types
│   ├── components/              # Shared UI components
│   │   ├── Header.tsx           # Responsive navigation header with i18n & profile modal trigger
│   │   ├── Footer.tsx           # Page footer with quick links
│   │   ├── EngineerOverviewModal.tsx # Technical profile overview modal
│   │   └── cv/                  # CV specific components
│   │       ├── CVSidebar.tsx    # Left panel with profile info & service selection
│   │       ├── CVRoleIntroBlock.tsx # Intro summary & active service badge
│   │       ├── CVTechStackBlock.tsx # Interactive skill matrix & search
│   │       ├── CVExperienceBlock.tsx # Work experience list with service filtering
│   │       ├── CVExperienceItem.tsx  # Individual experience card
│   │       ├── CVProjectsBlock.tsx   # Linked projects section
│   │       ├── CVProjectItem.tsx    # Project card with tech tags
│   │       ├── CVTrainingBlock.tsx   # Training & education block
│   │       ├── CVCertificationsBlock.tsx # Professional certifications list
│   │       ├── CVLanguagesHobbiesBlock.tsx # Languages & interests
│   │       └── CVPdfExportModal.tsx # PDF export preview & print modal
│   ├── context/
│   │   └── LanguageContext.tsx  # Bilingual i18n context provider (EN/FR)
│   ├── data/
│   │   ├── portfolioData.json   # Primary CV & portfolio data store
│   │   ├── blogPosts.json       # Blog articles data
│   │   ├── servicesData.json    # Services catalog data
│   │   └── translations/        # Translation files (en.json, fr.json)
│   ├── pages/
│   │   ├── CVPage.tsx           # Primary Curriculum Vitae page
│   │   ├── ServicesPage.tsx     # Consulting services page
│   │   ├── ProjectsPage.tsx     # Portfolio deliverables page
│   │   ├── ContactPage.tsx      # Contact form with OTP verification
│   │   └── blog/
│   │       ├── BlogListPage.tsx # Blog articles index
│   │       └── BlogPostDetailPage.tsx # Article detail view
│   └── services/
│       ├── portfolioService.ts  # Service layer for CV & portfolio data
│       └── blogService.ts       # Service layer for blog articles
├── test/                        # Vitest test suite
│   ├── setup.ts                 # Test environment setup
│   ├── components/              # Component tests
│   ├── context/                 # LanguageContext tests
│   ├── pages/                   # Page integration tests
│   └── services/                # Service unit tests
└── package.json                 # Project dependencies and scripts
```

---

## 🛠️ Tech Stack Summary

- **Frontend**: [React 18](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [React Router v6](https://reactrouter.com/)
- **Backend Server**: [Express.js](https://expressjs.com/), [EmailJS REST API](https://www.emailjs.com/)
- **Build System**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/), [Lucide React Icons](https://lucide.dev/)
- **Testing**: [Vitest](https://vitest.dev/), [React Testing Library](https://testing-library.com/)

---

## 🚀 Getting Started & Scripts

### Prerequisites
- **Node.js 18+**
- **npm**

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/your-portfolio-repo.git
cd your-portfolio-repo

# Install dependencies
npm install
```

### Development
```bash
# Start full-stack development server on port 3000
npm run dev
```

### Verification & Testing
```bash
# Run TypeScript linter
npm run lint

# Run Vitest test suite
npm run test
```

### Production Build
```bash
# Build client static assets and server bundle
npm run build

# Start production server
npm run start
```

---

## 🎨 Customizing & Adapting This Portfolio for Your Own Profile

If you want to use or fork this website for your own engineering portfolio, follow this step-by-step customization checklist:

### 1. Update HTML & Search Engine Metadata (`index.html`)
Since this is a client-side rendered (SPA) React application, search engines index the initial static metadata in `index.html`. You should customize the following in `index.html`:
- **Document Title**: Update `<title>` with your name and primary engineering titles.
- **SEO Title & Description**: Update `<meta name="title">`, `<meta name="description">`, and `<meta name="keywords">` (both generic and localized `lang="en"` / `lang="fr"` tags).
- **Social Media Cards**: Update Open Graph (`og:title`, `og:description`, `og:image`) and Twitter card (`twitter:title`, `twitter:description`, `twitter:image`) meta tags.
- **Profile Image Asset**: Replace or place your profile image in `public/assets/` (e.g., `public/assets/my_picture.jpg` or `public/avatar.jpg`).
- **Schema.org Structured Data**: Update the `<script type="application/ld+json">` block with your `Person` details:
  - `name`, `givenName`, `familyName`, `alternateName`
  - `jobTitle`, `description`, `email`, `telephone`, `address`
  - `sameAs` array (LinkedIn, GitHub, certification verification URLs)
  - `knowsAbout` array (your core skills and domain expertise)
  - `hasCredential` array (your verified degrees and certifications)

### 2. Update Portfolio & CV Data (`src/data/`)
All application content is driven by structured JSON files separated by language:
- **`src/data/portfolioData.json` (English) & `src/data/portfolioData_fr.json` (French)**:
  - `engineer`: Name, title, email, phone, location, bio introduction, social links, and current status.
  - `experiences`: Detailed work experience history with service tags (`Backend`, `Frontend`, `QA`, `Fullstack`, `Infrastructure`).
  - `skillCategories`: Categorized tech stack items, icons, and proficiency levels.
  - `education` & `certifications`: Degrees, schools, certification names, dates, and verification links.
  - `services`: Consulting and engineering service offerings with domain mappings.
  - `languages` & `hobbies`: Spoken languages and personal interests.
  - `projects`: Portfolio deliverables with descriptions, tech tags, GitHub repository URLs, and live demo links.
- **`src/data/blogData.json` (English) & `src/data/blogData_fr.json` (French)**:
  - Technical articles, tutorials, or case studies.
- **`src/data/translations/en.json` & `src/data/translations/fr.json`**:
  - Custom UI string phrasing for navigation, buttons, form placeholders, and section headers.

### 3. Configure Environment Variables & Email Integration (EmailJS)
To configure live contact form submissions with two-step OTP email verification without requiring a paid custom domain:
1. Create a free account at [EmailJS](https://www.emailjs.com/).
2. Connect your personal email (e.g. Gmail, Outlook) as an **Email Service** (e.g. `service_xxxxxxx`).
3. Create your email templates and copy your keys to `.env` (referencing `.env.example`):
   ```env
   EMAILJS_SERVICE_ID=service_your_id
   EMAILJS_TEMPLATE_ID=template_your_contact_template
   EMAILJS_OTP_TEMPLATE_ID=template_your_otp_template
   EMAILJS_PUBLIC_KEY=your_public_key
   EMAILJS_PRIVATE_KEY=your_private_key_optional
   RECIPIENT_EMAIL=mnchristelle@gmail.com
   ```
4. If no email keys are configured, the Express backend automatically runs in simulated sandbox mode, providing interactive OTP autofill codes directly in the verification dialog for seamless testing.

---

## 📜 License

Licensed under the [MIT License](LICENSE).
