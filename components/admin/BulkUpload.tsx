// components/ExcelUpload.tsx
import React, { useState } from 'react';
import axios from 'axios';

const BulkUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/api/admin/products/bulk', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;

    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <div>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload Excel</button>
    </div>
  );
};

export default BulkUpload;
