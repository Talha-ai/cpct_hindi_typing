/**
 * LayoutSelector Component
 *
 * Allows users to switch between different keyboard layouts
 * (Remington GAIL, INSCRIPT, etc.)
 */

import { useKeyboardLayout } from '@/contexts/KeyboardLayoutContext';
import type { LayoutId } from '@/data/keyboardMappings';
import { cn } from '@/utils/cn';

export function LayoutSelector() {
  const { currentLayoutId, setLayout, availableLayouts } = useKeyboardLayout();

  return (
    <div className="flex gap-2 justify-center items-center">
      <span className="text-sm text-gray-600 dark:text-gray-400 mr-2">
        Keyboard Layout:
      </span>
      {Object.entries(availableLayouts).map(([id, layout]) => (
        <button
          key={id}
          onClick={() => setLayout(id as LayoutId)}
          className={cn(
            'px-4 py-2 rounded-lg font-medium transition-all',
            currentLayoutId === id
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
          )}
        >
          {layout.name}
        </button>
      ))}
    </div>
  );
}
