import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { BookOpen, Map, ShieldAlert, Activity, ChevronRight } from 'lucide-react';
import axios from 'axios';

const getCategoryImageUrl = (category) => {
  switch (category?.toLowerCase()) {
    case 'earthquake':
      return 'https://images.unsplash.com/photo-1601584856086-621434c441ed?auto=format&fit=crop&q=80&w=800';
    case 'flood':
      return 'https://images.unsplash.com/photo-1547683905-f30e618a39ef?auto=format&fit=crop&q=80&w=800';
    case 'fire':
      return 'https://images.unsplash.com/photo-1627916568853-90d291ad8106?auto=format&fit=crop&q=80&w=800';
    case 'cyclone':
      return 'https://images.unsplash.com/photo-1527482837616-92896a75f284?auto=format&fit=crop&q=80&w=800';
    default:
      return 'https://images.unsplash.com/photo-1532996122724-e3c3552a4cd3?auto=format&fit=crop&q=80&w=800';
  }
};

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
          <Link to="/learn" className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center">
            View all <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentLessons.map((lesson) => (
            <div key={lesson._id} className="group bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col">
              <div className="h-48 relative overflow-hidden">
                <img 
                  src={getCategoryImageUrl(lesson.category)} 
                  alt={lesson.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://picsum.photos/seed/${lesson._id}/800/600`;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm text-indigo-600 font-bold flex items-center gap-1 text-xs pr-3">
                  <Activity className="w-4 h-4" /> <span>Quiz</span>
                </div>
                <div className="absolute bottom-4 left-4">
                  <span className="px-3 py-1 bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-sm">
                    {lesson.category}
                  </span>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-bold text-lg text-slate-900 mb-2 line-clamp-1">{lesson.title}</h3>
                <p className="text-slate-500 text-sm line-clamp-2 mb-4 flex-1">{lesson.description}</p>
                <div className="mt-auto pt-4 border-t border-slate-100">
                  <Link
                    to={`/quiz/${lesson._id}`}
                    className="inline-flex items-center px-4 py-2.5 border border-transparent text-sm font-bold rounded-xl shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 w-full justify-center transition-colors shadow-indigo-200"
                  >
                    Take Quiz & Learn
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
