import LoadingSpinner from './LoadingSpinner';

interface LoadingOverlayProps {
  show: boolean;
  text?: string;
}

export default function LoadingOverlay({ show, text = 'Loading...' }: LoadingOverlayProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg p-8 shadow-lg">
        <LoadingSpinner size="lg" text={text} />
      </div>
    </div>
  );
}
