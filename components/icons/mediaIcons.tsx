/**
 * Media Icons
 *
 * Icons for media playback and file types.
 * Uses Lucide React with Apple-style thin stroke styling.
 */

import React from 'react';
import {
  Play,
  Pause,
  Square,
  Volume2,
  File,
  Image,
  Video,
  Music,
  FileText,
  FileType,
  Camera,
  SkipForward,
  Mic,
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

export const PlayIcon = createIcon(Play, 'PlayIcon');
export const PauseIcon = createIcon(Pause, 'PauseIcon');
export const StopIcon = createIcon(Square, 'StopIcon');
export const VolumeIcon = createIcon(Volume2, 'VolumeIcon');
export const FileIcon = createIcon(File, 'FileIcon');
export const ImageIcon = createIcon(Image, 'ImageIcon');
export const VideoIcon = createIcon(Video, 'VideoIcon');
export const AudioFileIcon = createIcon(Music, 'AudioFileIcon');
export const PdfIcon = createIcon(FileText, 'PdfIcon');
export const DocIcon = createIcon(FileType, 'DocIcon');
export const CameraIcon = createIcon(Camera, 'CameraIcon');
export const SkipNextIcon = createIcon(SkipForward, 'SkipNextIcon');
export const MicrophoneIcon = createIcon(Mic, 'MicrophoneIcon');
