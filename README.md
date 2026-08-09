# Modern Software Engineer Portfolio & Targeted CV Platform

A high-performance, responsive, and bilingual (English / French) Developer Portfolio and Targeted Interactive CV Application built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**. 

> ⚡ **Powered by [Stitch](https://stitch.withgoogle.com/) and [Google AI Studio](https://aistudio.google.com/)**

Designed specifically for senior software engineers, technical architects, and consultants to highlight multi-disciplinary engineering expertise (Backend, Frontend, QA Testing, Fullstack, and Systems/Infrastructure) with dynamic service-based profile filtering, PDF export support, and rich project showcases.

---

## 🌟 Key Features

- **📄 Default Curriculum Vitae Landing Page**: The default home page (`/`) loads the **Curriculum Vitae** section directly with the navigation label **'Curriculum Vitae'**.
- **🎯 Interactive Service-Targeted CV Filtering**: Instantly filter work experiences, skills, projects, education, and certifications based on specific client service requirements:
  - Backend Engineering (.NET / Java Spring Boot)
  - Frontend Engineering (Angular / React)
  - QA Testing & Quality Assurance
  - Fullstack Engineering
  - System & Infrastructure Management
- **🌐 Bilingual i18n Support**: Full English (`en`) and French (`fr`) translation toggling across all pages and navigation menus.
- **📄 Print & PDF Export Optimized**: Professional CSS print stylesheets formatted for direct browser printing or saving as a clean PDF resume.
- **🛠️ Interactive Tech Stack Grid**: Filterable skills matrix categorized by Backend, Frontend, QA, and Infrastructure, with search and proficiency tags.
- **🚀 Featured Deliverables & Project Showcase**: Portfolio projects linked to specific services with GitHub repository links and technology badges.
- **📱 Fully Responsive & Accessible UI**: Desktop-first and mobile-friendly design with clean Material & Tailwind ergonomics.
- **✉️ Contact & Service Request Form**: Integrated contact form for prospective employers and freelance clients.

---

## 🤖 Platform Credits

This application was created and powered using **Stitch** and **Google AI Studio**.
- **Stitch**: Design system and UI component generation.
- **Google AI Studio**: Full-stack application generation, routing, and developer workflow automation.

---

## 🛠️ Tech Stack

- **Framework**: [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Routing**: [React Router v6](https://reactrouter.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Quick Start & Local Development

### Prerequisites

Ensure you have **Node.js 18+** and **npm** installed on your system.

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/your-portfolio-repo.git
   cd your-portfolio-repo
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:3000` (or `http://localhost:5173`).

4. **Build for production**:
   ```bash
   npm run build
   ```
   The compiled output will be generated in the `dist/` folder.

5. **Preview the production build**:
   ```bash
   npm run preview
   ```

---

## 🎨 How to Customize for Your Own Portfolio

This application is completely **data-driven** and decoupled from hardcoded text. You can easily adapt it to render your own personal portfolio and CV in minutes.

### 1. Update Profile & Career Data (`src/data/portfolioData.json`)

All portfolio content is central in `src/data/portfolioData.json`. Modify the JSON fields:

- **`engineer`**: Update your name, title, email, phone, location, avatar URL, bio, and social links (GitHub, LinkedIn, StackOverflow).
- **`services`**: Define the specific technical roles or freelance services you offer. Each service has an `id` (e.g., `backend-engineer`, `frontend-engineer`).
- **`experiences`**: List your employment history. Set `linkedServices: ["backend-engineer", ...]` to associate specific roles with service filters.
- **`skillCategories`**: Define skill groups (Backend, Frontend, QA, DevOps) and link skills to services.
- **`projects`**: Showcase your key achievements, deliverables, demo links, and source code.
- **`education` & `certifications`**: Update degrees, certifications, credential IDs, and badge icons.

### 2. Update Translations (`src/data/translations/en.json` & `fr.json`)

If you want to adjust UI labels, navigation buttons, or headings:
- Edit `src/data/translations/en.json` for English strings.
- Edit `src/data/translations/fr.json` for French strings.

### 3. Replace Profile Avatar & Images

- Update the `avatarUrl` property in `src/data/portfolioData.json` with an absolute URL or local image placed inside the `/public` directory (e.g., `/my-photo.jpg`).

---

## 🌐 Deploying to Vercel or Netlify

### Deploying to Vercel

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```
2. Log in to [Vercel](https://vercel.com/) and click **"New Project"**.
3. Import your GitHub repository.
4. **Build Settings** (detected automatically):
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **Deploy**.

> **Note**: A pre-configured `vercel.json` file is included in the project root to handle SPA client routing on page refreshes.

---

### Deploying to Netlify

1. Log in to [Netlify](https://www.netlify.com/) and click **"Add new site" > "Import an existing project"**.
2. Connect your GitHub account and select your portfolio repository.
3. **Build Settings**:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
4. Click **Deploy site**.

> **Note**: A pre-configured `public/_redirects` file (`/* /index.html 200`) is included to prevent 404 errors when navigating directly to routes like `/cv` or `/contact`.

---

## 📜 License

This project is licensed under the [MIT License](LICENSE) — feel free to customize and use it for your own portfolio!
