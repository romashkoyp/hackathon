# GitHub Actions CI/CD Setup Guide

This guide explains how the GitHub Actions workflows are configured for this project.

## Overview

This project uses GitHub Actions to automatically deploy the frontend and backend to Render.com whenever code is pushed to the `main` branch.

## Workflow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     GitHub Repository                        │
│                                                              │
│  ┌────────────────┐              ┌────────────────┐        │
│  │   backend/     │              │   frontend/    │        │
│  │   - server.js  │              │   - src/       │        │
│  │   - package.json│              │   - package.json│        │
│  └────────┬───────┘              └────────┬───────┘        │
│           │                               │                 │
│           │ Changes detected              │ Changes detected│
│           ▼                               ▼                 │
│  ┌────────────────┐              ┌────────────────┐        │
│  │ backend.yml    │              │ frontend.yml   │        │
│  │ workflow       │              │ workflow       │        │
│  └────────┬───────┘              └────────┬───────┘        │
└───────────┼──────────────────────────────┼─────────────────┘
            │                               │
            │ Triggers deploy               │ Triggers deploy
            ▼                               ▼
   ┌────────────────┐              ┌────────────────┐
   │ Render Backend │              │ Render Frontend│
   │  Web Service   │              │  Static Site   │
   └────────────────┘              └────────────────┘
