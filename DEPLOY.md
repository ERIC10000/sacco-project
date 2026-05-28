# 🚀 Deploying SaccoFlow to Vercel

Step-by-step. Takes about 10 minutes start to finish.

---

## 1. Push the project to GitHub

### 1a. Create the empty repo on GitHub
1. Go to <https://github.com/new>
2. Repo name: `saccoflow` (or anything you like)
3. **Don't** initialize with README/license/gitignore — we already have them
4. Click **Create repository**
5. GitHub shows you a remote URL like
   `https://github.com/<your-username>/saccoflow.git`
   → copy it

### 1b. Push from your machine
Open a terminal in `C:\Users\Administrator\Desktop\sacco-project` and run:

```bash
# Stage all the project files
git add .

# First commit (only if the repo doesn't have commits yet)
git commit -m "Initial commit — SaccoFlow web dashboard"

# Tell git where to push (replace the URL with yours)
git remote add origin https://github.com/<your-username>/saccoflow.git

# Push the main branch
git branch -M main
git push -u origin main
```

If `git remote add origin` errors with "remote origin already exists",
do this instead:

```bash
git remote set-url origin https://github.com/<your-username>/saccoflow.git
```

### 1c. Verify
Refresh your GitHub repo page. You should see all the files **except**
`node_modules`, `dist`, and `.env.local` — those are gitignored.

> ⚠️ **Don't commit `.env.local`.** It contains your Supabase keys.
> The `.gitignore` already excludes it.

---

## 2. Connect the repo to Vercel

1. Go to <https://vercel.com/new>
2. Sign in with GitHub (first time you'll grant access to your repos)
3. Click **Import** next to `saccoflow`
4. Vercel auto-detects everything from `vercel.json`:
   - Framework: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. **Don't click Deploy yet** — first add the env vars below

---

## 3. Add environment variables

In the Vercel import screen, expand **Environment Variables** and add:

| Name | Value |
|---|---|
| `VITE_SUPABASE_URL` | `https://rsmvvwwdjhztzmufehsx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `sb_publishable_DUp9ijTZxzdo5A-g7yMgZQ_erUaOYWq` |

Both should be available to all three environments (Production, Preview,
Development).

Now click **Deploy**. Build takes ~60 seconds.

---

## 4. Verify the deployment

After "Building" turns green:

1. Click the screenshot/URL — your dashboard opens at
   `https://saccoflow-<hash>.vercel.app`
2. Navigate to `/dashboard` — should load with **real KPIs from Supabase**
3. Navigate to `/supabase-test` — all four checks should be green
4. Refresh the page — it should NOT 404 (the `vercel.json` rewrites handle this)
5. The favicon in the browser tab is the indigo SaccoFlow mark

---

## 5. Configure your Supabase project to trust the Vercel URL

In **Supabase Dashboard → Authentication → URL Configuration**:

- **Site URL**:  `https://<your-project>.vercel.app`
- **Additional Redirect URLs**: add both
  - `https://<your-project>.vercel.app/**`
  - `https://*.vercel.app/**`   (so Preview deploys also work)

This is only needed once you wire up Supabase Auth (magic links / OAuth).
For the current demo (which uses the anon key for read/write), it's
optional.

---

## 6. Subsequent deploys

You're now wired up for continuous deployment:

```bash
# Make a change locally
git add .
git commit -m "Update dashboard styling"
git push                # ← triggers an automatic Vercel deploy
```

Every push to `main` → production deploy.
Every push to any other branch → preview URL.

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| Build fails with "command not found: tsc" | The build needs devDependencies. Vercel installs them by default — check that your `package.json` lists `typescript` under `devDependencies`. |
| `/dashboard` returns 404 on Vercel | The `vercel.json` rewrites aren't being read. Make sure that file is at the repo root and committed. |
| KPIs show all zeros | Either the seed data isn't in Supabase yet, or the demo RLS policies (migration 0003) aren't applied. |
| Favicon doesn't update | Vercel CDN is caching. Hard-refresh (Ctrl-Shift-R) or wait 5 min. |
| Build complains about missing env vars | Re-add them in Vercel → Settings → Environment Variables, then redeploy from the Deployments tab. |
| `supabase-js` returns CORS error | In Supabase dashboard → Authentication → URL configuration, add your Vercel URL as an allowed origin. |
