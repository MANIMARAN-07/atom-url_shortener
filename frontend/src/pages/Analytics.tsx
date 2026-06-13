import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import ThemeToggle from '../components/ThemeToggle';
import { useTheme } from '../context/ThemeContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { UAParser } from 'ua-parser-js';

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
  const { theme } = useTheme();

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

  const COLORS = theme === 'dark' 
    ? ['#ffffff', '#d4d4d4', '#a3a3a3', '#737373', '#404040'] 
    : ['#111111', '#404040', '#737373', '#a3a3a3', '#d4d4d4'];

  const clicksByDate = data.clicks.reduce((acc: any, click) => {
    const date = new Date(click.createdAt).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.keys(clicksByDate).map(date => ({
    date,
    clicks: clicksByDate[date],
  }));

  const browserData: Record<string, number> = {};
  const osData: Record<string, number> = {};

  data.clicks.forEach(click => {
    const parser = new UAParser(click.userAgent);
    const browser = parser.getBrowser().name || 'Unknown';
    const os = parser.getOS().name || 'Unknown';
    
    browserData[browser] = (browserData[browser] || 0) + 1;
    osData[os] = (osData[os] || 0) + 1;
  });

  const browserChart = Object.keys(browserData).map(name => ({ name, value: browserData[name] }));
  const osChart = Object.keys(osData).map(name => ({ name, value: osData[name] }));

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
                  <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#334155' : '#e5e5e5'} />
                  <XAxis dataKey="date" stroke="var(--text-muted)" />
                  <YAxis stroke="var(--text-muted)" />
                  <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-main)', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="clicks" stroke="var(--text-main)" strokeWidth={3} dot={{ r: 4, fill: 'var(--text-main)' }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">No click data available yet.</div>
            )}
          </div>
        </div>

        <div className="flex" style={{ gap: '2rem', flexWrap: 'wrap' }}>
          <div className="card" style={{ flex: '1 1 400px' }}>
            <h2 className="text-xl font-bold mb-6">Top Browsers</h2>
            <div style={{ width: '100%', height: 300 }}>
              {browserChart.length > 0 ? (
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={browserChart} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                      {browserChart.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-main)', borderRadius: '8px' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">No data.</div>
              )}
            </div>
          </div>
          <div className="card" style={{ flex: '1 1 400px' }}>
            <h2 className="text-xl font-bold mb-6">Top Operating Systems</h2>
            <div style={{ width: '100%', height: 300 }}>
              {osChart.length > 0 ? (
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={osChart} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                      {osChart.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-main)', borderRadius: '8px' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-400">No data.</div>
              )}
            </div>
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
