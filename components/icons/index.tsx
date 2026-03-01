/**
 * Icons Module Index
 * 
 * Re-exports all icons from categorized modules for convenient imports.
 * Import icons from this file for simplicity, or from specific modules for tree-shaking.
 */

// Types and utilities
export { stringToHash, getTagColor } from './types';
export type { IconProps } from './types';

// Navigation icons
export {
    FeedIcon,
    SearchIcon,
    SettingsIcon,
    HomeIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    MenuIcon,
    MoreVerticalIcon,
    MoreHorizontalIcon,
    LayoutDashboardIcon,
    ChartBarIcon,
    SortAscIcon,
    FilterIcon,
    ListIcon,
    CalendarDaysIcon,
    SplitScreenIcon,
    MaximizeIcon,
    ColumnsIcon,
    LayoutIcon,
    StopwatchIcon,
    ArrowRightIcon,
    ArrowLeftIcon,
    FastForwardIcon,
    PaletteIcon,
    VisualModeIcon,
    TemplateIcon,
    SwipeIcon,
    SmartphoneIcon,
    TypeIcon,
    ZoomInIcon,
} from './navigationIcons';

// Action icons
export {
    AddIcon,
    PlusIcon,
    MinusIcon,
    CloseIcon,
    XIcon,
    TrashIcon,
    EditIcon,
    CopyIcon,
    ShareIcon,
    SendIcon,
    RefreshIcon,
    DownloadIcon,
    UploadIcon,
    GripVerticalIcon,
    DragHandleIcon,
} from './actionIcons';

// Content type icons
export {
    LightbulbIcon,
    ClipboardListIcon,
    BookOpenIcon,
    DumbbellIcon,
    LinkIcon,
    RoadmapIcon,
    BrainCircuitIcon,
    CalendarIcon,
    InboxIcon,
    TargetIcon,
    SparklesIcon,
    SunIcon,
    MoonIcon,
    CloudIcon,
    FolderIcon,
    TagIcon,
    BookmarkIcon,
    ExternalLinkIcon,
    DatabaseIcon,
    KeyIcon,
    GoogleIcon,
    LogoutIcon,
    TrophyIcon,
    CrownIcon,
    LayersIcon,
    PinIcon,
    ShieldIcon,
    TimerIcon,
    BanIcon,
    GoogleCalendarIcon,
    MessageCircleIcon,
    BugIcon,
    SummarizeIcon,
    ReadIcon,
    UnreadIcon,
    ClipboardIcon,
    CheckIconNew,
    TrophyIconNew,
    RssIcon,
    FolderOpenIcon,
    FileTextIcon,
} from './contentIcons';

// Status icons
export {
    CheckCircleIcon,
    CircleIcon,
    CheckCheckIcon,
    CheckSquareIcon,
    AlertOctagonIcon,
    AlertTriangleIcon,
    StarIcon,
    FlameIcon,
    TrendingUpIcon,
    TrendingDownIcon,
    BellIcon,
    LockIcon,
    WifiOffIcon,
    EyeIcon,
    EyeOffIcon,
    ShieldCheckIcon,
    ShieldExclamationIcon,
    UserIcon,
    WarningIcon,
    InfoIcon,
    CheckIcon,
    AlertIcon,
    ClockIcon,
    HeartIcon,
} from './statusIcons';

// Media icons - all from one place
export {
    PlayIcon,
    PauseIcon,
    StopIcon,
    VolumeIcon,
    FileIcon,
    ImageIcon,
    VideoIcon,
    AudioFileIcon,
    PdfIcon,
    DocIcon,
    CameraIcon,
    SkipNextIcon,
    MicrophoneIcon,
} from './mediaIcons';

// Editor icons (text formatting)
export {
    BoldIcon,
    ItalicIcon,
    StrikethroughIcon,
    Heading1Icon,
    Heading2Icon,
    QuoteIcon,
    CodeIcon,
} from './editorIcons';

// File icon utility - from separate file to avoid initialization issues
export { getFileIcon } from './fileIconUtil';
