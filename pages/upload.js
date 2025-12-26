import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!selectedFile.name.match(/\.(xlsx|xls)$/)) {
        setError('Please select a valid Excel file (.xlsx or .xls)');
        return;
      }
      setFile(selectedFile);
      setError('');
      setUploadResult(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.name.match(/\.(xlsx|xls)$/)) {
      setFile(droppedFile);
      setError('');
    } else {
      setError('Please drop a valid Excel file');
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setError('');
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const data = await res.json();

      if (res.ok) {
        setUploadResult({
          success: true,
          total: data.total,
          inserted: data.inserted,
          duplicates: data.duplicates
        });
        setFile(null);
      } else {
        setError(data.message || 'Upload failed');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 2000);
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
                <h1 className="text-2xl font-bold text-gray-900">Upload Excel File</h1>
                <p className="text-sm text-gray-600">Import applicant data from Excel</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upload Area */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="border-4 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-indigo-400 transition-colors"
          >
            {file ? (
              <div className="space-y-4">
                <div className="text-6xl">📊</div>
                <div>
                  <p className="text-lg font-semibold text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                  >
                    {isUploading ? 'Uploading...' : 'Upload File'}
                  </button>
                  <button
                    onClick={() => setFile(null)}
                    disabled={isUploading}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-6xl">☁️</div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Drop your Excel file here
                  </h3>
                  <p className="text-gray-600 mb-4">or click to browse</p>
                </div>
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer transition-colors"
                >
                  Select Excel File
                </label>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          {isUploading && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Uploading...</span>
                <span className="text-sm font-medium text-indigo-600">{uploadProgress}%</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Success Result */}
          {uploadResult && uploadResult.success && (
            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="text-4xl mr-4">✅</div>
                <div>
                  <h4 className="text-lg font-semibold text-green-900">
                    Upload Successful!
                  </h4>
                  <p className="text-sm text-green-700">
                    Your data has been imported successfully
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {uploadResult.total}
                  </div>
                  <div className="text-sm text-gray-600">Total Records</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {uploadResult.inserted}
                  </div>
                  <div className="text-sm text-gray-600">Inserted</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {uploadResult.duplicates}
                  </div>
                  <div className="text-sm text-gray-600">Duplicates</div>
                </div>
              </div>
              <div className="mt-6 flex justify-center space-x-4">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  View Dashboard
                </button>
                <button
                  onClick={() => router.push('/search')}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Search Applicants
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            📝 File Format Requirements
          </h3>
          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex items-start">
              <span className="text-indigo-600 mr-2">•</span>
              <span>Excel file must contain columns: <strong>applicant_cnic, applicant_name, industry_category, business_sub_sector, mfibankname</strong></span>
            </div>
            <div className="flex items-start">
              <span className="text-indigo-600 mr-2">•</span>
              <span>CNIC must be unique (duplicates will be skipped)</span>
            </div>
            <div className="flex items-start">
              <span className="text-indigo-600 mr-2">•</span>
              <span>Supported formats: .xlsx, .xls</span>
            </div>
            <div className="flex items-start">
              <span className="text-indigo-600 mr-2">•</span>
              <span>Maximum file size: 10MB</span>
            </div>
          </div>
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
