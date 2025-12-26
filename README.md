# Applicant System

A complete Next.js application for managing applicant data with Excel import/export functionality.

## Features

✅ User Authentication (Login System)
✅ Dashboard with Statistics
✅ Excel File Upload & Import
✅ Advanced Search & Filtering
✅ Export to Excel
✅ MongoDB Database Integration
✅ Responsive Design

## Tech Stack

- **Frontend**: Next.js, React
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT & bcryptjs
- **Excel Processing**: xlsx library

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your MongoDB connection string:

```
MONGODB_URI=mongodb://localhost:27017/applicant-system
JWT_SECRET=your-secret-key-here
```

### 3. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

### 4. Default Login Credentials

- **Username**: Adnan
- **Password**: ad3115

## Project Structure

```
applicant-system/
├── pages/
│   ├── index.js          # Home/Redirect page
│   ├── login.js          # Login page
│   ├── dashboard.js      # Main dashboard
│   ├── upload.js         # Excel upload page
│   ├── search.js         # Search & filter page
│   └── api/
│       ├── login.js      # Authentication API
│       ├── search.js     # Search & export API
│       └── upload.js     # File upload API
├── models/
│   ├── User.js           # User schema
│   └── Applicant.js      # Applicant schema
├── lib/
│   └── mongodb.js        # Database connection
└── package.json
```

## Excel File Format

The Excel file should contain the following columns:

- `applicant_cnic` - CNIC number (unique)
- `applicant_name` - Applicant name
- `industry_category` - Industry category
- `business_sub_sector` - Business sub-sector
- `mfibankname` - Bank name

## API Endpoints

### POST /api/login
Authenticate user and get JWT token

### GET /api/search
Get all applicants with optional filters
- Query params: `cnic`, `name`, `industry`, `export=true`

### POST /api/upload
Upload and import Excel file

## Production Deployment

### Build for Production

```bash
npm run build
npm start
```

### Environment Variables for Production

Make sure to set these in your production environment:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Strong secret key for JWT
- `NODE_ENV=production`

## License

Private - All rights reserved

## Developer

Created for applicant management system.
