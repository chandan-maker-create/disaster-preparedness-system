import { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertTriangle, Info, BellRing } from 'lucide-react';

const AlertBanner = () => {
  const [activeAlerts, setActiveAlerts] = useState([]);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const { data } = await axios.get('/api/alerts');
        // Only show latest 2 active alerts for brevity
        setActiveAlerts(data.slice(0, 2));
      } catch (error) {
        console.error('Failed to fetch alerts', error);
      }
    };
    
    fetchAlerts();
    // In a real app with Socket.io, you'd listen to 'new-alert' here.
    const interval = setInterval(fetchAlerts, 60000); // Polling every minute as fallback
    return () => clearInterval(interval);
  }, []);

  if (activeAlerts.length === 0) return null;

  return (
    <div className="w-full flex flex-col pt-2 z-40 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-2">
        {activeAlerts.map((alert) => (
          <div
            key={alert._id}
            className={`flex items-center p-4 rounded-lg shadow-sm font-medium animate-pulse 
              ${alert.severity === 'critical' ? 'bg-red-100 text-red-800 border-l-4 border-red-600' : 
                alert.severity === 'warning' ? 'bg-orange-100 text-orange-800 border-l-4 border-orange-500' : 
                'bg-blue-100 text-blue-800 border-l-4 border-blue-500'}`}
          >
            {alert.severity === 'critical' ? (
              <AlertTriangle className="w-6 h-6 mr-3 flex-shrink-0" />
            ) : alert.severity === 'warning' ? (
              <BellRing className="w-6 h-6 mr-3 flex-shrink-0" />
            ) : (
              <Info className="w-6 h-6 mr-3 flex-shrink-0" />
            )}
            <div className="flex-grow">
              <span className="font-bold uppercase tracking-wider text-xs mr-2 px-2 py-0.5 rounded-full bg-white bg-opacity-50">
                {alert.category}
              </span>
              {alert.message}
            </div>
            {alert.location && (
              <div className="text-sm opacity-80 flex-shrink-0 ml-4 hidden md:block">
                Location: {alert.location}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertBanner;
