import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from '../services/api';

export default function SearchResults() {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams(); 
  const searchQuery = searchParams.get('q'); 

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchQuery) {
        setSearchResults([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError('');
      try {
        const projectRes = await axios.get(`/projects/search?q=${encodeURIComponent(searchQuery)}`);
        setSearchResults(projectRes.data);
      } catch (err) {
        console.error('Error fetching search results:', err);
        setError('Failed to fetch search results. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchQuery]); 

  if (loading) {
    return <div className="text-center mt-8">Searching for projects...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">
        Search Results for "{searchQuery}"
      </h2>

      {searchResults.length === 0 ? (
        <p className="text-center text-gray-600">No projects found matching your search.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchResults.map((project) => (
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
      )}
    </div>
  );
}