import { useState } from 'react';
import { MainPage } from './components/MainPage';
import { RegisterStudent } from './components/RegisterStudent';
import { StartSession } from './components/StartSession';
import { ActiveSession } from './components/ActiveSession';
import { SessionReport } from './components/SessionReport';
import { ViewReports } from './components/ViewReports';

export type Student = {
  id: string;
  name: string;
  faceData: string[];
  registeredAt: string;
};

export type SessionData = {
  id: string;
  teacherName: string;
  teacherId: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  totalStudents: number;
  attentionData: { time: number; attention: number }[];
  studentEngagement: { studentId: string; name: string; attentionScore: number }[];
  alerts: { time: number; type: string; message: string }[];
};

export type Page = 'main' | 'register' | 'start-session' | 'active-session' | 'session-report' | 'view-reports';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('main');
  const [students, setStudents] = useState<Student[]>([]);
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [currentSession, setCurrentSession] = useState<SessionData | null>(null);
  const [selectedReport, setSelectedReport] = useState<SessionData | null>(null);

  const addStudent = (student: Student) => {
    setStudents([...students, student]);
  };

  const startNewSession = (teacherName: string, teacherId: string) => {
    const session: SessionData = {
      id: Date.now().toString(),
      teacherName,
      teacherId,
      startTime: new Date().toISOString(),
      totalStudents: students.length,
      attentionData: [],
      studentEngagement: [],
      alerts: [],
    };
    setCurrentSession(session);
    setCurrentPage('active-session');
  };

  const endSession = (sessionData: SessionData) => {
    setSessions([sessionData, ...sessions]);
    setSelectedReport(sessionData);
    setCurrentSession(null);
    setCurrentPage('session-report');
  };

  const viewReport = (session: SessionData) => {
    setSelectedReport(session);
    setCurrentPage('session-report');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentPage === 'main' && (
        <MainPage
          onStartSession={() => setCurrentPage('start-session')}
          onViewReports={() => setCurrentPage('view-reports')}
          onRegisterStudent={() => setCurrentPage('register')}
        />
      )}
      {currentPage === 'register' && (
        <RegisterStudent
          onBack={() => setCurrentPage('main')}
          onRegister={addStudent}
        />
      )}
      {currentPage === 'start-session' && (
        <StartSession
          onBack={() => setCurrentPage('main')}
          onStart={startNewSession}
          studentsCount={students.length}
        />
      )}
      {currentPage === 'active-session' && currentSession && (
        <ActiveSession
          session={currentSession}
          students={students}
          onEndSession={endSession}
        />
      )}
      {currentPage === 'session-report' && selectedReport && (
        <SessionReport
          session={selectedReport}
          onBack={() => setCurrentPage('main')}
        />
      )}
      {currentPage === 'view-reports' && (
        <ViewReports
          sessions={sessions}
          onBack={() => setCurrentPage('main')}
          onViewReport={viewReport}
        />
      )}
    </div>
  );
}
