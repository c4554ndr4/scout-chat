'use client';

import { useState } from 'react';

interface ExampleHomeworkProps {
  onExampleSelect: (example: string) => void;
}

interface Example {
  id: string;
  title: string;
  subject: string;
  level: 'elementary' | 'medium' | 'hard';
  ageRange: string;
  description: string;
  question: string;
}

const examples: Example[] = [
  // Elementary Examples
  {
    id: '1',
    title: 'Cookie Division',
    subject: 'Math',
    level: 'elementary',
    ageRange: '5-10 years',
    description: 'Learning division through sharing cookies with friends',
    question: 'I have 12 cookies and want to share them equally with my 3 friends. How many cookies will each person get?'
  },
  {
    id: '2',
    title: 'Plant Growth',
    subject: 'Science',
    level: 'elementary',
    ageRange: '5-10 years',
    description: 'Understanding what plants need to grow',
    question: 'My plant is getting yellow leaves and not growing well. What might it need?'
  },
  {
    id: '3',
    title: 'Story Characters',
    subject: 'Reading',
    level: 'elementary',
    ageRange: '5-10 years',
    description: 'Understanding character feelings and motivations',
    question: 'In the story, why do you think the little rabbit was scared to go into the dark forest?'
  },
  // Middle School Examples
  {
    id: '4',
    title: 'Algebra Word Problem',
    subject: 'Math',
    level: 'medium',
    ageRange: '11-13 years',
    description: 'Setting up equations from word problems',
    question: 'Sarah has twice as many stickers as Tom. Together they have 36 stickers. How many stickers does each person have?'
  },
  {
    id: '5',
    title: 'Ecosystem Food Chain',
    subject: 'Science',
    level: 'medium',
    ageRange: '11-13 years',
    description: 'Understanding predator-prey relationships',
    question: 'If the rabbit population in a forest suddenly decreased, what might happen to the plant life and wolf population?'
  },
  {
    id: '6',
    title: 'Historical Cause & Effect',
    subject: 'History',
    level: 'medium',
    ageRange: '11-13 years',
    description: 'Analyzing historical events and their consequences',
    question: 'What were the main causes of the American Revolution, and how did it change daily life for colonists?'
  },
  // High School Examples
  {
    id: '7',
    title: 'Calculus Applications',
    subject: 'Math',
    level: 'hard',
    ageRange: '14-18 years',
    description: 'Real-world applications of derivatives',
    question: "A company&apos;s profit function is P(x) = -2x² + 100x - 800. At what production level is profit maximized?"
  },
  {
    id: '8',
    title: 'Chemical Equilibrium',
    subject: 'Chemistry',
    level: 'hard',
    ageRange: '14-18 years',
    description: "Understanding Le Chatelier&apos;s principle",
    question: 'In the reaction N₂ + 3H₂ ⇌ 2NH₃ + heat, what happens to the equilibrium if we increase the temperature?'
  },
  {
    id: '9',
    title: 'Literary Analysis',
    subject: 'Literature',
    level: 'hard',
    ageRange: '14-18 years',
    description: 'Analyzing themes and symbolism in literature',
    question: 'How does the author use the green light symbolism in The Great Gatsby to represent the American Dream?'
  }
];

