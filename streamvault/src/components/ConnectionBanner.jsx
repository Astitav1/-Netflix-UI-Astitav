import { useEffect, useState } from 'react';
import { useOnlineStatus } from '../hooks/utils';

// Shows a banner whenever online/offline status changes.
// Hides itself after 3 seconds when back online.
export default function ConnectionBanner() {
  const online = useOnlineStatus();
  const [visible, setVisible] = useState(false);
  const [prevOnline, setPrevOnline] = useState(online);

  useEffect(() => {
    // Only show if status actually changed (not on first render)
    if (online !== prevOnline) {
      setVisible(true);
      setPrevOnline(online);

      if (online) {
        // Auto-hide "back online" after 3 seconds
        const t = setTimeout(() => setVisible(false), 3000);
        return () => clearTimeout(t);
      }
    }
  }, [online]); // eslint-disable-line

  return (
    <div className={`connection-banner ${online ? 'online' : 'offline'} ${visible ? 'visible' : ''}`}>
      {online ? '✓ Back online' : '⚠ You are offline'}
    </div>
  );
}
