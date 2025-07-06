'use client';

import { useState } from 'react';

interface ParentSettingsProps {
  childAge: number;
  onAgeChange: (age: number) => void;
}

export default function ParentSettings({ childAge, onAgeChange }: ParentSettingsProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isIncorrect, setIsIncorrect] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Check if parent password exists on component mount
  const [hasParentPassword, setHasParentPassword] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedPassword = localStorage.getItem('scoutchat-parent-password');
      return savedPassword !== null && savedPassword.trim() !== '';
    }
    return false;
  });

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const savedPassword = localStorage.getItem('scoutchat-parent-password');
    
    if (savedPassword && password === savedPassword) {
      setIsAuthenticated(true);
      setPassword('');
    } else {
      setIsIncorrect(true);
      setTimeout(() => setIsIncorrect(false), 3000);
    }
  };

  const handleFirstTimeSetup = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.length < 6) {
      setIsIncorrect(true);
      setTimeout(() => setIsIncorrect(false), 3000);
      return;
    }
    
    if (password !== confirmPassword) {
      setIsIncorrect(true);
      setTimeout(() => setIsIncorrect(false), 3000);
      return;
    }

    // Save the password
    localStorage.setItem('scoutchat-parent-password', password);
    setHasParentPassword(true);
    setIsAuthenticated(true);
    setPassword('');
    setConfirmPassword('');
    setIsFirstTime(false);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword.length < 6) {
      setIsIncorrect(true);
      setTimeout(() => setIsIncorrect(false), 3000);
      return;
    }
    
    if (newPassword !== confirmNewPassword) {
      setIsIncorrect(true);
      setTimeout(() => setIsIncorrect(false), 3000);
      return;
    }

    // Update the password
    localStorage.setItem('scoutchat-parent-password', newPassword);
    setShowChangePassword(false);
    setNewPassword('');
    setConfirmNewPassword('');
  };

  const startFirstTimeSetup = () => {
    setIsFirstTime(true);
  };

  const getAgeGroup = (age: number) => {
    if (age <= 10) return 'Elementary School';
    if (age <= 13) return 'Middle School';
    return 'High School';
  };

  const getAgeDescription = (age: number) => {
    if (age <= 10) return 'Uses concrete examples, simple language, and story-based learning';
    if (age <= 13) return 'Introduces hypothesis testing and evidence evaluation';
    return 'Develops critical thinking and advanced analysis skills';
  };

  const getAgeFeatures = (age: number) => {
    if (age <= 10) return [
      'Simple, hands-on examples',
      'Basic cause-and-effect questions',
      'Vocabulary explanations',
      'Story characters for logic'
    ];
    if (age <= 13) return [
      'Hypothesis testing',
      'Source comparison',
      'Basic probability concepts',
      'Simple bias recognition'
    ];
    return [
      'Probabilistic thinking',
      'Cognitive bias identification',
      'Complex source evaluation',
      'Meta-cognitive awareness'
    ];
  };

  const handleLockSettings = () => {
    setIsAuthenticated(false);
    setPassword('');
    setShowChangePassword(false);
    setNewPassword('');
    setConfirmNewPassword('');
  };

  if (!isAuthenticated) {
    // First time setup flow
    if (!hasParentPassword || isFirstTime) {
      return (
        <div>
          <div className="text-center" style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem', color: '#1f2937' }}>
              Welcome to ScoutChat!
            </h1>
            <p style={{ color: '#6b7280' }}>
              First, create your personal parent password to secure these settings
            </p>
          </div>

          <div className="scout-card" style={{ maxWidth: '500px', margin: '0 auto' }}>
            <form onSubmit={handleFirstTimeSetup}>
              <div className="scout-form-group">
                <label className="scout-label">Create Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="scout-input"
                  placeholder="Minimum 6 characters"
                  minLength={6}
                  required
                />
              </div>
              
              <div className="scout-form-group">
                <label className="scout-label">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="scout-input"
                  placeholder="Re-enter your password"
                  minLength={6}
                  required
                />
              </div>
              
              {isIncorrect && (
                <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                  {password.length < 6 ? 'Password must be at least 6 characters.' : 'Passwords do not match.'}
                </p>
              )}
              
              <button 
                type="submit" 
                className="scout-btn" 
                style={{ width: '100%' }}
                disabled={!password || !confirmPassword}
              >
                Create Password & Access Settings
              </button>
            </form>
            
            <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f3f4f6', borderRadius: '8px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1f2937' }}>
                🔒 Password Security
              </h3>
              <ul style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>
                <li>• Choose a password you&apos;ll remember</li>
                <li>• This password is stored locally on your device</li>
                <li>• You can change it anytime in settings</li>
              </ul>
            </div>
          </div>
        </div>
      );
    }

    // Existing password login
    return (
      <div>
        <div className="text-center" style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem', color: '#1f2937' }}>
            Parent Settings Access
          </h1>
          <p style={{ color: '#6b7280' }}>
            Enter your parent password to configure settings
          </p>
        </div>

        <div className="scout-card" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <form onSubmit={handlePasswordSubmit}>
            <div className="scout-form-group">
              <label className="scout-label">Parent Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="scout-input"
                placeholder="Enter your parent password"
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
              Access Settings
            </button>
          </form>
          
          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <button 
              onClick={startFirstTimeSetup}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: '#6b7280', 
                fontSize: '0.875rem', 
                textDecoration: 'underline',
                cursor: 'pointer'
              }}
            >
              Forgot password? Reset it here
            </button>
          </div>
          
          <p style={{ marginTop: '1rem', color: '#6b7280', fontSize: '0.875rem', textAlign: 'center' }}>
            These settings control how the AI adapts its responses to your child&apos;s age and learning level.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center" style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem', color: '#1f2937' }}>
          Parent Settings
        </h1>
        <p style={{ color: '#6b7280' }}>
          Configure how ScoutChat adapts to your child&apos;s learning needs
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
        {/* Age Settings */}
        <div className="scout-settings-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>👤</span>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937' }}>
              Child Age Settings
            </h2>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <span style={{ color: '#6b7280' }}>Current Age: </span>
              <span style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937' }}>
                {childAge}
              </span>
              <span style={{ color: '#6b7280' }}> years old</span>
            </div>
            
            <input
              type="range"
              min="5"
              max="18"
              value={childAge}
              onChange={(e) => onAgeChange(parseInt(e.target.value))}
              className="scout-slider"
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#6b7280' }}>
              <span>5 years</span>
              <span>18 years</span>
            </div>
          </div>

          <div style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px', border: '1px solid var(--scout-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '1.25rem' }}>📚</span>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937' }}>
                {getAgeGroup(childAge)}
              </h3>
            </div>
            <p style={{ color: '#6b7280', marginBottom: '1rem', fontSize: '0.875rem' }}>
              {getAgeDescription(childAge)}
            </p>
            <ul style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              {getAgeFeatures(childAge).map((feature, index) => (
                <li key={index} style={{ marginBottom: '0.25rem' }}>
                  • {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Educational Approach */}
        <div className="scout-settings-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🎓</span>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937' }}>
              Educational Approach
            </h2>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.75rem', color: '#1f2937' }}>
              Socratic Method
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '1rem', fontSize: '0.875rem' }}>
              ScoutChat uses the Socratic method to guide learning through questions rather than providing direct answers.
            </p>
            <div>
              <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1f2937' }}>
                What this means:
              </h4>
              <ul style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                <li style={{ marginBottom: '0.25rem' }}>• Never completes assignments directly</li>
                <li style={{ marginBottom: '0.25rem' }}>• Asks guiding questions to promote thinking</li>
                <li style={{ marginBottom: '0.25rem' }}>• Builds confidence in problem-solving</li>
                <li>• Develops critical thinking skills</li>
              </ul>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.75rem', color: '#1f2937' }}>
              Content Safety
            </h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div>
                <div style={{ fontWeight: '500', color: '#1f2937', fontSize: '0.875rem' }}>
                  School-appropriate topics only
                </div>
                <p style={{ color: '#6b7280', fontSize: '0.75rem' }}>
                  Focuses exclusively on academic subjects and learning
                </p>
              </div>
              
              <div>
                <div style={{ fontWeight: '500', color: '#1f2937', fontSize: '0.875rem' }}>
                  Age-appropriate language
                </div>
                <p style={{ color: '#6b7280', fontSize: '0.75rem' }}>
                  Automatically adjusts vocabulary and complexity
                </p>
              </div>
              
              <div>
                <div style={{ fontWeight: '500', color: '#1f2937', fontSize: '0.875rem' }}>
                  Positive learning environment
                </div>
                <p style={{ color: '#6b7280', fontSize: '0.75rem' }}>
                  Encourages curiosity and celebrates good thinking
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Password Management */}
      <div className="scout-card" style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🔒</span>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937' }}>
            Password Management
          </h2>
        </div>

        {!showChangePassword ? (
          <div>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem' }}>
              Your parent password protects these settings from unauthorized changes.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button 
                onClick={() => setShowChangePassword(true)}
                className="scout-btn-outline"
              >
                Change Password
              </button>
              <button 
                onClick={handleLockSettings}
                className="scout-btn"
              >
                Lock Settings
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleChangePassword}>
            <div className="scout-form-group">
              <label className="scout-label">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="scout-input"
                placeholder="Minimum 6 characters"
                minLength={6}
                required
              />
            </div>
            
            <div className="scout-form-group">
              <label className="scout-label">Confirm New Password</label>
              <input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="scout-input"
                placeholder="Re-enter new password"
                minLength={6}
                required
              />
            </div>
            
            {isIncorrect && (
              <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                {newPassword.length < 6 ? 'Password must be at least 6 characters.' : 'Passwords do not match.'}
              </p>
            )}
            
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button 
                type="submit" 
                className="scout-btn"
                disabled={!newPassword || !confirmNewPassword}
              >
                Update Password
              </button>
              <button 
                type="button"
                onClick={() => {
                  setShowChangePassword(false);
                  setNewPassword('');
                  setConfirmNewPassword('');
                  setIsIncorrect(false);
                }}
                className="scout-btn-outline"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Session Information */}
      <div className="scout-card" style={{ marginTop: '2rem', textAlign: 'center' }}>
        <div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1f2937' }}>
            Session Information
          </h3>
          <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem' }}>
            Settings are saved automatically and persist across sessions
          </p>
        </div>
      </div>
    </div>
  );
} 