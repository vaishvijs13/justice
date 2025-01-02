import { useState } from "react";

const FileUpload = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    console.log("Uploaded File:", e.target.files[0]);
  };

  return (
    <div className="bg-white shadow-lg p-6 rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-slate-800">Upload a File</h2>
      <input 
        type="file" 
        onChange={handleFileChange} 
        className="w-full border border-gray-300 rounded-lg p-2 text-slate-800"
      />
      {file && (
        <p className="mt-2 text-green-600">Selected File: {file.name}</p>
      )}
    </div>
  );
};

export default FileUpload;
