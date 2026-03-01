/**
 * React 19 Compound Component Patterns
 * 
 * Production-ready compound component patterns for Spark Personal OS.
 * Follows React 19 best practices with TypeScript support.
 * 
 * @module components/patterns/CompoundComponents
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useId,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/styles';

// ============================================================================
// Accordion Compound Component
// ============================================================================

interface AccordionContextValue {
  openItems: Set<string>;
  toggleItem: (id: string) => void;
  allowMultiple: boolean;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordion() {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('Accordion components must be used within Accordion.Root');
  }
  return context;
}

interface AccordionRootProps {
  children: ReactNode;
  /** Allow multiple items to be open */
  allowMultiple?: boolean;
  /** Default open items */
  defaultOpen?: string[];
  /** Controlled open items */
  value?: string[];
  /** Controlled onChange */
  onChange?: (value: string[]) => void;
  className?: string;
}

function AccordionRoot({
  children,
  allowMultiple = false,
  defaultOpen = [],
  value,
  onChange,
  className,
}: AccordionRootProps) {
  const [internalOpen, setInternalOpen] = useState<Set<string>>(
    new Set(defaultOpen)
  );

  const openItems = value !== undefined ? new Set(value) : internalOpen;

  const toggleItem = useCallback(
    (id: string) => {
      const newSet = new Set(openItems);

      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        if (!allowMultiple) {
          newSet.clear();
        }
        newSet.add(id);
      }

      if (onChange) {
        onChange(Array.from(newSet));
      } else {
        setInternalOpen(newSet);
      }
    },
    [openItems, allowMultiple, onChange]
  );

  const contextValue = useMemo(
    () => ({ openItems, toggleItem, allowMultiple }),
    [openItems, toggleItem, allowMultiple]
  );

  return (
    <AccordionContext.Provider value={contextValue}>
      <div className={cn('space-y-2', className)}>{children}</div>
    </AccordionContext.Provider>
  );
}

interface AccordionItemProps {
  children: ReactNode;
  value: string;
  className?: string;
}

function AccordionItem({ children, value, className }: AccordionItemProps) {
  const { openItems } = useAccordion();
  const isOpen = openItems.has(value);

  return (
    <div
      className={cn(
        'bg-white/5 border border-white/10 rounded-xl overflow-hidden',
        'transition-colors duration-200',
        isOpen && 'border-[var(--cosmos-accent-primary)]/30',
        className
      )}
      data-state={isOpen ? 'open' : 'closed'}
      data-value={value}
    >
      {children}
    </div>
  );
}

interface AccordionTriggerProps {
  children: ReactNode;
  value: string;
  className?: string;
}

function AccordionTrigger({ children, value, className }: AccordionTriggerProps) {
  const { openItems, toggleItem } = useAccordion();
  const isOpen = openItems.has(value);
  const triggerId = useId();
  const contentId = `${triggerId}-content`;

  return (
    <button
      id={triggerId}
      type="button"
      aria-expanded={isOpen}
      aria-controls={contentId}
      onClick={() => toggleItem(value)}
      className={cn(
        'w-full flex items-center justify-between p-4',
        'text-white font-medium text-right',
        'hover:bg-white/5 transition-colors duration-200',
        'focus:outline-none focus:ring-2 focus:ring-[var(--cosmos-accent-primary)] focus:ring-inset',
        className
      )}
    >
      <span>{children}</span>
      <motion.svg
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.2 }}
        className="w-5 h-5 text-white/60"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </motion.svg>
    </button>
  );
}

interface AccordionContentProps {
  children: ReactNode;
  value: string;
  className?: string;
}

