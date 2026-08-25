'use client';

import { useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Card padding="lg" className="text-center max-w-md mx-auto mt-16">
      <h2 className="font-display text-3xl text-ink tracking-wide mb-3">Something went wrong</h2>
      <p className="text-ink-2 text-sm mb-6">We could not load this page. Please try again.</p>
      <Button onClick={() => retry()} variant="primary">
        Try Again
      </Button>
    </Card>
  );
}
