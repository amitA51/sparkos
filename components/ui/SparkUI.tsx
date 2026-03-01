/**
 * Spark UI Component Library
 * 
 * Production-ready Tailwind CSS components with:
 * - Full TypeScript support
 * - Accessibility (ARIA)
 * - RTL support
 * - Dark mode
 * - Animation
 * - Variants system
 */

import { forwardRef, createContext, useContext, useId, useState, useRef, useEffect } from 'react';
import type { 
  ReactNode, 
  ButtonHTMLAttributes, 
  InputHTMLAttributes, 
  TextareaHTMLAttributes,
  HTMLAttributes,
  FormHTMLAttributes,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================================================
// Utility Types & Helpers
// ============================================================================

type VariantProps<T extends Record<string, Record<string, string>>> = {
  [K in keyof T]?: keyof T[K];
};

const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

// ============================================================================
// Button Component
// ============================================================================

const buttonVariants = {
  variant: {
    primary: 'bg-[var(--cosmos-accent-primary)] text-black hover:brightness-110 shadow-[0_0_15px_var(--dynamic-accent-glow)]',
    secondary: 'bg-white/10 text-white hover:bg-white/20 border border-white/10',
    ghost: 'bg-transparent text-white hover:bg-white/10',
    danger: 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/20',
    success: 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/20',
  },
  size: {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl',
    icon: 'p-2',
  },
} as const;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    children, 
    className, 
    variant = 'primary', 
    size = 'md', 
    isLoading, 
    leftIcon, 
    rightIcon,
    fullWidth,
    disabled,
    ...props 
  }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-all duration-200',
          'focus:outline-none focus:ring-2 focus:ring-[var(--cosmos-accent-primary)] focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)]',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'active:scale-[0.98]',
          buttonVariants.variant[variant],
          buttonVariants.size[size],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Spinner size={size === 'sm' ? 'sm' : 'md'} />
        ) : (
          <>
            {leftIcon}
            {children}
            {rightIcon}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

// ============================================================================
// Spinner Component
// ============================================================================

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-8 w-8',
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-current border-t-transparent',
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="טוען..."
    >
      <span className="sr-only">טוען...</span>
    </div>
  );
}

