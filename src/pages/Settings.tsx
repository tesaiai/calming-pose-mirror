
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Settings as SettingsIcon, Save, Camera, Sliders, Check } from 'lucide-react';
import { toast } from "sonner";

// Sample yoga poses for customization
const availablePoses = [
  { id: 'mountain', name: 'Mountain Pose', difficulty: 'Beginner' },
  { id: 'warrior1', name: 'Warrior I', difficulty: 'Beginner' },
  { id: 'warrior2', name: 'Warrior II', difficulty: 'Intermediate' },
  { id: 'tree', name: 'Tree Pose', difficulty: 'Beginner' },
  { id: 'downdog', name: 'Downward Dog', difficulty: 'Beginner' },
  { id: 'triangle', name: 'Triangle Pose', difficulty: 'Intermediate' },
  { id: 'chair', name: 'Chair Pose', difficulty: 'Beginner' },
  { id: 'cobra', name: 'Cobra Pose', difficulty: 'Beginner' },
  { id: 'bridge', name: 'Bridge Pose', difficulty: 'Intermediate' },
  { id: 'crow', name: 'Crow Pose', difficulty: 'Advanced' },
];

const Settings = () => {
  const [confidenceThreshold, setConfidenceThreshold] = useState(70);
  const [selectedPoses, setSelectedPoses] = useState<string[]>(
    availablePoses.slice(0, 5).map(pose => pose.id)
  );
  const [showSkeletonOverlay, setShowSkeletonOverlay] = useState(true);
  const [flipCamera, setFlipCamera] = useState(false);
  const [voiceFeedback, setVoiceFeedback] = useState(false);

  const handleSaveSettings = () => {
    // In a real app, this would save to context/localStorage/backend
    toast.success("Settings saved successfully", {
      description: "Your preferences have been updated."
    });
  };

  const handlePoseToggle = (poseId: string) => {
    setSelectedPoses(prev => 
      prev.includes(poseId)
        ? prev.filter(id => id !== poseId)
        : [...prev, poseId]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <div className="mb-8 flex items-center justify-between animate-slide-down">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-foreground/70">Customize your yoga practice experience</p>
          </div>
          
          <button 
            onClick={handleSaveSettings}
            className="btn-primary flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6 animate-fade-in">
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center mb-4">
                <Sliders className="w-5 h-5 text-sage-500 mr-2" />
                <h2 className="text-xl font-medium">Detection Settings</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground/80 mb-2 block">
                    Confidence Threshold: {confidenceThreshold}%
                  </label>
                  <input 
                    type="range" 
                    min="50" 
                    max="95" 
                    value={confidenceThreshold}
                    onChange={(e) => setConfidenceThreshold(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-foreground/60 mt-1">
                    <span>Higher Sensitivity</span>
                    <span>Higher Accuracy</span>
                  </div>
                </div>
                
                <div className="pt-2">
                  <label className="text-sm font-medium text-foreground/80 mb-4 flex items-center justify-between">
                    <span>Show Skeleton Overlay</span>
                    <div 
                      className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
                        showSkeletonOverlay ? 'bg-sage-400' : 'bg-gray-200'
                      }`}
                      onClick={() => setShowSkeletonOverlay(!showSkeletonOverlay)}
                    >
                      <div 
                        className={`absolute w-5 h-5 rounded-full bg-white top-0.5 transition-transform ${
                          showSkeletonOverlay ? 'left-5' : 'left-0.5'
                        }`}
                      ></div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center mb-4">
                <Camera className="w-5 h-5 text-sage-500 mr-2" />
                <h2 className="text-xl font-medium">Camera Settings</h2>
              </div>
              
              <div className="space-y-4">
                <div className="pt-2">
                  <label className="text-sm font-medium text-foreground/80 mb-4 flex items-center justify-between">
                    <span>Flip Camera Horizontally</span>
                    <div 
                      className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
                        flipCamera ? 'bg-sage-400' : 'bg-gray-200'
                      }`}
                      onClick={() => setFlipCamera(!flipCamera)}
                    >
                      <div 
                        className={`absolute w-5 h-5 rounded-full bg-white top-0.5 transition-transform ${
                          flipCamera ? 'left-5' : 'left-0.5'
                        }`}
                      ></div>
                    </div>
                  </label>
                </div>
                
                <div className="pt-2">
                  <label className="text-sm font-medium text-foreground/80 mb-4 flex items-center justify-between">
                    <span>Voice Feedback</span>
                    <div 
                      className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
                        voiceFeedback ? 'bg-sage-400' : 'bg-gray-200'
                      }`}
                      onClick={() => setVoiceFeedback(!voiceFeedback)}
                    >
                      <div 
                        className={`absolute w-5 h-5 rounded-full bg-white top-0.5 transition-transform ${
                          voiceFeedback ? 'left-5' : 'left-0.5'
                        }`}
                      ></div>
                    </div>
                  </label>
                  <p className="text-xs text-foreground/60 mt-1">
                    Announces pose names and provides guidance
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="animate-fade-in delay-100">
            <div className="glass rounded-2xl p-6 h-full">
              <div className="flex items-center mb-6">
                <SettingsIcon className="w-5 h-5 text-sage-500 mr-2" />
                <h2 className="text-xl font-medium">Customize Poses</h2>
              </div>
              
              <div className="space-y-1 max-h-[400px] overflow-y-auto pr-2">
                {availablePoses.map((pose) => (
                  <div 
                    key={pose.id}
                    className="flex items-center py-3 border-b border-gray-100 last:border-0"
                  >
                    <button
                      onClick={() => handlePoseToggle(pose.id)}
                      className={`w-5 h-5 rounded flex items-center justify-center mr-3 border transition-colors ${
                        selectedPoses.includes(pose.id)
                          ? 'bg-sage-400 border-sage-400'
                          : 'bg-white border-gray-300'
                      }`}
                    >
                      {selectedPoses.includes(pose.id) && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </button>
                    
                    <div className="flex-1">
                      <span className="text-foreground font-medium block">{pose.name}</span>
                      <span className="text-xs text-foreground/60">{pose.difficulty}</span>
                    </div>
                    
                    <span 
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        pose.difficulty === 'Beginner'
                          ? 'bg-sage-100 text-sage-700'
                          : pose.difficulty === 'Intermediate'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-purple-100 text-purple-700'
                      }`}
                    >
                      {pose.difficulty}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;
