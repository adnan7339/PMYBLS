import connectDB from '../../lib/mongodb';
import Applicant from '../../models/Applicant';
import XLSX from 'xlsx';

export default async function handler(req, res) {
  try {
    await connectDB();

    if (req.method === 'GET') {
      const { export: shouldExport, cnic, name, industry } = req.query;

      // Build query
      let query = {};
      if (cnic) query.applicant_cnic = { $regex: cnic, $options: 'i' };
      if (name) query.applicant_name = { $regex: name, $options: 'i' };
      if (industry) query.industry_category = industry;

      // Fetch applicants
      const applicants = await Applicant.find(query).sort({ createdAt: -1 });

      // Export to Excel if requested
      if (shouldExport === 'true') {
        const worksheet = XLSX.utils.json_to_sheet(
          applicants.map(a => ({
            CNIC: a.applicant_cnic,
            Name: a.applicant_name,
            Industry: a.industry_category,
            'Sub Sector': a.business_sub_sector,
            Bank: a.mfibankname,
            Date: new Date(a.createdAt).toLocaleDateString()
          }))
        );

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Applicants');
        
        const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=applicants_export.xlsx');
        return res.status(200).send(buffer);
      }

      // Return JSON data
      res.status(200).json({
        success: true,
        applicants: applicants.map(a => ({
          applicant_cnic: a.applicant_cnic,
          applicant_name: a.applicant_name,
          industry_category: a.industry_category,
          business_sub_sector: a.business_sub_sector,
          mfibankname: a.mfibankname,
          createdAt: a.createdAt
        })),
        total: applicants.length
      });

    } else if (req.method === 'POST') {
      const { query, industry } = req.body;

      let searchQuery = {};
      if (query) {
        searchQuery.$or = [
          { applicant_cnic: { $regex: query, $options: 'i' } },
          { applicant_name: { $regex: query, $options: 'i' } },
          { mfibankname: { $regex: query, $options: 'i' } }
        ];
      }
      if (industry) {
        searchQuery.industry_category = industry;
      }

      const applicants = await Applicant.find(searchQuery).sort({ createdAt: -1 });

      res.status(200).json({
        success: true,
        applicants: applicants.map(a => ({
          applicant_cnic: a.applicant_cnic,
          applicant_name: a.applicant_name,
          industry_category: a.industry_category,
          business_sub_sector: a.business_sub_sector,
          mfibankname: a.mfibankname,
          createdAt: a.createdAt
        })),
        total: applicants.length
      });

    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error', 
      error: error.message 
    });
  }
}
