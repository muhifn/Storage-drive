import { usePrivy } from '@privy-io/react-auth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
  const { login, logout, authenticated, ready } = usePrivy();
  const navigate = useNavigate();

  // Memeriksa status autentikasi dan mengarahkan ke halaman berikutnya jika sudah login
  useEffect(() => {
    if (ready && authenticated) {
      navigate('/next');
    }
  }, [ready, authenticated, navigate]);

  // Fungsi untuk menangani login dengan penanganan error
  const handleLogin = async () => {
    try {
      // Memulai proses login
      const loginResult = await login();
      if (loginResult) {
        // Jika login berhasil, arahkan ke halaman berikutnya
        navigate('/next');
      }
    } catch (error) {
      // Menampilkan error jika login gagal
      console.error('Login gagal:', error);
    }
  };

  // Fungsi untuk menangani logout
  const handleLogout = async () => {
    try {
      // Memulai proses logout
      await logout();
      // Jika logout berhasil, arahkan ke halaman utama
      navigate('/');
    } catch (error) {
      // Menampilkan error jika logout gagal
      console.error('Logout gagal:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex justify-center space-x-8 mb-8">
          {/* Logo Vite */}
          <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">
            <img src={viteLogo} className="h-16 animate-spin-slow" alt="Vite logo" />
          </a>
          {/* Logo React */}
          <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
            <img src={reactLogo} className="h-16 animate-spin-slow" alt="React logo" />
          </a>
        </div>
        
        {/* Judul aplikasi */}
        <h1 className="text-3xl font-bold text-center mb-8">Web Drive</h1>
        
        <div className="space-y-4">
          {/* Tampilkan tombol login jika belum terautentikasi */}
          {!authenticated && (
            <button
              onClick={handleLogin}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Login
            </button>
          )}
          
          {/* Tampilkan tombol logout jika sudah terautentikasi */}
          {authenticated && (
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              Logout
            </button>
          )}
        </div>

        {/* Deskripsi aplikasi */}
        <p className="mt-8 text-center text-gray-600 text-sm">
          Penyimpanan file aman dengan teknologi Web3
        </p>
      </div>
    </div>
  );
}

export default App;
