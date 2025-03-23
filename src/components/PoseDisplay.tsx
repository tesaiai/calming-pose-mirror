
import React from 'react';

interface PoseDisplayProps {
  poseName: string;
  confidence: number;
  isDetecting: boolean;
}

const PoseDisplay: React.FC<PoseDisplayProps> = ({ 
  poseName, 
  confidence, 
  isDetecting 
}) => {
  // Determine color based on confidence
  const getConfidenceColor = () => {
    if (confidence >= 90) return 'bg-green-500';
    if (confidence >= 70) return 'bg-sage-400';
    if (confidence >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="glass rounded-2xl p-6 w-full max-w-md mx-auto">
      <div className="mb-4 flex items-center">
        <div className={`w-3 h-3 rounded-full mr-3 ${isDetecting ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
        <p className="text-sm font-medium text-foreground/70">
          {isDetecting ? 'Detecting Pose' : 'Waiting for Pose'}
        </p>
      </div>
      
      <h2 className="text-3xl font-semibold mb-2 animate-slide-up">
        {poseName || 'No Pose Detected'}
      </h2>
      
      <div className="mt-6">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-foreground/70">Confidence</span>
          <span className="text-sm font-medium">{confidence.toFixed(1)}%</span>
        </div>
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full ${getConfidenceColor()} transition-all duration-500 ease-out`}
            style={{ width: `${confidence}%` }}
          ></div>
        </div>
      </div>
      
      <div className="mt-8 flex flex-col items-center">
        <p className="text-xs text-center text-foreground/60 mb-2">
          Hold the pose steady for best results
        </p>
        <div className="w-24 h-24 rounded-full bg-beige-300/30 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-beige-300/60 animate-breathe flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-beige-300/90"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoseDisplay;
