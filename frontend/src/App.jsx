import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Navbar from "../components/Navbar";
import Home from '../pages/Home';
import Profile from '../pages/Profile';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import ProjectForm from '../pages/ProjectForm';
import ProjectDetail from '../pages/ProjectDetail';
import SearchResults from '../pages/SearchResults';
//import ForgotPassword from '../pages/ForgotPassword';
//import ResetPassword from '../pages/ResetPassword';
import "./App.css"; 

axios.defaults.baseURL = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setUser(user);
      axios.defaults.headers.common['x-user-id'] = user._id;
      console.log('Restored x-user-id:', user._id);
    }
  }, []);


  const login = (data) => {
    const { result: user } = data; 
    localStorage.setItem('user', JSON.stringify(user));
    axios.defaults.headers.common['x-user-id'] = user._id;
    console.log('Set x-user-id:', user._id);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem('user'); 
    delete axios.defaults.headers.common['x-user-id']; 
    setUser(null);
  };

  return (
    <Router>
      <div className="min-h-screen">
        <Navbar user={user} logout={logout} />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login login={login} />} />
            <Route path="/signup" element={<Signup login={login} />} />
            {/* Adjusted Profile route:
                - /profile for the logged-in user's profile
                - /user/:id for viewing other users' profiles
             */}
            <Route path="/profile" element={user ? <Profile userId={user._id} /> : <Login login={login} />} />
            <Route path="/user/:id" element={<Profile />} />
            <Route path="/create-project" element={user ? <ProjectForm /> : <Login login={login} />} />
            <Route path="/project/:id" element={<ProjectDetail user={user} />} /> 
            <Route path="/search" element={<SearchResults />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;