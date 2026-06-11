import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Link2,
  MousePointerClick,
  Activity,
  CalendarPlus,
  Plus,
  Copy,
  Check,
  BarChart3,
  Trash2,
  Pencil,
  QrCode,
  Upload,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  X,
  Download,
  Loader2,
  LinkIcon,
} from 'lucide-react';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/DashboardLayout';
import { useUrls } from '../hooks/useUrls';
import { useAnalytics } from '../hooks/useAnalytics';
import { getQrCode, bulkUpload } from '../api/urls';
import { formatDate, truncate, buildShortUrl } from '../utils/helpers';

const Dashboard = () => {
  const { urls, pagination, loading, fetchUrls, addUrl, removeUrl, editUrl } = useUrls();
  const { overview, fetchOverview } = useAnalytics();
  const navigate = useNavigate();

  // Form state
  const [longUrl, setLongUrl] = useState('');
  const [alias, setAlias] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [creating, setCreating] = useState(false);

  // UI state
  const [copiedId, setCopiedId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [editingUrl, setEditingUrl] = useState(null);
  const [editForm, setEditForm] = useState({ originalUrl: '', customAlias: '' });
  const [qrModal, setQrModal] = useState(null);
  const [showBulk, setShowBulk] = useState(false);
  const [bulkLoading, setBulkLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchUrls();
    fetchOverview();
  }, [fetchUrls, fetchOverview]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!longUrl.trim()) return toast.error('Please enter a URL');
    setCreating(true);

    try {
      await addUrl({
        originalUrl: longUrl.trim(),
        customAlias: alias.trim() || undefined,
        expiresAt: expiresAt || undefined,
      });
      toast.success('Short URL created!');
      setLongUrl('');
      setAlias('');
      setExpiresAt('');
      fetchUrls(pagination.page);
      fetchOverview();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create URL');
    } finally {
      setCreating(false);
    }
  };

  const handleCopy = (url) => {
    const shortUrl = buildShortUrl(url);
    navigator.clipboard.writeText(shortUrl);
    setCopiedId(url._id);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async () => {
    try {
      await removeUrl(deleteId);
      toast.success('URL deleted');
      setDeleteId(null);
      fetchOverview();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleEdit = async () => {
    try {
      await editUrl(editingUrl._id, editForm);
      toast.success('URL updated');
      setEditingUrl(null);
      fetchUrls(pagination.page);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update');
    }
  };

  const openEditModal = (url) => {
    setEditingUrl(url);
    setEditForm({ originalUrl: url.originalUrl, customAlias: url.customAlias || '' });
  };

  const handleQr = async (url) => {
    try {
      const { data } = await getQrCode(url._id);
      setQrModal({ ...data.data, url });
    } catch {
      toast.error('Failed to generate QR code');
    }
  };

  const downloadQr = () => {
    if (!qrModal) return;
    const link = document.createElement('a');
    link.download = `sniplink-${qrModal.url.shortCode}.png`;
    link.href = qrModal.qrCode;
    link.click();
  };

  const handleBulkUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBulkLoading(true);

    try {
      const { data } = await bulkUpload(file);
      toast.success(data.message);
      fetchUrls();
      fetchOverview();

      // Download results as CSV
      if (data.data.created.length > 0) {
        const csv = 'originalUrl,shortUrl\n' + data.data.created
          .map((r) => `${r.originalUrl},${r.shortUrl}`)
          .join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sniplink-bulk-results.csv';
        a.click();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Bulk upload failed');
    } finally {
      setBulkLoading(false);
      setShowBulk(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const isExpired = (url) => url.expiresAt && new Date(url.expiresAt) < new Date();

  const stats = [
    { label: 'Total Links', value: overview?.totalUrls ?? '–', icon: Link2, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { label: 'Total Clicks', value: overview?.totalClicks ?? '–', icon: MousePointerClick, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Active Links', value: overview?.activeUrls ?? '–', icon: Activity, color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: 'This Month', value: overview?.createdThisMonth ?? '–', icon: CalendarPlus, color: 'text-purple-500', bg: 'bg-purple-50' },
  ];

  return (
    <DashboardLayout>
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="stat-card"
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Create URL Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm mb-8"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-semibold text-slate-900">Create Short URL</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowBulk(!showBulk)}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-500 transition-colors"
            >
              <Upload className="w-4 h-4" />
              Bulk CSV
            </button>
          </div>
        </div>

        {showBulk ? (
          <div className="bg-slate-50 rounded-xl p-6 text-center">
            <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <p className="text-sm text-slate-600 mb-1">Upload a CSV file with a "url" column</p>
            <p className="text-xs text-slate-400 mb-4">Results will be downloaded as CSV automatically</p>
            <label className="btn-primary cursor-pointer inline-flex items-center gap-2">
              {bulkLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {bulkLoading ? 'Processing…' : 'Choose CSV File'}
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleBulkUpload}
                className="hidden"
              />
            </label>
          </div>
        ) : (
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="url"
                value={longUrl}
                onChange={(e) => setLongUrl(e.target.value)}
                placeholder="Paste your long URL here…"
                className="input-field flex-1"
                id="create-url-input"
                required
              />
              <button
                type="submit"
                disabled={creating}
                className="btn-primary flex items-center justify-center gap-2 shrink-0"
                id="create-url-submit"
              >
                {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Shorten
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                placeholder="Custom alias (optional)"
                className="input-field flex-1"
                id="create-url-alias"
              />
              <input
                type="datetime-local"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="input-field sm:w-56"
                id="create-url-expiry"
              />
            </div>
          </form>
        )}
      </motion.div>

      {/* URL List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-2xl border border-slate-100 shadow-sm"
      >
        <div className="p-6 border-b border-slate-100">
          <h2 className="font-display text-lg font-semibold text-slate-900">Your Links</h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
          </div>
        ) : urls.length === 0 ? (
          <div className="text-center py-20 px-6">
            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <LinkIcon className="w-8 h-8 text-indigo-400" />
            </div>
            <h3 className="font-display text-lg font-semibold text-slate-900 mb-2">
              No links yet
            </h3>
            <p className="text-slate-500 text-sm max-w-sm mx-auto">
              Create your first short URL above and start tracking clicks, devices, and locations.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wide px-6 py-3">Short URL</th>
                    <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wide px-6 py-3">Original URL</th>
                    <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wide px-6 py-3">Created</th>
                    <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wide px-6 py-3">Clicks</th>
                    <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wide px-6 py-3">Status</th>
                    <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wide px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {urls.map((url, i) => (
                      <motion.tr
                        key={url._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ delay: i * 0.03 }}
                        className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <span className="text-sm font-medium text-indigo-600 font-mono">
                            /{url.customAlias || url.shortCode}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-slate-600" title={url.originalUrl}>
                            {truncate(url.originalUrl, 45)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">
                          {formatDate(url.createdAt)}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-semibold text-slate-900">{url.clicks}</span>
                        </td>
                        <td className="px-6 py-4">
                          {isExpired(url) ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-600">Expired</span>
                          ) : url.isActive ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600">Active</span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-500">Inactive</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => handleCopy(url)} className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-all" title="Copy">
                              {copiedId === url._id ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                            </button>
                            <button onClick={() => handleQr(url)} className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-all" title="QR Code">
                              <QrCode className="w-4 h-4" />
                            </button>
                            <button onClick={() => navigate(`/analytics/${url._id}`)} className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-all" title="Analytics">
                              <BarChart3 className="w-4 h-4" />
                            </button>
                            <button onClick={() => openEditModal(url)} className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-all" title="Edit">
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button onClick={() => setDeleteId(url._id)} className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all" title="Delete">
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <a href={buildShortUrl(url)} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-all" title="Open">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-slate-100">
              {urls.map((url) => (
                <div key={url._id} className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium text-indigo-600 font-mono">/{url.customAlias || url.shortCode}</p>
                      <p className="text-xs text-slate-500 mt-0.5" title={url.originalUrl}>{truncate(url.originalUrl, 35)}</p>
                    </div>
                    {isExpired(url) ? (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-rose-50 text-rose-600">Expired</span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">Active</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-400">{formatDate(url.createdAt)} · {url.clicks} clicks</p>
                    <div className="flex items-center gap-1">
                      <button onClick={() => handleCopy(url)} className="p-1.5 text-slate-400 hover:text-indigo-500 rounded-lg">
                        {copiedId === url._id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <button onClick={() => navigate(`/analytics/${url._id}`)} className="p-1.5 text-slate-400 hover:text-indigo-500 rounded-lg">
                        <BarChart3 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setDeleteId(url._id)} className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
                <p className="text-sm text-slate-500">
                  Page {pagination.page} of {pagination.pages} ({pagination.total} links)
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => fetchUrls(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                    className="p-2 text-slate-400 hover:text-slate-900 disabled:opacity-30 rounded-lg hover:bg-slate-100"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => fetchUrls(pagination.page + 1)}
                    disabled={pagination.page >= pagination.pages}
                    className="p-2 text-slate-400 hover:text-slate-900 disabled:opacity-30 rounded-lg hover:bg-slate-100"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
            onClick={() => setDeleteId(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl"
            >
              <h3 className="font-display text-lg font-semibold text-slate-900 mb-2">Delete this link?</h3>
              <p className="text-sm text-slate-500 mb-6">This action cannot be undone. All click data for this link will be permanently removed.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="btn-ghost flex-1">Cancel</button>
                <button onClick={handleDelete} className="btn-danger flex-1">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
            onClick={() => setEditingUrl(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-lg font-semibold text-slate-900">Edit Link</h3>
                <button onClick={() => setEditingUrl(null)} className="p-1 text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Original URL</label>
                  <input
                    type="url"
                    value={editForm.originalUrl}
                    onChange={(e) => setEditForm({ ...editForm, originalUrl: e.target.value })}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Custom Alias</label>
                  <input
                    type="text"
                    value={editForm.customAlias}
                    onChange={(e) => setEditForm({ ...editForm, customAlias: e.target.value })}
                    className="input-field"
                    placeholder="Leave empty for auto-generated"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setEditingUrl(null)} className="btn-ghost flex-1">Cancel</button>
                  <button onClick={handleEdit} className="btn-primary flex-1">Save Changes</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* QR Code Modal */}
      <AnimatePresence>
        {qrModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
            onClick={() => setQrModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-lg font-semibold text-slate-900">QR Code</h3>
                <button onClick={() => setQrModal(null)} className="p-1 text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="bg-slate-50 rounded-xl p-6 mb-4">
                <img src={qrModal.qrCode} alt="QR Code" className="w-48 h-48 mx-auto" />
              </div>
              <p className="text-sm text-slate-500 mb-4 font-mono">{qrModal.shortUrl}</p>
              <button onClick={downloadQr} className="btn-primary w-full flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Download PNG
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default Dashboard;
