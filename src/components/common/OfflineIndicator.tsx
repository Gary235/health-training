import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export default function OfflineIndicator() {
  const isOnline = useOnlineStatus();

  if (isOnline) {
    return null;
  }

  return (
    <div className="
      fixed top-0 left-0 right-0
      bg-neutral-900 text-white
      py-2 px-4 text-sm text-center
      z-50
    ">
      <span className="inline-flex items-center gap-2">
        <WifiOff className="w-4 h-4" />
        You're offline. Changes will sync when reconnected.
      </span>
    </div>
  );
}
