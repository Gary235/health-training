import { cn } from '../../lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export default function LoadingSpinner({
  size = 'md',
  text,
  className
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-8 h-8 border-3',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={cn(
          "animate-spin rounded-full border-neutral-200 border-t-neutral-900",
          sizeClasses[size],
          className
        )}
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
      {text && (
        <p className="text-sm text-neutral-600">{text}</p>
      )}
    </div>
  );
}
