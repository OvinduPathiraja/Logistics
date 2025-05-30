import React, { useState } from 'react';
import { useAuth } from 'react-oidc-context';

const CsvUploadForm = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const auth = useAuth();
  const userEmail = auth.user?.profile?.email;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !userEmail) return;

    setUploading(true);

    try {
      const text = await file.text();
      const lines = text
        .split('\n')
        .map(line => line.trim())
        .filter(line => line !== '');

      const [header, ...dataRows] = lines;

      const modifiedRows = dataRows.map((line) => {
        const cols = line.split(',');
        while (cols.length < 17) cols.push('');
        cols[16] = userEmail;
        return cols.join(',');
      });

      const modifiedCsv = [header, ...modifiedRows].join('\n');
      const blob = new Blob([modifiedCsv], { type: 'text/csv' });

      const timestamp = Date.now();
      const url = `https://xwf1vv5ixd.execute-api.eu-north-1.amazonaws.com/prod/ultraod-s3-1/test.csv`;

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/csv',
        },
        body: blob,
      });

      if (res.ok) {
        alert('✅ Upload successful!');
        setFile(null);
      } else {
        const errText = await res.text();
        console.error('Upload failed:', errText);
        alert('❌ Upload failed: ' + errText);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('⚠️ An error occurred during upload.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="border p-2"
      />
      <button
        type="submit"
        disabled={!file || uploading}
        className={`px-4 py-2 rounded text-white ${uploading ? 'bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'}`}
      >
        {uploading ? 'Uploading...' : 'Upload CSV'}
      </button>
    </form>
  );
};

export default CsvUploadForm;
