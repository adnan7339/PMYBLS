# PM Youth Business Loan Scheme Dashboard

A modern, responsive, and dynamic dashboard for displaying PM Youth Business Loan Scheme applicant data with advanced search, filtering, and pagination features.

## 🚀 Features

- **Advanced Search**: Real-time search across all data fields
- **Multiple Filters**: Filter by Industry Category, Business Sector, and Bank
- **Grid/List View Toggle**: Switch between grid and list display modes
- **Pagination**: Efficient data pagination with page navigation
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Interactive UI**: Smooth animations and hover effects
- **Detail Modal**: Click any card to view detailed information
- **Statistics Dashboard**: Live statistics and metrics
- **Keyboard Shortcuts**: Press Ctrl+K to focus search
- **Modern Design**: Clean and professional interface

## 📁 Project Structure

```
PMYBLS/
├── index.html          # Main HTML file
├── data.json           # Applicant data
├── styles.css          # Styling
├── script.js           # JavaScript logic
├── vercel.json         # Vercel configuration
└── README.md           # This file
```

## 🔧 Setup Instructions

### Local Development

1. Clone or download this repository
2. Navigate to the project directory
3. Open `index.html` in a web browser
4. Or use a local server:
   ```bash
   # Python
   python -m http.server 8000
   
   # Node.js
   npx serve
   ```

### Environment Variables

This project uses the following environment variable:
- `PM_YBLS`: API Key - `2ce6413f90d9ed84238852299b353926`

## 🌐 Deployment Options

### Option 1: Deploy to Render.com (Recommended)

1. **Create a New Static Site on Render**
   - Go to [Render.com](https://render.com)
   - Click "New +" → "Static Site"
   - Connect your GitHub repository

2. **Configure Build Settings**
   - **Build Command**: Leave empty (static site)
   - **Publish Directory**: `.` (root directory)

3. **Environment Variables** (Optional)
   - Add `PM_YBLS` with value `2ce6413f90d9ed84238852299b353926`

4. **Deploy**
   - Click "Create Static Site"
   - Your site will be live at: `https://your-site-name.onrender.com`

### Option 2: Deploy to Vercel

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   cd PMYBLS
   vercel
   ```

3. Follow the prompts and your site will be live!

### Option 3: Deploy to Netlify

1. Drag and drop the `PMYBLS` folder to [Netlify Drop](https://app.netlify.com/drop)
2. Or use Netlify CLI:
   ```bash
   npm i -g netlify-cli
   netlify deploy --prod
   ```

### Option 4: GitHub Pages

1. Push to GitHub repository
2. Go to Settings → Pages
3. Select branch and root folder
4. Your site will be live at: `https://username.github.io/repository-name/`

## 📊 Data Format

The `data.json` file should contain an array of objects with the following structure:

```json
[
  {
    "Applicant CNIC": "32203-3883608-3",
    "Applicant Name": "Mubashar Hussain",
    "Industory Category": "Services",
    "Business Sector": "Retail",
    "Business Sub Sector": "Stationery & Photo Copy",
    "MFIBankName": "Bank of Punjab"
  }
]
```

## 🎨 Customization

### Colors
Edit CSS variables in `styles.css`:
```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #10b981;
    --bg-color: #f8fafc;
    /* ... */
}
```

### Items Per Page
Edit in `script.js`:
```javascript
const itemsPerPage = 12; // Change this number
```

## 🔍 Search Functionality

The search feature works across:
- Applicant Name
- CNIC Number
- Bank Name
- Industry Category
- Business Sector
- Business Sub Sector

## 📱 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers

## 🐛 Troubleshooting

**Issue**: Data not loading
- **Solution**: Check browser console for errors
- Ensure `data.json` is in the same directory as `index.html`

**Issue**: Search not working
- **Solution**: Clear browser cache and reload

**Issue**: Styling issues
- **Solution**: Ensure `styles.css` is properly linked

## 📝 License

This project is open source and available for use.

## 👨‍💻 Author

Created for PM Youth Business Loan Scheme

## 🙏 Support

For issues or questions, please create an issue in the repository.

---

Made with ❤️ for Pakistan's Youth
