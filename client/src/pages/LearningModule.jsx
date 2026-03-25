import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { PlayCircle, Award, BookOpen, AlertTriangle, Wind, Flame, Droplets } from 'lucide-react';

const icons = {
  earthquake: <AlertTriangle className="text-amber-500 w-8 h-8" />,
  flood: <Droplets className="text-blue-500 w-8 h-8" />,
  fire: <Flame className="text-red-500 w-8 h-8" />,
  cyclone: <Wind className="text-teal-500 w-8 h-8" />,
  general: <BookOpen className="text-indigo-500 w-8 h-8" />,
};

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

const LearningModule = () => {
  const { user } = useContext(AuthContext);
  const [lessons, setLessons] = useState([]);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const { data } = await axios.get('/api/content', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setLessons(data);
      } catch (error) {
        console.error('Failed to fetch lessons', error);
      }
    };
    if (user) {
      fetchLessons();
    }
  }, [user]);

  const categories = ['all', 'earthquake', 'flood', 'fire', 'cyclone', 'general'];

  const filteredLessons = activeTab === 'all' 
    ? lessons 
    : lessons.filter(l => (l.category || 'general').toLowerCase() === activeTab.toLowerCase());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Preparedness Library</h1>
        <p className="mt-3 max-w-2xl mx-auto text-xl text-slate-500 sm:mt-4">
          Equip yourself with the knowledge to stay safe in any emergency.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveTab(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all border ${
              activeTab === cat
                ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredLessons.map((lesson) => (
          <div key={lesson._id} className="group flex flex-col rounded-2xl shadow-sm border border-slate-200 overflow-hidden bg-white hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
            <div className="flex-shrink-0 h-48 relative overflow-hidden flex flex-col items-center justify-center p-6">
              <img 
                src={getCategoryImageUrl(lesson.category)} 
                alt={lesson.title} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://picsum.photos/seed/${lesson._id}/800/600`;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-slate-900/10 mix-blend-multiply"></div>
              
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm text-indigo-600 font-bold flex items-center gap-1 text-xs pr-3 z-10">
                <Award className="w-4 h-4" /> <span>Quiz Inside</span>
              </div>
              
              <div className="relative z-10 w-16 h-16 bg-white/20 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center mb-3 border border-white/30">
                {icons[lesson.category] || icons['general']}
              </div>
              <span className="relative z-10 px-3 py-1 bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-sm">
                {lesson.category}
              </span>
            </div>
            
            <div className="flex-1 bg-white p-6 flex flex-col justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900 line-clamp-1">{lesson.title}</h3>
                <p className="mt-3 text-base text-slate-500 line-clamp-3">
                  {lesson.description}
                </p>
              </div>
              <div className="mt-6 flex items-center gap-3 pt-4 border-t border-slate-100">
                <Link
                  to={`/quiz/${lesson._id}`}
                  className="flex-1 flex justify-center items-center px-4 py-2.5 border border-transparent text-sm font-bold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-200 transition-colors"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Take Quiz & Learn
                </Link>
              </div>
            </div>
          </div>
        ))}
        {filteredLessons.length === 0 && (
          <div className="col-span-full text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
              <BookOpen className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900">No modules found</h3>
            <p className="mt-1 text-slate-500">Check back later for new content in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningModule;
