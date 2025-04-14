'use client';

import { useState, useEffect } from 'react';

export default function FeedbackPage({ params }) {
  const [loading, setLoading] = useState(true);
  const [videoId, setVideoId] = useState(null);
  const [video, setVideo] = useState(null);
  const [feedbackDetails, setFeedbackDetails] = useState(null);
  const [generatingFeedback, setGeneratingFeedback] = useState(false);

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

  // Criteria for evaluation
  const evaluationCriteria = [
    { id: 'stance', name: 'Stance', description: 'Proper foot positioning and weight distribution' },
    { id: 'balance', name: 'Balance', description: 'Stability and control throughout movements' },
    { id: 'power', name: 'Power', description: 'Strength and energy in techniques' },
    { id: 'rhythm', name: 'Rhythm', description: 'Consistent timing and flow between movements' },
    { id: 'accuracy', name: 'Accuracy', description: 'Precision of techniques and movements' },
    { id: 'focus', name: 'Focus', description: 'Concentration and intent during performance' }
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

  const generateDetailedFeedback = () => {
    if (!video) return;
    
    setGeneratingFeedback(true);
    
    // Find the reference video for this poomsae type
    const reference = poomsaeReferences.find(ref => ref.name === video.poomsaeType);
    
    // Simulate analysis with a delay
    setTimeout(() => {
      // Generate scores for each criterion
      const criteriaScores = {};
      let totalScore = 0;
      
      evaluationCriteria.forEach(criterion => {
        // Generate a base score between 70-95
        const baseScore = Math.floor(Math.random() * 25) + 70;
        
        // Adjust based on Poomsae difficulty (higher forms are more difficult)
        const poomsaeNumber = parseInt(video.poomsaeType.split(' ')[1]);
        const difficultyAdjustment = Math.max(0, (poomsaeNumber - 1) * 1.5);
        
        // Calculate final score for this criterion
        const finalScore = Math.max(0, Math.min(100, Math.round(baseScore - difficultyAdjustment)));
        
        criteriaScores[criterion.id] = finalScore;
        totalScore += finalScore;
      });
      
      // Calculate overall score (average of all criteria)
      const overallScore = Math.round(totalScore / evaluationCriteria.length);
      
      // Generate feedback for each criterion
      const criteriaFeedback = {};
      evaluationCriteria.forEach(criterion => {
        const score = criteriaScores[criterion.id];
        
        if (score >= 90) {
          criteriaFeedback[criterion.id] = `Excellent ${criterion.name.toLowerCase()}. Your ${criterion.description.toLowerCase()} is exceptional.`;
        } else if (score >= 80) {
          criteriaFeedback[criterion.id] = `Good ${criterion.name.toLowerCase()}. Your ${criterion.description.toLowerCase()} is solid with minor areas for improvement.`;
        } else if (score >= 70) {
          criteriaFeedback[criterion.id] = `Satisfactory ${criterion.name.toLowerCase()}. Continue to work on your ${criterion.description.toLowerCase()}.`;
        } else {
          criteriaFeedback[criterion.id] = `${criterion.name} needs improvement. Focus on developing your ${criterion.description.toLowerCase()}.`;
        }
      });
      
      // Find the lowest and highest scoring criteria
      const lowestCriterion = evaluationCriteria.reduce((lowest, current) => 
        criteriaScores[current.id] < criteriaScores[lowest.id] ? current : lowest, 
        evaluationCriteria[0]
      );
      
      const highestCriterion = evaluationCriteria.reduce((highest, current) => 
        criteriaScores[current.id] > criteriaScores[highest.id] ? current : highest, 
        evaluationCriteria[0]
      );
      
      // Generate specific improvement suggestions
      let improvementSuggestions = [];
      
      if (criteriaScores.stance < 80) {
        improvementSuggestions.push('Practice basic stances in front of a mirror, focusing on proper foot positioning and weight distribution.');
      }
      
      if (criteriaScores.balance < 80) {
        improvementSuggestions.push('Incorporate balance exercises into your training routine, such as standing on one leg while performing hand techniques.');
      }
      
      if (criteriaScores.power < 80) {
        improvementSuggestions.push('Focus on generating power from your hips and core, not just your arms and legs.');
      }
      
      if (criteriaScores.rhythm < 80) {
        improvementSuggestions.push('Practice with a metronome or count out loud to maintain consistent timing between movements.');
      }
      
      if (criteriaScores.accuracy < 80) {
        improvementSuggestions.push('Break down complex movements into smaller components and practice each part slowly before combining them.');
      }
      
      if (criteriaScores.focus < 80) {
        improvementSuggestions.push('Incorporate meditation into your training routine to improve concentration and mental focus.');
      }
      
      // If all scores are good, add general improvement suggestion
      if (improvementSuggestions.length === 0) {
        improvementSuggestions.push('Continue practicing regularly to maintain your excellent form and technique.');
        improvementSuggestions.push('Consider learning the next Poomsae form to challenge yourself further.');
      }
      
      // Generate overall assessment
      let overallAssessment = '';
      if (overallScore >= 90) {
        overallAssessment = `Outstanding performance of ${video.poomsaeType}! Your technique demonstrates excellent understanding and execution of the form. Your strongest area is ${highestCriterion.name.toLowerCase()}, showing exceptional ${highestCriterion.description.toLowerCase()}. To further perfect your form, you could focus slightly more on your ${lowestCriterion.name.toLowerCase()}.`;
      } else if (overallScore >= 80) {
        overallAssessment = `Very good performance of ${video.poomsaeType}. You demonstrate solid technique and understanding of the form. Your ${highestCriterion.name.toLowerCase()} is particularly strong. To improve your overall score, focus on developing your ${lowestCriterion.name.toLowerCase()}, which is currently your area with the most room for growth.`;
      } else if (overallScore >= 70) {
        overallAssessment = `Good performance of ${video.poomsaeType}. You show a basic understanding of the form but need more practice to refine your technique. Your ${highestCriterion.name.toLowerCase()} shows promise. Concentrate on improving your ${lowestCriterion.name.toLowerCase()}, which needs the most attention.`;
      } else {
        overallAssessment = `Your performance of ${video.poomsaeType} shows you're on the right track, but requires significant practice to meet standard requirements. Focus primarily on developing your ${lowestCriterion.name.toLowerCase()}, which is currently your biggest challenge. Regular practice with attention to proper technique will help you improve.`;
      }
      
      // Set feedback details
      setFeedbackDetails({
        overallScore,
        criteriaScores,
        criteriaFeedback,
        overallAssessment,
        improvementSuggestions,
        lowestCriterion,
        highestCriterion,
        referenceVideo: reference
      });
      
      // Update the video with the new score and feedback in localStorage
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      const userVideos = JSON.parse(localStorage.getItem(`videos_${currentUser.id}`) || '[]');
      const updatedVideos = userVideos.map(v => {
        if (v.id.toString() === videoId) {
          return {
            ...v,
            score: overallScore,
            feedback: overallAssessment.split('.')[0] + '.' // Just the first sentence for the summary
          };
        }
        return v;
      });
      
      localStorage.setItem(`videos_${currentUser.id}`, JSON.stringify(updatedVideos));
      
      // Update the current video state
      setVideo(prev => ({
        ...prev,
        score: overallScore,
        feedback: overallAssessment.split('.')[0] + '.'
      }));
      
      setGeneratingFeedback(false);
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
        <h2 className="text-2xl font-bold mb-6">Feedback: {video.title}</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Info Section */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Performance Details</h3>
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
              <span className="font-medium mr-2">Overall Score:</span>
              <span className={`px-2 py-1 rounded text-white ${
                video.score >= 90 ? 'bg-green-500' : 
                video.score >= 80 ? 'bg-blue-500' : 
                video.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
              }`}>
                {video.score}/100
              </span>
            </div>
            <p className="text-sm mb-4">{video.feedback}</p>
            
            {!feedbackDetails && !generatingFeedback && (
              <button 
                onClick={generateDetailedFeedback}
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                Generate Detailed Feedback
              </button>
            )}
            
            {generatingFeedback && (
              <div className="text-center py-4">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600 mb-2"></div>
                <p>Generating detailed feedback...</p>
              </div>
            )}
            
            {feedbackDetails && (
              <a 
                href={`/video/${videoId}`}
                className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 mt-4"
              >
                View Video Comparison
              </a>
            )}
          </div>
          
          {/* Detailed Feedback Section */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Detailed Feedback</h3>
            
            {!feedbackDetails && !generatingFeedback && (
              <div className="text-center py-12">
                <p className="text-gray-500">Click "Generate Detailed Feedback" to receive a comprehensive analysis of your performance.</p>
              </div>
            )}
            
            {generatingFeedback && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
                <p className="text-lg">Analyzing your performance...</p>
                <p className="text-sm text-gray-500 mt-2">This may take a few moments as we compare your video with the reference performance.</p>
              </div>
            )}
            
            {feedbackDetails && (
              <>
                <div className="mb-6">
                  <h4 className="font-medium text-lg mb-2">Overall Assessment</h4>
                  <p className="text-gray-700">{feedbackDetails.overallAssessment}</p>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-medium text-lg mb-4">Performance Metrics</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {evaluationCriteria.map(criterion => (
                      <div key={criterion.id} className="bg-gray-50 p-4 rounded">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium">{criterion.name}</span>
                          <span className={`px-2 py-0.5 text-sm rounded text-white ${
                            feedbackDetails.criteriaScores[criterion.id] >= 90 ? 'bg-green-500' : 
                            feedbackDetails.criteriaScores[criterion.id] >= 80 ? 'bg-blue-500' : 
                            feedbackDetails.criteriaScores[criterion.id] >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}>
                            {feedbackDetails.criteriaScores[criterion.id]}/100
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                          <div 
                            className={`h-2 rounded-full ${
                              feedbackDetails.criteriaScores[criterion.id] >= 90 ? 'bg-green-500' : 
                              feedbackDetails.criteriaScores[criterion.id] >= 80 ? 'bg-blue-500' : 
                              feedbackDetails.criteriaScores[criterion.id] >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                            }`} 
                            style={{ width: `${feedbackDetails.criteriaScores[criterion.id]}%` }}
                          ></div>
                        </div>
                        <p className="text-sm text-gray-600">{criterion.description}</p>
                        <p className="text-sm mt-2">{feedbackDetails.criteriaFeedback[criterion.id]}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-medium text-lg mb-2">Improvement Suggestions</h4>
                  <ul className="list-disc pl-5 space-y-2">
                    {feedbackDetails.improvementSuggestions.map((suggestion, index) => (
                      <li key={index} className="text-gray-700">{suggestion}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                  <h4 className="font-medium text-blue-700 mb-1">Next Steps</h4>
                  <p className="text-sm text-blue-700">
                    Review the reference video for {video.poomsaeType} and practice regularly, focusing on your areas for improvement. 
                    Record another video after practicing to track your progress.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
