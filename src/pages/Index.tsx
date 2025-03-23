
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-beige-50">
      <Navbar />
      
      <main className="pt-24 pb-20">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-slide-up">
            <span className="inline-block px-3 py-1 rounded-full bg-sage-100 text-sage-700 text-xs font-medium mb-6">
              Mindful Practice Assistant
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground tracking-tight mb-6">
              Perfect Your Yoga Posture
            </h1>
            <p className="max-w-2xl mx-auto text-lg text-foreground/70 mb-12">
              Real-time pose detection and feedback to help you improve your practice.
              Get instant insights without interrupting your flow.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <button 
                onClick={() => navigate('/practice')}
                className="btn-primary"
              >
                Start Practice
              </button>
              <button 
                onClick={() => navigate('/settings')}
                className="btn-outline"
              >
                Customize Settings
              </button>
            </div>
          </div>
          
          <div className="relative mt-16 md:mt-24 mb-12 max-w-4xl mx-auto animate-fade-in">
            <div className="aspect-video overflow-hidden rounded-2xl glass-dark">
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent flex items-end">
                <div className="p-6 text-white text-left">
                  <span className="bg-blue-400 text-white text-xs font-medium px-2.5 py-0.5 rounded">
                    Real-time
                  </span>
                  <h3 className="text-xl font-medium mt-2">Pose Detection & Feedback</h3>
                </div>
              </div>
              <div className="w-full h-full bg-gradient-to-br from-sage-300/30 to-blue-300/30"></div>
            </div>
            
            <div className="absolute -bottom-6 -right-6 w-32 h-32 lg:w-48 lg:h-48 rounded-full bg-sage-400/20 backdrop-blur-sm"></div>
            <div className="absolute -top-6 -left-6 w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-blue-400/20 backdrop-blur-sm"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 max-w-5xl mx-auto">
            {[
              {
                title: 'Real-time Analysis',
                description: 'Get instant feedback on your poses without interrupting your flow.',
              },
              {
                title: 'Multiple Pose Detection',
                description: 'Comprehensive library of yoga poses for all experience levels.',
              },
              {
                title: 'Precision Guidance',
                description: 'Detailed guidance to help you perfect your alignment and form.',
              },
            ].map((feature, index) => (
              <div 
                key={index}
                className="glass p-6 rounded-2xl card-hover"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sage-400 to-sage-500 mb-4 flex items-center justify-center">
                  <div className="w-5 h-5 rounded-full bg-white"></div>
                </div>
                <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                <p className="text-foreground/70">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      
      <footer className="bg-white py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-foreground/60 text-sm">
            Yoga Pose Classifier &copy; {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
