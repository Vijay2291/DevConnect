import { useState, useEffect } from 'react';
import axios from '../services/api';
import { useParams } from 'react-router-dom';

export default function Profile({ userId: propUserId }) { 
  const { id: paramId } = useParams(); 
  const currentUserId = propUserId || paramId; 

  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    avatar: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!currentUserId) {
      setError('User ID not provided.');
      setLoading(false);
      return;
    }
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/users/${currentUserId}`);
        const user = res.data;
        setFormData({
          name: user.name || '',
          bio: user.bio || '',
          avatar: user.avatar || ''
        });
      } catch (err) {
        console.error('Failed to load user', err);
        setError(err.response?.data?.message || 'User not found');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [currentUserId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 
    try {
      await axios.put(`/users/${currentUserId}`, formData);
      alert('Profile updated successfully!');
      window.location.reload();
    } catch (err) {
      console.error('Error updating profile:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  if (loading) return <div className="text-center">Loading profile...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!formData.name && !formData.bio && !formData.avatar && !loading) {
    return <div className="text-center">Profile data not available.</div>;
  }

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-indigo-200"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-indigo-200"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Avatar URL</label>
          <input
            type="text"
            name="avatar"
            value={formData.avatar}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-indigo-200"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
        >
          Save
        </button>
      </form>
    </div>
  );
}