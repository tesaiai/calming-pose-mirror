
import * as ort from 'onnxruntime-web';

// Initialize the ONNX session
let session: ort.InferenceSession | null = null;

// Prepare the model
export const initPoseClassifier = async (): Promise<void> => {
  try {
    // Create an ONNX inference session
    session = await ort.InferenceSession.create('/yoga_pose_classifier.onnx');
    console.log('ONNX model loaded successfully');
  } catch (error) {
    console.error('Error initializing ONNX model:', error);
  }
};

// Process keypoints from MoveNet and classify pose
export const classifyPose = async (keypoints: number[]): Promise<{poseName: string, confidence: number}> => {
  if (!session) {
    console.error('Model not initialized. Call initPoseClassifier first.');
    return { poseName: 'No Pose', confidence: 0 };
  }

  try {
    // Prepare input tensor from keypoints (assuming 34 keypoints as in the export function)
    const inputTensor = new ort.Tensor('float32', new Float32Array(keypoints), [1, keypoints.length]);
    
    // Run inference
    const feeds = { input: inputTensor };
    const results = await session.run(feeds);
    
    // Process results (assuming the output is a classification with confidences)
    const output = results.output.data as Float32Array;
    
    // Get the index of the highest confidence
    let maxIndex = 0;
    let maxConfidence = output[0];
    
    for (let i = 1; i < output.length; i++) {
      if (output[i] > maxConfidence) {
        maxConfidence = output[i];
        maxIndex = i;
      }
    }
    
    // Map index to pose name (this mapping should match your model's training labels)
    const poseNames = [
      'Chair Pose', 'Dolphin Plank Pose', 'Downward-Facing Dog Pose', 'Fish Pose', 
      'Goddess Pose', 'Locust Pose', 'Lord of the Dance Pose', 'Low Lunge Pose',
      'Seated Forward Bend Pose', 'Side Plank Pose', 'Staff Pose', 'Tree Pose',
      'Warrior 1 Pose', 'Warrior 2 Pose', 'Warrior 3 Pose', 'Wide-Angle Seated Forward Bend Pose'
    ];
    
    // Convert confidence to percentage
    const confidencePercent = maxConfidence * 100;
    
    return {
      poseName: poseNames[maxIndex] || 'Unknown Pose',
      confidence: confidencePercent
    };
  } catch (error) {
    console.error('Error classifying pose:', error);
    return { poseName: 'Error', confidence: 0 };
  }
};

// Extract keypoints from MoveNet output for ONNX model input
export const extractKeypoints = (poses: any): number[] => {
  if (!poses || poses.length === 0) {
    // Return zeros if no poses detected
    return new Array(34).fill(0);
  }
  
  const pose = poses[0]; // Take the first detected pose
  
  // Extract x, y coordinates from keypoints and flatten them
  const keypoints = pose.keypoints.map((kp: any) => [kp.x, kp.y]).flat();
  
  return keypoints;
};
