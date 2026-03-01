/**
 * Editor Icons
 *
 * Icons for text formatting and editing.
 * Uses Lucide React with Apple-style thin stroke styling.
 */

import React from 'react';
import { Bold, Italic, Strikethrough, Heading1, Heading2, Quote, Code, List } from 'lucide-react';
import type { IconProps } from './types';

// Apple-style wrapper: thin 1.5px stroke, elegant and premium
const createIcon = (
  LucideIcon: React.FC<{ className?: string; style?: React.CSSProperties; strokeWidth?: number }>,
  displayName: string
): React.FC<IconProps> => {
  const Icon: React.FC<IconProps> = ({ className, filled, style, strokeWidth = 1.5 }) => (
    <LucideIcon
      className={className}
      strokeWidth={strokeWidth}
      style={{
        ...style,
        fill: filled ? 'currentColor' : 'none',
      }}
    />
  );
  Icon.displayName = displayName;
  return Icon;
};

export const BoldIcon = createIcon(Bold, 'BoldIcon');
export const ItalicIcon = createIcon(Italic, 'ItalicIcon');
export const StrikethroughIcon = createIcon(Strikethrough, 'StrikethroughIcon');
export const Heading1Icon = createIcon(Heading1, 'Heading1Icon');
export const Heading2Icon = createIcon(Heading2, 'Heading2Icon');
export const QuoteIcon = createIcon(Quote, 'QuoteIcon');
export const CodeIcon = createIcon(Code, 'CodeIcon');
export const ListIcon = createIcon(List, 'ListIcon');
