import { useState } from 'react';
import axios from '../services/api'; // Your configured axios instance
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setLoading(true);

        try {
            // *** THIS LINE NEEDS TO BE CHANGED ***
            const res = await axios.put('http://localhost:8000/users/forgot-password', { email, password }); // Add '/users'
            setMessage(res.data.message || 'Password updated successfully!');
            setPassword(''); // Clear password field on success
        } catch (err) {
            console.error('Forgot password error:', err.response?.data || err.message);
            setError(err.response?.data?.message || 'Something went wrong. Please check your email and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>
            <p className="mb-4 text-gray-700 text-center">
                Enter your email address and New Password
            </p>

            {message && <p className="text-green-600 text-sm mb-4 text-center">{message}</p>}
            {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

            <form onSubmit={handleSubmit}>
                <div className="mb-8">
                    <label htmlFor="email" className="block text-sm font-medium mt-4 mb-4">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-indigo-200"
                    />
                    <label htmlFor="password" className="block text-sm font-medium mt-4 mb-4">New Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-indigo-200"
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
                >
                    {loading ? 'Sending...' : 'Reset Password'}
                </button>
            </form>
            <p className="mt-4 text-center text-sm">
                Remembered your password? <Link to="/login" className="text-indigo-600">Login</Link>
            </p>
        </div>
    );
}