// ============================================================================
// Input Component
// ============================================================================

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftElement?: ReactNode;
  rightElement?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftElement, rightElement, className, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium text-[var(--text-primary)] mb-2"
          >
            {label}
            {props.required && <span className="text-red-400 mr-1">*</span>}
          </label>
        )}
        <div className="relative">
          {leftElement && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]">
              {leftElement}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full px-4 py-3 rounded-xl',
              'bg-[var(--bg-secondary)] border border-[var(--border-primary)]',
              'text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]',
              'focus:outline-none focus:ring-2 focus:ring-[var(--cosmos-accent-primary)] focus:border-transparent',
              'transition-all duration-200',
              error && 'border-red-500 focus:ring-red-500',
              leftElement ? 'pr-10' : undefined,
              rightElement ? 'pl-10' : undefined,
              className
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            {...props}
          />
          {rightElement && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]">
              {rightElement}
            </div>
          )}
        </div>
        {error && (
          <p id={`${inputId}-error`} className="mt-2 text-sm text-red-400" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${inputId}-hint`} className="mt-2 text-sm text-[var(--text-tertiary)]">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// ============================================================================
// Textarea Component
// ============================================================================

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  autoResize?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, autoResize, className, id, ...props }, ref) => {
    const generatedId = useId();
    const textareaId = id || generatedId;
    const innerRef = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
      if (autoResize && innerRef.current) {
        innerRef.current.style.height = 'auto';
        innerRef.current.style.height = `${innerRef.current.scrollHeight}px`;
      }
    }, [props.value, autoResize]);

    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={textareaId}
            className="block text-sm font-medium text-[var(--text-primary)] mb-2"
          >
            {label}
            {props.required && <span className="text-red-400 mr-1">*</span>}
          </label>
        )}
        <textarea
          ref={(node) => {
            innerRef.current = node;
            if (typeof ref === 'function') ref(node);
            else if (ref) ref.current = node;
          }}
          id={textareaId}
          className={cn(
            'w-full px-4 py-3 rounded-xl min-h-[120px]',
            'bg-[var(--bg-secondary)] border border-[var(--border-primary)]',
            'text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]',
            'focus:outline-none focus:ring-2 focus:ring-[var(--cosmos-accent-primary)] focus:border-transparent',
            'transition-all duration-200 resize-none',
            error && 'border-red-500 focus:ring-red-500',
            autoResize && 'overflow-hidden',
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${textareaId}-error` : hint ? `${textareaId}-hint` : undefined}
          {...props}
        />
        {error && (
          <p id={`${textareaId}-error`} className="mt-2 text-sm text-red-400" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${textareaId}-hint`} className="mt-2 text-sm text-[var(--text-tertiary)]">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

// ============================================================================
// Modal Component
// ============================================================================

interface ModalContextValue {
  isOpen: boolean;
  close: () => void;
  titleId: string;
  descriptionId: string;
}

const ModalContext = createContext<ModalContextValue | null>(null);

function useModal() {
  const context = useContext(ModalContext);
  if (!context) throw new Error('Modal components must be used within Modal');
  return context;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const modalSizes = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  full: 'max-w-full mx-4',
};

export function Modal({ isOpen, onClose, children, size = 'md' }: ModalProps) {
  const titleId = useId();
  const descriptionId = useId();

  // Close on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <ModalContext.Provider value={{ isOpen, close: onClose, titleId, descriptionId }}>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={onClose}
              aria-hidden="true"
            />
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.3 }}
              className={cn(
                'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50',
                'w-full p-6',
                modalSizes[size]
              )}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              aria-describedby={descriptionId}
            >
              <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl shadow-2xl overflow-hidden">
                {children}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </ModalContext.Provider>
  );
}

Modal.Header = function ModalHeader({ children, className }: { children: ReactNode; className?: string }) {
  const { titleId, close } = useModal();
  return (
    <div className={cn('flex items-center justify-between p-6 border-b border-[var(--border-primary)]', className)}>
      <h2 id={titleId} className="text-xl font-bold text-white">{children}</h2>
      <button
        onClick={close}
        className="p-2 rounded-lg hover:bg-white/10 text-[var(--text-tertiary)] transition-colors"
        aria-label="סגור"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

Modal.Body = function ModalBody({ children, className }: { children: ReactNode; className?: string }) {
  const { descriptionId } = useModal();
  return (
    <div id={descriptionId} className={cn('p-6', className)}>
      {children}
    </div>
  );
};

Modal.Footer = function ModalFooter({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('flex items-center justify-end gap-3 p-6 border-t border-[var(--border-primary)]', className)}>
      {children}
    </div>
  );
};

// ============================================================================
// Card Component
// ============================================================================

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  interactive?: boolean;
}

const cardVariants = {
  variant: {
    default: 'bg-[var(--bg-card)] border border-[var(--border-primary)]',
    elevated: 'bg-[var(--bg-card)] shadow-xl',
    outlined: 'bg-transparent border-2 border-[var(--border-primary)]',
    glass: 'bg-white/5 backdrop-blur-xl border border-white/10',
  },
  padding: {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  },
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, variant = 'default', padding = 'md', interactive, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-2xl transition-all duration-200',
          cardVariants.variant[variant],
          cardVariants.padding[padding],
          interactive && 'cursor-pointer hover:scale-[1.02] hover:shadow-lg',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

// ============================================================================
// Badge Component
// ============================================================================

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
}

const badgeVariants = {
  variant: {
    default: 'bg-white/10 text-white',
    primary: 'bg-[var(--cosmos-accent-primary)]/20 text-[var(--cosmos-accent-primary)]',
    success: 'bg-green-500/20 text-green-400',
    warning: 'bg-yellow-500/20 text-yellow-400',
    danger: 'bg-red-500/20 text-red-400',
    info: 'bg-blue-500/20 text-blue-400',
  },
  size: {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  },
};

export function Badge({ 
  children, 
  className, 
  variant = 'default', 
  size = 'md',
  ...props 
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full',
        badgeVariants.variant[variant],
        badgeVariants.size[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

// ============================================================================
// Toast Component
// ============================================================================

interface ToastProps {
  id: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  onClose: (id: string) => void;
}

const toastIcons = {
  info: '💡',
  success: '✅',
  warning: '⚠️',
  error: '❌',
};

const toastColors = {
  info: 'border-blue-500/30 bg-blue-500/10',
  success: 'border-green-500/30 bg-green-500/10',
  warning: 'border-yellow-500/30 bg-yellow-500/10',
  error: 'border-red-500/30 bg-red-500/10',
};

export function Toast({ id, message, type = 'info', duration = 5000, onClose }: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => onClose(id), duration);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [id, duration, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-xl border backdrop-blur-sm',
        toastColors[type]
      )}
      role="alert"
    >
      <span className="text-xl">{toastIcons[type]}</span>
      <p className="text-white text-sm flex-1">{message}</p>
      <button
        onClick={() => onClose(id)}
        className="p-1 rounded hover:bg-white/10 text-white/60 hover:text-white transition-colors"
        aria-label="סגור"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </motion.div>
  );
}

// ============================================================================
// Skeleton Component
// ============================================================================

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export function Skeleton({ 
  variant = 'text', 
  width, 
  height, 
  animation = 'pulse',
  className,
  style,
  ...props 
}: SkeletonProps) {
  const variantClasses = {
    text: 'rounded-md',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent bg-[length:200%_100%]',
    none: '',
  };

  return (
    <div
      className={cn(
        'bg-white/10',
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
      style={{
        width: width ?? (variant === 'text' ? '100%' : undefined),
        height: height ?? (variant === 'text' ? '1em' : undefined),
        ...style,
      }}
      aria-hidden="true"
      {...props}
    />
  );
}

// ============================================================================
// Avatar Component
// ============================================================================

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fallback?: ReactNode;
}

const avatarSizes = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

export function Avatar({ 
  src, 
  alt, 
  name, 
  size = 'md', 
  fallback,
  className,
  ...props 
}: AvatarProps) {
  const [hasError, setHasError] = useState(false);
  
  const initials = name
    ?.split(' ')
    .map(part => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center rounded-full bg-[var(--cosmos-accent-primary)]/20 text-[var(--cosmos-accent-primary)] font-bold overflow-hidden',
        avatarSizes[size],
        className
      )}
      {...props}
    >
      {src && !hasError ? (
        <img
          src={src}
          alt={alt || name || 'Avatar'}
          className="w-full h-full object-cover"
          onError={() => setHasError(true)}
        />
      ) : fallback ? (
        fallback
      ) : (
        <span>{initials || '?'}</span>
      )}
    </div>
  );
}

// ============================================================================
// Progress Component
// ============================================================================

interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'success' | 'warning' | 'danger';
  showValue?: boolean;
}

const progressSizes = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

const progressColors = {
  primary: 'bg-[var(--cosmos-accent-primary)]',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  danger: 'bg-red-500',
};

export function Progress({ 
  value, 
  max = 100, 
  size = 'md', 
  color = 'primary',
  showValue,
  className,
  ...props 
}: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn('w-full', className)} {...props}>
      <div 
        className={cn('w-full bg-white/10 rounded-full overflow-hidden', progressSizes[size])}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={cn('h-full rounded-full', progressColors[color])}
        />
      </div>
      {showValue && (
        <p className="mt-1 text-xs text-[var(--text-tertiary)] text-left">
          {Math.round(percentage)}%
        </p>
      )}
    </div>
  );
}

// ============================================================================
// Divider Component
// ============================================================================

interface DividerProps extends HTMLAttributes<HTMLHRElement> {
  orientation?: 'horizontal' | 'vertical';
  variant?: 'solid' | 'dashed' | 'dotted';
}

export function Divider({ 
  orientation = 'horizontal', 
  variant = 'solid',
  className,
  ...props 
}: DividerProps) {
  const variantClasses = {
    solid: 'border-solid',
    dashed: 'border-dashed',
    dotted: 'border-dotted',
  };

  if (orientation === 'vertical') {
    return (
      <div
        className={cn(
          'inline-block w-px self-stretch bg-[var(--border-primary)]',
          className
        )}
        role="separator"
        aria-orientation="vertical"
        {...props}
      />
    );
  }

  return (
    <hr
      className={cn(
        'w-full border-0 border-t border-[var(--border-primary)]',
        variantClasses[variant],
        className
      )}
      role="separator"
      {...props}
    />
  );
}

// ============================================================================
// Form Component
// ============================================================================

interface FormProps extends FormHTMLAttributes<HTMLFormElement> {
  onSubmitAsync?: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

export const Form = forwardRef<HTMLFormElement, FormProps>(
  ({ onSubmitAsync, onSubmit, children, ...props }, ref) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      if (onSubmitAsync) {
        e.preventDefault();
        setIsSubmitting(true);
        try {
          await onSubmitAsync(e);
        } finally {
          setIsSubmitting(false);
        }
      } else if (onSubmit) {
        onSubmit(e);
      }
    };

    return (
      <form ref={ref} onSubmit={handleSubmit} {...props}>
        {typeof children === 'function' 
          ? (children as (props: { isSubmitting: boolean }) => ReactNode)({ isSubmitting })
          : children
        }
      </form>
    );
  }
);

Form.displayName = 'Form';

// ============================================================================
// Select Component
// ============================================================================

interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface SelectProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: string;
  onChange?: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
}

export function Select({
  value,
  onChange,
  options,
  placeholder = 'בחר אפשרות...',
  label,
  error,
  disabled,
  className,
  ...props
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const generatedId = useId();

  const selectedOption = options.find(opt => opt.value === value);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        setIsOpen(!isOpen);
        break;
      case 'Escape':
        setIsOpen(false);
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          const currentIndex = options.findIndex(opt => opt.value === value);
          const nextIndex = Math.min(currentIndex + 1, options.length - 1);
          const nextOption = options[nextIndex];
          if (nextOption && !nextOption.disabled) {
            onChange?.(nextOption.value);
          }
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (isOpen) {
          const currentIndex = options.findIndex(opt => opt.value === value);
          const prevIndex = Math.max(currentIndex - 1, 0);
          const prevOption = options[prevIndex];
          if (prevOption && !prevOption.disabled) {
            onChange?.(prevOption.value);
          }
        }
        break;
    }
  };

  return (
    <div className={cn('w-full', className)} ref={containerRef} {...props}>
      {label && (
        <label 
          id={`${generatedId}-label`}
          className="block text-sm font-medium text-[var(--text-primary)] mb-2"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className={cn(
            'w-full flex items-center justify-between px-4 py-3 rounded-xl',
            'bg-[var(--bg-secondary)] border border-[var(--border-primary)]',
            'text-[var(--text-primary)] text-right',
            'focus:outline-none focus:ring-2 focus:ring-[var(--cosmos-accent-primary)]',
            'transition-all duration-200',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            error && 'border-red-500 focus:ring-red-500',
            isOpen && 'ring-2 ring-[var(--cosmos-accent-primary)]'
          )}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-labelledby={label ? `${generatedId}-label` : undefined}
        >
          <span className={cn(!selectedOption && 'text-[var(--text-tertiary)]')}>
            {selectedOption?.label || placeholder}
          </span>
          <svg 
            className={cn('w-5 h-5 text-[var(--text-tertiary)] transition-transform', isOpen && 'rotate-180')}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.ul
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className={cn(
                'absolute z-50 w-full mt-2 py-2',
                'bg-[var(--bg-card)] border border-[var(--border-primary)]',
                'rounded-xl shadow-2xl max-h-60 overflow-auto'
              )}
              role="listbox"
            >
              {options.map((option) => (
                <li
                  key={option.value}
                  onClick={() => {
                    if (!option.disabled) {
                      onChange?.(option.value);
                      setIsOpen(false);
                    }
                  }}
                  className={cn(
                    'px-4 py-2 cursor-pointer transition-colors',
                    'hover:bg-white/10',
                    option.value === value && 'bg-[var(--cosmos-accent-primary)]/20 text-[var(--cosmos-accent-primary)]',
                    option.disabled && 'opacity-50 cursor-not-allowed'
                  )}
                  role="option"
                  aria-selected={option.value === value}
                  aria-disabled={option.disabled}
                >
                  {option.label}
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-400" role="alert">{error}</p>
      )}
    </div>
  );
}

// ============================================================================
// Checkbox Component
// ============================================================================

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label?: string;
  description?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  indeterminate?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, checked, onChange, indeterminate, className, id, disabled, ...props }, ref) => {
    const generatedId = useId();
    const checkboxId = id || generatedId;
    const innerRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
      if (innerRef.current) {
        innerRef.current.indeterminate = indeterminate || false;
      }
    }, [indeterminate]);

    return (
      <label 
        htmlFor={checkboxId}
        className={cn(
          'flex items-start gap-3 cursor-pointer group',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
      >
        <div className="relative flex-shrink-0 mt-0.5">
          <input
            ref={(node) => {
              innerRef.current = node;
              if (typeof ref === 'function') ref(node);
              else if (ref) ref.current = node;
            }}
            type="checkbox"
            id={checkboxId}
            checked={checked}
            onChange={(e) => onChange?.(e.target.checked)}
            disabled={disabled}
            className="sr-only peer"
            {...props}
          />
          <div 
            className={cn(
              'w-5 h-5 rounded-md border-2 transition-all duration-200',
              'border-[var(--border-primary)] bg-transparent',
              'peer-focus:ring-2 peer-focus:ring-[var(--cosmos-accent-primary)] peer-focus:ring-offset-2 peer-focus:ring-offset-[var(--bg-primary)]',
              'peer-checked:bg-[var(--cosmos-accent-primary)] peer-checked:border-[var(--cosmos-accent-primary)]',
              'group-hover:border-[var(--cosmos-accent-primary)]'
            )}
          >
            <svg 
              className={cn(
                'w-full h-full text-black transition-opacity',
                checked ? 'opacity-100' : 'opacity-0'
              )}
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              strokeWidth={3}
            >
              {indeterminate ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              )}
            </svg>
          </div>
        </div>
        {(label || description) && (
          <div className="flex flex-col">
            {label && (
              <span className="text-[var(--text-primary)] font-medium">{label}</span>
            )}
            {description && (
              <span className="text-sm text-[var(--text-tertiary)]">{description}</span>
            )}
          </div>
        )}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';

// ============================================================================
// Switch Component
// ============================================================================

interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange' | 'size'> {
  label?: string;
  description?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  switchSize?: 'sm' | 'md' | 'lg';
}

const switchSizes = {
  sm: { track: 'w-8 h-4', thumb: 'w-3 h-3', translate: 'translate-x-4' },
  md: { track: 'w-11 h-6', thumb: 'w-5 h-5', translate: 'translate-x-5' },
  lg: { track: 'w-14 h-7', thumb: 'w-6 h-6', translate: 'translate-x-7' },
};

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ label, description, checked, onChange, switchSize = 'md', className, id, disabled, ...props }, ref) => {
    const generatedId = useId();
    const switchId = id || generatedId;

    return (
      <label 
        htmlFor={switchId}
        className={cn(
          'flex items-center justify-between gap-4 cursor-pointer group',
          disabled && 'opacity-50 cursor-not-allowed',
          className
        )}
      >
        {(label || description) && (
          <div className="flex flex-col">
            {label && (
              <span className="text-[var(--text-primary)] font-medium">{label}</span>
            )}
            {description && (
              <span className="text-sm text-[var(--text-tertiary)]">{description}</span>
            )}
          </div>
        )}
        <div className="relative flex-shrink-0">
          <input
            ref={ref}
            type="checkbox"
            id={switchId}
            checked={checked}
            onChange={(e) => onChange?.(e.target.checked)}
            disabled={disabled}
            className="sr-only peer"
            role="switch"
            aria-checked={checked}
            {...props}
          />
          <div 
            className={cn(
              'rounded-full transition-colors duration-200',
              'bg-white/20 peer-checked:bg-[var(--cosmos-accent-primary)]',
              'peer-focus:ring-2 peer-focus:ring-[var(--cosmos-accent-primary)] peer-focus:ring-offset-2 peer-focus:ring-offset-[var(--bg-primary)]',
              switchSizes[switchSize].track
            )}
          />
          <div 
            className={cn(
              'absolute top-0.5 start-0.5 rounded-full bg-white shadow-lg transition-transform duration-200',
              'peer-checked:bg-black',
              checked ? switchSizes[switchSize].translate : 'translate-x-0',
              switchSizes[switchSize].thumb
            )}
          />
        </div>
      </label>
    );
  }
);

Switch.displayName = 'Switch';

// ============================================================================
// Tooltip Component
// ============================================================================

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

const tooltipPositions = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 me-2',
  right: 'left-full top-1/2 -translate-y-1/2 ms-2',
};

const tooltipArrows = {
  top: 'top-full left-1/2 -translate-x-1/2 border-t-[var(--bg-card)] border-x-transparent border-b-transparent',
  bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-[var(--bg-card)] border-x-transparent border-t-transparent',
  left: 'left-full top-1/2 -translate-y-1/2 border-l-[var(--bg-card)] border-y-transparent border-r-transparent',
  right: 'right-full top-1/2 -translate-y-1/2 border-r-[var(--bg-card)] border-y-transparent border-l-transparent',
};

export function Tooltip({ 
  content, 
  children, 
  position = 'top',
  delay = 300 
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => setIsVisible(true), delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div 
      className="relative inline-flex"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.1 }}
            className={cn(
              'absolute z-50 px-3 py-2 rounded-lg',
              'bg-[var(--bg-card)] border border-[var(--border-primary)]',
              'text-sm text-[var(--text-primary)] shadow-xl',
              'whitespace-nowrap pointer-events-none',
              tooltipPositions[position]
            )}
            role="tooltip"
          >
            {content}
            <div 
              className={cn(
                'absolute w-0 h-0 border-4',
                tooltipArrows[position]
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================================================
// RadioGroup Component
// ============================================================================

interface RadioOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

interface RadioGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value?: string;
  onChange?: (value: string) => void;
  options: RadioOption[];
  name?: string;
  orientation?: 'horizontal' | 'vertical';
  label?: string;
}

export function RadioGroup({
  value,
  onChange,
  options,
  name,
  orientation = 'vertical',
  label,
  className,
  ...props
}: RadioGroupProps) {
  const generatedName = useId();
  const radioName = name || generatedName;

  return (
    <div 
      role="radiogroup" 
      aria-label={label}
      className={cn(
        'flex',
        orientation === 'vertical' ? 'flex-col gap-3' : 'flex-row flex-wrap gap-4',
        className
      )} 
      {...props}
    >
      {label && (
        <span className="text-sm font-medium text-[var(--text-primary)] mb-2 w-full">
          {label}
        </span>
      )}
      {options.map((option) => (
        <label
          key={option.value}
          className={cn(
            'flex items-start gap-3 cursor-pointer group',
            option.disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          <div className="relative flex-shrink-0 mt-0.5">
            <input
              type="radio"
              name={radioName}
              value={option.value}
              checked={value === option.value}
              onChange={() => onChange?.(option.value)}
              disabled={option.disabled}
              className="sr-only peer"
            />
            <div 
              className={cn(
                'w-5 h-5 rounded-full border-2 transition-all duration-200',
                'border-[var(--border-primary)] bg-transparent',
                'peer-focus:ring-2 peer-focus:ring-[var(--cosmos-accent-primary)] peer-focus:ring-offset-2 peer-focus:ring-offset-[var(--bg-primary)]',
                'peer-checked:border-[var(--cosmos-accent-primary)]',
                'group-hover:border-[var(--cosmos-accent-primary)]'
              )}
            >
              <div 
                className={cn(
                  'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
                  'w-2.5 h-2.5 rounded-full bg-[var(--cosmos-accent-primary)]',
                  'transition-transform duration-200',
                  value === option.value ? 'scale-100' : 'scale-0'
                )}
              />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[var(--text-primary)] font-medium">{option.label}</span>
            {option.description && (
              <span className="text-sm text-[var(--text-tertiary)]">{option.description}</span>
            )}
          </div>
        </label>
      ))}
    </div>
  );
}

// ============================================================================
// Tabs Component
// ============================================================================

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs() {
  const context = useContext(TabsContext);
  if (!context) throw new Error('Tabs components must be used within Tabs');
  return context;
}

interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  defaultTab?: string;
  value?: string;
  onTabChange?: (value: string) => void;
}

export function Tabs({ 
  children, 
  defaultTab, 
  value, 
  onTabChange,
  className,
  ...props 
}: TabsProps) {
  const [internalTab, setInternalTab] = useState(defaultTab || '');
  const activeTab = value !== undefined ? value : internalTab;
  
  const setActiveTab = (id: string) => {
    if (onTabChange) {
      onTabChange(id);
    } else {
      setInternalTab(id);
    }
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={cn('w-full', className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

interface TabListProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'pills' | 'underline';
}

Tabs.List = function TabList({ children, className, variant = 'default', ...props }: TabListProps) {
  const variantClasses = {
    default: 'bg-white/5 p-1 rounded-xl gap-1',
    pills: 'gap-2',
    underline: 'border-b border-[var(--border-primary)] gap-4',
  };

  return (
    <div 
      role="tablist"
      className={cn('flex', variantClasses[variant], className)}
      {...props}
    >
      {children}
    </div>
  );
};

interface TabTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

Tabs.Trigger = function TabTrigger({ value, children, className, ...props }: TabTriggerProps) {
  const { activeTab, setActiveTab } = useTabs();
  const isActive = activeTab === value;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={() => setActiveTab(value)}
      className={cn(
        'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-[var(--cosmos-accent-primary)]',
        isActive
          ? 'bg-[var(--cosmos-accent-primary)] text-black'
          : 'text-[var(--text-secondary)] hover:text-white hover:bg-white/10',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

interface TabContentProps {
  value: string;
  children: ReactNode;
  className?: string;
}

Tabs.Content = function TabContent({ value, children, className }: TabContentProps) {
  const { activeTab } = useTabs();
  
  if (activeTab !== value) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      role="tabpanel"
      className={cn('mt-4', className)}
    >
      {children}
    </motion.div>
  );
};

// ============================================================================
// Exports
// ============================================================================

export { cn };
