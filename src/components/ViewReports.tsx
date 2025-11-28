import { ArrowLeft, FileText, Clock, Users, TrendingUp, ChevronRight } from 'lucide-react';
import { SessionData } from '../App';

type ViewReportsProps = {
  sessions: SessionData[];
  onBack: () => void;
  onViewReport: (session: SessionData) => void;
};

export function ViewReports({ sessions, onBack, onViewReport }: ViewReportsProps) {
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getAverageAttention = (session: SessionData) => {
    if (session.attentionData.length === 0) return 0;
    return Math.round(
      session.attentionData.reduce((sum, d) => sum + d.attention, 0) / session.attentionData.length
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <div>
          <h1 className="text-gray-900">Session History</h1>
          <p className="text-gray-600">{sessions.length} session{sessions.length !== 1 ? 's' : ''} recorded</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        {sessions.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 shadow-lg text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-gray-900 mb-2">No Sessions Yet</h2>
            <p className="text-gray-600">
              Start your first classroom session to see reports here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => {
              const avgAttention = getAverageAttention(session);
              return (
                <button
                  key={session.id}
                  onClick={() => onViewReport(session)}
                  className="w-full bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 text-left"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-gray-900">
                            {new Date(session.startTime).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {new Date(session.startTime).toLocaleTimeString()} - Teacher: {session.teacherName}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-600" />
                          <div>
                            <p className="text-xs text-gray-600">Duration</p>
                            <p className="text-gray-900">
                              {session.duration ? formatDuration(session.duration) : 'N/A'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-purple-600" />
                          <div>
                            <p className="text-xs text-gray-600">Students</p>
                            <p className="text-gray-900">{session.totalStudents}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-green-600" />
                          <div>
                            <p className="text-xs text-gray-600">Avg. Attention</p>
                            <p className="text-gray-900">{avgAttention}%</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-orange-600" />
                          <div>
                            <p className="text-xs text-gray-600">Alerts</p>
                            <p className="text-gray-900">{session.alerts.length}</p>
                          </div>
                        </div>
                      </div>

                      {/* Attention Bar */}
                      <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs text-gray-600">Overall Performance</p>
                          <p className="text-xs text-gray-600">{avgAttention}%</p>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-full rounded-full transition-all ${
                              avgAttention >= 80
                                ? 'bg-green-500'
                                : avgAttention >= 60
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                            }`}
                            style={{ width: `${avgAttention}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <ChevronRight className="w-6 h-6 text-gray-400 flex-shrink-0" />
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
