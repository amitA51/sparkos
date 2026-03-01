/**
 * Navigation Icons
 *
 * Icons used for navigation and UI control elements.
 * Uses Lucide React with Apple-style thin stroke styling.
 */

import React from 'react';
import {
  Rss,
  Search,
  Settings,
  Home,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Menu,
  MoreVertical,
  MoreHorizontal,
  LayoutDashboard,
  BarChart3,
  ArrowDownNarrowWide,
  Filter,
  List,
  CalendarDays,
  SplitSquareHorizontal,
  Maximize2,
  Columns2,
  Layout,
  Timer,
  ArrowRight,
  ArrowLeft,
  FastForward,
  Palette,
  Grid2X2,
  LayoutTemplate,
  MoveHorizontal,
  Smartphone,
  Type,
  ZoomIn,
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

export const FeedIcon = createIcon(Rss, 'FeedIcon');
export const SearchIcon = createIcon(Search, 'SearchIcon');
export const SettingsIcon = createIcon(Settings, 'SettingsIcon');
export const HomeIcon = createIcon(Home, 'HomeIcon');
export const ChevronLeftIcon = createIcon(ChevronLeft, 'ChevronLeftIcon');
export const ChevronRightIcon = createIcon(ChevronRight, 'ChevronRightIcon');
export const ChevronDownIcon = createIcon(ChevronDown, 'ChevronDownIcon');
export const ChevronUpIcon = createIcon(ChevronUp, 'ChevronUpIcon');
export const MenuIcon = createIcon(Menu, 'MenuIcon');
export const MoreVerticalIcon = createIcon(MoreVertical, 'MoreVerticalIcon');
export const MoreHorizontalIcon = createIcon(MoreHorizontal, 'MoreHorizontalIcon');
export const LayoutDashboardIcon = createIcon(LayoutDashboard, 'LayoutDashboardIcon');
export const ChartBarIcon = createIcon(BarChart3, 'ChartBarIcon');
export const SortAscIcon = createIcon(ArrowDownNarrowWide, 'SortAscIcon');
export const FilterIcon = createIcon(Filter, 'FilterIcon');
export const ListIcon = createIcon(List, 'ListIcon');
export const CalendarDaysIcon = createIcon(CalendarDays, 'CalendarDaysIcon');
export const SplitScreenIcon = createIcon(SplitSquareHorizontal, 'SplitScreenIcon');
export const MaximizeIcon = createIcon(Maximize2, 'MaximizeIcon');
export const ColumnsIcon = createIcon(Columns2, 'ColumnsIcon');
export const LayoutIcon = createIcon(Layout, 'LayoutIcon');
export const StopwatchIcon = createIcon(Timer, 'StopwatchIcon');
export const ArrowRightIcon = createIcon(ArrowRight, 'ArrowRightIcon');
export const ArrowLeftIcon = createIcon(ArrowLeft, 'ArrowLeftIcon');
export const FastForwardIcon = createIcon(FastForward, 'FastForwardIcon');
export const PaletteIcon = createIcon(Palette, 'PaletteIcon');
export const VisualModeIcon = createIcon(Grid2X2, 'VisualModeIcon');
export const TemplateIcon = createIcon(LayoutTemplate, 'TemplateIcon');
export const SwipeIcon = createIcon(MoveHorizontal, 'SwipeIcon');
export const SmartphoneIcon = createIcon(Smartphone, 'SmartphoneIcon');
export const TypeIcon = createIcon(Type, 'TypeIcon');
export const ZoomInIcon = createIcon(ZoomIn, 'ZoomInIcon');
