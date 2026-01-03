/**
 * KeyboardLayoutContext - Multi-Layout State Management
 *
 * Provides centralized state management for keyboard layouts using React Context API.
 * Supports switching between different keyboard layouts (Remington GAIL, INSCRIPT, etc.)
 * with automatic keyMap derivation and layout persistence.
 */

import { createContext, useContext, useState, useMemo, useEffect, ReactNode } from 'react';
import {
  AVAILABLE_LAYOUTS,
  type LayoutId,
} from '@/data/keyboardMappings';
import type { KeyboardLayout, KeyMapping } from '@/types/keyboard.types';

const STORAGE_KEY = 'hindi-typing-keyboard-layout';

/**
 * Context value interface
 */
interface KeyboardLayoutContextValue {
  /** Currently active keyboard layout */
  currentLayout: KeyboardLayout;

  /** ID of the current layout */
  currentLayoutId: LayoutId;

  /** Flattened map for O(1) key lookups */
  keyMap: Map<string, KeyMapping>;

  /** Function to switch layouts */
  setLayout: (layoutId: LayoutId) => void;

  /** Registry of all available layouts */
  availableLayouts: typeof AVAILABLE_LAYOUTS;
}

/**
 * Create the context
 */
const KeyboardLayoutContext = createContext<KeyboardLayoutContextValue | null>(null);

/**
 * Provider props
 */
interface KeyboardLayoutProviderProps {
  children: ReactNode;
  defaultLayout?: LayoutId;
}

/**
 * KeyboardLayoutProvider - Wraps app to provide layout context
 *
 * @example
 * ```tsx
 * <KeyboardLayoutProvider defaultLayout="remington-gail">
 *   <App />
 * </KeyboardLayoutProvider>
 * ```
 */
export function KeyboardLayoutProvider({
  children,
  defaultLayout = 'remington-gail',
}: KeyboardLayoutProviderProps) {
  // Initialize from localStorage if available
  const [layoutId, setLayoutId] = useState<LayoutId>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && saved in AVAILABLE_LAYOUTS) {
        return saved as LayoutId;
      }
    } catch (error) {
      // localStorage might not be available (e.g., SSR, private browsing)
      console.warn('Failed to load keyboard layout from localStorage:', error);
    }
    return defaultLayout;
  });

  // Persist layout preference to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, layoutId);
    } catch (error) {
      // Ignore errors (e.g., storage quota exceeded, private browsing)
      console.warn('Failed to save keyboard layout to localStorage:', error);
    }
  }, [layoutId]);

  // Get the current layout object
  const currentLayout = AVAILABLE_LAYOUTS[layoutId];

  // Derive the keyMap from current layout (memoized for performance)
  const keyMap = useMemo(
    () => new Map(currentLayout.rows.flat().map((k) => [k.key, k])),
    [currentLayout]
  );

  const value: KeyboardLayoutContextValue = {
    currentLayout,
    currentLayoutId: layoutId,
    keyMap,
    setLayout: setLayoutId,
    availableLayouts: AVAILABLE_LAYOUTS,
  };

  return (
    <KeyboardLayoutContext.Provider value={value}>
      {children}
    </KeyboardLayoutContext.Provider>
  );
}

/**
 * useKeyboardLayout hook - Access keyboard layout context
 *
 * @throws Error if used outside KeyboardLayoutProvider
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { currentLayout, setLayout } = useKeyboardLayout();
 *   return <button onClick={() => setLayout('inscript')}>Switch to INSCRIPT</button>;
 * }
 * ```
 */
export function useKeyboardLayout() {
  const context = useContext(KeyboardLayoutContext);

  if (!context) {
    throw new Error(
      'useKeyboardLayout must be used within a KeyboardLayoutProvider'
    );
  }

  return context;
}
