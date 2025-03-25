
import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import WebcamFeed from '../components/WebcamFeed';
import PoseDisplay from '../components/PoseDisplay';
import { Clock, CheckCircle2 } from 'lucide-react';
import { usePoseClassification } from '../hooks/usePoseClassification';
import { toast } from '@/hooks/use-toast';

// Import the MoveNet model
import * as poseDetection from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs-backend-webgl';

const Practice = () => {
  const { currentPose, confidence, isDetecting, processPose } = usePoseClassification();
  const [detector, setDetector] = useState<poseDetection.PoseDetector | null>(null);
  const [sessionTime, setSessionTime] = useState(0);
  const [poseCount, setPoseCount] = useState(0);
  const [recentPoses, setRecentPoses] = useState<string[]>([]);
  const [isModelLoading, setIsModelLoading] = useState(true);
  
  // Initialize MoveNet model
  useEffect(() => {
    const loadMoveNetModel = async () => {
      try {
        setIsModelLoading(true);
        // Load the MoveNet model
        const detectorConfig = {
          modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER,
          enableSmoothing: true
        };
        
        const detector = await poseDetection.createDetector(
          poseDetection.SupportedModels.MoveNet, 
          detectorConfig
        );
        
        setDetector(detector);
        toast({
          title: "Model loaded successfully",
          description: "You can now start practicing yoga poses."
        });
      } catch (error) {
        console.error('Error loading MoveNet model:', error);
        toast({
          title: "Error loading model",
          description: "Please refresh the page and try again.",
          variant: "destructive"
        });
      } finally {
        setIsModelLoading(false);
      }
    };
    
    loadMoveNetModel();
    
    // Cleanup function
    return () => {
      if (detector) {
        // No direct dispose method in pose-detection API, but good practice to cleanup
      }
    };
  }, []);
  
  // Handle pose detection from webcam frames
  const handleFrame = useCallback(async (imageData: ImageData) => {
    if (!detector || isModelLoading) return;
    
    try {
      // Create an HTMLImageElement from ImageData
      const canvas = document.createElement('canvas');
      canvas.width = imageData.width;
      canvas.height = imageData.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      ctx.putImageData(imageData, 0, 0);
      
      // Detect poses
      const poses = await detector.estimatePoses(canvas);
      
      // Process the detected poses with our ONNX model
      await processPose(poses);
      
      // Update recent poses list if a new pose is detected with high confidence
      if (currentPose && confidence > 80) {
        // Check if this is a new pose compared to the most recent one
        if (recentPoses.length === 0 || recentPoses[0] !== currentPose) {
          setRecentPoses(prev => [currentPose, ...prev.slice(0, 2)]);
          setPoseCount(prev => prev + 1);
        }
      }
    } catch (error) {
      console.error('Error estimating poses:', error);
    }
  }, [detector, isModelLoading, processPose, currentPose, confidence, recentPoses]);
  
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
            <WebcamFeed onFrame={handleFrame} isLoading={isModelLoading} />
            
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
                {recentPoses.length > 0 ? (
                  recentPoses.map((pose, index) => (
                    <li key={index} className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-sage-400 mr-3"></div>
                      <span className="text-foreground/80">{pose}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-foreground/60">No poses detected yet</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Practice;