```

## Workflow Files

### 1. `backend.yml` - Backend Deployment

**Purpose**: Automatically deploy the Express.js backend to Render when backend code changes.

**Triggers**:
- Push to `main` branch with changes in `backend/**`
- Changes to the workflow file itself
- Manual trigger via GitHub UI

**What it does**:
1. ✅ Checks out the code
2. ✅ Sets up Node.js 20
3. ✅ Installs dependencies with `npm ci`
4. ✅ Runs tests (if available)
5. ✅ Triggers Render deployment via deploy hook
6. ✅ Provides deployment summary

**Required Secrets**:
- `RENDER_BACKEND_DEPLOY_HOOK`

### 2. `frontend.yml` - Frontend Deployment

**Purpose**: Automatically deploy the React frontend to Render when frontend code changes.

**Triggers**:
- Push to `main` branch with changes in `frontend/**`
- Changes to the workflow file itself
- Manual trigger via GitHub UI

**What it does**:
1. ✅ Checks out the code
2. ✅ Sets up Node.js 20
3. ✅ Installs dependencies with `npm ci`
4. ✅ Builds the frontend with Vite
5. ✅ Runs linter (if available)
6. ✅ Triggers Render deployment via deploy hook
7. ✅ Provides deployment summary

**Required Secrets**:
- `RENDER_FRONTEND_DEPLOY_HOOK`
- `VITE_API_BASE_URL`

## Path Filters Explained

Both workflows use **path filters** to only run when relevant files change:

```yaml
on:
  push:
    branches:
      - main
    paths:
      - 'backend/**'  # Only run when backend files change
```

**Benefits**:
- ✅ Saves GitHub Actions minutes
- ✅ Faster CI/CD pipeline
- ✅ Only deploys what changed
- ✅ Prevents unnecessary deployments

**Example Scenarios**:

| Files Changed | Backend Workflow | Frontend Workflow |
|---------------|------------------|-------------------|
| `backend/server.js` | ✅ Runs | ❌ Skipped |
| `frontend/src/App.jsx` | ❌ Skipped | ✅ Runs |
| `backend/server.js` + `frontend/src/App.jsx` | ✅ Runs | ✅ Runs |
| `README.md` | ❌ Skipped | ❌ Skipped |
| `.github/workflows/backend.yml` | ✅ Runs | ❌ Skipped |

## Secrets Configuration

### Where to Add Secrets

1. Go to your GitHub repository
2. Navigate to: **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**

### Required Secrets

#### `RENDER_BACKEND_DEPLOY_HOOK`
- **What**: Deploy hook URL for the backend service
- **Where to get**: Render backend service → Settings → Deploy Hook
- **Format**: `https://api.render.com/deploy/srv-xxxxx?key=yyyyy`
- **Used by**: `backend.yml` workflow

#### `RENDER_FRONTEND_DEPLOY_HOOK`
- **What**: Deploy hook URL for the frontend service
- **Where to get**: Render frontend service → Settings → Deploy Hook
- **Format**: `https://api.render.com/deploy/srv-xxxxx?key=yyyyy`
- **Used by**: `frontend.yml` workflow

#### `VITE_API_BASE_URL`
- **What**: Backend API URL for frontend builds
- **Where to get**: Your Render backend service URL
- **Format**: `https://your-backend-name.onrender.com` (no trailing slash)
- **Used by**: `frontend.yml` workflow (for building the frontend)

## Manual Deployment

### Via GitHub UI

1. Go to the **Actions** tab in your repository
2. Select the workflow you want to run:
   - "Deploy Backend to Render"
   - "Deploy Frontend to Render"
3. Click **"Run workflow"** button (top right)
4. Select branch (usually `main`)
5. Click **"Run workflow"**

### Via GitHub CLI

```bash
# Install GitHub CLI first: https://cli.github.com/

# Run backend deployment
gh workflow run backend.yml

# Run frontend deployment
gh workflow run frontend.yml

# Check workflow status
gh run list

# View specific run
gh run view <run-id> --log
```

## Monitoring Deployments

### GitHub Actions Dashboard

- **Actions Tab**: View all workflow runs
- **Commit Page**: See workflow status next to commits
- **Pull Requests**: Workflows run on PRs for validation

### Status Indicators

- 🟡 **Yellow dot**: Workflow is running
- ✅ **Green checkmark**: Workflow succeeded
- ❌ **Red X**: Workflow failed
- ⚪ **Gray circle**: Workflow was cancelled

### Deployment Summary

Each workflow provides a deployment summary with:
- Service name
- Commit hash
- Branch name
- Triggered by (user)
- Link to Render dashboard

## Workflow Customization

### Adding Tests

To add tests to the backend workflow:

```yaml
- name: Run tests
  working-directory: ./backend
  run: npm test
```

### Adding Environment Variables

To add environment variables for builds:

```yaml
- name: Build
  env:
    MY_ENV_VAR: ${{ secrets.MY_SECRET }}
  run: npm run build
```

### Adding Notifications

To add Slack notifications on failure:

```yaml
- name: Notify Slack
  if: failure()
  uses: slackapi/slack-github-action@v1
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK }}
```

## Best Practices

### ✅ Do's

- ✅ Use `npm ci` instead of `npm install` for faster, reproducible builds
- ✅ Use path filters to avoid unnecessary deployments
- ✅ Add deployment summaries for visibility
- ✅ Use secrets for sensitive data
- ✅ Enable manual triggers with `workflow_dispatch`
- ✅ Test locally before pushing to main

### ❌ Don'ts

- ❌ Don't commit secrets to the repository
- ❌ Don't use `npm install` in CI (use `npm ci`)
- ❌ Don't deploy on every push to every branch
- ❌ Don't skip error handling
- ❌ Don't forget to update secrets when they change

## Troubleshooting

### Workflow Not Running

**Check**:
- Are you pushing to the `main` branch?
- Did files in the correct path change?
- Are workflows enabled in repository settings?

### Secret Not Found Error

**Check**:
- Is the secret name spelled correctly? (case-sensitive)
- Is the secret set in repository settings?
- Are you using the correct syntax: `${{ secrets.SECRET_NAME }}`?

### Deploy Hook Fails

**Check**:
- Is the deploy hook URL correct and complete?
- Test manually: `curl -X POST "your-deploy-hook-url"`
- Has the deploy hook been regenerated in Render?

### Build Fails

**Check**:
- Is `package-lock.json` committed?
- Are all dependencies in `package.json`?
- Does the build work locally?
- Check workflow logs for specific errors

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Render Deploy Hooks](https://render.com/docs/deploy-hooks)
- [Full Deployment Guide](../../deployment.md)
- [Quick Start Guide](../../DEPLOYMENT_QUICKSTART.md)

## Support

If you encounter issues:
1. Check the workflow logs in GitHub Actions
2. Review the [Troubleshooting](#troubleshooting) section
3. Consult the [full deployment guide](../../deployment.md)
4. Check Render dashboard for deployment errors

