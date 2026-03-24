import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldAlert, Mail, Lock, User, UserPlus } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // Use a secret code to register as admin (simplification for demo)
  const [secretCode, setSecretCode] = useState('');
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    
    // Determine role based on secret code
    const role = secretCode === 'ADMIN123' ? 'admin' : 'student';

    const res = await register(name, email, password, role);
    setIsLoading(false);
    
    if (res.success) {
      navigate('/');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 -m-32 w-[600px] h-[600px] bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 right-0 -m-32 w-[600px] h-[600px] bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="max-w-md w-full glass rounded-2xl p-8 z-10 shadow-2xl border border-white/20">
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center rounded-2xl shadow-lg mb-4">
            <UserPlus className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create Account</h2>
          <p className="mt-2 text-sm text-slate-600">
            Join the preparedness network
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="name">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 text-sm shadow-sm transition-all focus:shadow-md bg-white/50 backdrop-blur-sm"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="email">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 text-sm shadow-sm transition-all focus:shadow-md bg-white/50 backdrop-blur-sm"
                  placeholder="you@school.edu"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="password">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 text-sm shadow-sm transition-all focus:shadow-md bg-white/50 backdrop-blur-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="confirm">Confirm</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input id="confirm" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 text-sm shadow-sm transition-all focus:shadow-md bg-white/50 backdrop-blur-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="secret">Admin Secret Code (Optional)</label>
              <input id="secret" type="password" value={secretCode} onChange={(e) => setSecretCode(e.target.value)}
                className="block w-full px-3 py-3 border border-slate-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 text-sm shadow-sm transition-all focus:shadow-md bg-white/50 backdrop-blur-sm"
                placeholder="Leave blank for student account"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all ${
              isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg transform hover:-translate-y-0.5'
            }`}
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-slate-600">Already have an account? </span>
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
