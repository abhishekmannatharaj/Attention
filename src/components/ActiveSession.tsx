import { useState, useEffect, useRef } from 'react';
import { StopCircle, Users, Hand, AlertTriangle, Video } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SessionData, Student } from '../App';

type ActiveSessionProps = {
  session: SessionData;
  students: Student[];
  onEndSession: (session: SessionData) => void;
};

type Alert = {
  id: string;
  type: 'hand' | 'distraction';
  message: string;
  studentName?: string;
};

export function ActiveSession({ session, students, onEndSession }: ActiveSessionProps) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [overallAttention, setOverallAttention] = useState(85);
  const [detectedStudents, setDetectedStudents] = useState(students.length);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [attentionHistory, setAttentionHistory] = useState<{ time: number; attention: number }[]>([]);
  const [studentEngagement, setStudentEngagement] = useState<Map<string, number[]>>(new Map());
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sessionAlertsRef = useRef<{ time: number; type: string; message: string }[]>([]);

  useEffect(() => {
    startCamera();
    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
      stopCamera();
    };
  }, []);

  // Simulate real-time tracking
  useEffect(() => {
    const trackingInterval = setInterval(() => {
      // Random attention fluctuation
      const newAttention = Math.max(40, Math.min(100, overallAttention + (Math.random() - 0.5) * 20));
      setOverallAttention(Math.round(newAttention));
      
      // Store attention data point
      setAttentionHistory((prev) => [
        ...prev,
        { time: elapsedTime, attention: Math.round(newAttention) }
      ]);

      // Update student engagement
      students.forEach((student) => {
        setStudentEngagement((prev) => {
          const current = prev.get(student.id) || [];
          const studentAttention = Math.max(30, Math.min(100, 70 + (Math.random() - 0.5) * 40));
          return new Map(prev).set(student.id, [...current, studentAttention]);
        });
      });

      // Random hand raise alert (10% chance)
      if (Math.random() > 0.9) {
        const randomStudent = students[Math.floor(Math.random() * students.length)];
        showAlert('hand', `${randomStudent.name} raised their hand`, randomStudent.name);
      }

      // Distraction alert if attention drops below 70%
      if (newAttention < 70) {
        const distractionPercent = Math.round((100 - newAttention));
        showAlert('distraction', `${distractionPercent}% of class appears distracted`);
      }
    }, 3000);

    return () => clearInterval(trackingInterval);
  }, [elapsedTime, overallAttention, students]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const showAlert = (type: 'hand' | 'distraction', message: string, studentName?: string) => {
    const alert: Alert = {
      id: Date.now().toString(),
      type,
      message,
      studentName,
    };
    
    setAlerts((prev) => [...prev, alert]);
    
    // Store in session alerts
    sessionAlertsRef.current.push({
      time: elapsedTime,
      type,
      message,
    });

    // Remove alert after 3 seconds
    setTimeout(() => {
      setAlerts((prev) => prev.filter((a) => a.id !== alert.id));
    }, 3000);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndSession = () => {
    const endTime = new Date().toISOString();
    const duration = elapsedTime;

    // Calculate final engagement scores
    const finalEngagement = students.map((student) => {
      const scores = studentEngagement.get(student.id) || [];
      const avgScore = scores.length > 0 
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : 0;
      return {
        studentId: student.id,
        name: student.name,
        attentionScore: avgScore,
      };
    });

    const completedSession: SessionData = {
      ...session,
      endTime,
      duration,
      attentionData: attentionHistory,
      studentEngagement: finalEngagement,
      alerts: sessionAlertsRef.current,
    };

    stopCamera();
    onEndSession(completedSession);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-white">Active Session</h1>
          <p className="text-gray-400">
            Teacher: {session.teacherName} (ID: {session.teacherId})
          </p>
        </div>
        <button
          onClick={handleEndSession}
          className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <StopCircle className="w-5 h-5" />
          End Session
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Camera Feed */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg">
            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-auto bg-black"
              />
              <div className="absolute top-4 left-4 bg-red-600 px-3 py-1 rounded-full flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-white text-sm">LIVE</span>
              </div>
              
              {/* Face detection overlays - simulated */}
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(Math.min(5, detectedStudents))].map((_, i) => (
                  <div
                    key={i}
                    className="absolute border-2 border-green-500 rounded-lg"
                    style={{
                      left: `${10 + i * 15}%`,
                      top: `${20 + (i % 2) * 30}%`,
                      width: '120px',
                      height: '140px',
                    }}
                  >
                    <div className="bg-green-500 text-white text-xs px-2 py-1 rounded">
                      Tracking
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Panel */}
        <div className="space-y-6">
          {/* Timer */}
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 shadow-lg">
            <p className="text-blue-200 text-sm mb-2">Session Duration</p>
            <p className="text-white text-3xl">{formatTime(elapsedTime)}</p>
          </div>

          {/* Overall Attention */}
          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 shadow-lg">
            <p className="text-green-200 text-sm mb-2">Overall Class Attention</p>
            <div className="flex items-baseline gap-2">
              <p className="text-white text-4xl">{overallAttention}%</p>
              {overallAttention >= 80 && <span className="text-green-200 text-sm">Excellent</span>}
              {overallAttention >= 60 && overallAttention < 80 && <span className="text-yellow-200 text-sm">Good</span>}
              {overallAttention < 60 && <span className="text-red-200 text-sm">Needs attention</span>}
            </div>
            <div className="mt-4 bg-white/20 rounded-full h-2 overflow-hidden">
              <div
                className="bg-white h-full transition-all duration-500"
                style={{ width: `${overallAttention}%` }}
              ></div>
            </div>
          </div>

          {/* Students Count */}
          <div className="bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl p-6 shadow-lg">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-white" />
              <div>
                <p className="text-purple-200 text-sm">Students Detected</p>
                <p className="text-white text-2xl">{detectedStudents} / {students.length}</p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-white mb-4">Session Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Alerts Triggered</span>
                <span className="text-white">{sessionAlertsRef.current.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Data Points</span>
                <span className="text-white">{attentionHistory.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Avg. Attention</span>
                <span className="text-white">
                  {attentionHistory.length > 0
                    ? Math.round(attentionHistory.reduce((sum, d) => sum + d.attention, 0) / attentionHistory.length)
                    : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="fixed top-24 right-6 w-80 space-y-2 z-50">
        <AnimatePresence>
          {alerts.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className={`p-4 rounded-lg shadow-lg flex items-start gap-3 ${
                alert.type === 'hand'
                  ? 'bg-blue-600'
                  : 'bg-orange-600'
              }`}
            >
              {alert.type === 'hand' ? (
                <Hand className="w-6 h-6 text-white flex-shrink-0" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-white flex-shrink-0" />
              )}
              <div>
                <p className="text-white">{alert.message}</p>
                <p className="text-xs text-white/80 mt-1">{formatTime(elapsedTime)}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
