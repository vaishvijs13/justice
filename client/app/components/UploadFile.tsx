import React, { useState } from 'react';
import axios from 'axios';

interface SearchResult {
  video_filename: string;
  text_snippet: string;
}

const FileUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>('');
  const [query, setQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

  const API_URL = 'http://127.0.0.1:8080';

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      setSelectedFile(files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage('Please select a file first');
      return;
    }

    const formData = new FormData();
    formData.append('video', selectedFile);

    try {
      setMessage('Uploading and processing the video...');
      const response = await axios.post(`${API_URL}/process`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage(response.data.message);
    } catch (error: any) {
      setMessage(`Error: ${error.response?.data?.error || 'Something went wrong'}`);
    }
  };

  const handleSearch = async () => {
    if (!query) {
      setMessage('Please enter a search query');
      return;
    }

    try {
      setMessage('Searching for relevant clips...');
      const response = await axios.get(`${API_URL}/search`, {
        params: { query, top_k: 5 },
      });

      setSearchResults(response.data.results || []);
    } catch (error: any) {
      setMessage(`Error: ${error.response?.data?.error || 'Something went wrong'}`);
    }
  };

  return (
    <div className="bg-white shadow-lg p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-slate-800">Upload a File</h2>
      <input 
        type="file" 
        onChange={handleFileChange} 
        className="w-full border border-gray-300 rounded-lg p-2 text-slate-800"
      />
      <button onClick={handleUpload} className="mt-4 text-sm bg-slate-800 text-white py-2 px-3 rounded hover:bg-slate-400 cursor">Upload</button>
      {selectedFile && (
        <p className="mt-2 text-green-600">Selected File: {selectedFile.name}</p>
      )}
        <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4 text-slate-800">Search for Content</h2>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your query"
          className="text-black px-4 py-2 w-full"
          style={{ textAlign: 'left' }}
        />
      <button onClick={handleSearch} className="mt-4 bg-slate-800 text-white text-sm py-2 px-3 rounded hover:bg-slate-400">Search</button>
      </div>

        <div>
        {searchResults.length > 0 && (
          <>
            <h2 className="text-xl font-semibold mb-4 text-slate-800">Top Matching Clips</h2>
            {searchResults.map((result, index) => (
              <div key={index}>
                <video
                  controls
                  src={`http://127.0.0.1:8080/uploads/${result.video_filename}`}
                  style={{ width: '100%' }}
                />
                <p>{result.text_snippet}</p>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
