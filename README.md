# Setu AI Opportunity Bridge 🌉

**AI-powered bridge between Bharat and the right opportunity.**

Setu ("सेतु" meaning *bridge*) is an inclusive, multilingual platform that matches Indian job seekers, students, and workers with **jobs, internships, scholarships, government schemes, skilling courses, and gig work** — powered by AI, available in **English and हिंदी**, installable as a **phone app (PWA)**, and tuned for Bharat.

![Setu AI](public/icon.svg)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsauravprivatelimited369-byte%2FSetu-AI-Opportunity-Bridge&project-name=setu-ai-opportunity-bridge&repository-name=Setu-AI-Opportunity-Bridge)
[![CI](https://github.com/sauravprivatelimited369-byte/Setu-AI-Opportunity-Bridge/actions/workflows/ci.yml/badge.svg)](https://github.com/sauravprivatelimited369-byte/Setu-AI-Opportunity-Bridge/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## 🚀 Live website + phone app

- **Deploy in 1 click**: Click the **Deploy with Vercel** button above. It will ask you to sign in with GitHub, then Vercel builds and hosts your site for free on a public URL like `https://setu-ai-opportunity-bridge.vercel.app`.
- **Install as a phone/desktop app**: Open your deployed URL in Chrome/Safari/Edge, tap the **"Install App"** button in the top nav (or the banner that appears on mobile). Setu installs to your home screen, runs full-screen like a native app, and works offline.
- See [DEPLOY.md](DEPLOY.md) for the one-line Git Bash command to deploy from your terminal.

## ✨ Features

### 🧠 Intelligent opportunity matching
- Skill-aware **fit scoring (0-100%)** with match reasons & skill-gap analysis
- Weights: skills (50), location (20), experience (15), work mode (10), type preference (20), freshness
- Skill-gap suggestions with one-click link to free skilling courses
- **Personalised AI feedback** when you apply to any opportunity

### 🏠 Personal dashboard (`/dashboard`)
- Profile-completeness progress bar with nudges
- Stat cards: high-match opportunities, applications, saved, total opportunities
- Top 3 matches with scores, trending skills in your matches, recent applications
- Quick action card to open Setu Mitra chat

### 💼 Applications tracker (`/applications`)
- Tabbed by status: All / Applied / Under review / Shortlisted / Rejected
- Shows match score + AI feedback per application
- Application date and role details

### 🔖 Saved opportunities (`/saved`)
- Bookmark opportunities for later, remove in one click

### 🗂️ Opportunity browser (`/opportunities`)
- Filter by type (Job / Internship / Scholarship / Scheme / Skilling / Gig)
- Filter by work mode (Remote / Hybrid / On-site)
- Full-text search across role, company, skills, city

### 📄 Opportunity detail pages
- Full description, requirements, eligibility, stipend/salary, required skills
- Visual match-score progress bar with reasons & skills to build
- **Eligibility checker** for schemes/scholarships/skilling (PMKVY, MUDRA, SVANidhi, etc.) with per-rule pass/fail and disclaimers
- One-click apply with AI-generated personalised feedback
- Apply-on-official-site link & contact email when available

### 👤 Seeker profile (`/profile`)
- Name, email, phone, location, current role, experience, education
- Skills, languages, bio, preferred opportunity types
- Profile-completeness metric
- Reset demo data button

### 💬 Setu Mitra — bilingual AI chat (`/chat`)
- Rule-based assistant that understands English, हिंदी, and Hinglish
- Intent detection for jobs, internships, scholarships, schemes, skilling, gigs
- Skill/location/type extraction (e.g. "remote React jobs in Bengaluru")
- Smart suggestion chips
- Typing indicator and chat history persisted per session
- Easily swapped for a real LLM later (single-file assistant module)

### 🌐 Accessibility & UX essentials
- 🔁 **Full English ↔ हिंदी toggle** (navbar, persisted in localStorage)
- 🇮🇳 Hindi translations for all seeded content + UI strings
- 📱 **Mobile-responsive** (bottom nav on small screens)
- ⌨️ Loading skeletons and toast feedback
- 🎨 Custom branded favicon + SVG icon, PWA manifest, sitemap, robots.txt
- 🔍 SEO metadata (OpenGraph, Twitter, keywords in EN+HI)
- 🚫 Custom 404 page
- ♿ Accessible contrast, focus rings, semantic HTML
- ⚡ Builds cleanly with TypeScript strict mode (no `any` leaks)

## 🧱 Tech Stack

- **Next.js 16 (App Router) + React 19 + TypeScript**
- **Tailwind CSS v4**
- **Lucide icons**
- Lightweight **JSON-file persistence** (zero external DB setup; drops into `prisma/postgres` later)
- No API keys required — AI matching & chat run via deterministic on-device rule engine (easy to replace with a real LLM)

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

First run creates `.data/db.json` seeded with:
- A demo profile (Aarav Sharma, React dev in Bengaluru)
- ~16 realistic India-focused opportunities across jobs, internships, scholarships, schemes, skilling & gig work

Use **Reset demo data** on the Profile page to re-seed.

## 🗂️ Project Structure

```
src/
├── app/
│   ├── page.tsx                     # Marketing landing + top matches preview
│   ├── dashboard/                   # Personal dashboard
│   ├── opportunities/               # Browse + [id] detail (with eligibility check)
│   ├── matches/                     # AI-ranked matches
│   ├── applications/                # Applications tracker
│   ├── saved/                       # Saved/bookmarked
│   ├── profile/                     # Seeker profile editor
│   ├── chat/                        # Setu Mitra chat
│   ├── not-found.tsx                # Custom 404
│   ├── manifest.ts / sitemap.ts     # PWA manifest & sitemap
│   └── api/
│       ├── opportunities/           # List + detail
│       ├── matches                  # AI ranked matches
│       ├── apply                    # Apply with AI feedback
│       ├── save / saved             # Bookmark ops
│       ├── applications             # List applications
│       ├── dashboard                # Dashboard aggregation
│       ├── profile                  # GET/POST profile
│       ├── chat                     # Setu Mitra assistant
│       └── reset                    # Demo data reset
├── components/
│   ├── AppShell.tsx                 # Navbar + footer + language toggle
│   ├── OpportunityCard.tsx
│   └── StatCard.tsx
├── context/LangContext.tsx          # EN/हिंदी state
├── lib/
│   ├── db.ts                        # JSON-file data layer (easy to swap for Prisma)
│   ├── matching.ts                  # AI scoring + feedback
│   ├── eligibility.ts               # Scheme/scholarship eligibility checker
│   ├── assistant.ts                 # Bilingual rule-based chat (swap for LLM here)
│   ├── i18n.ts                      # Translation strings + localized field picker
│   └── types.ts
└── data/opportunities.ts            # Seed content (Indian jobs, schemes, courses, scholarships)
```

## 🔌 Going to Production

The architecture cleanly separates concerns so you can drop in real services without rewriting the UI:

1. **Database** — Replace `src/lib/db.ts` with Prisma (Postgres) or your backend API. Models are already typed.
2. **Real AI** — Swap `matching.ts → generateAiFeedback` and `assistant.ts → chatReply` with calls to any LLM (OpenAI, Sarvam, an Indian open-source model, etc.). Keep the same return shape and all UI keeps working.
3. **Live feeds** — Replace `data/opportunities.ts` with scrapers/APIs for:
   - National Career Service (NCS)
   - State employment exchanges
   - National Scholarship Portal
   - MyScheme / India.gov.in
   - Job boards (Naukri, Indeed, Apna, WorkIndia)
   - Partner employer APIs
4. **Auth** — Phone OTP (Twilio/Gupshup), DigiLocker, Aadhaar eKYC where permissible.
5. **Languages** — Extend `lib/i18n.ts` to 12 Indian languages and add ASR/TTS for voice-first users.
6. **Accessibility** – Add TTS/read-aloud, screen-reader optimizations, simple UI mode.
7. **Payments/claims** – For schemes, track document upload and application status via official portals.

## 💡 Why "Setu"?

India has hundreds of active government schemes, thousands of employers, and growing skilling programs — but discovering *which ones you actually qualify for* is often the hardest part. Setu aims to be that bridge: a single multilingual AI assistant that removes information asymmetry and points every seeker — from an IT fresher in Bengaluru to a street vendor in Lucknow to a class-9 student in Patna — to the opportunity that fits them best.

## 📜 License

MIT License. See [LICENSE](LICENSE).

---

*Demo MVP. Data is illustrative; AI logic is deterministic for the demo.*
