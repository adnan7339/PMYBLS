import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [stats, setStats] = useState({ total: 0, recent: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(userData));
    fetchApplicants();
  }, []);

  const fetchApplicants = async () => {
    try {
      const res = await fetch('/api/search');
      const data = await res.json();
      if (data.applicants) {
        setApplicants(data.applicants);
        setStats({
          total: data.applicants.length,
          recent: data.applicants.filter(a => {
            const date = new Date(a.createdAt);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return date > weekAgo;
          }).length
        });
      }
    } catch (err) {
      console.error('Error fetching applicants:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">📋</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Applicant System</h1>
                <p className="text-sm text-gray-600">Welcome, {user.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/upload')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Upload Excel
              </button>
              <button
                onClick={() => router.push('/search')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Search
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl">👥</div>
              <div className="bg-white bg-opacity-20 rounded-full p-2">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{stats.total}</div>
            <div className="text-sm opacity-90">Total Applicants</div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl">📅</div>
              <div className="bg-white bg-opacity-20 rounded-full p-2">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{stats.recent}</div>
            <div className="text-sm opacity-90">This Week</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl">🏢</div>
              <div className="bg-white bg-opacity-20 rounded-full p-2">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">
              {new Set(applicants.map(a => a.industry_category)).size}
            </div>
            <div className="text-sm opacity-90">Industries</div>
          </div>
        </div>

        {/* Recent Applicants */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Applicants</h2>
          
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading...</p>
            </div>
          ) : applicants.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📂</div>
              <p className="text-gray-600 mb-4">No applicants yet</p>
              <button
                onClick={() => router.push('/upload')}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Upload Excel File
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">CNIC</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Industry</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sub Sector</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Bank</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {applicants.slice(0, 10).map((applicant, idx) => (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {applicant.applicant_cnic}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {applicant.applicant_name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {applicant.industry_category}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {applicant.business_sub_sector}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {applicant.mfibankname}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(applicant.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {applicants.length > 10 && (
            <div className="mt-6 text-center">
              <button
                onClick={() => router.push('/search')}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                View All Applicants
              </button>
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
