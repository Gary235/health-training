import { Sparkles } from 'lucide-react';
import { cn } from '../../lib/utils';

interface AIBadgeProps {
  text?: string;
  className?: string;
}

export default function AIBadge({
  text = 'AI Generated',
  className
}: AIBadgeProps) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1 px-2 py-1 bg-ai-light text-ai border border-ai-border rounded-md text-xs font-medium",
      className
    )}>
      <Sparkles className="w-3 h-3" />
      <span>{text}</span>
    </span>
  );
}
