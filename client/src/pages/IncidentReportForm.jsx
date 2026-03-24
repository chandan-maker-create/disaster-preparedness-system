import { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { ShieldAlert, MapPin, Camera, AlertTriangle, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const IncidentReportForm = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [type, setType] = useState('fire');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Simulating location fetch
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Hardcoding string for demo without rev-geocode api
          setAddress(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
        },
        () => {
          setError("Failed to get location. Please input manually.");
        }
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post('/api/reports', {
        type,
        description,
        location: { address }
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setSuccess(true);
      setLoading(false);
      setTimeout(() => navigate('/'), 3000);
    } catch (err) {
      setError('Failed to submit report. Try again.');
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl shadow-lg p-10 border border-slate-100">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldAlert className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Report Submitted Successfully</h2>
          <p className="text-slate-600 mb-6">Authorities have been notified and rescue teams are reviewing your report.</p>
          <div className="animate-pulse flex justify-center items-center text-sm font-medium text-slate-500">
            Redirecting to dashboard...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 relative">
        {/* Urgent header styling */}
        <div className="bg-red-600 px-6 py-8 sm:p-10 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-red-500 rounded-full opacity-50 blur-2xl"></div>
          <div className="relative z-10 flex items-start">
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm mr-5 shadow-inner">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight">Emergency Incident Report</h1>
              <p className="mt-2 text-red-100 text-lg">
                Submit details immediately to alert campus authorities.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-8 sm:p-10 space-y-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Disaster Type</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {['fire', 'flood', 'earthquake', 'cyclone'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`px-4 py-3 border-2 rounded-xl flex flex-col items-center justify-center capitalize font-medium transition-all ${
                      type === t 
                        ? 'border-red-500 bg-red-50 text-red-700 ring-2 ring-red-500 ring-offset-2' 
                        : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="col-span-1 md:col-span-2">
              <label htmlFor="address" className="block text-sm font-bold text-slate-700 mb-2">Location/Address</label>
              <div className="flex">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    id="address"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-l-xl focus:ring-red-500 focus:border-red-500 shadow-sm"
                    placeholder="E.g. Main Library, Floor 2"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleGetLocation}
                  className="px-4 py-3 border border-l-0 border-slate-300 rounded-r-xl bg-slate-50 text-slate-600 hover:bg-slate-100 font-medium"
                >
                  Use GPS
                </button>
              </div>
            </div>

            <div className="col-span-1 md:col-span-2">
              <label htmlFor="description" className="block text-sm font-bold text-slate-700 mb-2">Brief Description</label>
              <textarea
                id="description"
                rows="4"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="block w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-red-500 focus:border-red-500 shadow-sm"
                placeholder="Describe the situation, number of people involved, severity..."
              ></textarea>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className={`inline-flex items-center px-6 py-3 border border-transparent rounded-xl shadow-lg text-base font-bold text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all ${
                loading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5'
              }`}
            >
              {loading ? 'Submitting...' : 'Submit Emergency Report'}
              <Send className="ml-2 -mr-1 h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IncidentReportForm;
