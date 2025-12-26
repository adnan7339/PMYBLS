import { useState, useEffect } from 'react';

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [files, setFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [sortBy, setSortBy] = useState('date');
  const [filterType, setFilterType] = useState('all');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    // Load files from localStorage
    const uploads = JSON.parse(localStorage.getItem('uploads') || '[]');
    setFiles(uploads);
    setFilteredFiles(uploads);
  }, []);

  useEffect(() => {
    // Save search to history
    if (searchQuery) {
      const searches = JSON.parse(localStorage.getItem('searches') || '[]');
      searches.push({
        query: searchQuery,
        date: new Date().toISOString()
      });
      localStorage.setItem('searches', JSON.stringify(searches));
    }
  }, [searchQuery]);

  useEffect(() => {
    setIsSearching(true);
    
    // Simulate search delay
    const timer = setTimeout(() => {
      let results = [...files];

      // Filter by search query
      if (searchQuery) {
        results = results.filter(file =>
          file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (file.description && file.description.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      }

      // Filter by type
      if (filterType !== 'all') {
        results = results.filter(file => {
          const fileType = file.type?.split('/')[0] || 'other';
          return fileType === filterType || (filterType === 'document' && file.type?.includes('pdf'));
        });
      }

      // Sort results
      results.sort((a, b) => {
        switch (sortBy) {
          case 'name':
            return a.name.localeCompare(b.name);
          case 'size':
            return (b.size || 0) - (a.size || 0);
          case 'date':
          default:
            return new Date(b.date) - new Date(a.date);
        }
      });

      setFilteredFiles(results);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, files, sortBy, filterType]);

  const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (type) => {
    if (!type) return '📄';
    if (type.includes('image')) return '🖼️';
    if (type.includes('video')) return '🎥';
    if (type.includes('audio')) return '🎵';
    if (type.includes('pdf')) return '📕';
    if (type.includes('zip') || type.includes('rar')) return '📦';
    return '📄';
  };

  const highlightText = (text, query) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() ? 
        <span key={i} className="bg-yellow-200 font-semibold">{part}</span> : 
        part
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Search Your Files
          </h1>
          <p className="text-gray-600 text-lg">Find anything instantly with powerful search and filters</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search files by name or description..."
              className="w-full pl-14 pr-4 py-5 text-lg border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-purple-200 focus:border-purple-500 transition-all shadow-lg"
            />
            {isSearching && (
              <div className="absolute inset-y-0 right-0 pr-5 flex items-center">
                <svg className="animate-spin h-6 w-6 text-purple-500" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
            )}
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="mb-8 flex flex-wrap gap-4 items-center justify-center">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Filter:</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white shadow-sm"
            >
              <option value="all">All Files</option>
              <option value="image">Images</option>
              <option value="video">Videos</option>
              <option value="audio">Audio</option>
              <option value="document">Documents</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white shadow-sm"
            >
              <option value="date">Date</option>
              <option value="name">Name</option>
              <option value="size">Size</option>
            </select>
          </div>

          <div className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium">
            {filteredFiles.length} {filteredFiles.length === 1 ? 'result' : 'results'}
          </div>
        </div>

        {/* Results */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          {filteredFiles.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-8xl mb-6">
                {searchQuery ? '🔍' : '📂'}
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                {searchQuery ? 'No files found' : 'No files yet'}
              </h3>
              <p className="text-gray-600">
                {searchQuery 
                  ? 'Try adjusting your search or filters' 
                  : 'Upload some files to get started'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFiles.map((file, idx) => (
                <div
                  key={idx}
                  className="group relative bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl p-6 hover:border-purple-500 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                  style={{ animationDelay: `${idx * 0.05}s` }}
                >
                  {/* File Icon */}
                  <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                    {getFileIcon(file.type)}
                  </div>

                  {/* File Info */}
                  <h3 className="font-semibold text-lg text-gray-800 mb-2 truncate">
                    {highlightText(file.name, searchQuery)}
                  </h3>

                  {file.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {highlightText(file.description, searchQuery)}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span>{formatBytes(file.size)}</span>
                    <span>{new Date(file.date).toLocaleDateString()}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button className="flex-1 px-3 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm font-medium">
                      Open
                    </button>
                    <button className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-0 group-hover:opacity-5 rounded-xl transition-opacity pointer-events-none" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Search Tips */}
        {files.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <span className="text-2xl">💡</span>
              Search Tips
            </h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-purple-500 font-bold">•</span>
                <span>Use filters to narrow down results by file type</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 font-bold">•</span>
                <span>Sort by date, name, or size to find files quickly</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500 font-bold">•</span>
                <span>Search matches both file names and descriptions</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
