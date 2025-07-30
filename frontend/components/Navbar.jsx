import { Link } from 'react-router-dom';

export default function Navbar({ user, logout }) {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-indigo-600">DevConnect</Link>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/create-project" className="text-sm font-medium hover:text-indigo-600">+ Post Project</Link>
              <Link to="/profile" className="text-sm font-medium hover:text-indigo-600">Profile</Link> {/* Link to current user's profile */}
              <button onClick={logout} className="text-sm text-gray-600 hover:text-red-600">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium hover:text-indigo-600">Login</Link>
              <Link to="/signup" className="text-sm font-medium bg-indigo-600 text-white px-4 py-1 rounded hover:bg-indigo-700">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}