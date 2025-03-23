
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import WebcamFeed from '../components/WebcamFeed';
import PoseDisplay from '../components/PoseDisplay';
import { Clock, CheckCircle2 } from 'lucide-react';

// Sample pose data - in a real implementation, this would be from a model
const samplePoses = [
  'Mountain Pose', 
  'Warrior I', 
  'Warrior II', 
  'Tree Pose', 
  'Downward Dog'
];

const Practice = () => {
  const [currentPose, setCurrentPose] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [isDetecting, setIsDetecting] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [poseCount, setPoseCount] = useState(0);
  
  // For demo purposes, simulate pose detection
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.3) {
        const randomPose = samplePoses[Math.floor(Math.random() * samplePoses.length)];
        const randomConfidence = 50 + Math.random() * 50;
        
        setCurrentPose(randomPose);
        setConfidence(randomConfidence);
        setIsDetecting(true);
        
        if (randomConfidence > 80) {
          setPoseCount(prev => prev + 1);
        }
      } else {
        setIsDetecting(false);
        setCurrentPose('');
        setConfidence(0);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Session timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Format time as MM:SS
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Handle frame from webcam - in a real app, this would process with a pose detection model
  const handleFrame = (imageData: ImageData) => {
    // Here you would run the pose detection model on the imageData
    // This is just a placeholder for the real implementation
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <div className="mb-8 animate-slide-down">
          <h1 className="text-3xl font-bold text-foreground">Practice Session</h1>
          <p className="text-foreground/70">Position yourself in the frame and hold poses steadily.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 animate-fade-in">
            <WebcamFeed onFrame={handleFrame} />
            
            <div className="mt-4 glass rounded-xl p-4 flex justify-between items-center">
              <div className="flex items-center">
                <Clock className="w-4 h-4 text-sage-500 mr-2" />
                <span className="text-sm font-medium">{formatTime(sessionTime)}</span>
              </div>
              
              <div className="flex items-center">
                <CheckCircle2 className="w-4 h-4 text-sage-500 mr-2" />
                <span className="text-sm font-medium">{poseCount} poses detected</span>
              </div>
            </div>
          </div>
          
          <div className="animate-fade-in delay-100">
            <PoseDisplay 
              poseName={currentPose} 
              confidence={confidence} 
              isDetecting={isDetecting} 
            />
            
            <div className="mt-6 glass rounded-xl p-4">
              <h3 className="text-lg font-medium mb-3">Recent Poses</h3>
              <ul className="space-y-3">
                {samplePoses.slice(0, 3).map((pose, index) => (
                  <li key={index} className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-sage-400 mr-3"></div>
                    <span className="text-foreground/80">{pose}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Practice;
