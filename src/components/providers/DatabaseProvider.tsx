'use client';

import { useEffect, useState } from 'react';
import { seedDatabase } from '@/data/seed';

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    seedDatabase();
    setIsReady(true);
  }, []);

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}
