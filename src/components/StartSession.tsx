import { useState } from 'react';
import { ArrowLeft, Play, Users } from 'lucide-react';

type StartSessionProps = {
  onBack: () => void;
  onStart: (teacherName: string, teacherId: string) => void;
  studentsCount: number;
};

export function StartSession({ onBack, onStart, studentsCount }: StartSessionProps) {
  const [teacherName, setTeacherName] = useState('');
  const [teacherId, setTeacherId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (teacherName && teacherId) {
      onStart(teacherName, teacherId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-gray-900">Start New Session</h1>
      </div>

      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Play className="w-10 h-10 text-white ml-1" />
          </div>
          
          <h2 className="text-center text-gray-900 mb-2">Session Details</h2>
          <p className="text-center text-gray-600 mb-8">
            Enter your information to begin tracking
          </p>

          {/* Students Count */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-blue-600" />
              <div>
                <p className="text-sm text-blue-900">Registered Students</p>
                <p className="text-blue-600">{studentsCount} students ready</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="teacherName" className="block text-gray-700 mb-2">
                Teacher Name
              </label>
              <input
                id="teacherName"
                type="text"
                value={teacherName}
                onChange={(e) => setTeacherName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter your name"
                required
              />
            </div>
            
            <div>
              <label htmlFor="teacherId" className="block text-gray-700 mb-2">
                Teacher ID
              </label>
              <input
                id="teacherId"
                type="text"
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter your ID"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 rounded-lg hover:from-green-600 hover:to-teal-600 transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5" />
              Start Session
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
