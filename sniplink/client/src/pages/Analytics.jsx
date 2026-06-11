import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar,
} from 'recharts';
import {
  ArrowLeft,
  MousePointerClick,
  Users,
  Clock,
  ExternalLink,
  Copy,
  Loader2,
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { useAnalytics } from '../hooks/useAnalytics';
import { formatDate, formatDateTime, truncate, buildShortUrl } from '../utils/helpers';
import toast from 'react-hot-toast';

const DEVICE_COLORS = ['#6366F1', '#10B981', '#F59E0B', '#94A3B8'];
const COUNTRY_COLOR = '#6366F1';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-100 px-4 py-2.5">
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <p className="text-sm font-semibold text-slate-900">{payload[0].value} clicks</p>
    </div>
  );
};

const Analytics = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { analytics, loading, fetchAnalytics } = useAnalytics();

  useEffect(() => {
    fetchAnalytics(id);
  }, [id, fetchAnalytics]);

  if (loading || !analytics) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      </DashboardLayout>
    );
  }

  const { url, analytics: data } = analytics;
  const shortUrl = buildShortUrl(url);

  const deviceData = data.clicksByDevice.map((d) => ({
    name: d._id.charAt(0).toUpperCase() + d._id.slice(1),
    value: d.count,
  }));

  const countryData = data.clicksByCountry.map((c) => ({
    name: c._id,
    clicks: c.count,
  }));

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    toast.success('Copied!');
  };

  return (
    <DashboardLayout>
      {/* Back + Link Info */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to dashboard
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="font-display text-xl font-bold text-slate-900">
                  /{url.customAlias || url.shortCode}
                </h1>
                <button onClick={handleCopy} className="p-1.5 text-slate-400 hover:text-indigo-500 rounded-lg hover:bg-indigo-50 transition-all">
                  <Copy className="w-4 h-4" />
                </button>
                <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="p-1.5 text-slate-400 hover:text-indigo-500 rounded-lg hover:bg-indigo-50 transition-all">
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              <p className="text-sm text-slate-500" title={url.originalUrl}>
                {truncate(url.originalUrl, 60)}
              </p>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <span>Created {formatDate(url.createdAt)}</span>
              {url.expiresAt && (
                <span className={new Date(url.expiresAt) < new Date() ? 'text-rose-500' : ''}>
                  Expires {formatDate(url.expiresAt)}
                </span>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Clicks', value: data.totalClicks, icon: MousePointerClick, color: 'text-indigo-500', bg: 'bg-indigo-50' },
          { label: 'Unique IPs', value: data.uniqueClicks, icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: 'Last Visited', value: data.lastVisited ? formatDateTime(data.lastVisited) : 'Never', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
            className="stat-card"
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Line Chart: Clicks over 30 days */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm"
        >
          <h3 className="font-display text-base font-semibold text-slate-900 mb-4">Clicks Over Last 30 Days</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.clicksByDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  tickFormatter={(val) => val.slice(5)} // MM-DD
                  interval="preserveStartEnd"
                />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="clicks"
                  stroke="#6366F1"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5, fill: '#6366F1' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Donut Chart: Device breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm"
        >
          <h3 className="font-display text-base font-semibold text-slate-900 mb-4">Devices</h3>
          {deviceData.length > 0 ? (
            <>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deviceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {deviceData.map((_, i) => (
                        <Cell key={i} fill={DEVICE_COLORS[i % DEVICE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap gap-3 mt-2 justify-center">
                {deviceData.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-1.5 text-xs text-slate-600">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: DEVICE_COLORS[i % DEVICE_COLORS.length] }} />
                    {d.name} ({d.value})
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-sm text-slate-400 text-center py-8">No data yet</p>
          )}
        </motion.div>
      </div>

      {/* Bar Chart: Top countries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm"
        >
          <h3 className="font-display text-base font-semibold text-slate-900 mb-4">Top Countries</h3>
          {countryData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={countryData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} width={80} />
                  <Tooltip />
                  <Bar dataKey="clicks" fill={COUNTRY_COLOR} radius={[0, 6, 6, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-8">No data yet</p>
          )}
        </motion.div>

        {/* Recent Visits Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
        >
          <div className="p-6 border-b border-slate-100">
            <h3 className="font-display text-base font-semibold text-slate-900">Recent Visits</h3>
          </div>
          {data.recentVisits.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left text-xs font-medium text-slate-500 uppercase px-4 py-2">Time</th>
                    <th className="text-left text-xs font-medium text-slate-500 uppercase px-4 py-2">Device</th>
                    <th className="text-left text-xs font-medium text-slate-500 uppercase px-4 py-2">Browser</th>
                    <th className="text-left text-xs font-medium text-slate-500 uppercase px-4 py-2">Country</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentVisits.map((visit, i) => (
                    <tr key={i} className="border-b border-slate-50 text-sm">
                      <td className="px-4 py-2.5 text-slate-600">{formatDateTime(visit.timestamp)}</td>
                      <td className="px-4 py-2.5 text-slate-600 capitalize">{visit.device}</td>
                      <td className="px-4 py-2.5 text-slate-600">{visit.browser}</td>
                      <td className="px-4 py-2.5 text-slate-600">{visit.country}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-8">No visits yet</p>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
