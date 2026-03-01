/**
 * Action Icons
 *
 * Icons for common user actions (add, edit, delete, etc.).
 * Uses Lucide React with Apple-style thin stroke styling.
 */

import React from 'react';
import {
  PlusCircle,
  Plus,
  Minus,
  X,
  Trash2,
  Pencil,
  Copy,
  Share2,
  Send,
  RefreshCw,
  Download,
  Upload,
  GripVertical,
} from 'lucide-react';
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

export const AddIcon = createIcon(PlusCircle, 'AddIcon');
export const PlusIcon = createIcon(Plus, 'PlusIcon');
export const MinusIcon = createIcon(Minus, 'MinusIcon');
export const CloseIcon = createIcon(X, 'CloseIcon');
export const XIcon = CloseIcon; // Alias
export const TrashIcon = createIcon(Trash2, 'TrashIcon');
export const EditIcon = createIcon(Pencil, 'EditIcon');
export const CopyIcon = createIcon(Copy, 'CopyIcon');
export const ShareIcon = createIcon(Share2, 'ShareIcon');
export const SendIcon = createIcon(Send, 'SendIcon');
export const RefreshIcon = createIcon(RefreshCw, 'RefreshIcon');
export const DownloadIcon = createIcon(Download, 'DownloadIcon');
export const UploadIcon = createIcon(Upload, 'UploadIcon');
export const GripVerticalIcon = createIcon(GripVertical, 'GripVerticalIcon');
export const DragHandleIcon = GripVerticalIcon; // Alias
