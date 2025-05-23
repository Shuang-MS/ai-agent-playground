// useQueueStatus.ts
import { useEffect, useState } from 'react';
import TaskQueue from './speech_queue';

export type QueueStatus = {
  isProcessing: boolean;
  length: number;
};

export default function useQueueStatus() {
  const [status, setStatus] = useState<QueueStatus>({
    isProcessing: false,
    length: 0,
  });

  useEffect(() => {
    const unsubscribe = TaskQueue.subscribe(setStatus);
    return unsubscribe;
  }, []);

  return status;
}
