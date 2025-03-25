
import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { yogaPoses } from '../data/yogaPoses';
import { ChevronDown, Search, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PoseLibrary = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [difficulty, setDifficulty] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  
  // Filter poses based on search query and difficulty
  const filteredPoses = yogaPoses.filter(pose => {
    const matchesSearch = pose.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          pose.sanskritName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = difficulty ? pose.difficulty === difficulty : true;
    
    return matchesSearch && matchesDifficulty;
  });
  
  const handleDifficultyChange = (level: string | null) => {
    setDifficulty(level === difficulty ? null : level);
  };
  
  const toggleExpanded = (id: string) => {
    setExpanded(expanded === id ? null : id);
  };
  
  const clearFilters = () => {
    setSearchQuery('');
    setDifficulty(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <div className="mb-8 animate-slide-down">
          <h1 className="text-3xl font-bold text-foreground">Yoga Pose Library</h1>
          <p className="text-foreground/70">Explore different yoga poses, their benefits, and how to perform them.</p>
        </div>
        
        {/* Search and Filter */}
        <div className="glass rounded-xl p-4 mb-8 animate-fade-in">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground/50" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search poses by name..."
                className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground/50 hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={difficulty === 'beginner' ? 'default' : 'outline'}
                onClick={() => handleDifficultyChange('beginner')}
                className={difficulty === 'beginner' ? 'bg-sage-500 hover:bg-sage-600' : ''}
              >
                Beginner
              </Button>
              <Button
                variant={difficulty === 'intermediate' ? 'default' : 'outline'}
                onClick={() => handleDifficultyChange('intermediate')}
                className={difficulty === 'intermediate' ? 'bg-sage-500 hover:bg-sage-600' : ''}
              >
                Intermediate
              </Button>
              <Button
                variant={difficulty === 'advanced' ? 'default' : 'outline'}
                onClick={() => handleDifficultyChange('advanced')}
                className={difficulty === 'advanced' ? 'bg-sage-500 hover:bg-sage-600' : ''}
              >
                Advanced
              </Button>
              
              {(searchQuery || difficulty) && (
                <Button variant="ghost" onClick={clearFilters} className="gap-1">
                  <X className="w-4 h-4" /> Clear
                </Button>
              )}
            </div>
          </div>
        </div>
        
        {/* Poses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          {filteredPoses.length > 0 ? (
            filteredPoses.map((pose) => (
              <div 
                key={pose.id}
                className="glass rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={pose.imageUrl} 
                    alt={pose.name} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium text-white ${
                      pose.difficulty === 'beginner' ? 'bg-green-500' : 
                      pose.difficulty === 'intermediate' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}>
                      {pose.difficulty.charAt(0).toUpperCase() + pose.difficulty.slice(1)}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-1">{pose.name}</h3>
                  <p className="text-sm text-foreground/70 italic mb-3">{pose.sanskritName}</p>
                  
                  <p className="text-sm text-foreground/80 mb-4">{pose.description}</p>
                  
                  <button
                    onClick={() => toggleExpanded(pose.id)}
                    className="flex items-center justify-between w-full text-sage-600 hover:text-sage-700 text-sm font-medium"
                  >
                    <span>Benefits</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${expanded === pose.id ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {expanded === pose.id && (
                    <div className="mt-3 animate-slide-down">
                      <ul className="text-sm space-y-2 pl-4">
                        {pose.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-sage-400 mt-1.5 mr-2"></span>
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
              <Filter className="w-10 h-10 text-foreground/30 mb-4" />
              <h3 className="text-lg font-medium text-foreground/80 mb-2">No poses found</h3>
              <p className="text-foreground/60 max-w-md">
                Try adjusting your search criteria or clearing the filters to see more results.
              </p>
              <Button
                variant="outline"
                onClick={clearFilters}
                className="mt-4"
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PoseLibrary;
