
import React, { useRef, useEffect, useState } from 'react';
import { Camera, RefreshCw } from 'lucide-react';

interface WebcamFeedProps {
  onFrame?: (imageData: ImageData) => void;
  isLoading?: boolean;
}

const WebcamFeed: React.FC<WebcamFeedProps> = ({ onFrame, isLoading = false }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraLoading, setIsCameraLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(true);

  const startCamera = async () => {
    setIsCameraLoading(true);
    setError(null);
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsActive(true);
      }
    } catch (err) {
      console.error('Error accessing webcam:', err);
      setError('Unable to access your camera. Please check permissions and try again.');
    } finally {
      setIsCameraLoading(false);
    }
  };

  useEffect(() => {
    startCamera();
    
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current || !isActive || isCameraLoading) return;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    let animationId: number;
    
    const processFrame = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw video frame to canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Get image data for pose detection
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        // Send frame data to parent component for processing
        if (onFrame && !isLoading) onFrame(imageData);
      }
      
      animationId = requestAnimationFrame(processFrame);
    };
    
    processFrame();
    
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [onFrame, isActive, isCameraLoading, isLoading]);

  const toggleCamera = () => {
    if (isActive) {
      setIsActive(false);
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    } else {
      startCamera();
    }
  };

  return (
    <div className="relative rounded-2xl overflow-hidden bg-black/5 w-full aspect-video max-w-4xl mx-auto">
      {(isCameraLoading || isLoading) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10 backdrop-blur-sm">
          <div className="w-12 h-12 border-4 border-sage-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-foreground/80">
            {isCameraLoading ? "Initializing camera..." : "Loading pose detection model..."}
          </p>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 p-6 text-center">
          <Camera className="w-12 h-12 text-red-500 mb-4" />
          <h3 className="text-xl font-medium text-red-600 mb-2">Camera Access Error</h3>
          <p className="text-gray-700 mb-4">{error}</p>
          <button 
            onClick={startCamera}
            className="btn-primary flex items-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>
        </div>
      )}
      
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        onLoadedData={() => setIsCameraLoading(false)}
        className="w-full h-full object-cover"
      />
      
      <canvas 
        ref={canvasRef} 
        className="absolute top-0 left-0 w-full h-full"
      />
      
      <div className="absolute bottom-4 right-4 flex space-x-2">
        <button
          onClick={toggleCamera}
          className="p-3 glass rounded-full hover:bg-white/80 transition-colors"
          aria-label={isActive ? "Pause camera" : "Resume camera"}
          disabled={isLoading}
        >
          {isActive ? (
            <span className="w-4 h-4 bg-red-500 rounded-sm"></span>
          ) : (
            <Camera className="w-4 h-4 text-foreground" />
          )}
        </button>
      </div>
    </div>
  );
};

export default WebcamFeed;