export default function ExampleHomework({ onExampleSelect }: ExampleHomeworkProps) {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'elementary' | 'medium' | 'hard'>('all');

  const filteredExamples = selectedFilter === 'all' 
    ? examples 
    : examples.filter(example => example.level === selectedFilter);

  const getLevelCounts = () => ({
    all: examples.length,
    elementary: examples.filter(e => e.level === 'elementary').length,
    medium: examples.filter(e => e.level === 'medium').length,
    hard: examples.filter(e => e.level === 'hard').length
  });

  const counts = getLevelCounts();

  const handleExampleClick = (example: Example) => {
    onExampleSelect(example.question);
  };

  return (
    <div>
      <div className="text-center" style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem', color: '#1f2937' }}>
          Example Homework & Questions
        </h1>
        <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>
          Explore how ScoutChat helps students of different ages think through various subjects. Click any example to start an interactive learning session!
        </p>
      </div>

      {/* Filter Buttons */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          onClick={() => setSelectedFilter('all')}
          className={`scout-btn ${selectedFilter === 'all' ? '' : 'scout-btn-outline'}`}
          style={{ 
            background: selectedFilter === 'all' ? 'var(--scout-red)' : 'white',
            color: selectedFilter === 'all' ? 'white' : '#6b7280',
            border: '1px solid var(--scout-border)'
          }}
        >
          All Levels <span style={{ marginLeft: '0.5rem', background: 'rgba(255,255,255,0.2)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem' }}>{counts.all}</span>
        </button>
        <button
          onClick={() => setSelectedFilter('elementary')}
          className={`scout-btn ${selectedFilter === 'elementary' ? '' : 'scout-btn-outline'}`}
          style={{ 
            background: selectedFilter === 'elementary' ? 'var(--scout-red)' : 'white',
            color: selectedFilter === 'elementary' ? 'white' : '#6b7280',
            border: '1px solid var(--scout-border)'
          }}
        >
          Elementary <span style={{ marginLeft: '0.5rem', background: 'rgba(255,255,255,0.2)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem' }}>{counts.elementary}</span>
        </button>
        <button
          onClick={() => setSelectedFilter('medium')}
          className={`scout-btn ${selectedFilter === 'medium' ? '' : 'scout-btn-outline'}`}
          style={{ 
            background: selectedFilter === 'medium' ? 'var(--scout-red)' : 'white',
            color: selectedFilter === 'medium' ? 'white' : '#6b7280',
            border: '1px solid var(--scout-border)'
          }}
        >
          Middle School <span style={{ marginLeft: '0.5rem', background: 'rgba(255,255,255,0.2)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem' }}>{counts.medium}</span>
        </button>
        <button
          onClick={() => setSelectedFilter('hard')}
          className={`scout-btn ${selectedFilter === 'hard' ? '' : 'scout-btn-outline'}`}
          style={{ 
            background: selectedFilter === 'hard' ? 'var(--scout-red)' : 'white',
            color: selectedFilter === 'hard' ? 'white' : '#6b7280',
            border: '1px solid var(--scout-border)'
          }}
        >
          High School <span style={{ marginLeft: '0.5rem', background: 'rgba(255,255,255,0.2)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem' }}>{counts.hard}</span>
        </button>
      </div>

      {/* Examples Grid */}
      <div className="scout-examples-grid">
        {filteredExamples.map((example) => (
          <div
            key={example.id}
            className="scout-example-card"
            onClick={() => handleExampleClick(example)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.5rem' }}>
                {example.subject === 'Math' ? '🔢' : 
                 example.subject === 'Science' ? '🔬' : 
                 example.subject === 'Chemistry' ? '⚗️' : 
                 example.subject === 'History' ? '📚' : 
                 example.subject === 'Reading' ? '📖' : 
                 example.subject === 'Literature' ? '✍️' : '📝'}
              </span>
              <span className={`scout-badge ${example.level}`}>
                {example.level === 'elementary' ? 'Elementary' : 
                 example.level === 'medium' ? 'Medium' : 'Hard'}
              </span>
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.25rem', color: '#1f2937' }}>
                {example.title}
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                {example.subject} • {example.ageRange}
              </p>
              <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem' }}>
                {example.description}
              </p>
              <p style={{ 
                color: '#374151', 
                fontStyle: 'italic', 
                background: '#f9fafb', 
                padding: '0.75rem', 
                borderRadius: '6px',
                border: '1px solid var(--scout-border)',
                fontSize: '0.875rem'
              }}>
                &quot;{example.question}&quot;
              </p>
            </div>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              padding: '0.75rem',
              background: '#f9fafb',
              borderRadius: '6px',
              marginTop: 'auto'
            }}>
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Click to try</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--scout-red)', fontSize: '0.875rem', fontWeight: '500' }}>
                <span>Start Learning</span>
                <span>→</span>
              </div>
            </div>
          </div>
        ))}
      </div>


    </div>
  );
} 