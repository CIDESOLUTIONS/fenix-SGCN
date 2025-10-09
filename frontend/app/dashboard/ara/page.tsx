'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ARARedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/ara/scoring');
  }, [router]);

  return (
    <div className="flex justify-center items-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );
}
