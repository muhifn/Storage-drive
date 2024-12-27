import React, { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import './ProfilePage.css';

interface UserProfile {
  displayName: string;
  email: string;
  walletAddress: string;
}

const ProfilePage = () => {
  const { user, authenticated, ready, linkEmail, linkWallet } = usePrivy(); // Mengambil fungsi dan status dari Privy
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile>({ // State untuk menyimpan data profil
    displayName: '',
    email: '',
    walletAddress: ''
  });
  const [isEditing, setIsEditing] = useState(false); // State untuk mode pengeditan

  // Efek untuk memastikan pengguna sudah autentikasi sebelum mengakses halaman ini
  useEffect(() => {
    if (ready && !authenticated) {
      navigate('/');
    }

    // Memuat data profil dari localStorage atau dari objek user
    if (user) {
      const savedProfile = localStorage.getItem(`profile_${user.id}`);
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      } else {
        setProfile({
          displayName: user.name || 'User',
          email: user.email?.address || '',
          walletAddress: user.wallet?.address || ''
        });
      }
    }
  }, [ready, authenticated, user, navigate]);

  // Fungsi untuk menyimpan perubahan profil ke localStorage
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    localStorage.setItem(`profile_${user.id}`, JSON.stringify(profile));
    setIsEditing(false);
  };

  // Fungsi untuk menghubungkan email pengguna
  const handleEmailLink = async () => {
    try {
      await linkEmail();
      if (user?.email?.address) {
        const updatedProfile = {
          ...profile,
          email: user.email.address
        };
        setProfile(updatedProfile);
        localStorage.setItem(`profile_${user.id}`, JSON.stringify(updatedProfile));
      }
    } catch (error) {
      console.error('Error linking email:', error);
    }
  };

  // Fungsi untuk menghubungkan dompet pengguna
  const handleWalletLink = async () => {
    try {
      await linkWallet();
      if (user?.wallet?.address) {
        setProfile((prevProfile) => ({
          ...prevProfile,
          walletAddress: user.wallet.address
        }));
        localStorage.setItem(`profile_${user.id}`, JSON.stringify(profile));
      }
    } catch (error) {
      console.error('Error linking wallet:', error);
    }
  };

  // Fungsi untuk memutuskan tautan email
  const handleUnlinkEmail = () => {
    setProfile((prevProfile) => ({ ...prevProfile, email: '' }));
    localStorage.setItem(`profile_${user.id}`, JSON.stringify({ ...profile, email: '' }));
  };

  // Fungsi untuk memutuskan tautan dompet
  const handleUnlinkWallet = () => {
    setProfile((prevProfile) => ({ ...prevProfile, walletAddress: '' }));
    localStorage.setItem(`profile_${user.id}`, JSON.stringify({ ...profile, walletAddress: '' }));
  };

  if (!ready || !authenticated) return null; // Menampilkan halaman kosong jika belum siap atau belum autentikasi

  return (
    <div className="profile-page min-h-screen"> {/* Kelas profile-page diterapkan */}
      <Navbar />
  
      <main className="profile-page-container mx-auto px-4 py-8">
        <div className="profile-page-card mx-auto rounded-lg shadow p-6"> {/* Kelas khusus untuk card */}
          <div className="profile-page-header flex items-center space-x-4 mb-8">
            <img
              src={user?.picture || 'https://via.placeholder.com/80'}
              alt="Profile"
              className="profile-page-avatar w-20 h-20 rounded-full border-4"
            />
            <div>
              <h1 className="profile-page-title text-2xl font-bold">Profile Settings</h1>
              <p className="profile-page-subtitle">Manage your profile and connections</p>
            </div>
          </div>
  
          {/* Form untuk pengaturan profil */}
          <form onSubmit={handleProfileUpdate} className="profile-page-form space-y-6">
            <div>
              <label className="profile-page-label block text-sm font-medium mb-2">
                Display Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profile.displayName}
                  onChange={(e) =>
                    setProfile({ ...profile, displayName: e.target.value })
                  }
                  className="profile-page-input w-full px-3 py-2 border rounded-md"
                />
              ) : (
                <div className="profile-page-display flex justify-between items-center">
                  <p className="profile-page-display-text">{profile.displayName}</p>
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="profile-page-button-edit"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>
  
            <div>
              <label className="profile-page-label block text-sm font-medium mb-2">
                Connected Email
              </label>
              <div className="profile-page-display flex justify-between items-center">
                <p className="profile-page-display-text">
                  {profile.email || 'No email connected'}
                </p>
                {profile.email ? (
                  <button
                    type="button"
                    onClick={handleUnlinkEmail}
                    className="profile-page-button-unlink"
                  >
                    Unlink
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleEmailLink}
                    className="profile-page-button-link"
                  >
                    Connect Email
                  </button>
                )}
              </div>
            </div>
  
            <div>
              <label className="profile-page-label block text-sm font-medium mb-2">
                Connected Wallet
              </label>
              <div className="profile-page-display flex justify-between items-center">
                <p className="profile-page-display-text">
                  {profile.walletAddress
                    ? `${profile.walletAddress.slice(0, 6)}...${profile.walletAddress.slice(-4)}`
                    : 'No wallet connected'}
                </p>
                {profile.walletAddress ? (
                  <button
                    type="button"
                    onClick={handleUnlinkWallet}
                    className="profile-page-button-unlink"
                  >
                    Unlink
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleWalletLink}
                    className="profile-page-button-link"
                  >
                    Connect Wallet
                  </button>
                )}
              </div>
            </div>
  
            {isEditing && (
              <div className="profile-page-actions flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="profile-page-button-cancel"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="profile-page-button-save"
                >
                  Save Changes
                </button>
              </div>
            )}
          </form>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