function AccordionContent({ children, value, className }: AccordionContentProps) {
  const { openItems } = useAccordion();
  const isOpen = openItems.has(value);

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
        >
          <div className={cn('p-4 pt-0 text-white/70', className)}>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export const Accordion = {
  Root: AccordionRoot,
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
};

// ============================================================================
// Disclosure Compound Component (Simpler Accordion)
// ============================================================================

interface DisclosureContextValue {
  isOpen: boolean;
  toggle: () => void;
  id: string;
}

const DisclosureContext = createContext<DisclosureContextValue | null>(null);

function useDisclosure() {
  const context = useContext(DisclosureContext);
  if (!context) {
    throw new Error('Disclosure components must be used within Disclosure.Root');
  }
  return context;
}

interface DisclosureRootProps {
  children: ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function DisclosureRoot({
  children,
  defaultOpen = false,
  open,
  onOpenChange,
}: DisclosureRootProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const id = useId();

  const isOpen = open !== undefined ? open : internalOpen;

  const toggle = useCallback(() => {
    const newValue = !isOpen;
    if (onOpenChange) {
      onOpenChange(newValue);
    } else {
      setInternalOpen(newValue);
    }
  }, [isOpen, onOpenChange]);

  const contextValue = useMemo(
    () => ({ isOpen, toggle, id }),
    [isOpen, toggle, id]
  );

  return (
    <DisclosureContext.Provider value={contextValue}>
      {children}
    </DisclosureContext.Provider>
  );
}

interface DisclosureButtonProps {
  children: ReactNode | ((isOpen: boolean) => ReactNode);
  className?: string;
  as?: 'button' | 'div' | 'span';
}

function DisclosureButton({
  children,
  className,
  as = 'button',
}: DisclosureButtonProps) {
  const { isOpen, toggle, id } = useDisclosure();

  const content = typeof children === 'function' ? children(isOpen) : children;

  const commonProps = {
    'aria-expanded': isOpen,
    'aria-controls': `${id}-panel`,
    onClick: toggle,
    className,
  };

  if (as === 'button') {
    return (
      <button type="button" {...commonProps}>
        {content}
      </button>
    );
  }

  if (as === 'div') {
    return (
      <div role="button" tabIndex={0} {...commonProps}>
        {content}
      </div>
    );
  }

  return (
    <span role="button" tabIndex={0} {...commonProps}>
      {content}
    </span>
  );
}

interface DisclosurePanelProps {
  children: ReactNode;
  className?: string;
}

function DisclosurePanel({ children, className }: DisclosurePanelProps) {
  const { isOpen, id } = useDisclosure();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id={`${id}-panel`}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export const Disclosure = {
  Root: DisclosureRoot,
  Button: DisclosureButton,
  Panel: DisclosurePanel,
};

// ============================================================================
// Menu/Dropdown Compound Component
// ============================================================================

interface MenuContextValue {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  activeIndex: number;
  setActiveIndex: Dispatch<SetStateAction<number>>;
  menuId: string;
}

const MenuContext = createContext<MenuContextValue | null>(null);

function useMenu() {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('Menu components must be used within Menu.Root');
  }
  return context;
}

interface MenuRootProps {
  children: ReactNode;
}

function MenuRoot({ children }: MenuRootProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const menuId = useId();

  const contextValue = useMemo(
    () => ({ isOpen, setIsOpen, activeIndex, setActiveIndex, menuId }),
    [isOpen, activeIndex, menuId]
  );

  return (
    <MenuContext.Provider value={contextValue}>
      <div className="relative inline-block">{children}</div>
    </MenuContext.Provider>
  );
}

interface MenuTriggerProps {
  children: ReactNode;
  className?: string;
}

function MenuTrigger({ children, className }: MenuTriggerProps) {
  const { isOpen, setIsOpen, menuId } = useMenu();

  return (
    <button
      type="button"
      aria-haspopup="menu"
      aria-expanded={isOpen}
      aria-controls={`${menuId}-items`}
      onClick={() => setIsOpen((prev) => !prev)}
      className={className}
    >
      {children}
    </button>
  );
}

interface MenuItemsProps {
  children: ReactNode;
  className?: string;
}

function MenuItems({ children, className }: MenuItemsProps) {
  const { isOpen, setIsOpen, menuId } = useMenu();

  // Close on click outside
  React.useEffect(() => {
    if (!isOpen) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(`[data-menu-id="${menuId}"]`)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [isOpen, menuId, setIsOpen]);

  // Close on Escape
  React.useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, setIsOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id={`${menuId}-items`}
          role="menu"
          data-menu-id={menuId}
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.15 }}
          className={cn(
            'absolute left-0 top-full mt-2 z-50',
            'min-w-[180px] p-1',
            'bg-[var(--bg-card)] backdrop-blur-xl',
            'border border-white/10 rounded-xl shadow-2xl',
            className
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface MenuItemProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

function MenuItem({ children, onClick, disabled, className }: MenuItemProps) {
  const { setIsOpen } = useMenu();

  const handleClick = () => {
    if (disabled) return;
    onClick?.();
    setIsOpen(false);
  };

  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      onClick={handleClick}
      className={cn(
        'w-full px-3 py-2 text-right',
        'text-white/80 text-sm',
        'rounded-lg transition-colors duration-150',
        'hover:bg-white/10 hover:text-white',
        'focus:outline-none focus:bg-white/10',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {children}
    </button>
  );
}

function MenuDivider() {
  return <div className="my-1 border-t border-white/10" />;
}

export const Menu = {
  Root: MenuRoot,
  Trigger: MenuTrigger,
  Items: MenuItems,
  Item: MenuItem,
  Divider: MenuDivider,
};

// ============================================================================
// Popover Compound Component
// ============================================================================

interface PopoverContextValue {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  popoverId: string;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}

const PopoverContext = createContext<PopoverContextValue | null>(null);

function usePopover() {
  const context = useContext(PopoverContext);
  if (!context) {
    throw new Error('Popover components must be used within Popover.Root');
  }
  return context;
}

interface PopoverRootProps {
  children: ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function PopoverRoot({
  children,
  defaultOpen = false,
  open,
  onOpenChange,
}: PopoverRootProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const popoverId = useId();
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  const isOpen = open !== undefined ? open : internalOpen;

  const setIsOpen: Dispatch<SetStateAction<boolean>> = useCallback(
    (value) => {
      const newValue = typeof value === 'function' ? value(isOpen) : value;
      if (onOpenChange) {
        onOpenChange(newValue);
      } else {
        setInternalOpen(newValue);
      }
    },
    [isOpen, onOpenChange]
  );

  const contextValue = useMemo(
    () => ({ isOpen, setIsOpen, popoverId, triggerRef }),
    [isOpen, setIsOpen, popoverId]
  );

  return (
    <PopoverContext.Provider value={contextValue}>
      <div className="relative inline-block">{children}</div>
    </PopoverContext.Provider>
  );
}

interface PopoverTriggerProps {
  children: ReactNode;
  className?: string;
}

function PopoverTrigger({ children, className }: PopoverTriggerProps) {
  const { isOpen, setIsOpen, popoverId, triggerRef } = usePopover();

  return (
    <button
      ref={triggerRef}
      type="button"
      aria-haspopup="dialog"
      aria-expanded={isOpen}
      aria-controls={`${popoverId}-content`}
      onClick={() => setIsOpen((prev) => !prev)}
      className={className}
    >
      {children}
    </button>
  );
}

interface PopoverContentProps {
  children: ReactNode;
  className?: string;
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
}

function PopoverContent({
  children,
  className,
  side = 'bottom',
  align = 'center',
}: PopoverContentProps) {
  const { isOpen, setIsOpen, popoverId } = usePopover();

  // Close on click outside
  React.useEffect(() => {
    if (!isOpen) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(`[data-popover-id="${popoverId}"]`)) {
        setIsOpen(false);
      }
    };

    // Delay to prevent immediate close
    const timeoutId = setTimeout(() => {
      document.addEventListener('click', handleClick);
    }, 0);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('click', handleClick);
    };
  }, [isOpen, popoverId, setIsOpen]);

  const positionClasses = {
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2',
    right: 'left-full ml-2',
  };

  const alignClasses = {
    start: 'right-0',
    center: 'left-1/2 -translate-x-1/2',
    end: 'left-0',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id={`${popoverId}-content`}
          data-popover-id={popoverId}
          role="dialog"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className={cn(
            'absolute z-50',
            'p-4 min-w-[200px]',
            'bg-[var(--bg-card)] backdrop-blur-xl',
            'border border-white/10 rounded-xl shadow-2xl',
            positionClasses[side],
            alignClasses[align],
            className
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function PopoverClose({ children, className }: { children: ReactNode; className?: string }) {
  const { setIsOpen } = usePopover();

  return (
    <button
      type="button"
      onClick={() => setIsOpen(false)}
      className={className}
    >
      {children}
    </button>
  );
}

export const Popover = {
  Root: PopoverRoot,
  Trigger: PopoverTrigger,
  Content: PopoverContent,
  Close: PopoverClose,
};

// ============================================================================
// Card with Slots Compound Component
// ============================================================================

interface CardRootProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'solid';
  interactive?: boolean;
  onClick?: () => void;
}

function CardRoot({
  children,
  className,
  variant = 'default',
  interactive = false,
  onClick,
}: CardRootProps) {
  const variantClasses = {
    default: 'bg-white/5 border border-white/10',
    glass: 'bg-white/[0.03] backdrop-blur-xl border border-white/5',
    solid: 'bg-[var(--bg-card)] border border-white/10',
  };

  const Component = interactive ? motion.div : 'div';
  const interactiveProps = interactive
    ? {
        whileHover: { y: -2, boxShadow: '0 10px 40px -10px rgba(0,0,0,0.3)' },
        whileTap: { scale: 0.99 },
        transition: { duration: 0.2 },
      }
    : {};

  return (
    <Component
      onClick={onClick}
      className={cn(
        'rounded-2xl overflow-hidden',
        variantClasses[variant],
        interactive && 'cursor-pointer',
        className
      )}
      {...interactiveProps}
    >
      {children}
    </Component>
  );
}

function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('p-4 pb-2 flex items-center justify-between', className)}>
      {children}
    </div>
  );
}

function CardTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h3 className={cn('text-lg font-bold text-white', className)}>
      {children}
    </h3>
  );
}

function CardDescription({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn('text-sm text-white/60', className)}>
      {children}
    </p>
  );
}

