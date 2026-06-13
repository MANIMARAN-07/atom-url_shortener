import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import ThemeToggle from '../components/ThemeToggle';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Click {
  _id: string;
  ipHash: string;
  userAgent: string;
  referrer: string;
  createdAt: string;
}

interface AnalyticsData {
  totalClicks: number;
  clicks: Click[];
}

const Analytics = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get(`/analytics/${id}`);
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAnalytics();
  }, [id]);

  if (!data) return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;

  // Process data for charts
  const clicksByDate = data.clicks.reduce((acc: any, click) => {
    const date = new Date(click.createdAt).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.keys(clicksByDate).map(date => ({
    date,
    clicks: clicksByDate[date],
  }));

  return (
    <div className="min-h-screen bg-gray-900">
      <header className="header">
        <Link to="/dashboard" className="logo">Atom</Link>
        <div className="nav-links flex items-center">
          <ThemeToggle />
          <Link to="/dashboard" className="link" style={{ marginLeft: '1.5rem' }}>Back</Link>
        </div>
      </header>

      <main className="main-content max-w-6xl mx-auto space-y-8">
        <div className="card flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Link Analytics</h1>
            <p className="text-gray-400">Total lifetime clicks: <span className="text-white font-bold text-xl">{data.totalClicks}</span></p>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold mb-6">Click Timeline</h2>
          <div style={{ width: '100%', height: 300 }}>
            {chartData.length > 0 ? (
              <ResponsiveContainer>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="date" stroke="var(--text-muted)" />
                  <YAxis stroke="var(--text-muted)" />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--border-radius)', color: 'var(--text-main)' }} itemStyle={{ color: 'var(--text-main)' }} />
                  <Line type="monotone" dataKey="clicks" stroke="var(--text-main)" strokeWidth={3} dot={{ r: 4, fill: 'var(--text-main)' }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">No click data available yet.</div>
            )}
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold mb-6">Recent Clicks Log</h2>
          <div style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>IP Hash</th>
                  <th>User Agent</th>
                  <th>Referrer</th>
                </tr>
              </thead>
              <tbody>
                {data.clicks.slice().reverse().slice(0, 50).map(click => (
                  <tr key={click._id}>
                    <td>{new Date(click.createdAt).toLocaleString()}</td>
                    <td className="text-gray-400" style={{ fontSize: '0.8rem' }}>{click.ipHash.substring(0, 16)}...</td>
                    <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{click.userAgent}</td>
                    <td>{click.referrer || 'Direct'}</td>
                  </tr>
                ))}
                {data.clicks.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center p-8 text-gray-400">No clicks recorded.</td>
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

export default Analytics;
