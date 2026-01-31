# Deploying Mandi Mitra to Vercel

## option 1: Deploy with Vercel CLI (Recommended for quick testing)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   Run the following command in the root directory:
   ```bash
   vercel
   ```

4. **Follow the prompts:**
   - Set up and deploy: `Y`
   - Which scope: `(Select your account)`
   - Link to existing project: `N`
   - Project Name: `mandi-mitra` (or your choice)
   - In which directory is your code located: `./`
   - Want to modify these settings: `N`

5. **Set Environment Variables:**
   After the deployment starts, Vercel will ask if you want to set environment variables. Or you can set them in the Vercel Dashboard later.
   
   **CRITICAL:** You must set the `VITE_GEMINI_API_KEY` (or `GEMINI_API_KEY`) in the Vercel project settings.
   
   If deployment fails due to missing keys, go to Vercel Dashboard > Settings > Environment Variables and add:
   - Key: `VITE_GEMINI_API_KEY`
   - Value: `your_actual_api_key`

## Option 2: Deploy via Git (GitHub/GitLab/Bitbucket)

1. Push your code to a Git repository.
2. Log in to Vercel and click "Add New..." > "Project".
3. Import your repository.
4. Framework Preset will automatically detect **Vite**.
5. **Environment Variables:**
   - Add `VITE_GEMINI_API_KEY` with your Gemini API key.
6. Click **Deploy**.

## Troubleshooting via Vercel Logs

- If you see a 404 on refresh, ensure `vercel.json` with rewrites is present (we added this).
- If AI features don't work, check the content of `VITE_GEMINI_API_KEY` in the Vercel dashboard.
- If you see "Module not found", check that all files are committed and filenames utilize correct casing (Windows is case-insensitive, Linux/Vercel is case-sensitive).
