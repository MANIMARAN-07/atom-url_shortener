import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';

interface Url {
  _id: string;
  shortCode: string;
  originalUrl: string;
  title: string;
  totalClicks: number;
  createdAt: string;
}

const Dashboard = () => {
  const [urls, setUrls] = useState<Url[]>([]);
  const [newUrl, setNewUrl] = useState('');
  const [alias, setAlias] = useState('');
  const [title, setTitle] = useState('');
  const { logout } = useAuth();
  const [error, setError] = useState('');

  const fetchUrls = async () => {
    try {
      const res = await api.get('/urls');
      setUrls(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/urls', { originalUrl: newUrl, customAlias: alias, title });
      setNewUrl('');
      setAlias('');
      setTitle('');
      fetchUrls();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to shorten URL');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/urls/${id}`);
      fetchUrls();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="header">
        <Link to="/dashboard" className="logo">Atom</Link>
        <div className="nav-links flex items-center">
          <ThemeToggle />
          <button onClick={logout} className="text-gray-400 hover:text-white" style={{ background: 'none', border: 'none', cursor: 'pointer', marginLeft: '1.5rem' }}>
            Logout
          </button>
        </div>
      </header>

      <main className="main-content max-w-6xl mx-auto space-y-8">
        <div className="card">
          <h2 className="text-xl font-bold mb-6">Create New Link</h2>
          {error && <div className="error-box">{error}</div>}
          <form onSubmit={handleShorten} className="flex" style={{ gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 300px' }}>
              <label className="block text-sm font-medium text-gray-400 mb-2">Destination URL</label>
              <input
                type="url"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="https://long-url.com/something"
                className="input-field"
                required
              />
            </div>
            <div style={{ flex: '1 1 150px' }}>
              <label className="block text-sm font-medium text-gray-400 mb-2">Custom Alias (Optional)</label>
              <input
                type="text"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                placeholder="my-link"
                className="input-field"
              />
            </div>
            <div style={{ flex: '1 1 200px' }}>
              <label className="block text-sm font-medium text-gray-400 mb-2">Title (Optional)</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Campaign Fall 2026"
                className="input-field"
              />
            </div>
            <div>
              <button type="submit" className="btn-primary" style={{ padding: '0.75rem 2rem' }}>Shorten</button>
            </div>
          </form>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold mb-6">Your Links</h2>
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Short Link</th>
                  <th>Original URL</th>
                  <th>Clicks</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {urls.map((url) => (
                  <tr key={url._id}>
                    <td>
                      <div className="flex items-center" style={{ gap: '0.5rem' }}>
                        <a href={`https://3b009e4b436817.lhr.life/${url.shortCode}`} target="_blank" rel="noopener noreferrer" className="link font-bold">
                          /{url.shortCode}
                        </a>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(`https://3b009e4b436817.lhr.life/${url.shortCode}`);
                            alert('Copied to clipboard!');
                          }}
                          className="text-gray-400 hover:text-white"
                          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.7rem', textTransform: 'uppercase', fontFamily: 'Oswald' }}
                          title="Copy to clipboard"
                        >
                          Copy
                        </button>
                      </div>
                    </td>
                    <td style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      <a href={url.originalUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                        {url.originalUrl}
                      </a>
                    </td>
                    <td>
                      <span className="badge">{url.totalClicks} clicks</span>
                    </td>
                    <td className="text-gray-400 text-sm">
                      {new Date(url.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <Link to={`/analytics/${url._id}`} className="link" style={{ marginRight: '1rem' }}>Stats</Link>
                      <button onClick={() => handleDelete(url._id)} className="text-gray-400 hover:text-white" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {urls.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center p-8 text-gray-400">
                      No links created yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
