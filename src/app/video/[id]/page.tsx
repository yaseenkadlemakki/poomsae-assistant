'use client';

import { useState, useEffect } from 'react';

export default function VideoComparisonPage({ params }) {
  const [loading, setLoading] = useState(true);
  const [videoId, setVideoId] = useState(null);
  const [video, setVideo] = useState(null);
  const [comparisonResults, setComparisonResults] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  // Poomsae reference videos from the RTF file
  const poomsaeReferences = [
    { id: 1, name: 'Taegeuk 1 Jang', url: 'https://youtu.be/WhkjRruCBTo?si=hSxur1q9b2wSacDi', youtubeId: 'WhkjRruCBTo' },
    { id: 2, name: 'Taegeuk 2 Jang', url: 'https://youtu.be/tGlrUplKHh8?si=KgJ5k5IOnoKvqla1', youtubeId: 'tGlrUplKHh8' },
    { id: 3, name: 'Taegeuk 3 Jang', url: 'https://youtu.be/ksSqKt0UkWo?si=qTIO3avP6xhUQvU4', youtubeId: 'ksSqKt0UkWo' },
    { id: 4, name: 'Taegeuk 4 Jang', url: 'https://youtu.be/Lt917gacJho?si=K8yoJ6eaddHO10hM', youtubeId: 'Lt917gacJho' },
    { id: 5, name: 'Taegeuk 5 Jang', url: 'https://youtu.be/VdqNEAHWCBM?si=17WOwOJReoNDt-Lj', youtubeId: 'VdqNEAHWCBM' },
    { id: 6, name: 'Taegeuk 6 Jang', url: 'https://youtu.be/jcBwWo4wN7c?si=WhmvhFTclIXyXuQA', youtubeId: 'jcBwWo4wN7c' },
    { id: 7, name: 'Taegeuk 7 Jang', url: 'https://youtu.be/6FUM1p6qqhQ?si=sRP9OcmHnQDubXKg', youtubeId: '6FUM1p6qqhQ' }
  ];

  useEffect(() => {
    // Check if user is logged in
    const currentUser = localStorage.getItem('currentUser');
    const authToken = localStorage.getItem('authToken');
    
    if (!currentUser || !authToken) {
      window.location.href = '/login';
      return;
    }

    // Get video ID from URL params
    if (params && params.id) {
      setVideoId(params.id);
      
      // Get user videos from localStorage
      const user = JSON.parse(currentUser);
      const userVideos = JSON.parse(localStorage.getItem(`videos_${user.id}`) || '[]');
      
      // Find the specific video
      const foundVideo = userVideos.find(v => v.id.toString() === params.id);
      if (foundVideo) {
        setVideo(foundVideo);
      }
    }
    
    setLoading(false);
  }, [params]);

  const startComparison = () => {
    if (!video) return;
    
    setAnalyzing(true);
    
    // Find the reference video for this poomsae type
    const reference = poomsaeReferences.find(ref => ref.name === video.poomsaeType);
    
    // Simulate analysis with a delay
    setTimeout(() => {
      // Generate detailed comparison results
      const alignmentScore = Math.floor(Math.random() * 30) + 70;
      const timingScore = Math.floor(Math.random() * 30) + 70;
      const postureScore = Math.floor(Math.random() * 30) + 70;
      const executionScore = Math.floor(Math.random() * 30) + 70;
      
      // Calculate overall score (weighted average)
      const overallScore = Math.round(
        (alignmentScore * 0.25) + 
        (timingScore * 0.25) + 
        (postureScore * 0.25) + 
        (executionScore * 0.25)
      );
      
      // Generate detailed feedback
      const generateFeedback = (score, aspect) => {
        if (score >= 90) {
          return `Excellent ${aspect}. Your movements are precise and well-executed.`;
        } else if (score >= 80) {
          return `Good ${aspect}. Minor improvements could be made for perfection.`;
        } else if (score >= 70) {
          return `Satisfactory ${aspect}. Focus on consistency and precision.`;
        } else {
          return `${aspect} needs improvement. Practice the basic techniques more.`;
        }
      };
      
      // Generate specific improvement suggestions based on the lowest score
      let improvementFocus = '';
      const lowestScore = Math.min(alignmentScore, timingScore, postureScore, executionScore);
      
      if (lowestScore === alignmentScore) {
        improvementFocus = 'Focus on maintaining proper alignment throughout the form. Practice in front of a mirror to check your positioning.';
      } else if (lowestScore === timingScore) {
        improvementFocus = 'Work on the rhythm and timing of your movements. Practice with a metronome or count out loud to maintain consistent timing.';
      } else if (lowestScore === postureScore) {
        improvementFocus = 'Pay attention to your stance and posture. Ensure your weight distribution is correct and your back is straight.';
      } else {
        improvementFocus = 'Focus on the power and precision of your techniques. Practice each movement slowly to perfect the execution before increasing speed.';
      }
      
      // Set comparison results
      setComparisonResults({
        overallScore,
        alignmentScore,
        timingScore,
        postureScore,
        executionScore,
        alignmentFeedback: generateFeedback('alignment', 'alignment'),
        timingFeedback: generateFeedback('timing', 'timing'),
        postureFeedback: generateFeedback('posture', 'posture'),
        executionFeedback: generateFeedback('execution', 'execution'),
        improvementFocus,
        referenceVideo: reference
      });
      
      setAnalyzing(false);
    }, 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-xl text-red-600">Video not found</p>
        <a href="/dashboard" className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
          Return to Dashboard
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Virtual Poomsae Coach</h1>
          <a href="/dashboard" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
            Back to Dashboard
          </a>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold mb-6">{video.title}</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* User Video Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Your Performance</h3>
            <div className="aspect-video bg-gray-200 mb-4">
              <img 
                src={video.thumbnailUrl} 
                alt={video.title} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mb-4">
              <p className="font-medium">Poomsae Type: {video.poomsaeType}</p>
              <p className="text-sm text-gray-500">Uploaded on {new Date(video.uploadDate).toLocaleDateString()}</p>
            </div>
            <div className="flex items-center mb-4">
              <span className="font-medium mr-2">Current Score:</span>
              <span className={`px-2 py-1 rounded text-white ${
                video.score >= 90 ? 'bg-green-500' : 
                video.score >= 80 ? 'bg-blue-500' : 
                video.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
              }`}>
                {video.score}/100
              </span>
            </div>
            <p className="text-sm mb-4">{video.feedback}</p>
            
            {!comparisonResults && !analyzing && (
              <button 
                onClick={startComparison}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Analyze and Compare
              </button>
            )}
            
            {analyzing && (
              <div className="text-center py-4">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600 mb-2"></div>
                <p>Analyzing your performance...</p>
              </div>
            )}
          </div>
          
          {/* Reference Video Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Reference Performance</h3>
            {comparisonResults ? (
              <>
                <div className="aspect-video bg-gray-200 mb-4">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src={`https://www.youtube.com/embed/${comparisonResults.referenceVideo.youtubeId}`} 
                    title={`${comparisonResults.referenceVideo.name} Reference`}
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                </div>
                <p className="font-medium mb-2">Reference: {comparisonResults.referenceVideo.name}</p>
                <p className="text-sm mb-4">This is the standard form for comparison.</p>
              </>
            ) : (
              <>
                <div className="aspect-video bg-gray-200 mb-4 flex items-center justify-center">
                  <p className="text-gray-500">Reference video will appear here after analysis</p>
                </div>
                <p className="text-sm mb-4">Click "Analyze and Compare" to see the reference video and detailed feedback.</p>
              </>
            )}
          </div>
        </div>
        
        {/* Comparison Results Section */}
        {comparisonResults && (
          <div className="mt-8 bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-4">Detailed Analysis</h3>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Overall Performance:</span>
                <span className={`px-3 py-1 rounded text-white ${
                  comparisonResults.overallScore >= 90 ? 'bg-green-500' : 
                  comparisonResults.overallScore >= 80 ? 'bg-blue-500' : 
                  comparisonResults.overallScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                }`}>
                  {comparisonResults.overallScore}/100
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${
                    comparisonResults.overallScore >= 90 ? 'bg-green-500' : 
                    comparisonResults.overallScore >= 80 ? 'bg-blue-500' : 
                    comparisonResults.overallScore >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                  }`} 
                  style={{ width: `${comparisonResults.overallScore}%` }}
                ></div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-medium mb-2">Alignment</h4>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">Score:</span>
                  <span className="text-sm font-medium">{comparisonResults.alignmentScore}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${comparisonResults.alignmentScore}%` }}
                  ></div>
                </div>
                <p className="text-sm">{comparisonResults.alignmentFeedback}</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Timing</h4>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">Score:</span>
                  <span className="text-sm font-medium">{comparisonResults.timingScore}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${comparisonResults.timingScore}%` }}
                  ></div>
                </div>
                <p className="text-sm">{comparisonResults.timingFeedback}</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Posture</h4>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">Score:</span>
                  <span className="text-sm font-medium">{comparisonResults.postureScore}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${comparisonResults.postureScore}%` }}
                  ></div>
                </div>
                <p className="text-sm">{comparisonResults.postureFeedback}</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Execution</h4>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm">Score:</span>
                  <span className="text-sm font-medium">{comparisonResults.executionScore}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${comparisonResults.executionScore}%` }}
                  ></div>
                </div>
                <p className="text-sm">{comparisonResults.executionFeedback}</p>
              </div>
            </div>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
              <h4 className="font-medium text-blue-700 mb-1">Improvement Focus</h4>
              <p className="text-sm text-blue-700">{comparisonResults.improvementFocus}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
