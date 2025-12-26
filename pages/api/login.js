export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false,
      error: 'Method not allowed. Use POST request.' 
    });
  }

  try {
    const { email, password, isSignUp } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email) && !isSignUp) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    // Password validation
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters'
      });
    }

    // Mock user database (in production, use a real database)
    const users = [
      {
        id: 1,
        email: 'Adnan',
        password: 'ad3115', // In production, use hashed passwords
        name: 'Adnan',
        role: 'admin',
        createdAt: '2025-01-01'
      },
      {
        id: 2,
        email: 'demo@example.com',
        password: 'demo123',
        name: 'Demo User',
        role: 'user',
        createdAt: '2025-01-15'
      }
    ];

    if (isSignUp) {
      // Sign Up Logic
      const existingUser = users.find(u => u.email === email);
      
      if (existingUser) {
        return res.status(409).json({
          success: false,
          error: 'User already exists with this email'
        });
      }

      // Create new user
      const newUser = {
        id: users.length + 1,
        email,
        name: email.split('@')[0],
        role: 'user',
        createdAt: new Date().toISOString()
      };

      // Generate token (in production, use JWT)
      const token = Buffer.from(`${email}:${Date.now()}`).toString('base64');

      return res.status(201).json({
        success: true,
        message: 'Account created successfully',
        data: {
          user: {
            id: newUser.id,
            email: newUser.email,
            name: newUser.name,
            role: newUser.role
          },
          token,
          expiresIn: '24h'
        }
      });

    } else {
      // Login Logic
      const user = users.find(u => u.email === email && u.password === password);

      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid email or password'
        });
      }

      // Generate token (in production, use JWT)
      const token = Buffer.from(`${email}:${Date.now()}`).toString('base64');

      // Update last login (in production, update in database)
      const lastLogin = new Date().toISOString();

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            lastLogin
          },
          token,
          expiresIn: '24h'
        }
      });
    }

  } catch (error) {
    console.error('Login API Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
}

// Example usage documentation
/*
POST /api/login

Request Body (Login):
{
  "email": "Adnan",
  "password": "ad3115",
  "isSignUp": false
}

Request Body (Sign Up):
{
  "email": "newuser@example.com",
  "password": "password123",
  "isSignUp": true
}

Response (Success):
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "email": "Adnan",
      "name": "Adnan",
      "role": "admin",
      "lastLogin": "2025-12-26T10:30:00.000Z"
    },
    "token": "base64encodedtoken",
    "expiresIn": "24h"
  }
}

Response (Error):
{
  "success": false,
  "error": "Invalid email or password"
}
*/
