'use client';

import { useState } from 'react';
import Image from 'next/image';

interface PrivacyPolicyProps {
  onAccepted: () => void;
}

export default function PrivacyPolicy({ onAccepted }: PrivacyPolicyProps) {
  const [isAccepted, setIsAccepted] = useState(false);

  const handleContinue = () => {
    if (isAccepted) {
      onAccepted();
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

      <div className="scout-container" style={{ padding: '3rem 20px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div className="text-center" style={{ marginBottom: '3rem' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem', color: '#1f2937' }}>
              Privacy & Beta Guidelines
            </h1>
            <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>
              Important information for parents and educators about ScoutChat Beta
            </p>
          </div>

          <div className="scout-card" style={{ marginBottom: '2rem' }}>
            <div style={{ padding: '1rem', background: '#fef2f2', borderRadius: '8px', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#991b1b' }}>
                🚧 Beta Testing Notice
              </h3>
              <p style={{ color: '#6b7280' }}>
                <strong>This is a beta version for testing purposes only.</strong> This site is designed for parents and educators to test and evaluate our educational AI assistant. <strong>Children should NOT use this platform during the beta testing period.</strong>
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
                  Who This Is For
                </h3>
                <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                  <p style={{ marginBottom: '0.5rem' }}>✓ Parents testing AI-assisted homework help</p>
                  <p style={{ marginBottom: '0.5rem' }}>✓ Educators evaluating Socratic teaching methods</p>
                  <p>✓ Administrators assessing educational technology</p>
                </div>
              </div>
              
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', color: '#1f2937' }}>
                  Educational Approach
                </h3>
                <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                  <p style={{ marginBottom: '0.5rem' }}>✓ Socratic method - questions that guide learning</p>
                  <p style={{ marginBottom: '0.5rem' }}>✓ Age-appropriate content (5-18 years)</p>
                  <p>✓ No direct answers - promotes critical thinking</p>
                </div>
              </div>
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: '#1f2937' }}>
              Privacy & Data Protection
            </h2>
            <ul style={{ color: '#6b7280', marginBottom: '2rem', paddingLeft: '1rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>
                <strong>Data Collection:</strong> We collect only conversation data necessary for AI improvement and safety monitoring.
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <strong>COPPA Compliance:</strong> This beta is not intended for children under 13 without explicit parental supervision.
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <strong>Data Retention:</strong> Conversation data is stored temporarily for testing and will be deleted after the beta period.
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                <strong>No Sharing:</strong> Your data will not be shared with third parties except as required by law.
              </li>
              <li>
                <strong>Security:</strong> All communications are encrypted and stored securely.
              </li>
            </ul>

            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem', color: '#1f2937' }}>
              Future Release
            </h2>
            <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
              After beta testing concludes, we plan to make ScoutChat available for children with proper parental controls, enhanced privacy protections, and full COPPA compliance. Parent feedback during this beta will directly inform our safety and privacy implementations.
            </p>

            <label className="scout-checkbox">
              <input
                type="checkbox"
                checked={isAccepted}
                onChange={(e) => setIsAccepted(e.target.checked)}
              />
              <span style={{ color: '#374151' }}>
                I acknowledge that I have read and understood these guidelines. I understand this is a beta for adults only, and I agree to use ScoutChat responsibly for testing and evaluation purposes.
              </span>
            </label>
          </div>

          <div className="text-center">
            <button 
              onClick={handleContinue}
              disabled={!isAccepted}
              className="scout-btn"
              style={{ fontSize: '1.125rem', padding: '16px 32px' }}
            >
              Continue to ScoutChat →
            </button>
            <p style={{ marginTop: '1rem', color: '#6b7280', fontSize: '0.875rem' }}>
              By continuing, you agree to these terms and acknowledge this is for testing purposes only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 