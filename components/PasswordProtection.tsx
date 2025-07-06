'use client';

import { useState } from 'react';
import Image from 'next/image';

interface PasswordProtectionProps {
  onAuthenticated: () => void;
}

export default function PasswordProtection({ onAuthenticated }: PasswordProtectionProps) {
  const [password, setPassword] = useState('');
  const [isIncorrect, setIsIncorrect] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'scout_mindset') {
      onAuthenticated();
    } else {
      setIsIncorrect(true);
      setTimeout(() => setIsIncorrect(false), 3000);
    }
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
          </nav>
        </div>
      </header>

      {/* Simple Login Form */}
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center p-4">
        <div className="scout-card" style={{ maxWidth: '400px', width: '100%' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
              ScoutChat Beta Access
            </h1>
            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              Enter your access code to continue
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="scout-form-group">
              <label className="scout-label">Access Code</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="scout-input"
                placeholder="Enter access code"
                required
              />
              {isIncorrect && (
                <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                  Incorrect password. Please try again.
                </p>
              )}
            </div>
            <button 
              type="submit" 
              className="scout-btn" 
              style={{ width: '100%' }}
              disabled={!password}
            >
              Access ScoutChat
            </button>
          </form>
          
          <div style={{ marginTop: '2rem', padding: '1rem', background: '#f9fafb', borderRadius: '8px' }}>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
              <strong>For Parents & Educators:</strong>
            </p>
            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              This platform uses AI to guide children through learning using the Socratic method. 
              We don&apos;t provide direct answers—we help kids think critically and discover solutions themselves.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 