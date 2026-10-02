# 🚀 Deploy Setu AI — one command (Git Bash / Terminal)

This project is configured to deploy to **Vercel** for free in seconds. Vercel gives you:
- A real public `https://` URL (no localhost)
- Automatic HTTPS
- Automatic redeploys on every `git push` to `main`
- Global CDN

## Option A — 1-click (easiest, no terminal needed)

Just click this button in your browser and sign in with GitHub:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsauravprivatelimited369-byte%2FSetu-AI-Opportunity-Bridge&project-name=setu-ai-opportunity-bridge&repository-name=Setu-AI-Opportunity-Bridge)

That's it. You'll get a live URL like `https://setu-ai-opportunity-bridge.vercel.app`.

## Option B — Copy-paste into Git Bash (one command)

Open **Git Bash** (Windows) or **Terminal** (Mac/Linux), make sure you are inside this project folder (or anywhere — the script clones automatically if needed), and paste the entire block below. It will:

1. Install Vercel CLI
2. Log you in (opens browser once)
3. Deploy the site to production with a public URL
4. Print the URL

```bash
npx vercel --yes --prod
```

**When the browser asks to log in**, click "Continue with GitHub" and authorize Vercel. When you return to the terminal, press Enter to accept defaults. You'll get a live URL in ~30 seconds.

### After first deploy, auto-deploy on every push

In Git Bash (replace `YOUR_VERCEL_URL` with the URL you got, e.g. `setu-ai-opportunity-bridge.vercel.app`):

```bash
vercel link
```

That links the local folder to your Vercel project. After that, every time you run:

```bash
git add -A && git commit -m "update" && git push
vercel --prod
```

Your website updates automatically. Or set up the GitHub Actions auto-deploy workflow (see `.github/workflows/deploy.yml`) by adding three secrets in GitHub repo → Settings → Secrets and variables → Actions:

- `VERCEL_TOKEN` — from https://vercel.com/account/tokens
- `VERCEL_ORG_ID` — run `vercel link` and look in `.vercel/project.json`
- `VERCEL_PROJECT_ID` — same file

Then every push to `main` auto-deploys.

## 📱 Install as a Phone App (no app store needed)

Once your site is live:

1. Open the URL in **Chrome** on Android, or **Safari** on iPhone.
2. On Android: Tap the menu (⋮) → **"Install app"** → Install.
   On iPhone: Tap the share icon (􀈂) → **"Add to Home Screen"** → Add.
3. Setu appears on your home screen with its own icon, launches full screen, and works offline — just like an app from Play Store / App Store.

A floating "Install" banner appears on mobile when you visit the site. The desktop nav also has an "Install App" button.

## 🌐 Other free hosts (no-Vercel options)

- **Netlify**: run `npx netlify deploy --build --prod`
- **Cloudflare Pages**: connect the GitHub repo in Cloudflare dashboard → Framework = Next.js
- **Render**: "New" → "Static Site" / "Web Service", build command `next build && next start`, start command `next start -p 3000`

Vercel is recommended because Next.js is made by Vercel and deploys with zero config.

## ✅ Verify your deploy

After you get a URL, open it and confirm these work:

- `/` landing page loads
- `/dashboard` shows your stats
- `/chat` responds in English and Hindi
- The URL starts with `https://` and the browser shows no errors
- On mobile, "Install App" banner appears

## 🛟 Troubleshooting

- **"Command not found: vercel"** — use `npx vercel` instead (it installs automatically).
- **Build fails** — make sure Node 20+ is installed (`node -v`).
- **Site doesn't load over HTTPS** — Vercel provisions SSL in ~1 minute; refresh.
