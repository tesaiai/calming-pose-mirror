
import { useState, useEffect } from 'react';
import { initPoseClassifier, classifyPose, extractKeypoints } from '../services/poseClassifier';

export const usePoseClassification = () => {
  const [isModelReady, setIsModelReady] = useState(false);
  const [currentPose, setCurrentPose] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [isDetecting, setIsDetecting] = useState(false);
  
  // Initialize the model on mount
  useEffect(() => {
    const loadModel = async () => {
      try {
        await initPoseClassifier();
        setIsModelReady(true);
      } catch (error) {
        console.error('Error loading model:', error);
      }
    };
    
    loadModel();
  }, []);
  
  // Function to process poses from MoveNet and classify them
  const processPose = async (poses: any) => {
    if (!isModelReady || !poses || poses.length === 0) {
      setIsDetecting(false);
      return;
    }
    
    setIsDetecting(true);
    
    try {
      // Extract keypoints in the format expected by our ONNX model
      const keypoints = extractKeypoints(poses);
      
      // Classify the pose
      const result = await classifyPose(keypoints);
      
      // Update state with the results
      setCurrentPose(result.poseName);
      setConfidence(result.confidence);
    } catch (error) {
      console.error('Error processing pose:', error);
      setIsDetecting(false);
    }
  };
  
  return {
    isModelReady,
    currentPose,
    confidence,
    isDetecting,
    processPose
  };
};
