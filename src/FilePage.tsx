import React, { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';

interface StoredFile {
  id: string;
  name: string;
  data: string;
  type: string;
  size: number;
  uploadedAt: string;
  uploadedBy: string;
}

const FilePage = () => {
  const { user, authenticated, ready } = usePrivy();
  const navigate = useNavigate();
  const [files, setFiles] = useState<StoredFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const maxFileSize = 1 * 1024 * 1024 * 1024; // Batas ukuran file 1GB

  // Memeriksa status autentikasi dan memuat file jika sudah login
  useEffect(() => {
    if (ready && !authenticated) {
      navigate('/'); // Jika belum login, arahkan ke halaman utama
    }
    if (authenticated && user) {
      loadFiles(); // Memuat file yang tersimpan jika pengguna sudah login
    }
  }, [ready, authenticated, navigate, user]);

  // Fungsi untuk memuat file dari localStorage
  const loadFiles = () => {
    const storedFiles = localStorage.getItem(`files_${user?.id}`);
    if (storedFiles) {
      setFiles(JSON.parse(storedFiles));
    }
  };

  // Fungsi untuk menangani pemilihan file oleh pengguna
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !event.target.files[0] || !user?.id) return;

    const file = event.target.files[0];

    // Validasi ukuran file
    if (file.size > maxFileSize) {
      alert('Ukuran file melebihi batas 1GB. Silakan pilih file yang lebih kecil.');
      return;
    }

    setUploading(true); // Menandakan proses upload sedang berlangsung
    const reader = new FileReader();

    reader.onload = () => {
      const base64Data = reader.result as string;
      const newFile: StoredFile = {
        id: crypto.randomUUID(), // Membuat ID unik untuk file
        name: file.name,
        data: base64Data, // Menyimpan data file dalam format Base64
        type: file.type,
        size: file.size,
        uploadedAt: new Date().toISOString(), // Menyimpan waktu upload
        uploadedBy: user.id as string, // Menyimpan ID pengguna yang mengupload file
      };

      const updatedFiles = [...files, newFile]; // Menambahkan file baru ke daftar
      setFiles(updatedFiles);
      localStorage.setItem(`files_${user.id}`, JSON.stringify(updatedFiles)); // Menyimpan daftar file ke localStorage
      setUploading(false);
    };

    reader.onerror = () => {
      console.error('Error membaca file');
      setUploading(false);
    };

    reader.readAsDataURL(file); // Membaca file sebagai Base64
  };

  // Fungsi untuk menghapus file dari daftar
  const handleDelete = (fileId: string) => {
    if (!user?.id) return;

    const updatedFiles = files.filter((file) => file.id !== fileId); // Menghapus file berdasarkan ID
    setFiles(updatedFiles);
    localStorage.setItem(`files_${user.id}`, JSON.stringify(updatedFiles));
  };

  // Fungsi untuk mendownload file
  const handleDownload = (file: StoredFile) => {
    const link = document.createElement('a');
    link.href = file.data; // Menggunakan data Base64 untuk mendownload file
    link.download = file.name; // Memberi nama file yang akan didownload
    link.click();
  };

  // Tampilkan pesan loading jika aplikasi belum siap
  if (!ready) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // Jangan tampilkan apa pun jika pengguna belum terautentikasi
  if (!authenticated) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold mb-6">File Saya</h1>

          {/* Bagian untuk upload file */}
          <div className="mb-8 p-6 border-2 border-dashed border-gray-300 rounded-lg text-center">
            <input
              type="file"
              onChange={handleFileSelect}
              className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              disabled={uploading}
            />
            <p className="text-sm text-gray-500 mt-2">
              {uploading ? 'Mengupload...' : 'Pilih file untuk diupload (maksimal 1GB)'}
            </p>
          </div>

          {/* Daftar file */}
          <div className="space-y-4">
            {files.length > 0 ? (
              files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm"
                >
                  <div>
                    <h3 className="font-medium text-lg text-gray-900">{file.name}</h3>
                    <p className="text-sm text-gray-600">Ukuran: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    <p className="text-sm text-gray-600">Diunggah: {new Date(file.uploadedAt).toLocaleString()}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDownload(file)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md"
                    >
                      Download
                    </button>
                    <button
                      onClick={() => handleDelete(file.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">Belum ada file yang diupload</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default FilePage;
