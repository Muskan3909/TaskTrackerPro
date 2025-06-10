# Deploy Task Management System to Render

## Quick Setup

### 1. Push to GitHub
First, push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### 2. Connect to Render
1. Go to [render.com](https://render.com) and sign up/login
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Use these settings:

**Basic Settings:**
- Name: `task-management-system`
- Environment: `Python 3`
- Region: Choose closest to your users
- Branch: `main`
- Root Directory: Leave blank
- Runtime: `Python 3.11.0`

**Build & Deploy:**
- Build Command: `pip install -r render_requirements.txt`
- Start Command: `gunicorn --bind 0.0.0.0:$PORT main:app`

### 3. Environment Variables
Add these environment variables in Render dashboard:
- `SESSION_SECRET`: Generate a random secret key (click "Generate" button)
- `DATABASE_URL`: Will be auto-provided when you add PostgreSQL

### 4. Add PostgreSQL Database
1. In Render dashboard, click "New +" → "PostgreSQL"
2. Name: `task-management-db`
3. Database Name: `taskmanagement`
4. User: `taskuser`
5. Region: Same as your web service
6. Plan: Free tier is fine for testing

### 5. Connect Database
1. Go back to your web service settings
2. Add environment variable:
   - Key: `DATABASE_URL`
   - Value: Select your PostgreSQL database from dropdown

### 6. Deploy
Click "Create Web Service" - Render will automatically build and deploy your app.

## Alternative: Using render.yaml (Infrastructure as Code)

If you prefer to define everything in code, use the `render.yaml` file included in your project:

1. In Render dashboard, click "New +" → "Blueprint"
2. Connect your GitHub repository
3. Render will read the `render.yaml` file and create all services automatically

## Post-Deployment

### Verify Deployment
1. Your app will be available at: `https://YOUR_SERVICE_NAME.onrender.com`
2. Test all functionality:
   - Create tasks
   - Edit tasks
   - Delete tasks
   - Filter tasks
   - Toggle task status

### Custom Domain (Optional)
1. In your web service settings, scroll to "Custom Domains"
2. Add your domain and follow DNS configuration instructions

## Troubleshooting

### Build Fails
- Check build logs in Render dashboard
- Ensure `render_requirements.txt` has correct package versions
- Verify Python version compatibility

### Database Connection Issues
- Ensure `DATABASE_URL` environment variable is set
- Check database service is running
- Verify database connection string format

### App Not Loading
- Check service logs in Render dashboard
- Verify start command: `gunicorn --bind 0.0.0.0:$PORT main:app`
- Ensure `main.py` imports your Flask app correctly

## Files Created for Deployment
- `render.yaml`: Infrastructure as code configuration
- `Procfile`: Process definition for deployment
- `render_requirements.txt`: Python dependencies with versions
- `RENDER_DEPLOYMENT.md`: This deployment guide

Your Task Management System is now ready to deploy to Render!