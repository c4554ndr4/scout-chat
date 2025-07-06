'use client';


import MainApp from '../components/MainApp';
import UsageTrackerComponent from '../components/UsageTracker';

export default function Home() {
  const handleUsageBlocked = () => {
    // Usage blocked - could add additional logic here if needed
  };

  return (
    <>
      <MainApp />
      <UsageTrackerComponent onUsageBlocked={handleUsageBlocked} />
    </>
  );
} 