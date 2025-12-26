import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [applicants, setApplicants] = useState([]);
  const [filteredApplicants, setFilteredApplicants] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchApplicants();
  }, []);

  useEffect(() => {
    filterApplicants();
  }, [searchQuery, selectedIndustry, applicants]);

  const fetchApplicants = async () => {
    try {
      const res = await fetch('/api/search');
      const data = await res.json();
      if (data.applicants) {
        setApplicants(data.applicants);
        const uniqueIndustries = [...new Set(data.applicants.map(a => a.industry_category))];
        setIndustries(uniqueIndustries);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filterApplicants = () => {
    let filtered = [...applicants];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(a =>
        a.applicant_name?.toLowerCase().includes(query) ||
        a.applicant_cnic?.includes(query) ||
        a.mfibankname?.toLowerCase().includes(query)
      );
    }

    if (selectedIndustry !== 'all') {
      filtered = filtered.filter(a => a.industry_category === selectedIndustry);
    }

    setFilteredApplicants(filtered);
  };

  const exportToExcel = async () => {
    try {
      const res = await fetch('/api/search?export=true');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'applicants_export.xlsx';
      a.click();
    } catch (err) {
      console.error('Export error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <button onClick={() => router.push('/dashboard')} className="text-2xl">
                ← 
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Search Applicants</h1>
                <p className="text-sm text-gray-600">Find and filter applicants</p>
              </div>
            </div>
            <button
              onClick={exportToExcel}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              📊 Export to Excel
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search by Name, CNIC or Bank
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter search term..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter by Industry
              </label>
              <select
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="all">All Industries</option>
                {industries.map((industry, idx) => (
                  <option key={idx} value={industry}>{industry}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {filteredApplicants.length} of {applicants.length} applicants
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedIndustry('all');
              }}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading...</p>
            </div>
          ) : filteredApplicants.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-gray-600">No applicants found</p>
              <p className="text-sm text-gray-500 mt-2">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">CNIC</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Industry</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Sub Sector</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Bank</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredApplicants.map((applicant, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-500">{idx + 1}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {applicant.applicant_cnic}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {applicant.applicant_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {applicant.industry_category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {applicant.business_sub_sector}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {applicant.mfibankname}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(applicant.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
        }
      `}</style>
    </div>
  );
}
