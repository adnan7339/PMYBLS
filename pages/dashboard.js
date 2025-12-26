import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function Dashboard({ user, onLogout }) {
  const [stats, setStats] = useState({
    totalFiles: 0,
    totalSearches: 0,
    storageUsed: 0,
    activeUsers: 1
  });
  
  const [recentActivity, setRecentActivity] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    // Set greeting based on time
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    // Load stats from localStorage
    const uploads = JSON.parse(localStorage.getItem('uploads') || '[]');
    const searches = JSON.parse(localStorage.getItem('searches') || '[]');
    
    setStats({
      totalFiles: uploads.length,
      totalSearches: searches.length,
      storageUsed: uploads.reduce((acc, file) => acc + (file.size || 0), 0),
      activeUsers: 1
    });

    // Generate chart data
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayUploads = uploads.filter(u => {
        const uploadDate = new Date(u.date);
        return uploadDate.toDateString() === date.toDateString();
      }).length;
      
      last7Days.push({
        name: date.toLocaleDateString('en-US', { weekday: 'short' }),
        uploads: dayUploads,
        searches: Math.floor(Math.random() * 10) + dayUploads
      });
    }
    setChartData(last7Days);

    // Recent activity
    const activity = [
      ...uploads.map(u => ({ type: 'upload', name: u.name, time: u.date })),
      ...searches.map(s => ({ type: 'search', name: s.query, time: s.date }))
    ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 5);
    
    setRecentActivity(activity);
  }, []);

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const StatCard = ({ title, value, icon, color, gradient }) => (
    <div className={`bg-gradient-to-br ${gradient} rounded-xl p-6 text-white shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300`}>
      <div className="flex items-center justify-between mb-4">
        <div className="text-3xl">{icon}</div>
        <div className={`bg-white bg-opacity-20 rounded-full p-2`}>
          <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
        </div>
      </div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-sm opacity-90">{title}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-gray-600 mt-1">{greeting}, {user?.name || user?.email?.split('@')[0] || 'User'}! 👋</p>
            </div>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-md hover:shadow-lg"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Files"
            value={stats.totalFiles}
            icon="📁"
            color="blue"
            gradient="from-blue-500 to-blue-600"
          />
          <StatCard
            title="Total Searches"
            value={stats.totalSearches}
            icon="🔍"
            color="green"
            gradient="from-green-500 to-emerald-600"
          />
          <StatCard
            title="Storage Used"
            value={formatBytes(stats.storageUsed)}
            icon="💾"
            color="purple"
            gradient="from-purple-500 to-pink-600"
          />
          <StatCard
            title="Active Users"
            value={stats.activeUsers}
            icon="👥"
            color="orange"
            gradient="from-orange-500 to-red-600"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Line Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Activity Over Time</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Line type="monotone" dataKey="uploads" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', r: 5 }} />
                <Line type="monotone" dataKey="searches" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Weekly Comparison</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar dataKey="uploads" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                <Bar dataKey="searches" fill="#ec4899" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Recent Activity</h3>
          {recentActivity.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-lg">No recent activity yet</p>
              <p className="text-sm mt-2">Start uploading files or searching to see activity here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentActivity.map((activity, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`text-2xl ${activity.type === 'upload' ? 'animate-bounce' : ''}`}>
                      {activity.type === 'upload' ? '📤' : '🔍'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {activity.type === 'upload' ? 'File Uploaded' : 'Search Performed'}
                      </p>
                      <p className="text-sm text-gray-600">{activity.name}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(activity.time).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all cursor-pointer">
            <div className="text-4xl mb-3">📤</div>
            <h4 className="text-xl font-semibold mb-2">Upload Files</h4>
            <p className="text-sm opacity-90">Upload and manage your documents</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all cursor-pointer">
            <div className="text-4xl mb-3">🔍</div>
            <h4 className="text-xl font-semibold mb-2">Search Files</h4>
            <p className="text-sm opacity-90">Find what you're looking for quickly</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 text-white shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all cursor-pointer">
            <div className="text-4xl mb-3">⚙️</div>
            <h4 className="text-xl font-semibold mb-2">Settings</h4>
            <p className="text-sm opacity-90">Customize your experience</p>
          </div>
        </div>
      </main>
    </div>
  );
}
