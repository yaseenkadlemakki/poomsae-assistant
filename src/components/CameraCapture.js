'use client';

import { useState, useRef, useEffect } from 'react';

const CameraCapture = ({ onCapture, onCancel }) => {
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [videoURL, setVideoURL] = useState('');
  const [cameraError, setCameraError] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
      setIsMobile(isMobileDevice);
    };
    
    checkMobile();
  }, []);

  // Initialize camera
  useEffect(() => {
    async function setupCamera() {
      try {
        const constraints = {
          audio: true,
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: isMobile ? "environment" : "user"
          }
        };
        
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        
        // Setup media recorder
        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: 'video/webm;codecs=vp9,opus'
        });
        
        mediaRecorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            setRecordedChunks((prev) => [...prev, event.data]);
          }
        };
        
        mediaRecorder.onstop = () => {
          const blob = new Blob(recordedChunks, {
            type: 'video/webm'
          });
          const url = URL.createObjectURL(blob);
          setVideoURL(url);
        };
        
        mediaRecorderRef.current = mediaRecorder;
      } catch (error) {
        console.error('Error accessing camera:', error);
        setCameraError(`Error accessing camera: ${error.message || 'Permission denied'}`);
      }
    }
    
    setupCamera();
    
    // Cleanup function
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
      
      if (videoURL) {
        URL.revokeObjectURL(videoURL);
      }
    };
  }, [isMobile]);

  // Handle recording timer
  useEffect(() => {
    let interval;
    
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prevTime) => {
          // Auto-stop after 15 seconds
          if (prevTime >= 15) {
            stopRecording();
            return 15;
          }
          return prevTime + 1;
        });
      }, 1000);
    } else if (!isRecording && recordingTime !== 0) {
      clearInterval(interval);
    }
    
    return () => clearInterval(interval);
  }, [isRecording, recordingTime]);

  // Handle countdown timer
  useEffect(() => {
    let interval;
    
    if (countdown !== null && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prevCount) => {
          if (prevCount <= 1) {
            startRecording();
            return null;
          }
          return prevCount - 1;
        });
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [countdown]);

  const startCountdown = () => {
    setCountdown(3);
  };

  const startRecording = () => {
    setRecordedChunks([]);
    setVideoURL('');
    setRecordingTime(0);
    setIsRecording(true);
    
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.start(100);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  const handleRetake = () => {
    setRecordedChunks([]);
    setVideoURL('');
    setRecordingTime(0);
  };

  const handleSave = () => {
    if (recordedChunks.length === 0) return;
    
    const blob = new Blob(recordedChunks, {
      type: 'video/webm'
    });
    
    onCapture(blob, videoURL);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (cameraError) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-red-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-center font-medium">Camera Error</p>
        </div>
        <p className="text-gray-700 mb-4 text-center">{cameraError}</p>
        <p className="text-gray-600 mb-4 text-center text-sm">
          Please ensure you've granted camera permissions and are using a supported browser.
          iPhone users should use Safari for best compatibility.
        </p>
        <div className="flex justify-center">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <div className="relative">
        {!videoURL ? (
          <div className="relative rounded-lg overflow-hidden bg-black aspect-video">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${isRecording ? 'recording-pulse' : ''}`}
            />
            
            {countdown !== null && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <span className="text-white text-6xl font-bold">{countdown}</span>
              </div>
            )}
            
            {isRecording && (
              <div className="absolute top-4 left-4 flex items-center">
                <div className="h-3 w-3 rounded-full bg-red-500 mr-2 animate-pulse"></div>
                <span className="text-white font-medium">{formatTime(recordingTime)}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="relative rounded-lg overflow-hidden bg-black aspect-video">
            <video
              src={videoURL}
              controls
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>
      
      <div className="mt-4 flex justify-between">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
        >
          Cancel
        </button>
        
        {!videoURL ? (
          isRecording ? (
            <button
              onClick={stopRecording}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
              </svg>
              Stop Recording
            </button>
          ) : (
            <button
              onClick={startCountdown}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
              Start Recording
            </button>
          )
        ) : (
          <div className="space-x-2">
            <button
              onClick={handleRetake}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Retake
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Use This Video
            </button>
          </div>
        )}
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p className="mb-1">Tips for best results:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Ensure good lighting and a clear background</li>
          <li>Position your device to capture your full body</li>
          <li>Perform the Poomsae at a steady pace</li>
          <li>Recording will automatically stop after 15 seconds</li>
        </ul>
      </div>
      
      <style jsx>{`
        .recording-pulse {
          box-shadow: 0 0 0 0 rgba(220, 38, 38, 1);
          animation: pulse 1.5s infinite;
        }
        
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(220, 38, 38, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(220, 38, 38, 0);
          }
        }
      `}</style>
    </div>
  );
};

export default CameraCapture;
