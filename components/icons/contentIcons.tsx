/**
 * Content Type Icons
 *
 * Icons representing different content types (tasks, notes, books, etc.).
 * Uses Lucide React with Apple-style thin stroke styling.
 */

import React from 'react';
import {
  Lightbulb,
  ClipboardList,
  BookOpen,
  Dumbbell,
  Link,
  BookMarked,
  BrainCircuit,
  Calendar,
  Inbox,
  Target,
  Sparkles,
  Sun,
  Moon,
  Cloud,
  Folder,
  FolderOpen,
  Tag,
  Bookmark,
  ExternalLink,
  Database,
  Key,
  LogOut,
  Trophy,
  Crown,
  Layers,
  Pin,
  Shield,
  Timer,
  Ban,
  MessageCircle,
  Bug,
  AlignJustify,
  BookOpen as BookRead,
  Clipboard,
  Check,
  Rss,
  FileText,
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

export const LightbulbIcon = createIcon(Lightbulb, 'LightbulbIcon');
export const ClipboardListIcon = createIcon(ClipboardList, 'ClipboardListIcon');
export const BookOpenIcon = createIcon(BookOpen, 'BookOpenIcon');
export const DumbbellIcon = createIcon(Dumbbell, 'DumbbellIcon');
export const LinkIcon = createIcon(Link, 'LinkIcon');
export const RoadmapIcon = createIcon(BookMarked, 'RoadmapIcon');
export const BrainCircuitIcon = createIcon(BrainCircuit, 'BrainCircuitIcon');
export const CalendarIcon = createIcon(Calendar, 'CalendarIcon');
export const InboxIcon = createIcon(Inbox, 'InboxIcon');
export const TargetIcon = createIcon(Target, 'TargetIcon');
export const SparklesIcon = createIcon(Sparkles, 'SparklesIcon');
export const SunIcon = createIcon(Sun, 'SunIcon');
export const MoonIcon = createIcon(Moon, 'MoonIcon');
export const CloudIcon = createIcon(Cloud, 'CloudIcon');
export const FolderIcon = createIcon(Folder, 'FolderIcon');
export const TagIcon = createIcon(Tag, 'TagIcon');
export const BookmarkIcon = createIcon(Bookmark, 'BookmarkIcon');
export const ExternalLinkIcon = createIcon(ExternalLink, 'ExternalLinkIcon');
export const DatabaseIcon = createIcon(Database, 'DatabaseIcon');
export const KeyIcon = createIcon(Key, 'KeyIcon');
export const LogoutIcon = createIcon(LogOut, 'LogoutIcon');
export const TrophyIcon = createIcon(Trophy, 'TrophyIcon');
export const CrownIcon = createIcon(Crown, 'CrownIcon');
export const LayersIcon = createIcon(Layers, 'LayersIcon');
export const PinIcon = createIcon(Pin, 'PinIcon');
export const ShieldIcon = createIcon(Shield, 'ShieldIcon');
export const TimerIcon = createIcon(Timer, 'TimerIcon');
export const BanIcon = createIcon(Ban, 'BanIcon');
export const MessageCircleIcon = createIcon(MessageCircle, 'MessageCircleIcon');
export const BugIcon = createIcon(Bug, 'BugIcon');
export const SummarizeIcon = createIcon(AlignJustify, 'SummarizeIcon');
export const ReadIcon = createIcon(BookRead, 'ReadIcon');
export const ClipboardIcon = createIcon(Clipboard, 'ClipboardIcon');
export const CheckIconNew = createIcon(Check, 'CheckIconNew');
export const TrophyIconNew = createIcon(Trophy, 'TrophyIconNew');
export const RssIcon = createIcon(Rss, 'RssIcon');
export const FolderOpenIcon = createIcon(FolderOpen, 'FolderOpenIcon');
export const FileTextIcon = createIcon(FileText, 'FileTextIcon');

// Google Icon - Custom SVG for brand consistency
export const GoogleIcon: React.FC<IconProps> = ({ className, style }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
  >
    <path
      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
      stroke="none"
      fill="#fff"
      fillOpacity="0.1"
    />
    <path
      d="M20.2826 12.2424C20.2826 11.4909 20.1626 10.8394 19.9826 10.2394H12V13.3879H16.7426C16.6109 14.2576 15.987 15.5242 14.8109 16.3364L14.7948 16.4436L17.3594 18.4273L17.537 18.4455C19.1674 16.9455 20.2826 14.7394 20.2826 12.2424Z"
      fill="#4285F4"
    />
    <path
      d="M12 20.4848C14.3296 20.4848 16.2848 19.7121 17.7109 18.4455L14.8109 16.3364C14.0783 16.8424 13.1304 17.1606 12 17.1606C9.72174 17.1606 7.77652 15.6606 7.08 13.6394L6.97391 13.6485L4.30826 15.7121L4.27174 15.8121C5.68696 18.6212 8.61913 20.4848 12 20.4848Z"
      fill="#34A853"
    />
    <path
      d="M7.08 13.6394C6.89348 13.1061 6.78652 12.5364 6.78652 11.9515C6.78652 11.3667 6.89348 10.797 7.08 10.2636L7.07478 10.1515L4.37826 8.06364L4.27174 8.09091C3.68478 9.25758 3.35217 10.5727 3.35217 11.9515C3.35217 13.3303 3.68478 14.6455 4.27174 15.8121L7.08 13.6394Z"
      fill="#FBBC05"
    />
    <path
      d="M12 6.73939C13.6278 6.73939 14.7174 7.43939 15.3413 8.03333L17.7826 5.64545C16.2783 4.23939 14.3296 3.41818 12 3.41818C8.61913 3.41818 5.68696 5.28182 4.27174 8.09091L7.08 10.2636C7.77652 8.24242 9.72174 6.73939 12 6.73939Z"
      fill="#EA4335"
    />
  </svg>
);

// Google Calendar Icon - Custom SVG for brand consistency
export const GoogleCalendarIcon: React.FC<IconProps> = ({ className, style }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <path d="M12 14l2 2l4-4" />
  </svg>
);

// Unread Icon - Custom with notification dot
export const UnreadIcon: React.FC<IconProps> = ({ className, style }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
  >
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    <circle cx="19" cy="5" r="3" fill="currentColor" stroke="none" />
  </svg>
);