function CardBody({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('p-4 pt-2', className)}>
      {children}
    </div>
  );
}

function CardFooter({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('p-4 pt-0 flex items-center gap-2', className)}>
      {children}
    </div>
  );
}

export const Card = {
  Root: CardRoot,
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Body: CardBody,
  Footer: CardFooter,
};

// ============================================================================
// List with Selection Compound Component
// ============================================================================

interface ListContextValue<T> {
  selectedItems: Set<T>;
  toggleItem: (item: T) => void;
  selectAll: () => void;
  clearSelection: () => void;
  isSelected: (item: T) => boolean;
  multiSelect: boolean;
}

const ListContext = createContext<ListContextValue<unknown> | null>(null);

function useList<T>() {
  const context = useContext(ListContext) as ListContextValue<T> | null;
  if (!context) {
    throw new Error('List components must be used within List.Root');
  }
  return context;
}

interface ListRootProps<T> {
  children: ReactNode;
  items: T[];
  multiSelect?: boolean;
  selectedItems?: T[];
  onSelectionChange?: (items: T[]) => void;
  className?: string;
}

function ListRoot<T>({
  children,
  items,
  multiSelect = false,
  selectedItems: controlledSelected,
  onSelectionChange,
  className,
}: ListRootProps<T>) {
  const [internalSelected, setInternalSelected] = useState<Set<T>>(new Set());

  const selectedItems = controlledSelected
    ? new Set(controlledSelected)
    : internalSelected;

  const setSelectedItems = useCallback(
    (items: Set<T>) => {
      if (onSelectionChange) {
        onSelectionChange(Array.from(items));
      } else {
        setInternalSelected(items);
      }
    },
    [onSelectionChange]
  );

  const toggleItem = useCallback(
    (item: T) => {
      const newSet = new Set(selectedItems);
      if (newSet.has(item)) {
        newSet.delete(item);
      } else {
        if (!multiSelect) {
          newSet.clear();
        }
        newSet.add(item);
      }
      setSelectedItems(newSet);
    },
    [selectedItems, multiSelect, setSelectedItems]
  );

  const selectAll = useCallback(() => {
    setSelectedItems(new Set(items));
  }, [items, setSelectedItems]);

  const clearSelection = useCallback(() => {
    setSelectedItems(new Set());
  }, [setSelectedItems]);

  const isSelected = useCallback(
    (item: T) => selectedItems.has(item),
    [selectedItems]
  );

  const contextValue = useMemo(
    () => ({
      selectedItems,
      toggleItem,
      selectAll,
      clearSelection,
      isSelected,
      multiSelect,
    }),
    [selectedItems, toggleItem, selectAll, clearSelection, isSelected, multiSelect]
  ) as ListContextValue<unknown>;

  return (
    <ListContext.Provider value={contextValue}>
      <div className={cn('space-y-1', className)} role="listbox" aria-multiselectable={multiSelect}>
        {children}
      </div>
    </ListContext.Provider>
  );
}

interface ListItemProps<T> {
  children: ReactNode;
  value: T;
  className?: string;
  disabled?: boolean;
}

function ListItem<T>({ children, value, className, disabled }: ListItemProps<T>) {
  const { isSelected, toggleItem } = useList<T>();
  const selected = isSelected(value);

  return (
    <div
      role="option"
      aria-selected={selected}
      aria-disabled={disabled}
      onClick={() => !disabled && toggleItem(value)}
      className={cn(
        'px-4 py-3 rounded-xl cursor-pointer',
        'transition-all duration-200',
        'border border-transparent',
        selected
          ? 'bg-[var(--cosmos-accent-primary)]/10 border-[var(--cosmos-accent-primary)]/30'
          : 'hover:bg-white/5',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {children}
    </div>
  );
}

export const List = {
  Root: ListRoot,
  Item: ListItem,
  useList,
};
