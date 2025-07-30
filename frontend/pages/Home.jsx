import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../services/api';

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get('/projects');
      setProjects(res.data);
      console.log("Projects:", res.data);
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    window.location.href = `/search?q=${encodeURIComponent(search)}`;
  };

  return (
    <div>
      <form onSubmit={handleSearch} className="mb-8 max-w-xl mx-auto">
        <input
          type="text"
          placeholder="Search projects by title or description..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </form>

      <h2 className="text-2xl font-bold mb-6">Latest Projects</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project._id} className="bg-white p-5 rounded-lg shadow">
            <div className="flex items-center gap-3 mb-3">
              {project.userId?.avatar ? (
                <img
                  src={project.userId.avatar}
                  alt="avatar"
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
                  ?
                </div>
              )}
              <div>
                {project.userId ? (
                  <Link
                    to={`/user/${project.userId._id}`}
                    className="font-medium hover:underline"
                  >
                    {project.userId.name || project.userId.username || 'Unnamed User'}
                  </Link>
                ) : (
                  <p className="text-gray-500 italic">Unknown User</p>
                )}
                <p className="text-sm text-gray-500">
                  {new Date(project.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
            <p className="text-gray-700 mb-4 line-clamp-3">{project.description}</p>

            {project.imageUrl && (
              <img
                src={project.imageUrl}
                alt="project"
                className="w-full h-40 object-cover rounded mb-3"
              />
            )}

            {project.projectUrl && (
              <a
                href={project.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 text-sm"
              >
                View Project →
              </a>
            )}

            <Link
              to={`/project/${project._id}`}
              className="block mt-4 text-sm text-gray-500"
            >
              {project.comments?.length || 0} comments
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}