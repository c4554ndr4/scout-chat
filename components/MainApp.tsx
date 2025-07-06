'use client';

import { useState } from 'react';
import Image from 'next/image';
import ChatInterface from './ChatInterface';
import ExampleHomework from './ExampleHomework';
import ParentSettings from './ParentSettings';

export default function MainApp() {
  const [currentView, setCurrentView] = useState<'chat' | 'examples' | 'settings'>('chat');
  const [selectedExample, setSelectedExample] = useState<string>('');
  const [childAge, setChildAge] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('scoutchat-child-age');
      return saved ? parseInt(saved, 10) : 10;
    }
    return 10;
  });

  const updateAge = (newAge: number) => {
    setChildAge(newAge);
    if (typeof window !== 'undefined') {
      localStorage.setItem('scoutchat-child-age', newAge.toString());
    }
  };

  const getAgeGroup = (age: number) => {
    if (age <= 10) return 'Elementary';
    if (age <= 13) return 'Middle School';
    return 'High School';
  };

  const handleExampleSelect = (example: string) => {
    setSelectedExample(example);
    setCurrentView('chat');
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="scout-header">
        <div className="scout-container">
          <nav className="scout-nav">
            <a href="#" className="scout-logo">
              <Image src="/scout_logo.png" alt="Scout Logo" width={40} height={40} />
              ScoutChat
            </a>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span className="scout-badge elementary">Beta</span>
            </div>
          </nav>
        </div>
      </header>

      <div style={{ display: 'flex', minHeight: 'calc(100vh - 80px)' }}>
        {/* Sidebar */}
        <aside className="scout-sidebar" style={{ width: '280px' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
              Navigation
            </h3>
            <nav>
              <button
                onClick={() => setCurrentView('chat')}
                className={`scout-nav-item ${currentView === 'chat' ? 'active' : ''}`}
              >
                <span>💬</span>
                <div>
                  <div style={{ fontWeight: '500' }}>Chat</div>
                  <div style={{ fontSize: '0.875rem', opacity: 0.7 }}>Start learning conversation</div>
                </div>
              </button>
              
              <button
                onClick={() => setCurrentView('examples')}
                className={`scout-nav-item ${currentView === 'examples' ? 'active' : ''}`}
              >
                <span>📚</span>
                <div>
                  <div style={{ fontWeight: '500' }}>Examples</div>
                  <div style={{ fontSize: '0.875rem', opacity: 0.7 }}>Sample homework & questions</div>
                </div>
              </button>
              
              <button
                onClick={() => setCurrentView('settings')}
                className={`scout-nav-item ${currentView === 'settings' ? 'active' : ''}`}
              >
                <span>⚙️</span>
                <div>
                  <div style={{ fontWeight: '500' }}>Parent Settings</div>
                  <div style={{ fontSize: '0.875rem', opacity: 0.7 }}>Configure age & preferences</div>
                </div>
              </button>
            </nav>
          </div>

          <div className="scout-card" style={{ padding: '1rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: '700', color: '#e94b3c' }}>{childAge}</div>
              <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280' }}>Years Old</div>
              <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>
                {getAgeGroup(childAge)} • AI responses are adapted for this age group
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1, padding: '2rem' }}>
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            {currentView === 'chat' && (
              <ChatInterface 
                childAge={childAge} 
                initialQuestion={selectedExample}
                onQuestionProcessed={() => setSelectedExample('')}
              />
            )}
            
            {currentView === 'examples' && (
              <ExampleHomework onExampleSelect={handleExampleSelect} />
            )}
            
            {currentView === 'settings' && (
              <ParentSettings childAge={childAge} onAgeChange={updateAge} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
} 