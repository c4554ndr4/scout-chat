'use client';

import { useEffect, useState } from 'react';
import { UsageTracker } from '../lib/usageTracker';

interface UsageTrackerProps {
  onUsageBlocked: () => void;
}

export default function UsageTrackerComponent({ onUsageBlocked }: UsageTrackerProps) {
  const [usageSummary, setUsageSummary] = useState<{
    used: number;
    remaining: number;
    percentage: number;
    requestCount: number;
  } | null>(null);
  
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    const checkUsage = () => {
      const ip = UsageTracker.getClientIP();
      const { allowed } = UsageTracker.checkUsageLimit(ip);
      const summary = UsageTracker.getUsageSummary(ip);
      
      setUsageSummary(summary);
      setIsBlocked(!allowed);
      
      if (!allowed) {
        onUsageBlocked();
      }
    };

    checkUsage();
    const interval = setInterval(checkUsage, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [onUsageBlocked]);

  if (isBlocked) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="scout-card" style={{ maxWidth: '500px', margin: '1rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem', color: '#ef4444' }}>
              Usage Limit Reached
            </h2>
            <p style={{ color: '#6b7280', fontSize: '1rem' }}>
              You&apos;ve reached the $1.00 daily limit for ScoutChat usage.
            </p>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ 
              background: '#fee2e2', 
              border: '1px solid #fecaca', 
              borderRadius: '8px', 
              padding: '1rem' 
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: '600', color: '#7f1d1d' }}>Usage Summary:</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ color: '#7f1d1d' }}>Used today:</span>
                <span style={{ fontWeight: '600', color: '#7f1d1d' }}>
                  ${usageSummary?.used.toFixed(3) || '0.000'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ color: '#7f1d1d' }}>Requests made:</span>
                <span style={{ fontWeight: '600', color: '#7f1d1d' }}>
                  {usageSummary?.requestCount || 0}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#7f1d1d' }}>Daily limit:</span>
                <span style={{ fontWeight: '600', color: '#7f1d1d' }}>$1.00</span>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.75rem', color: '#1f2937' }}>
              What does this mean?
            </h3>
            <ul style={{ color: '#6b7280', fontSize: '0.875rem', paddingLeft: '1rem' }}>
              <li style={{ marginBottom: '0.5rem' }}>
                • ScoutChat tracks AI usage to prevent abuse and control costs
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                • Each chat message consumes tokens that have a small cost
              </li>
              <li style={{ marginBottom: '0.5rem' }}>
                • The $1 limit resets every 24 hours
              </li>
              <li>
                • This ensures fair access for all users
              </li>
            </ul>
          </div>

          <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '8px', textAlign: 'center' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1f2937' }}>
              🕐 Come back tomorrow!
            </h4>
            <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
              Your usage limit will reset in 24 hours from your first chat today.
            </p>
            <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>
              Thank you for using ScoutChat responsibly! 🎓
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      position: 'fixed', 
      top: '1rem', 
      right: '1rem', 
      zIndex: 40,
      maxWidth: '280px'
    }}>
      <div style={{ 
        background: 'white', 
        border: '1px solid var(--scout-border)', 
        borderRadius: '8px', 
        padding: '0.75rem',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.875rem' }}>💰</span>
          <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1f2937' }}>
            Daily Usage
          </span>
        </div>
        
        <div style={{ marginBottom: '0.5rem' }}>
          <div style={{ 
            background: '#f3f4f6', 
            height: '6px', 
            borderRadius: '3px',
            overflow: 'hidden'
          }}>
            <div style={{ 
              background: usageSummary && usageSummary.percentage > 80 ? '#ef4444' : 
                         usageSummary && usageSummary.percentage > 60 ? '#f59e0b' : 
                         'var(--scout-red)',
              height: '100%',
              width: `${usageSummary?.percentage || 0}%`,
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>
        
        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
            <span>Used:</span>
            <span>${usageSummary?.used.toFixed(3) || '0.000'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
            <span>Remaining:</span>
            <span>${usageSummary?.remaining.toFixed(3) || '1.000'}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Requests:</span>
            <span>{usageSummary?.requestCount || 0}</span>
          </div>
        </div>
        
        {usageSummary && usageSummary.percentage > 80 && (
          <div style={{ 
            marginTop: '0.5rem', 
            padding: '0.5rem', 
            background: '#fef3c7', 
            borderRadius: '4px',
            fontSize: '0.75rem',
            color: '#92400e'
          }}>
            ⚠️ Approaching daily limit
          </div>
        )}
      </div>
    </div>
  );
} 