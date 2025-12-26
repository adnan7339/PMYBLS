export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

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
    // Get upload data from request body
    const { 
      fileName, 
      fileType, 
      fileSize, 
      description = '', 
      tags = [],
      userId = null 
    } = req.body;

    // Validation
    if (!fileName) {
      return res.status(400).json({
        success: false,
        error: 'File name is required'
      });
    }

    if (!fileType) {
      return res.status(400).json({
        success: false,
        error: 'File type is required'
      });
    }

    if (!fileSize || fileSize <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Valid file size is required'
      });
    }

    // File size limit (50MB)
    const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes
    if (fileSize > MAX_FILE_SIZE) {
      return res.status(413).json({
        success: false,
        error: 'File size exceeds maximum limit of 50MB',
        maxSize: MAX_FILE_SIZE
      });
    }

    // Validate file type
    const allowedTypes = [
      // Images
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
      // Videos
      'video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo',
      // Audio
      'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp3',
      // Documents
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain', 'text/csv',
      // Archives
      'application/zip', 'application/x-rar-compressed'
    ];

    if (!allowedTypes.includes(fileType)) {
      return res.status(415).json({
        success: false,
        error: 'File type not supported',
        allowedTypes
      });
    }

    // Generate file metadata
    const fileId = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const uploadedAt = new Date().toISOString();
    
    // Determine category
    let category = 'other';
    if (fileType.startsWith('image/')) category = 'image';
    else if (fileType.startsWith('video/')) category = 'video';
    else if (fileType.startsWith('audio/')) category = 'audio';
    else if (fileType.includes('pdf') || fileType.includes('document') || 
             fileType.includes('spreadsheet') || fileType.includes('presentation') ||
             fileType.includes('text')) category = 'document';
    else if (fileType.includes('zip') || fileType.includes('rar')) category = 'archive';

    // Format file size
    const formatBytes = (bytes) => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    // Create file record
    const fileRecord = {
      id: fileId,
      name: fileName,
      type: fileType,
      size: fileSize,
      sizeFormatted: formatBytes(fileSize),
      description,
      tags: Array.isArray(tags) ? tags : [],
      category,
      uploadedBy: userId || 'anonymous',
      uploadedAt,
      status: 'completed',
      downloadCount: 0,
      url: `/files/${fileId}/${fileName}`, // In production, this would be a real storage URL
      thumbnailUrl: category === 'image' ? `/thumbnails/${fileId}` : null
    };

    // In production, you would:
    // 1. Save file to cloud storage (AWS S3, Google Cloud Storage, etc.)
    // 2. Generate thumbnails for images/videos
    // 3. Scan for viruses
    // 4. Save metadata to database
    // 5. Create file access permissions

    // Mock success response
    return res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        file: fileRecord,
        uploadStats: {
          uploadSpeed: Math.round(fileSize / 1024 / 2), // Mock speed in KB/s
          uploadTime: Math.round(fileSize / 1024 / 500) + ' seconds', // Mock time
          compressionSaved: 0
        }
      }
    });

  } catch (error) {
    console.error('Upload API Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
}

// Batch upload handler (optional)
export async function batchUpload(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  try {
    const { files } = req.body;

    if (!Array.isArray(files) || files.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Files array is required'
      });
    }

    const results = [];
    const errors = [];

    for (const file of files) {
      try {
        // Process each file (reuse single upload logic)
        const result = {
          id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          name: file.fileName,
          status: 'completed'
        };
        results.push(result);
      } catch (error) {
        errors.push({
          fileName: file.fileName,
          error: error.message
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: `${results.length} files uploaded successfully`,
      data: {
        successful: results,
        failed: errors,
        totalFiles: files.length,
        successCount: results.length,
        failureCount: errors.length
      }
    });

  } catch (error) {
    console.error('Batch Upload API Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error.message
    });
  }
}

// Example usage documentation
/*
POST /api/upload

Request Body (Single File):
{
  "fileName": "document.pdf",
  "fileType": "application/pdf",
  "fileSize": 2458624,
  "description": "Important document",
  "tags": ["work", "important"],
  "userId": "user123"
}

Response (Success):
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "file": {
      "id": "file_1703598000000_abc123",
      "name": "document.pdf",
      "type": "application/pdf",
      "size": 2458624,
      "sizeFormatted": "2.34 MB",
      "description": "Important document",
      "tags": ["work", "important"],
      "category": "document",
      "uploadedBy": "user123",
      "uploadedAt": "2025-12-26T10:30:00.000Z",
      "status": "completed",
      "downloadCount": 0,
      "url": "/files/file_1703598000000_abc123/document.pdf",
      "thumbnailUrl": null
    },
    "uploadStats": {
      "uploadSpeed": 1229,
      "uploadTime": "5 seconds",
      "compressionSaved": 0
    }
  }
}

Response (Error):
{
  "success": false,
  "error": "File size exceeds maximum limit of 50MB",
  "maxSize": 52428800
}

POST /api/upload/batch

Request Body (Multiple Files):
{
  "files": [
    {
      "fileName": "file1.pdf",
      "fileType": "application/pdf",
      "fileSize": 1234567
    },
    {
      "fileName": "file2.jpg",
      "fileType": "image/jpeg",
      "fileSize": 789012
    }
  ]
}

Response (Batch Success):
{
  "success": true,
  "message": "2 files uploaded successfully",
  "data": {
    "successful": [...],
    "failed": [],
    "totalFiles": 2,
    "successCount": 2,
    "failureCount": 0
  }
}
*/
