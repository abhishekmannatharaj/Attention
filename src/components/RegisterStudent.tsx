import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Camera, Check, User } from 'lucide-react';
import { Student } from '../App';

type RegisterStudentProps = {
  onBack: () => void;
  onRegister: (student: Student) => void;
};

export function RegisterStudent({ onBack, onRegister }: RegisterStudentProps) {
  const [step, setStep] = useState<'form' | 'camera' | 'success'>('form');
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [photosTaken, setPhotosTaken] = useState(0);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (step === 'camera') {
      startCamera();
    }
    return () => {
      stopCamera();
    };
  }, [step]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Unable to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const photoData = canvasRef.current.toDataURL('image/jpeg');
        
        const newPhotos = [...capturedPhotos, photoData];
        setCapturedPhotos(newPhotos);
        setPhotosTaken(photosTaken + 1);

        if (photosTaken + 1 >= 3) {
          // All photos captured
          stopCamera();
          completeRegistration(newPhotos);
        }
      }
    }
  };

  const completeRegistration = (photos: string[]) => {
    const student: Student = {
      id: studentId,
      name: name,
      faceData: photos,
      registeredAt: new Date().toISOString(),
    };
    onRegister(student);
    setStep('success');
    setTimeout(() => {
      onBack();
    }, 2000);
  };

  const handleStartCapture = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && studentId) {
      setStep('camera');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="p-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-gray-900">Register New Student</h1>
      </div>

      <div className="max-w-2xl mx-auto">
        {step === 'form' && (
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-center text-gray-900 mb-2">Student Information</h2>
            <p className="text-center text-gray-600 mb-8">
              Enter student details before face registration
            </p>
            
            <form onSubmit={handleStartCapture} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter student name"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="studentId" className="block text-gray-700 mb-2">
                  Student ID
                </label>
                <input
                  id="studentId"
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter student ID"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all flex items-center justify-center gap-2"
              >
                <Camera className="w-5 h-5" />
                Start Face Capture
              </button>
            </form>
          </div>
        )}

        {step === 'camera' && (
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h2 className="text-center text-gray-900 mb-2">Face Capture</h2>
            <p className="text-center text-gray-600 mb-6">
              Photos captured: {photosTaken} / 3
            </p>

            <div className="relative bg-gray-900 rounded-xl overflow-hidden mb-6">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-auto"
              />
              <canvas ref={canvasRef} className="hidden" />
              
              {/* Face Detection Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-64 h-64 border-4 border-purple-500 rounded-full opacity-50"></div>
              </div>
            </div>

            <button
              onClick={capturePhoto}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all flex items-center justify-center gap-2"
            >
              <Camera className="w-6 h-6" />
              Capture Photo ({photosTaken}/3)
            </button>

            <div className="mt-6 grid grid-cols-3 gap-4">
              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  className={`aspect-square rounded-lg border-2 ${
                    index < photosTaken
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 bg-gray-50'
                  } flex items-center justify-center`}
                >
                  {index < photosTaken ? (
                    <Check className="w-8 h-8 text-green-500" />
                  ) : (
                    <Camera className="w-8 h-8 text-gray-400" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-gray-900 mb-2">Registration Complete!</h2>
            <p className="text-gray-600">
              {name} has been successfully registered
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
