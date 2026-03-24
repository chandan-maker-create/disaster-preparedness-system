import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { BookOpen, Map, ShieldAlert, Activity, ChevronRight } from 'lucide-react';
import axios from 'axios';

const StudentDashboard = () => {
  const { user } = useContext(AuthContext);
  const [recentLessons, setRecentLessons] = useState([]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data } = await axios.get('/api/content', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setRecentLessons(data.slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch lessons', error);
      }
    };
    if (user) {
      fetchContent();
    }
  }, [user]);

  const quickLinks = [
    { title: 'Learning Module', desc: 'Access survival guides & quizzes', icon: <BookOpen className="h-8 w-8 text-blue-500" />, path: '/learn', color: 'from-blue-500 to-cyan-500' },
    { title: 'Report Incident', desc: 'Alert authorities immediately', icon: <ShieldAlert className="h-8 w-8 text-red-500" />, path: '/report', color: 'from-red-500 to-orange-500' },
    { title: 'Safe Zones Map', desc: 'Find nearby shelters & hospitals', icon: <Map className="h-8 w-8 text-emerald-500" />, path: '/map', color: 'from-emerald-500 to-teal-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Welcome, {user?.name.split(' ')[0]}
        </h1>
        <p className="mt-2 text-slate-600">Your personal disaster preparedness command center.</p>
      </div>

      {/* Quick Action Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {quickLinks.map((link, idx) => (
          <Link
            key={idx}
            to={link.path}
            className="group relative bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
          >
            <div className={`absolute top-0 right-0 -m-8 w-32 h-32 bg-gradient-to-br ${link.color} rounded-full mix-blend-multiply filter blur-3xl opacity-10 group-hover:opacity-30 transition-opacity`}></div>
            <div className="flex items-start justify-between">
              <div>
                <div className="mb-4 bg-slate-50 w-14 h-14 rounded-xl flex items-center justify-center">
                  {link.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">{link.title}</h3>
                <p className="text-slate-500 text-sm">{link.desc}</p>
              </div>
              <ChevronRight className="text-slate-300 group-hover:text-slate-600 transition-colors" />
            </div>
          </Link>
        ))}
      </div>

      {/* Suggested Learning section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center">
            <Activity className="h-6 w-6 mr-2 text-indigo-500" />
            Latest Modules
          </h2>
          <Link to="/learn" className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
            View all &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentLessons.map((lesson) => (
            <div key={lesson._id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-32 bg-slate-100 relative">
                {/* Fallback pattern */}
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#CBD5E1_1px,transparent_1px)] [background-size:16px_16px]"></div>
                <div className="absolute bottom-4 left-4">
                  <span className="px-3 py-1 bg-white text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
                    {lesson.category}
                  </span>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-lg text-slate-900 mb-2 truncate">{lesson.title}</h3>
                <p className="text-slate-600 text-sm line-clamp-2">{lesson.description}</p>
                <div className="mt-4">
                  <Link
                    to={`/quiz/${lesson._id}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 w-full justify-center"
                  >
                    Start Lesson
                  </Link>
                </div>
              </div>
            </div>
          ))}
          {recentLessons.length === 0 && (
            <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-300 rounded-xl">
              <p className="text-slate-500">No lessons available right now.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
