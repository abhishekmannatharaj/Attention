import { ArrowLeft, Download, TrendingUp, TrendingDown, Clock, Users } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SessionData } from '../App';

type SessionReportProps = {
  session: SessionData;
  onBack: () => void;
};

export function SessionReport({ session, onBack }: SessionReportProps) {
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  const formatTimeLabel = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const downloadCSV = () => {
    const csvRows = [
      ['Session Report'],
      [''],
      ['Session ID', session.id],
      ['Teacher Name', session.teacherName],
      ['Teacher ID', session.teacherId],
      ['Start Time', new Date(session.startTime).toLocaleString()],
      ['End Time', session.endTime ? new Date(session.endTime).toLocaleString() : 'N/A'],
      ['Duration', session.duration ? formatDuration(session.duration) : 'N/A'],
      ['Total Students', session.totalStudents.toString()],
      [''],
      ['Student Engagement Data'],
      ['Student ID', 'Student Name', 'Attention Score (%)'],
      ...session.studentEngagement.map(s => [s.studentId, s.name, s.attentionScore.toString()]),
      [''],
      ['Attention Over Time'],
      ['Time (seconds)', 'Attention (%)'],
      ...session.attentionData.map(d => [d.time.toString(), d.attention.toString()]),
      [''],
      ['Alerts Log'],
      ['Time (seconds)', 'Type', 'Message'],
      ...session.alerts.map(a => [a.time.toString(), a.type, a.message]),
    ];

    const csvContent = csvRows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `session-report-${session.id}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  // Calculate most and least engaged students
  const sortedStudents = [...session.studentEngagement].sort((a, b) => b.attentionScore - a.attentionScore);
  const mostEngaged = sortedStudents[0];
  const leastEngaged = sortedStudents[sortedStudents.length - 1];

  const averageAttention = session.attentionData.length > 0
    ? Math.round(session.attentionData.reduce((sum, d) => sum + d.attention, 0) / session.attentionData.length)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <div>
            <h1 className="text-gray-900">Session Report</h1>
            <p className="text-gray-600">
              {new Date(session.startTime).toLocaleDateString()} at{' '}
              {new Date(session.startTime).toLocaleTimeString()}
            </p>
          </div>
        </div>
        <button
          onClick={downloadCSV}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg"
        >
          <Download className="w-5 h-5" />
          Download CSV
        </button>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <p className="text-gray-600 text-sm">Duration</p>
            </div>
            <p className="text-gray-900 text-2xl">
              {session.duration ? formatDuration(session.duration) : 'N/A'}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-purple-600" />
              <p className="text-gray-600 text-sm">Total Students</p>
            </div>
            <p className="text-gray-900 text-2xl">{session.totalStudents}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <p className="text-gray-600 text-sm">Avg. Attention</p>
            </div>
            <p className="text-gray-900 text-2xl">{averageAttention}%</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <TrendingDown className="w-5 h-5 text-orange-600" />
              <p className="text-gray-600 text-sm">Total Alerts</p>
            </div>
            <p className="text-gray-900 text-2xl">{session.alerts.length}</p>
          </div>
        </div>

        {/* Attention Graph */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-gray-900 mb-6">Attention Over Time</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={session.attentionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="time" 
                  tickFormatter={formatTimeLabel}
                  stroke="#6b7280"
                  label={{ value: 'Time', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  stroke="#6b7280"
                  domain={[0, 100]}
                  label={{ value: 'Attention (%)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  labelFormatter={formatTimeLabel}
                  formatter={(value: number) => [`${value}%`, 'Attention']}
                />
                <Line 
                  type="monotone" 
                  dataKey="attention" 
                  stroke="#4f46e5" 
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Student Performance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Most Engaged */}
          {mostEngaged && (
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 shadow-lg text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h3>Most Engaged Student</h3>
              </div>
              <p className="text-2xl mb-2">{mostEngaged.name}</p>
              <p className="text-green-100 mb-4">ID: {mostEngaged.studentId}</p>
              <div className="bg-white/20 rounded-lg p-4">
                <p className="text-sm text-green-100 mb-1">Attention Score</p>
                <p className="text-3xl">{mostEngaged.attentionScore}%</p>
              </div>
            </div>
          )}

          {/* Least Engaged */}
          {leastEngaged && (
            <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-6 shadow-lg text-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <TrendingDown className="w-6 h-6" />
                </div>
                <h3>Most Distracted Student</h3>
              </div>
              <p className="text-2xl mb-2">{leastEngaged.name}</p>
              <p className="text-orange-100 mb-4">ID: {leastEngaged.studentId}</p>
              <div className="bg-white/20 rounded-lg p-4">
                <p className="text-sm text-orange-100 mb-1">Attention Score</p>
                <p className="text-3xl">{leastEngaged.attentionScore}%</p>
              </div>
            </div>
          )}
        </div>

        {/* All Students Performance */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-gray-900 mb-6">Individual Student Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {session.studentEngagement.map((student) => (
              <div key={student.studentId} className="border border-gray-200 rounded-lg p-4">
                <p className="text-gray-900 mb-1">{student.name}</p>
                <p className="text-gray-500 text-sm mb-3">ID: {student.studentId}</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-full rounded-full transition-all ${
                        student.attentionScore >= 80
                          ? 'bg-green-500'
                          : student.attentionScore >= 60
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${student.attentionScore}%` }}
                    ></div>
                  </div>
                  <span className="text-gray-700">{student.attentionScore}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Teacher Info */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-gray-900 mb-4">Session Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 text-sm mb-1">Teacher Name</p>
              <p className="text-gray-900">{session.teacherName}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Teacher ID</p>
              <p className="text-gray-900">{session.teacherId}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Session ID</p>
              <p className="text-gray-900">{session.id}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-1">Status</p>
              <p className="text-green-600">Completed</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
