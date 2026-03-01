/**
 * Status Icons
 *
 * Icons for status indicators, checks, and feedback.
 * Uses Lucide React with Apple-style thin stroke styling.
 */

import React from 'react';
import {
  CheckCircle2,
  Circle,
  CheckCheck,
  CheckSquare,
  Octagon,
  AlertTriangle,
  Star,
  Flame,
  TrendingUp,
  TrendingDown,
  Bell,
  Lock,
  WifiOff,
  Eye,
  EyeOff,
  ShieldCheck,
  ShieldAlert,
  User,
  AlertCircle,
  Info,
  Check,
  Clock,
  Heart,
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

export const CheckCircleIcon = createIcon(CheckCircle2, 'CheckCircleIcon');
export const CircleIcon = createIcon(Circle, 'CircleIcon');
export const CheckCheckIcon = createIcon(CheckCheck, 'CheckCheckIcon');
export const CheckSquareIcon = createIcon(CheckSquare, 'CheckSquareIcon');
export const AlertOctagonIcon = createIcon(Octagon, 'AlertOctagonIcon');
export const AlertTriangleIcon = createIcon(AlertTriangle, 'AlertTriangleIcon');
export const StarIcon = createIcon(Star, 'StarIcon');
export const FlameIcon = createIcon(Flame, 'FlameIcon');
export const TrendingUpIcon = createIcon(TrendingUp, 'TrendingUpIcon');
export const TrendingDownIcon = createIcon(TrendingDown, 'TrendingDownIcon');
export const BellIcon = createIcon(Bell, 'BellIcon');
export const LockIcon = createIcon(Lock, 'LockIcon');
export const WifiOffIcon = createIcon(WifiOff, 'WifiOffIcon');
export const EyeIcon = createIcon(Eye, 'EyeIcon');
export const EyeOffIcon = createIcon(EyeOff, 'EyeOffIcon');
export const ShieldCheckIcon = createIcon(ShieldCheck, 'ShieldCheckIcon');
export const ShieldExclamationIcon = createIcon(ShieldAlert, 'ShieldExclamationIcon');
export const UserIcon = createIcon(User, 'UserIcon');
export const WarningIcon = createIcon(AlertTriangle, 'WarningIcon');
export const InfoIcon = createIcon(Info, 'InfoIcon');
export const CheckIcon = createIcon(Check, 'CheckIcon');
export const AlertIcon = createIcon(AlertCircle, 'AlertIcon');
export const ClockIcon = createIcon(Clock, 'ClockIcon');
export const HeartIcon = createIcon(Heart, 'HeartIcon');
