# GitHub Actions Workflows

This directory contains GitHub Actions workflows for automated CI/CD deployment to Render.com.

## Workflows

### 1. Backend Deployment (`backend.yml`)

Automatically deploys the Express.js backend to Render.com when backend files change.

**Triggers**:
- Push to `main` branch with changes in `backend/**`
- Changes to `.github/workflows/backend.yml`
- Manual trigger via GitHub Actions UI

**Steps**:
1. Checkout code
2. Setup Node.js 20
3. Install dependencies (`npm ci`)
4. Run tests (if available)
5. Trigger Render deployment via deploy hook

**Required Secrets**:
- `RENDER_BACKEND_DEPLOY_HOOK`: Deploy hook URL from Render backend service

### 2. Frontend Deployment (`frontend.yml`)

Automatically deploys the React + Vite frontend to Render.com when frontend files change.

**Triggers**:
- Push to `main` branch with changes in `frontend/**`
- Changes to `.github/workflows/frontend.yml`
- Manual trigger via GitHub Actions UI

**Steps**:
1. Checkout code
2. Setup Node.js 20
3. Install dependencies (`npm ci`)
4. Build frontend (`npm run build`)
5. Run linter (if available)
6. Trigger Render deployment via deploy hook

**Required Secrets**:
- `RENDER_FRONTEND_DEPLOY_HOOK`: Deploy hook URL from Render frontend service
- `VITE_API_BASE_URL`: Backend API URL for frontend builds

## Configuration

### Setting Up Secrets

1. Go to repository **Settings** → **Secrets and variables** → **Actions**
2. Click **"New repository secret"**
3. Add the following secrets:

| Secret Name | Description | Where to Get It |
|-------------|-------------|-----------------|
| `RENDER_BACKEND_DEPLOY_HOOK` | Backend deploy hook URL | Render backend service → Settings → Deploy Hook |
| `RENDER_FRONTEND_DEPLOY_HOOK` | Frontend deploy hook URL | Render frontend service → Settings → Deploy Hook |
| `VITE_API_BASE_URL` | Backend API URL | Your Render backend URL (e.g., `https://your-backend.onrender.com`) |

### Manual Deployment

To manually trigger a deployment:

1. Go to **Actions** tab in GitHub
2. Select the workflow (Backend or Frontend)
3. Click **"Run workflow"**
4. Select branch (usually `main`)
5. Click **"Run workflow"**

## Path Filters

Workflows use path filters to only run when relevant files change:

- **Backend workflow** runs when:
  - Any file in `backend/` directory changes
  - The `backend.yml` workflow file itself changes

- **Frontend workflow** runs when:
  - Any file in `frontend/` directory changes
  - The `frontend.yml` workflow file itself changes

This prevents unnecessary deployments and saves GitHub Actions minutes.

## Workflow Status

Check workflow status:
- **Actions tab**: View all workflow runs and their status
- **Commit page**: See workflow status next to each commit
- **Pull requests**: Workflows run on PRs to validate changes

## Troubleshooting

### Workflow Not Running

- Check that files changed are in the correct path (`backend/**` or `frontend/**`)
- Verify workflows are enabled in repository settings
- Check branch name matches (e.g., `main` vs `master`)

### Deployment Fails

- Check GitHub Actions logs for error messages
- Verify secrets are set correctly
- Test deploy hook manually: `curl -X POST "your-deploy-hook-url"`
- Check Render dashboard for deployment errors

### Build Fails

- Ensure `package-lock.json` is committed
- Check Node version compatibility
- Review error messages in workflow logs

## Best Practices

1. **Always test locally** before pushing to main
2. **Use feature branches** for development
3. **Create pull requests** for code review before merging
4. **Monitor deployments** in GitHub Actions and Render dashboards
5. **Keep secrets secure** - never commit them to the repository

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Render Deploy Hooks Documentation](https://render.com/docs/deploy-hooks)
- [Project Deployment Guide](../../deployment.md)

