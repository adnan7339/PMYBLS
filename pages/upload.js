import { useState, useRef } from 'react';

export default function Upload() {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    addFiles(selectedFiles);
  };

  const addFiles = (newFiles) => {
    const filesWithPreview = newFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : null,
      description: ''
    }));
    setFiles(prev => [...prev, ...filesWithPreview]);
  };

  const removeFile = (id) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    setUploadProgress(prev => {
      const newProgress = { ...prev };
      delete newProgress[id];
      return newProgress;
    });
  };

  const updateDescription = (id, description) => {
    setFiles(prev => prev.map(f => 
      f.id === id ? { ...f, description } : f
    ));
  };

  const uploadFiles = async () => {
    for (const fileData of files) {
      // Simulate upload progress
      setUploadProgress(prev => ({ ...prev, [fileData.id]: 0 }));
      
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setUploadProgress(prev => ({ ...prev, [fileData.id]: i }));
      }

      // Save to localStorage
      const uploads = JSON.parse(localStorage.getItem('uploads') || '[]');
      uploads.push({
        name: fileData.name,
        size: fileData.size,
        type: fileData.type,
        description: fileData.description,
        date: new Date().toISOString()
      });
      localStorage.setItem('uploads', JSON.stringify(uploads));
      
      setUploadedFiles(prev => [...prev, fileData.id]);
    }

    // Clear after successful upload
    setTimeout(() => {
      setFiles([]);
      setUploadProgress({});
      setUploadedFiles([]);
    }, 2000);
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
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
    if (type.includes('word') || type.includes('document')) return '📝';
    if (type.includes('sheet') || type.includes('excel')) return '📊';
    return '📄';
  };

  const totalSize = files.reduce((acc, f) => acc + f.size, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-4">
            Upload Your Files
          </h1>
          <p className="text-gray-600 text-lg">Drag and drop or click to select files</p>
        </div>

        {/* Drop Zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            relative border-4 border-dashed rounded-3xl p-12 mb-8 text-center cursor-pointer
            transition-all duration-300 ease-in-out
            ${isDragging 
              ? 'border-emerald-500 bg-emerald-50 scale-105' 
              : 'border-gray-300 bg-white hover:border-emerald-400 hover:bg-emerald-50/50'
            }
            shadow-lg hover:shadow-2xl
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <div className={`transition-transform duration-300 ${isDragging ? 'scale-110' : ''}`}>
            <div className="text-8xl mb-6">
              {isDragging ? '📥' : '☁️'}
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              {isDragging ? 'Drop files here!' : 'Drag & Drop Files'}
            </h3>
            <p className="text-gray-600 mb-4">
              or click to browse from your computer
            </p>
            <div className="inline-block px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all">
              Select Files
            </div>
          </div>

          {/* Animated Border */}
          {isDragging && (
            <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
              <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-emerald-500 to-teal-500 opacity-10" />
            </div>
          )}
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-3">
                <span>📋</span>
                Selected Files ({files.length})
              </h3>
              <div className="text-sm text-gray-600 bg-gray-100 px-4 py-2 rounded-lg">
                Total: {formatBytes(totalSize)}
              </div>
            </div>

            <div className="space-y-4">
              {files.map((fileData, idx) => (
                <div
                  key={fileData.id}
                  className="group relative bg-gradient-to-r from-gray-50 to-white border-2 border-gray-200 rounded-xl p-6 hover:border-emerald-400 transition-all"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <div className="flex items-start gap-4">
                    {/* File Preview/Icon */}
                    <div className="flex-shrink-0">
                      {fileData.preview ? (
                        <img 
                          src={fileData.preview} 
                          alt={fileData.name}
                          className="w-20 h-20 object-cover rounded-lg shadow-md"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg flex items-center justify-center text-4xl">
                          {getFileIcon(fileData.type)}
                        </div>
                      )}
                    </div>

                    {/* File Info */}
                    <div className="flex-grow min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-grow min-w-0 pr-4">
                          <h4 className="font-semibold text-gray-800 truncate text-lg">
                            {fileData.name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {formatBytes(fileData.size)} • {fileData.type || 'Unknown type'}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFile(fileData.id)}
                          className="flex-shrink-0 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      {/* Description Input */}
                      <input
                        type="text"
                        value={fileData.description}
                        onChange={(e) => updateDescription(fileData.id, e.target.value)}
                        placeholder="Add a description (optional)"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                      />

                      {/* Upload Progress */}
                      {uploadProgress[fileData.id] !== undefined && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-600">
                              {uploadedFiles.includes(fileData.id) ? 'Uploaded!' : 'Uploading...'}
                            </span>
                            <span className="font-semibold text-emerald-600">
                              {uploadProgress[fileData.id]}%
                            </span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-300 rounded-full ${
                                uploadedFiles.includes(fileData.id)
                                  ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                                  : 'bg-gradient-to-r from-emerald-500 to-teal-500'
                              }`}
                              style={{ width: `${uploadProgress[fileData.id]}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Upload Button */}
            <div className="mt-6 flex gap-4">
              <button
                onClick={uploadFiles}
                disabled={Object.keys(uploadProgress).length > 0}
                className="flex-1 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold text-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {Object.keys(uploadProgress).length > 0 ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Uploading Files...
                  </span>
                ) : (
                  `Upload ${files.length} ${files.length === 1 ? 'File' : 'Files'}`
                )}
              </button>
              
              <button
                onClick={() => setFiles([])}
                className="px-6 py-4 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        )}

        {/* Upload Tips */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200">
          <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <span className="text-2xl">💡</span>
            Upload Tips
          </h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">✓</span>
              <span>You can upload multiple files at once</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">✓</span>
              <span>Add descriptions to make files easier to find later</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">✓</span>
              <span>Supported formats: Images, Videos, Documents, and more</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">✓</span>
              <span>Files are stored locally in your browser</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
