# Pathway — MVP v0.1

> See where your first job can take you.

Pathway is an interactive, data-driven platform where users can explore career exits from specific companies — starting with Bain & Company consultants.

## 🎯 Overview

This MVP focuses exclusively on visualizing exits from **Bain & Company** to test product-market fit. The platform displays:

- Common exit industries
- Top exit companies
- Average tenure before exit
- Example career transitions (role-to-role)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## 🏗️ Tech Stack

- **Framework:** Next.js 14 (React)
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **Charts:** Recharts
- **Data:** Static JSON file (`data/bain_exits.json`)
- **Deployment:** Vercel (recommended)

## 📁 Project Structure

```
/pathsearch
  ├── /app
  │     ├── page.tsx              → main dashboard
  │     ├── layout.tsx            → site layout
  │     └── globals.css           → global styles
  │
  ├── /components
  │     ├── StatsCards.tsx        → shows avg tenure, most common industry
  │     ├── IndustryChart.tsx     → bar chart (Recharts)
  │     ├── ExitList.tsx          → top exit companies list
  │     └── ExampleExits.tsx      → example career transitions
  │
  ├── /data
  │     └── bain_exits.json       → mock data
  │
  ├── /types
  │     └── index.ts              → TypeScript interfaces
  │
  ├── package.json
  ├── tailwind.config.ts
  ├── next.config.js
  └── README.md
```

## 🧩 Components

### StatsCards
Displays three key metrics:
- Average years before exit
- Most common exit industry
- Percentage pursuing MBAs

### IndustryChart
Bar chart showing the distribution of exits by industry using Recharts.

### ExitList
Top 5 exit companies ranked by frequency, showing average tenure per company.

### ExampleExits
Scrollable list of anonymized career transition examples.

## 📊 Data Format

The mock data in `data/bain_exits.json` follows this structure:

```json
{
  "start_company": "Bain & Company",
  "start_role": "Associate Consultant",
  "exit_company": "Blackstone",
  "exit_role": "Private Equity Analyst",
  "industry": "Private Equity",
  "avg_years_before_exit": 2.5
}
```

## 🚀 Deployment to Vercel

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect Next.js and deploy

Your site will be live at `https://pathsearch.vercel.app` (or your custom domain).

## 🎨 UI Style Guide

- **Font:** Inter (via Next.js)
- **Colors:** Blue-gray palette (`bg-slate-50`, `text-slate-700`, `accent-blue-500`)
- **Cards:** Rounded corners (`rounded-2xl`), shadow (`shadow-md`), hover animations
- **Buttons:** Rounded, hover glow effect

## 📈 Success Metrics (MVP Goals)

- Page visits (test users): 100+
- Average session duration: > 1 min
- User feedback score: ≥ 80% positive
- LinkedIn engagement on demo post: ≥ 20 interactions

## 🗺️ Roadmap (Post-MVP)

1. Add McKinsey, BCG, Deloitte data
2. Add Reverse Search ("I want to go to VC → what are common feeder firms?")
3. Integrate with real data API (People Data Labs or Crunchbase)
4. Add school filter ("UCSB → Consulting → Tech transitions")
5. Create public API endpoint for "career mobility graph"

## 📝 License

MIT

## 🤝 Contributing

This is an MVP project. Feedback and contributions are welcome!

---

Built with ❤️ using Next.js, TailwindCSS, and Recharts.

