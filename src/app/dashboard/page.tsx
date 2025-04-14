'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// Import CameraCapture component with dynamic loading (no SSR)
const CameraCapture = dynamic(() => import('@/components/CameraCapture'), { 
  ssr: false,
  loading: () => <div className="p-8 text-center">Loading camera...</div>
});

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState('');
  const [selectedPoomsae, setSelectedPoomsae] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const [capturedVideo, setCapturedVideo] = useState(null);
  const [capturedVideoURL, setCapturedVideoURL] = useState('');
  
  // Poomsae reference videos from the RTF file
  const poomsaeReferences = [
    { id: 1, name: 'Taegeuk 1 Jang', url: 'https://youtu.be/WhkjRruCBTo?si=hSxur1q9b2wSacDi' },
    { id: 2, name: 'Taegeuk 2 Jang', url: 'https://youtu.be/tGlrUplKHh8?si=KgJ5k5IOnoKvqla1' },
    { id: 3, name: 'Taegeuk 3 Jang', url: 'https://youtu.be/ksSqKt0UkWo?si=qTIO3avP6xhUQvU4' },
    { id: 4, name: 'Taegeuk 4 Jang', url: 'https://youtu.be/Lt917gacJho?si=K8yoJ6eaddHO10hM' },
    { id: 5, name: 'Taegeuk 5 Jang', url: 'https://youtu.be/VdqNEAHWCBM?si=17WOwOJReoNDt-Lj' },
    { id: 6, name: 'Taegeuk 6 Jang', url: 'https://youtu.be/jcBwWo4wN7c?si=WhmvhFTclIXyXuQA' },
    { id: 7, name: 'Taegeuk 7 Jang', url: 'https://youtu.be/6FUM1p6qqhQ?si=sRP9OcmHnQDubXKg' }
  ];

  useEffect(() => {
    // Check if user is logged in
    const currentUser = localStorage.getItem('currentUser');
    const authToken = localStorage.getItem('authToken');
    
    if (!currentUser || !authToken) {
      router.push('/login');
      return;
    }
    
    setUser(JSON.parse(currentUser));
    
    // Load mock videos from localStorage or create sample data
    const storedVideos = localStorage.getItem(`videos_${JSON.parse(currentUser).id}`);
    if (storedVideos) {
      setVideos(JSON.parse(storedVideos));
    } else {
      // Create sample videos for demo
      const sampleVideos = [
        {
          id: 1,
          title: 'Taegeuk Il Jang Practice',
          poomsaeType: 'Taegeuk 1 Jang',
          uploadDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          thumbnailUrl: 'https://via.placeholder.com/300x200?text=Taegeuk+Il+Jang',
          score: 78,
          feedback: 'Good stance, but work on timing between movements.'
        },
        {
          id: 2,
          title: 'Taegeuk Yi Jang Practice',
          poomsaeType: 'Taegeuk 2 Jang',
          uploadDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          thumbnailUrl: 'https://via.placeholder.com/300x200?text=Taegeuk+Yi+Jang',
          score: 85,
          feedback: 'Excellent power and precision. Focus on smoother transitions.'
        }
      ];
      
      setVideos(sampleVideos);
      localStorage.setItem(`videos_${JSON.parse(currentUser).id}`, JSON.stringify(sampleVideos));
    }
    
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    router.push('/login');
  };

  const handleUploadClick = () => {
    setUploadModalOpen(true);
    setUploadProgress(0);
    setUploadError('');
    setSelectedPoomsae('');
  };

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    const title = e.target.title.value;
    
    if (!title) {
      setUploadError('Please enter a title for your video');
      return;
    }
    
    if (!selectedPoomsae) {
      setUploadError('Please select a Poomsae type');
      return;
    }
    
    // Check if we have a captured video
    if (!capturedVideo && !capturedVideoURL) {
      setUploadError('Please capture or upload a video');
      return;
    }
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        
        // Generate a score between 70-99 based on the selected Poomsae type
        // More complex forms get slightly lower average scores to simulate difficulty
        const baseScore = Math.floor(Math.random() * 20) + 70;
        const poomsaeNumber = parseInt(selectedPoomsae.split(' ')[1]);
        const difficultyAdjustment = Math.max(0, (poomsaeNumber - 1) * 2);
        const adjustedScore = Math.max(70, Math.min(99, baseScore - difficultyAdjustment));
        
        // Generate feedback based on the score and selected Poomsae
        let feedback = '';
        if (adjustedScore >= 90) {
          feedback = `Excellent execution of ${selectedPoomsae}! Your movements are precise and powerful.`;
        } else if (adjustedScore >= 80) {
          feedback = `Good performance of ${selectedPoomsae}. Focus on improving your stance transitions.`;
        } else if (adjustedScore >= 70) {
          feedback = `Satisfactory execution of ${selectedPoomsae}. Work on timing and balance.`;
        } else {
          feedback = `Keep practicing ${selectedPoomsae}. Focus on the basic stances and movements.`;
        }
        
        // Generate a thumbnail URL - in a real app, this would be created from the video
        // For now, we'll use the captured video URL if available, or a placeholder
        const thumbnailUrl = capturedVideoURL || `https://via.placeholder.com/300x200?text=${encodeURIComponent(selectedPoomsae)}`;
        
        // Add new video to the list
        const newVideo = {
          id: Date.now(),
          title,
          poomsaeType: selectedPoomsae,
          uploadDate: new Date().toISOString(),
          thumbnailUrl,
          score: adjustedScore,
          feedback
        };
        
        const updatedVideos = [newVideo, ...videos];
        setVideos(updatedVideos);
        localStorage.setItem(`videos_${user.id}`, JSON.stringify(updatedVideos));
        
        // Reset captured video state
        setCapturedVideo(null);
        setCapturedVideoURL('');
        
        // Close modal after short delay
        setTimeout(() => {
          setUploadModalOpen(false);
        }, 500);
      }
    }, 300);
  };

  const handlePoomsaeSelect = (e) => {
    setSelectedPoomsae(e.target.value);
  };

  const viewReferenceVideo = (poomsaeType) => {
    const reference = poomsaeReferences.find(ref => ref.name === poomsaeType);
    if (reference) {
      window.open(reference.url, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-indigo-700 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <img src="/images/taekwondo_logo.png" alt="Taekwondo Logo" className="h-10 w-auto mr-3" />
            <h1 className="text-2xl font-bold text-white">Virtual Poomsae Coach</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-white">Welcome, {user?.username}</span>
            <button 
              onClick={handleLogout}
              className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8" style={{
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.95)), url("/images/taekwondo_woman.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}>
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-indigo-800 mb-2">Welcome to Your Poomsae Training</h2>
              <p className="text-gray-600 mb-4">Track your progress, upload practice videos, and receive feedback to improve your Taekwondo forms.</p>
            </div>
            <button 
              onClick={handleUploadClick}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Upload New Video
            </button>
          </div>
        </div>

        {/* Reference Videos Section */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <img src="/images/taekwondo_logo.png" alt="Taekwondo Logo" className="h-8 w-auto mr-2" />
            <h3 className="text-xl font-bold text-gray-800">Reference Videos</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {poomsaeReferences.map(ref => (
              <div key={ref.id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-indigo-500 hover:shadow-lg transition-shadow">
                <h4 className="font-medium mb-2">{ref.name}</h4>
                <button 
                  onClick={() => viewReferenceVideo(ref.name)}
                  className="w-full px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  Watch Reference
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Video grid */}
        <div className="flex items-center mb-4">
          <img src="/images/taekwondo_kick.jpg" alt="Taekwondo Kick" className="h-8 w-auto mr-2 rounded-full object-cover" />
          <h3 className="text-xl font-bold text-gray-800">Your Uploaded Videos</h3>
        </div>
        
        {videos.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center border border-gray-200">
            <img src="/images/taekwondo_pose.jpg" alt="Taekwondo Pose" className="h-32 w-auto mx-auto mb-4 rounded-lg shadow-sm" />
            <p className="text-gray-600">You haven't uploaded any videos yet. Click "Upload New Video" to get started.</p>
            <button 
              onClick={handleUploadClick}
              className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md inline-flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Upload New Video
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map(video => (
              <div key={video.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gray-200 relative">
                  <img 
                    src={video.thumbnailUrl} 
                    alt={video.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 rounded-full text-white text-sm font-bold ${
                      video.score >= 90 ? 'bg-green-500' : 
                      video.score >= 80 ? 'bg-blue-500' : 
                      video.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}>
                      {video.score}/100
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">{video.title}</h3>
                  <div className="flex items-center mb-1">
                    <span className="text-sm text-indigo-600 font-medium">{video.poomsaeType}</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">
                    Uploaded on {new Date(video.uploadDate).toLocaleDateString()}
                  </p>
                  <div className="bg-gray-50 p-3 rounded-md mb-3 border-l-2 border-indigo-400">
                    <p className="text-sm">{video.feedback}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="flex-1 px-3 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                      View Details
                    </button>
                    <button 
                      className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 flex items-center justify-center"
                      onClick={() => viewReferenceVideo(video.poomsaeType)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                      </svg>
                      Compare
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Upload Modal */}
      {uploadModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Upload New Video</h3>
              <button 
                onClick={() => setUploadModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {showCamera ? (
              <CameraCapture 
                onCapture={(videoBlob, videoURL) => {
                  setCapturedVideo(videoBlob);
                  setCapturedVideoURL(videoURL);
                  setShowCamera(false);
                }}
                onCancel={() => {
                  setShowCamera(false);
                }}
              />
            ) : uploadProgress > 0 && uploadProgress < 100 ? (
              <div className="mb-4">
                <p className="mb-2 font-medium">Uploading and analyzing video...</p>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-indigo-600 h-3 rounded-full transition-all duration-300" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-right text-sm mt-1 text-gray-600">{uploadProgress}%</p>
              </div>
            ) : (
              <form onSubmit={handleUploadSubmit}>
                {uploadError && (
                  <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm">{uploadError}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="mb-4">
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Video Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., My Taegeuk 1 Jang Practice"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="poomsaeType" className="block text-sm font-medium text-gray-700 mb-1">
                    Poomsae Type
                  </label>
                  <select
                    id="poomsaeType"
                    name="poomsaeType"
                    value={selectedPoomsae}
                    onChange={handlePoomsaeSelect}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Select Poomsae Type</option>
                    {poomsaeReferences.map(ref => (
                      <option key={ref.id} value={ref.name}>{ref.name}</option>
                    ))}
                  </select>
                </div>
                
                {capturedVideoURL ? (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Captured Video
                    </label>
                    <div className="relative rounded-lg overflow-hidden bg-black aspect-video mb-2">
                      <video
                        src={capturedVideoURL}
                        controls
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setCapturedVideo(null);
                          setCapturedVideoURL('');
                        }}
                        className="text-sm text-indigo-600 hover:text-indigo-500"
                      >
                        Remove and capture again
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Capture or Upload Video
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md px-4 py-4 text-center hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        onClick={() => {
                          setShowCamera(true);
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-sm text-gray-600">Capture with Camera</span>
                      </button>
                      
                      <div className="border-2 border-dashed border-gray-300 rounded-md px-4 py-4 text-center hover:bg-gray-50">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-8 w-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-sm text-gray-600">
                          Upload from Device
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          MP4, MOV, or AVI
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setUploadModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    disabled={!selectedPoomsae || (!capturedVideo && uploadProgress === 0)}
                  >
                    Upload
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
