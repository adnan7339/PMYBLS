import connectDB from '../../lib/mongodb';
import Applicant from '../../models/Applicant';
import XLSX from 'xlsx';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();

    // Parse form data
    const form = formidable({
      uploadDir: '/tmp',
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(400).json({ 
          success: false,
          message: 'Error parsing file', 
          error: err.message 
        });
      }

      const file = files.file;
      if (!file) {
        return res.status(400).json({ 
          success: false,
          message: 'No file uploaded' 
        });
      }

      try {
        // Read Excel file
        const filePath = Array.isArray(file) ? file[0].filepath : file.filepath;
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);

        // Clean up uploaded file
        fs.unlinkSync(filePath);

        if (data.length === 0) {
          return res.status(400).json({ 
            success: false,
            message: 'Excel file is empty' 
          });
        }

        // Process and insert data
        let inserted = 0;
        let duplicates = 0;
        const errors = [];

        for (const row of data) {
          try {
            // Map Excel columns to database fields
            const applicantData = {
              applicant_cnic: row.applicant_cnic || row.CNIC || row.cnic,
              applicant_name: row.applicant_name || row.Name || row.name,
              industry_category: row.industry_category || row.Industry || row.industry,
              business_sub_sector: row.business_sub_sector || row['Sub Sector'] || row.subsector,
              mfibankname: row.mfibankname || row.Bank || row.bank
            };

            // Validate required fields
            if (!applicantData.applicant_cnic) {
              errors.push({ row, error: 'Missing CNIC' });
              continue;
            }

            // Check for duplicates
            const existing = await Applicant.findOne({ 
              applicant_cnic: applicantData.applicant_cnic 
            });

            if (existing) {
              duplicates++;
              continue;
            }

            // Insert new applicant
            await Applicant.create(applicantData);
            inserted++;

          } catch (error) {
            if (error.code === 11000) {
              // Duplicate key error
              duplicates++;
            } else {
              errors.push({ row, error: error.message });
            }
          }
        }

        res.status(200).json({
          success: true,
          message: 'Upload completed',
          total: data.length,
          inserted,
          duplicates,
          errors: errors.length,
          errorDetails: errors.slice(0, 10) // Return first 10 errors
        });

      } catch (error) {
        console.error('Processing error:', error);
        res.status(500).json({ 
          success: false,
          message: 'Error processing Excel file', 
          error: error.message 
        });
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
}
