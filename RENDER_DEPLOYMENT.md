# 🚀 Render.com Deployment Guide

## Step-by-Step Instructions for Deploying to Render.com

### Prerequisites
- GitHub account
- This project pushed to a GitHub repository
- Render.com account (free tier available)

---

## Method 1: Direct GitHub Deployment (Recommended)

### Step 1: Push to GitHub

1. Initialize Git repository (if not already done):
```bash
cd PMYBLS
git init
git add .
git commit -m "Initial commit: PM YBLS Dashboard"
```

2. Create a new repository on GitHub
   - Go to https://github.com/new
   - Name: `pmybls-dashboard`
   - Click "Create repository"

3. Push your code:
```bash
git remote add origin https://github.com/YOUR_USERNAME/pmybls-dashboard.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on Render

1. **Sign up/Login to Render**
   - Go to https://render.com
   - Sign up or login

2. **Create New Static Site**
   - Click "New +" button in top right
   - Select "Static Site"

3. **Connect GitHub Repository**
   - Click "Connect a repository"
   - Select your `pmybls-dashboard` repository
   - Click "Connect"

4. **Configure Build Settings**
   ```
   Name: pmybls-dashboard (or your preferred name)
   Branch: main
   Build Command: (leave empty)
   Publish Directory: .
   ```

5. **Add Environment Variables** (Optional)
   - Click "Advanced"
   - Add environment variable:
     - Key: `PM_YBLS`
     - Value: `e84b50d8176a3705676f25c1507ef27a`

6. **Deploy**
   - Click "Create Static Site"
   - Wait for deployment (usually 1-2 minutes)
   - Your site will be live at: `https://pmybls-dashboard.onrender.com`

---

## Method 2: Manual Upload

### Step 1: Prepare Your Files

1. Ensure all files are in the PMYBLS folder:
   - index.html
   - data.json
   - styles.css
   - script.js
   - vercel.json (can be used for render too)

### Step 2: Create ZIP File

```bash
cd PMYBLS
zip -r pmybls-dashboard.zip *
```

### Step 3: Deploy on Render

1. Go to Render Dashboard
2. Click "New +" → "Static Site"
3. Select "Deploy from GitHub" or use manual upload option
4. Follow the prompts to upload your ZIP file

---

## Configuration Details

### Static Site Settings

**For Render.com specifically:**

```yaml
# render.yaml (optional - Render auto-detects static sites)
services:
  - type: web
    name: pmybls-dashboard
    env: static
    buildCommand: ""
    staticPublishPath: .
    envVars:
      - key: PM_YBLS
        value: 2ce6413f90d9ed84238852299b353926
```

### Custom Domain Setup (Optional)

1. Go to your site's Dashboard on Render
2. Click "Settings" → "Custom Domain"
3. Add your domain (e.g., `pmybls.yourdomain.com`)
4. Update DNS records as instructed by Render
5. SSL certificate will be auto-generated

---

## Post-Deployment

### 1. Test Your Site
- Visit your Render URL
- Test search functionality
- Check filters
- Verify pagination
- Test responsive design on mobile

### 2. Monitor Performance
- Go to Render Dashboard
- View deployment logs
- Check site analytics

### 3. Update Your Site

**Auto-Deploy (if using GitHub):**
- Just push changes to GitHub:
```bash
git add .
git commit -m "Update dashboard"
git push
```
- Render will automatically redeploy

**Manual Deploy:**
- Upload new files through Render Dashboard
- Or push to GitHub if connected

---

## Troubleshooting

### Issue: Site not loading
**Solution:**
- Check Render deployment logs
- Ensure all files are present
- Verify data.json is valid JSON

### Issue: 404 errors
**Solution:**
- Check Publish Directory is set to `.` (root)
- Ensure index.html is in root directory

### Issue: Data not displaying
**Solution:**
- Open browser console (F12)
- Check for JavaScript errors
- Verify data.json path is correct

### Issue: Slow loading
**Solution:**
- Optimize data.json size
- Enable CDN on Render (paid plan)
- Consider pagination improvements

---

## Advanced Configuration

### Enable CORS (if needed)
Add to your static site:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        }
      ]
    }
  ]
}
```

### Custom Headers
Create `render.yaml`:
```yaml
services:
  - type: web
    name: pmybls-dashboard
    env: static
    buildCommand: ""
    staticPublishPath: .
    headers:
      - path: /*
        name: X-Frame-Options
        value: DENY
      - path: /*
        name: X-Content-Type-Options
        value: nosniff
```

---

## Cost & Limits

### Free Tier Includes:
- ✅ 100 GB bandwidth/month
- ✅ Unlimited static sites
- ✅ Auto SSL certificates
- ✅ Global CDN
- ✅ Custom domains

### Paid Plans Start at $7/month:
- Increased bandwidth
- Priority support
- Advanced analytics

---

## Useful Commands

```bash
# Check git status
git status

# Add all changes
git add .

# Commit changes
git commit -m "Your message"

# Push to GitHub (auto-deploys to Render)
git push

# Check remote URL
git remote -v
```

---

## Support & Resources

- **Render Documentation**: https://render.com/docs
- **Render Community**: https://community.render.com
- **Status Page**: https://status.render.com

---

## Quick Reference

| Setting | Value |
|---------|-------|
| Build Command | (empty) |
| Publish Directory | `.` |
| Environment | Static |
| Auto-Deploy | Yes (if GitHub) |
| SSL | Auto-enabled |

---

✅ **Your site is now live and ready to use!**

URL Format: `https://[your-site-name].onrender.com`

---

**Need Help?**
- Check deployment logs in Render Dashboard
- Review this guide
- Contact Render support

**Happy Deploying! 🎉**
