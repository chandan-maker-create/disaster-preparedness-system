import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { CheckCircle, XCircle, ArrowRight, BookOpen, AlertCircle } from 'lucide-react';

const QuizView = () => {
  const { contentId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [content, setContent] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchContentAndQuizzes = async () => {
      try {
        const { data } = await axios.get(`/api/content/${contentId}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setContent(data.content);
        setQuizzes(data.quizzes || []);
        setLoading(false);
      } catch (err) {
        setError('Failed to load content');
        setLoading(false);
      }
    };
    fetchContentAndQuizzes();
  }, [contentId, user]);

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

  const handleNext = () => {
    // Add logic to proceed to next question or quiz
    const quiz = quizzes[currentQuizIndex];
    if (selectedOption === quiz.questions[currentQuestionIndex].correctAnswerIndex) {
      setScore(score + 1);
    }

    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      setQuizFinished(true);
    }
  };

  const handleOptionClick = (index) => {
    if (!showResult) {
      setSelectedOption(index);
    }
  };

  const checkAnswer = () => {
    if (selectedOption !== null) {
      setShowResult(true);
    }
  };

  // 1. Render content if we haven't started quiz or if quizzes exist
  if (quizzes.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm p-8 border border-slate-200">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">{content.title}</h1>
          <div className="prose max-w-none text-slate-700">
            {(content.text || content.content || '').split('\n').map((paragraph, i) => (
              <p key={i} className="mb-4">{paragraph}</p>
            ))}
          </div>
          {content.videoUrl && (
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4">Educational Video</h3>
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  src={content.videoUrl}
                  title="Video"
                  className="w-full h-96 rounded-xl"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}
          <div className="mt-8 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md flex items-start">
            <AlertCircle className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-700">There are no quizzes available for this module yet.</p>
          </div>
        </div>
      </div>
    );
  }

  const quiz = quizzes[currentQuizIndex];
  const question = quiz.questions[currentQuestionIndex];

  if (quizFinished) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-slate-200">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Quiz Completed!</h2>
          <p className="text-lg text-slate-600 mb-8">
            You scored <span className="font-bold text-indigo-600">{score}</span> out of {quiz.questions.length}
          </p>
          <button
            onClick={() => navigate('/learn')}
            className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition"
          >
            Back to Modules
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Learning Material Column */}
      <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-8 border border-slate-200 h-fit max-h-[80vh] overflow-y-auto custom-scrollbar">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">{content.title}</h1>
        <div className="bg-indigo-50 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full inline-block mb-6 uppercase tracking-wider">
          {content.category}
        </div>
        <div className="prose max-w-none text-slate-700">
          {(content.text || content.content || '').split('\n').map((paragraph, i) => (
             <p key={i} className="mb-4">{paragraph}</p>
          ))}
        </div>
      </div>

      {/* Quiz Column */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden sticky top-24">
          <div className="bg-indigo-600 px-6 py-4">
            <div className="flex justify-between items-center text-white">
              <h3 className="font-bold text-lg flex items-center">
                <BookOpen className="w-5 h-5 mr-2" />
                Knowledge Check
              </h3>
              <span className="text-sm font-medium opacity-80">
                {currentQuestionIndex + 1} of {quiz.questions.length}
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-indigo-800 h-1.5 rounded-full mt-3 overflow-hidden">
              <div 
                className="bg-white h-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex) / quiz.questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="p-6">
            <h4 className="text-lg font-medium text-slate-900 mb-6">
              {question.questionText}
            </h4>

            <div className="space-y-3 mb-6">
              {question.options.map((option, idx) => {
                let btnClass = "w-full text-left px-4 py-3 rounded-xl border-2 transition-all ";
                
                if (showResult) {
                  if (idx === question.correctAnswerIndex) {
                    btnClass += "border-green-500 bg-green-50 text-green-700";
                  } else if (idx === selectedOption) {
                    btnClass += "border-red-500 bg-red-50 text-red-700";
                  } else {
                    btnClass += "border-slate-200 opacity-50";
                  }
                } else {
                  btnClass += selectedOption === idx 
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700" 
                    : "border-slate-200 hover:border-indigo-300 hover:bg-slate-50";
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleOptionClick(idx)}
                    disabled={showResult}
                    className={btnClass}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      {showResult && idx === question.correctAnswerIndex && <CheckCircle className="w-5 h-5 text-green-500" />}
                      {showResult && idx === selectedOption && idx !== question.correctAnswerIndex && <XCircle className="w-5 h-5 text-red-500" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {!showResult ? (
              <button
                onClick={checkAnswer}
                disabled={selectedOption === null}
                className={`w-full py-3 rounded-xl font-medium transition-colors ${
                  selectedOption === null 
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md'
                }`}
              >
                Check Answer
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 shadow-md flex items-center justify-center transition"
              >
                {currentQuestionIndex < quiz.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizView;
