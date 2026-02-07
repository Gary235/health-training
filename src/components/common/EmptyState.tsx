import type { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  children?: ReactNode;
}

export default function EmptyState({
  icon = '📭',
  title,
  description,
  actionLabel,
  onAction,
  children,
}: EmptyStateProps) {
  return (
    <Card>
      <CardHeader className="text-center">
        <div className="text-5xl mb-4">{icon}</div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      {(actionLabel || children) && (
        <CardContent className="flex flex-col items-center gap-2">
          {actionLabel && onAction && (
            <Button onClick={onAction}>{actionLabel}</Button>
          )}
          {children}
        </CardContent>
      )}
    </Card>
  );
}
