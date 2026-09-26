# Diwaar.com

Pakistan property portal.

## Put it on Vercel

Do not use the Upload files button on github.com. That page stops at 100 files, and this project has more. Do not upload the zip itself.

1. Unzip this folder on your computer.
2. Install GitHub Desktop from https://desktop.github.com and sign in.
3. File → Add local repository → choose this folder.
4. If it says the folder is not a Git repository, click **create a repository**.
5. Commit, then **Publish repository**.
6. On https://vercel.com/new import that GitHub repo.
7. Framework preset: **Other**. Build command: `npm run build`. Leave the output directory empty.
8. Deploy. Then add the domain `diwaar.com` under Settings → Domains.
