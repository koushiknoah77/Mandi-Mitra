import { useState, useEffect } from 'react';
import { useOnlineStatus } from './useOnlineStatus';

export interface QueuedAction {
  id: string;
  type: 'create_listing' | 'send_message' | 'complete_deal' | 'update_listing';
  payload: any;
  timestamp: number;
  retries: number;
}

const QUEUE_KEY = 'mandi_offline_queue';
const MAX_RETRIES = 3;

export const useOfflineQueue = () => {
  const isOnline = useOnlineStatus();
  const [queue, setQueue] = useState<QueuedAction[]>(() => {
    const stored = localStorage.getItem(QUEUE_KEY);
    return stored ? JSON.parse(stored) : [];
  });
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
  }, [queue]);

  useEffect(() => {
    if (isOnline && queue.length > 0 && !isSyncing) {
      syncQueue();
    }
  }, [isOnline, queue.length]);

  const addToQueue = (action: Omit<QueuedAction, 'id' | 'timestamp' | 'retries'>) => {
    const queuedAction: QueuedAction = {
      ...action,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      retries: 0
    };
    setQueue(prev => [...prev, queuedAction]);
    return queuedAction.id;
  };

  const syncQueue = async () => {
    if (queue.length === 0 || isSyncing) return;
    
    setIsSyncing(true);
    const failedActions: QueuedAction[] = [];

    for (const action of queue) {
      try {
        await processAction(action);
      } catch (error) {
        console.error(`Failed to sync action ${action.id}:`, error);
        if (action.retries < MAX_RETRIES) {
          failedActions.push({ ...action, retries: action.retries + 1 });
        }
      }
    }

    setQueue(failedActions);
    setIsSyncing(false);
  };

  const processAction = async (action: QueuedAction): Promise<void> => {
    // Actions are processed by the components that added them
    // This is a placeholder - actual processing happens in context
    await new Promise(resolve => setTimeout(resolve, 100));
  };

  const clearQueue = () => {
    setQueue([]);
    localStorage.removeItem(QUEUE_KEY);
  };

  return {
    queue,
    addToQueue,
    syncQueue,
    clearQueue,
    isSyncing,
    queueLength: queue.length
  };
};
