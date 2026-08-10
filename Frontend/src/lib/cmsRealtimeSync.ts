import { useEffect } from 'react';

export interface CmsUpdateEvent {
  filename: string;
  content: any;
  timestamp: number;
}

export function subscribeToCmsRealtime(onUpdate: (event: CmsUpdateEvent) => void): () => void {
  // 1. BroadcastChannel for cross-tab communication
  let bc: BroadcastChannel | null = null;
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    bc = new BroadcastChannel('omr_cms_realtime_channel');
    bc.onmessage = (evt) => {
      if (evt.data && evt.data.filename) {
        onUpdate(evt.data);
      }
    };
  }

  // 2. Window Custom Event for same-tab / modal live preview updates
  const handleCustomEvent = (e: any) => {
    if (e.detail && e.detail.filename) {
      onUpdate({
        filename: e.detail.filename,
        content: e.detail.content,
        timestamp: Date.now(),
      });
    }
  };

  // 3. Native Storage Event for multi-tab fallback
  const handleStorageEvent = (e: StorageEvent) => {
    if (e.key && e.key.startsWith('omr_cms_data_') && e.newValue) {
      const filename = e.key.replace('omr_cms_data_', '');
      try {
        const content = JSON.parse(e.newValue);
        onUpdate({ filename, content, timestamp: Date.now() });
      } catch (err) {
        console.warn('Failed to parse storage event data:', err);
      }
    }
  };

  // 4. Backend SSE EventSource Stream for multi-device / network real-time updates
  let es: EventSource | null = null;
  if (typeof window !== 'undefined' && 'EventSource' in window) {
    try {
      const sseUrl = window.location.port === '3002' ? '/api/cms/realtime-stream' : 'http://localhost:3002/api/cms/realtime-stream';
      es = new EventSource(sseUrl);
      es.onmessage = (evt) => {
        try {
          const data = JSON.parse(evt.data);
          if (data && data.filename) {
            localStorage.setItem(`omr_cms_data_${data.filename}`, JSON.stringify(data.content));
            onUpdate(data);
          }
        } catch (err) {
          console.warn('Failed to parse SSE realtime message:', err);
        }
      };
    } catch (e) {
      console.warn('Failed to connect SSE EventSource:', e);
    }
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('cms_data_updated', handleCustomEvent);
    window.addEventListener('storage', handleStorageEvent);
  }

  return () => {
    if (bc) bc.close();
    if (es) es.close();
    if (typeof window !== 'undefined') {
      window.removeEventListener('cms_data_updated', handleCustomEvent);
      window.removeEventListener('storage', handleStorageEvent);
    }
  };
}

export function useCmsRealtimeListener(onUpdate: (event: CmsUpdateEvent) => void) {
  useEffect(() => {
    const unsubscribe = subscribeToCmsRealtime(onUpdate);
    return () => unsubscribe();
  }, [onUpdate]);
}
