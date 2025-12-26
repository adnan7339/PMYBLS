export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Allow both GET and POST requests
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use GET or POST request.'
    });
  }

  try {
    // Get search parameters
    const { 
      query = '', 
      type = 'all', 
      sortBy = 'date', 
      page = 1, 
      limit = 20 
    } = req.method === 'GET' ? req.query : req.body;

    // Mock file database (in production, use a real database)
    const allFiles = [
      {
        id: 1,
        name: 'Project Proposal.pdf',
        type: 'application/pdf',
        size: 2458624,
        description: 'Q4 2025 project proposal document',
        uploadedBy: 'Adnan',
        uploadedAt: '2025-12-20T10:30:00Z',
        tags: ['project', 'proposal', 'business'],
        category: 'document'
      },
      {
        id: 2,
        name: 'Company Logo.png',
        type: 'image/png',
        size: 156789,
        description: 'Official company logo in high resolution',
        uploadedBy: 'Adnan',
        uploadedAt: '2025-12-22T14:45:00Z',
        tags: ['logo', 'branding', 'design'],
        category: 'image'
      },
      {
        id: 3,
        name: 'Meeting Recording.mp4',
        type: 'video/mp4',
        size: 45678912,
        description: 'Weekly team meeting recording',
        uploadedBy: 'Demo User',
        uploadedAt: '2025-12-23T09:15:00Z',
        tags: ['meeting', 'video', 'team'],
        category: 'video'
      },
      {
        id: 4,
        name: 'Budget Spreadsheet.xlsx',
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        size: 89456,
        description: 'Annual budget breakdown and forecasts',
        uploadedBy: 'Adnan',
        uploadedAt: '2025-12-24T11:20:00Z',
        tags: ['budget', 'finance', 'spreadsheet'],
        category: 'document'
      },
      {
        id: 5,
        name: 'Presentation Slides.pptx',
        type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        size: 3456789,
        description: 'Quarterly review presentation slides',
        uploadedBy: 'Adnan',
        uploadedAt: '2025-12-25T16:00:00Z',
        tags: ['presentation', 'quarterly', 'review'],
        category: 'document'
      },
      {
        id: 6,
        name: 'Background Music.mp3',
        type: 'audio/mpeg',
        size: 5678912,
        description: 'Royalty-free background music for videos',
        uploadedBy: 'Demo User',
        uploadedAt: '2025-12-26T08:30:00Z',
        tags: ['audio', 'music', 'background'],
        category: 'audio'
      }
    ];

    // Filter by search query
    let filteredFiles = allFiles;
    
    if (query && query.trim() !== '') {
      const searchTerm = query.toLowerCase();
      filteredFiles = filteredFiles.filter(file => 
        file.name.toLowerCase().includes(searchTerm) ||
        file.description.toLowerCase().includes(searchTerm) ||
        file.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        file.uploadedBy.toLowerCase().includes(searchTerm)
      );
    }

    // Filter by type
    if (type !== 'all') {
      filteredFiles = filteredFiles.filter(file => {
        const fileCategory = file.type.split('/')[0];
        return fileCategory === type || 
               (type === 'document' && (file.type.includes('pdf') || 
                                       file.type.includes('document') || 
                                       file.type.includes('spreadsheet') ||
                                       file.type.includes('presentation')));
      });
    }

    // Sort files
    filteredFiles.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'size':
          return b.size - a.size;
        case 'date':
        default:
          return new Date(b.uploadedAt) - new Date(a.uploadedAt);
      }
    });

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedFiles = filteredFiles.slice(startIndex, endIndex);

    // Calculate statistics
    const stats = {
      totalResults: filteredFiles.length,
      totalSize: filteredFiles.reduce((acc, file) => acc + file.size, 0),
      categories: {
        image: filteredFiles.filter(f => f.category === 'image').length,
        video: filteredFiles.filter(f => f.category === 'video').length,
        audio: filteredFiles.filter(f => f.category === 'audio').length,
        document: filteredFiles.filter(f => f.category === 'document').length
      }
    };

    // Return response
    return res.status(200).json({
      success: true,
      message: 'Search completed successfully',
      data: {
        files: paginatedFiles,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(filteredFiles.length / limit),
          totalResults: filteredFiles.length,
          resultsPerPage: parseInt(limit),
          hasNextPage: endIndex < filteredFiles.length,
          hasPrevPage: page > 1
        },
        filters: {
          query,
          type,
          sortBy
        },
        stats
      }
    });

  } catch (error) {
    console.error('Search API Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
}

// Example usage documentation
/*
GET /api/search?query=project&type=document&sortBy=date&page=1&limit=20
POST /api/search

Request Body (POST):
{
  "query": "project",
  "type": "document",
  "sortBy": "date",
  "page": 1,
  "limit": 20
}

Response (Success):
{
  "success": true,
  "message": "Search completed successfully",
  "data": {
    "files": [
      {
        "id": 1,
        "name": "Project Proposal.pdf",
        "type": "application/pdf",
        "size": 2458624,
        "description": "Q4 2025 project proposal document",
        "uploadedBy": "Adnan",
        "uploadedAt": "2025-12-20T10:30:00Z",
        "tags": ["project", "proposal", "business"],
        "category": "document"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 1,
      "totalResults": 1,
      "resultsPerPage": 20,
      "hasNextPage": false,
      "hasPrevPage": false
    },
    "filters": {
      "query": "project",
      "type": "document",
      "sortBy": "date"
    },
    "stats": {
      "totalResults": 1,
      "totalSize": 2458624,
      "categories": {
        "image": 0,
        "video": 0,
        "audio": 0,
        "document": 1
      }
    }
  }
}
*/
