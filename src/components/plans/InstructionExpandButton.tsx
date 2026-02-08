import { Button } from '../ui/button';
import { ChevronDown, Plus } from 'lucide-react';
import LoadingSpinner from '../common/LoadingSpinner';

interface InstructionExpandButtonProps {
  instructions: string[];
  isExpanded: boolean;
  isLoading: boolean;
  onExpand: () => void;
}

export default function InstructionExpandButton({
  instructions,
  isExpanded,
  isLoading,
  onExpand,
}: InstructionExpandButtonProps) {
  // If already expanded, show detailed instructions only
  if (isExpanded) {
    return (
      <div>
        <h4 className="font-semibold text-sm text-neutral-800 mb-2">Instructions</h4>
        <ol className="text-sm space-y-2 list-decimal list-inside">
          {instructions.map((instruction, index) => (
            <li key={index} className="text-neutral-700">
              {instruction}
            </li>
          ))}
        </ol>
      </div>
    );
  }

  // Not expanded: show button and brief instructions
  return (
    <div>
      <h4 className="font-semibold text-sm text-neutral-800 mb-2">Instructions</h4>
      <ol className="text-sm space-y-2 list-decimal list-inside mb-3">
        {instructions.map((instruction, index) => (
          <li key={index} className="text-neutral-700">
            {instruction}
          </li>
        ))}
      </ol>
      <Button
        variant="outline"
        size="sm"
        onClick={onExpand}
        disabled={isLoading}
        className="text-xs text-neutral-700 border-neutral-300 hover:bg-neutral-50"
      >
        {isLoading ? (
          <>
            <LoadingSpinner size="sm" className="mr-2" />
            Expanding...
          </>
        ) : (
          <>
            <Plus className="w-3 h-3 mr-1" />
            Expand Instructions
          </>
        )}
      </Button>
    </div>
  );
}
