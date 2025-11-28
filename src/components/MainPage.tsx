import { Video, FileText, Settings } from 'lucide-react';

type MainPageProps = {
  onStartSession: () => void;
  onViewReports: () => void;
  onRegisterStudent: () => void;
};

export function MainPage({ onStartSession, onViewReports, onRegisterStudent }: MainPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center">
            <Video className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-indigo-900">Classroom Engagement Analyzer</h1>
            <p className="text-sm text-indigo-600">Real-time attention tracking</p>
          </div>
        </div>
        <button
          onClick={onRegisterStudent}
          className="p-3 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
          title="Register New Student"
        >
          <Settings className="w-6 h-6 text-indigo-600" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-120px)]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full px-6">
          {/* Start Session Card */}
          <button
            onClick={onStartSession}
            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Video className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-gray-900 mb-3">Start Session</h2>
            <p className="text-gray-600">
              Begin a new classroom engagement tracking session with live emotion detection and attention monitoring
            </p>
          </button>

          {/* View Reports Card */}
          <button
            onClick={onViewReports}
            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-gray-900 mb-3">View Session Reports</h2>
            <p className="text-gray-600">
              Access detailed analytics and historical data from previous classroom sessions
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}
