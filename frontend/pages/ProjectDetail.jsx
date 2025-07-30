import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../services/api'; 

export default function ProjectDetail({ user }) { 
  const { id } = useParams(); 
  const [project, setProject] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      setError(''); 
      const res = await axios.get(`/projects/${id}`); 
      setProject(res.data);
    } catch (err) {
      console.error('Error fetching project:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to fetch project.');
      setProject(null); 
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('You must be logged in to comment.');
      return;
    }
    if (!newComment.trim()) {
      alert('Comment cannot be empty.');
      return;
    }

    try {
      setLoading(true);
      setError(''); 
      await axios.post(`/projects/${id}/comments`, { content: newComment });
      setNewComment('');
      fetchProject(); 
    } catch (err) {
      console.error('Error posting comment:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to post comment.');
    } finally {
      setLoading(false);
    }
  };

  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;
  if (!project) return <div className="text-center mt-10">Loading project or project not found...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-5 bg-white shadow rounded">
      <h2 className="text-3xl font-bold mb-4">{project.title}</h2>
      <p className="mb-4">{project.description}</p>
      {project.imageUrl && (
        <img src={project.imageUrl} alt="project" className="w-full h-auto rounded mb-4" />
      )}
      {project.projectUrl && (
        <a href={project.projectUrl} className="text-blue-600 underline mb-6 block" target="_blank" rel="noopener noreferrer">
          Visit Project
        </a>
      )}

      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-3">Comments</h3>
        {project.comments?.length === 0 && <p className="text-gray-500">No comments yet.</p>}
        <ul className="mb-6 space-y-4">
          {project.comments?.map((comment) => (
            <li key={comment._id} className="border-b pb-2">
              <div className="flex items-center gap-2 mb-1">
                {comment.userId?.avatar ? (
                  <img src={comment.userId.avatar} alt="avatar" className="w-6 h-6 rounded-full object-cover" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs text-white">?</div>
                )}
                <span className="font-medium">{comment.userId?.name || comment.userId?.username || 'User'}</span>
                <span className="text-xs text-gray-400 ml-2">{new Date(comment.createdAt).toLocaleString()}</span>
              </div>
              <p>{comment.content}</p>
            </li>
          ))}
        </ul>

        {user ? ( 
          <form onSubmit={handleCommentSubmit} className="flex flex-col gap-3">
            <textarea
              rows="3"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add your comment..."
              className="border p-3 rounded w-full"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Posting...' : 'Post Comment'}
            </button>
          </form>
        ) : (
          <p className="text-center text-gray-600">Please log in to add a comment.</p>
        )}
      </div>
    </div>
  );
}