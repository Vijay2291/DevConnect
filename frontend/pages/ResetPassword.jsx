import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from '../services/api'; // Your configured axios instance

export default function ResetPassword({ login }) { // Pass login prop to auto-login after reset
  const { token } = useParams(); // Get token from URL params
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }
    if (password.length < 6) { // Basic password strength check
        setError('Password must be at least 6 characters long.');
        setLoading(false);
        return;
    }

    try {
      const res = await axios.post(`/users/reset-password/${token}`, { password });
      setMessage(res.data.message);
      // Automatically log in the user after successful password reset
      if (res.data.result && res.data.token) {
        login({ result: res.data.result, token: res.data.token });
        navigate('/'); // Redirect to home page
      } else {
        // If login data not returned, prompt user to log in manually
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err) {
      console.error('Reset password error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to reset password. Token may be invalid or expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>

      {message && <p className="text-green-600 text-sm mb-4 text-center">{message}</p>}
      {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium mb-1">New Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-indigo-200"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">Confirm New Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-indigo-200"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
      <p className="mt-4 text-center text-sm">
        <Link to="/login" className="text-indigo-600">Back to Login</Link>
      </p>
    </div>
  );
}