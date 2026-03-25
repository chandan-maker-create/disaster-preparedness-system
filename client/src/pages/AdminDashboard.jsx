import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Users, FileText, Bell, BarChart2, PlusCircle, CheckCircle, AlertTriangle } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [analytics, setAnalytics] = useState({ users: 0, reports: 0, contents: 0 });
  const [reports, setReports] = useState([]);
  
  // Forms state
  const [alertForm, setAlertForm] = useState({ message: '', severity: 'info', category: 'general' });
  const [contentForm, setContentForm] = useState({ title: '', category: 'earthquake', text: '', description: '', videoUrl: '' });
  
  const [alertSuccess, setAlertSuccess] = useState(false);
  const [contentSuccess, setContentSuccess] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const authOptions = { headers: { Authorization: `Bearer ${user.token}` } };
      
      const [analyticsRes, reportsRes] = await Promise.all([
        axios.get('/api/admin/analytics', authOptions),
        axios.get('/api/reports', authOptions)
      ]);
      
      setAnalytics(analyticsRes.data);
      setReports(reportsRes.data);
    } catch (error) {
      console.error('Failed to fetch admin data', error);
    }
  };

  const handleAlertSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/alerts', alertForm, { headers: { Authorization: `Bearer ${user.token}` } });
      setAlertSuccess(true);
      setAlertForm({ message: '', severity: 'info', category: 'general' });
      setTimeout(() => setAlertSuccess(false), 3000);
    } catch (error) {
      console.error(error);
    }
  };

  const handleContentSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/content', contentForm, { headers: { Authorization: `Bearer ${user.token}` } });
      setContentSuccess(true);
      setContentForm({ title: '', category: 'earthquake', text: '', description: '', videoUrl: '' });
      fetchData();
      setTimeout(() => setContentSuccess(false), 3000);
    } catch (error) {
      console.error(error);
    }
  };

  const updateReportStatus = async (id, status) => {
    try {
      await axios.put(`/api/reports/${id}/status`, { status }, { headers: { Authorization: `Bearer ${user.token}` } });
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center">
      <div className={`p-4 rounded-xl ${color} text-white mr-4 shadow-md`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{title}</p>
        <p className="text-3xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center">
          <BarChart2 className="w-8 h-8 mr-3 text-red-600" />
          Admin Command Center
        </h1>
        <p className="mt-2 text-slate-600">Manage alerts, content, and track incident reports</p>
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard title="Total Users" value={analytics.users} icon={<Users className="w-6 h-6" />} color="bg-blue-500" />
        <StatCard title="Incident Reports" value={analytics.reports} icon={<Bell className="w-6 h-6" />} color="bg-red-500" />
        <StatCard title="Learning Modules" value={analytics.contents} icon={<FileText className="w-6 h-6" />} color="bg-indigo-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Broadcast Alert */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center">
              <Bell className="w-5 h-5 mr-2 text-orange-500" /> Broadcast Emergency Alert
            </h3>
          </div>
          <div className="p-6">
            {alertSuccess && (
              <div className="mb-4 bg-green-50 text-green-700 p-3 rounded-md flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" /> Alert broadcasted successfully!
              </div>
            )}
            <form onSubmit={handleAlertSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Alert Message</label>
                <textarea required rows="3" value={alertForm.message} onChange={e => setAlertForm({...alertForm, message: e.target.value})} className="w-full border-slate-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 px-3 py-2 border"></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Severity</label>
                  <select value={alertForm.severity} onChange={e => setAlertForm({...alertForm, severity: e.target.value})} className="w-full border-slate-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 px-3 py-2 border">
                    <option value="info">Info (Blue)</option>
                    <option value="warning">Warning (Orange)</option>
                    <option value="critical">Critical (Red)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <select value={alertForm.category} onChange={e => setAlertForm({...alertForm, category: e.target.value})} className="w-full border-slate-300 rounded-lg shadow-sm focus:ring-red-500 focus:border-red-500 px-3 py-2 border">
                    <option value="general">General</option>
                    <option value="earthquake">Earthquake</option>
                    <option value="fire">Fire</option>
                    <option value="flood">Flood</option>
                    <option value="cyclone">Cyclone</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full bg-red-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-red-700 transition">
                Send Alert
              </button>
            </form>
          </div>
        </div>

        {/* Create Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center">
              <PlusCircle className="w-5 h-5 mr-2 text-indigo-500" /> Create Learning Module
            </h3>
          </div>
          <div className="p-6">
            {contentSuccess && (
              <div className="mb-4 bg-green-50 text-green-700 p-3 rounded-md flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" /> Module published successfully!
              </div>
            )}
            <form onSubmit={handleContentSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                  <input required type="text" value={contentForm.title} onChange={e => setContentForm({...contentForm, title: e.target.value})} className="w-full border-slate-300 rounded-lg shadow-sm px-3 py-2 border focus:ring-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <select value={contentForm.category} onChange={e => setContentForm({...contentForm, category: e.target.value})} className="w-full border-slate-300 rounded-lg shadow-sm px-3 py-2 border focus:ring-indigo-500">
                    <option value="general">General</option>
                    <option value="earthquake">Earthquake</option>
                    <option value="fire">Fire</option>
                    <option value="flood">Flood</option>
                    <option value="cyclone">Cyclone</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Short Description</label>
                <input required type="text" value={contentForm.description} onChange={e => setContentForm({...contentForm, description: e.target.value})} className="w-full border-slate-300 rounded-lg shadow-sm px-3 py-2 border focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Content Text (Markdown/Plain)</label>
                <textarea required rows="4" value={contentForm.text} onChange={e => setContentForm({...contentForm, text: e.target.value})} className="w-full border-slate-300 rounded-lg shadow-sm px-3 py-2 border focus:ring-indigo-500"></textarea>
              </div>
              <button type="submit" className="w-full bg-indigo-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-indigo-700 transition">
                Publish Content
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Incident Reports Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2 text-red-500" /> Recent Incident Reports
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full whitespace-nowrap">
            <thead className="bg-slate-50 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Student</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Location</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {reports.map((report) => (
                <tr key={report._id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">
                    {report.studentId?.name || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 capitalize">{report.type}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{report.location?.address}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${report.status === 'resolved' ? 'bg-green-100 text-green-800' : 
                        report.status === 'investigating' ? 'bg-orange-100 text-orange-800' : 
                        'bg-red-100 text-red-800'}`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    {report.status === 'pending' && (
                      <button onClick={() => updateReportStatus(report._id, 'investigating')} className="text-orange-600 hover:text-orange-900 mr-3">
                        Investigate
                      </button>
                    )}
                    {(report.status === 'pending' || report.status === 'investigating') && (
                      <button onClick={() => updateReportStatus(report._id, 'resolved')} className="text-green-600 hover:text-green-900">
                        Resolve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {reports.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                    No incident reports found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
