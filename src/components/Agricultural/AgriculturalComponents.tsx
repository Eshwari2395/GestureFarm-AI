import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { agriculturePalette, agricultureShadows } from '@/theme/agricultureTheme';

/**
 * Agricultural Card Component
 * Base component for displaying feature cards with agricultural styling
 */
export const AgriculturalCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'soil' | 'water' | 'harvest' | 'growth';
  padding?: 'sm' | 'md' | 'lg';
}> = ({ children, className, variant = 'default', padding = 'md' }) => {
  const variants = {
    default: 'bg-gradient-to-br from-green-50 to-emerald-50 border-l-4 border-green-400',
    soil: 'bg-gradient-to-br from-amber-50 to-orange-50 border-l-4 border-amber-400',
    water: 'bg-gradient-to-br from-blue-50 to-cyan-50 border-l-4 border-blue-400',
    harvest: 'bg-gradient-to-br from-orange-50 to-yellow-50 border-l-4 border-orange-400',
    growth: 'bg-gradient-to-br from-green-50 to-lime-50 border-l-4 border-lime-400',
  };

  const paddingMap = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  return (
    <div
      className={cn(
        'rounded-lg border border-green-100 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105',
        variants[variant],
        paddingMap[padding],
        className
      )}
    >
      {children}
    </div>
  );
};

/**
 * Agricultural Stat Component
 * Display metrics with agricultural styling
 */
export const AgriculturalStat: React.FC<{
  label: string;
  value: string | number;
  unit?: string;
  icon?: LucideIcon;
  trend?: 'up' | 'down' | 'stable';
  color?: 'green' | 'orange' | 'blue' | 'brown';
}> = ({ label, value, unit, icon: Icon, trend = 'stable', color = 'green' }) => {
  const colorMap = {
    green: 'bg-green-100 text-green-700 border-green-200',
    orange: 'bg-orange-100 text-orange-700 border-orange-200',
    blue: 'bg-blue-100 text-blue-700 border-blue-200',
    brown: 'bg-amber-100 text-amber-700 border-amber-200',
  };

  const trendIcons = {
    up: '📈',
    down: '📉',
    stable: '➡️',
  };

  return (
    <div className={cn('rounded-lg border p-4', colorMap[color])}>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium opacity-75">{label}</p>
        <span className="text-lg">{trendIcons[trend]}</span>
      </div>
      <div className="flex items-baseline gap-2">
        {Icon && <Icon className="w-5 h-5" />}
        <p className="text-2xl font-bold">{value}</p>
        {unit && <p className="text-sm opacity-75">{unit}</p>}
      </div>
    </div>
  );
};

/**
 * Agricultural Button Component
 */
export const AgriculturalButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'success' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  disabled?: boolean;
  className?: string;
  fullWidth?: boolean;
}> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  disabled = false,
  className,
  fullWidth = false,
}) => {
  const variants = {
    primary: 'bg-green-500 hover:bg-green-600 text-white',
    secondary: 'bg-orange-500 hover:bg-orange-600 text-white',
    tertiary: 'bg-blue-500 hover:bg-blue-600 text-white',
    success: 'bg-emerald-500 hover:bg-emerald-600 text-white',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
  };

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'rounded-lg font-semibold transition-all duration-200 active:scale-95',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none',
        'flex items-center gap-2 justify-center',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
    >
      {Icon && <Icon className="w-5 h-5" />}
      {children}
    </button>
  );
};

/**
 * Agricultural Progress Bar
 */
export const AgriculturalProgress: React.FC<{
  value: number;
  max: number;
  label?: string;
  color?: 'green' | 'orange' | 'blue' | 'brown';
  showPercentage?: boolean;
}> = ({ value, max, label, color = 'green', showPercentage = true }) => {
  const percentage = (value / max) * 100;

  const colorMap = {
    green: 'bg-green-500',
    orange: 'bg-orange-500',
    blue: 'bg-blue-500',
    brown: 'bg-amber-600',
  };

  return (
    <div className="w-full">
      {label && <p className="text-sm font-medium mb-2 text-gray-700">{label}</p>}
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-300', colorMap[color])}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      {showPercentage && <p className="text-xs text-gray-600 mt-1">{percentage.toFixed(1)}%</p>}
    </div>
  );
};

/**
 * Agricultural Alert Component
 */
export const AgriculturalAlert: React.FC<{
  children: React.ReactNode;
  type?: 'info' | 'success' | 'warning' | 'danger';
  title?: string;
  icon?: LucideIcon;
  dismissible?: boolean;
  onDismiss?: () => void;
}> = ({ children, type = 'info', title, icon: Icon, dismissible = false, onDismiss }) => {
  const [visible, setVisible] = React.useState(true);

  const typeMap = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-orange-50 border-orange-200 text-orange-800',
    danger: 'bg-red-50 border-red-200 text-red-800',
  };

  const iconColorMap = {
    info: 'text-blue-500',
    success: 'text-green-500',
    warning: 'text-orange-500',
    danger: 'text-red-500',
  };

  if (!visible) return null;

  const handleDismiss = () => {
    setVisible(false);
    onDismiss?.();
  };

  return (
    <div className={cn('rounded-lg border p-4 flex gap-3', typeMap[type])}>
      {Icon && <Icon className={cn('w-5 h-5 flex-shrink-0 mt-0.5', iconColorMap[type])} />}
      <div className="flex-1">
        {title && <p className="font-semibold mb-1">{title}</p>}
        <p className="text-sm">{children}</p>
      </div>
      {dismissible && (
        <button
          onClick={handleDismiss}
          className="text-gray-400 hover:text-gray-600 flex-shrink-0"
        >
          ✕
        </button>
      )}
    </div>
  );
};

/**
 * Agricultural Badge Component
 */
export const AgriculturalBadge: React.FC<{
  children: React.ReactNode;
  variant?: 'green' | 'orange' | 'blue' | 'brown' | 'red' | 'yellow';
  size?: 'sm' | 'md';
  icon?: LucideIcon;
}> = ({ children, variant = 'green', size = 'md', icon: Icon }) => {
  const variants = {
    green: 'bg-green-100 text-green-800',
    orange: 'bg-orange-100 text-orange-800',
    blue: 'bg-blue-100 text-blue-800',
    brown: 'bg-amber-100 text-amber-800',
    red: 'bg-red-100 text-red-800',
    yellow: 'bg-yellow-100 text-yellow-800',
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
  };

  return (
    <span className={cn('rounded-full font-medium inline-flex items-center gap-1', variants[variant], sizes[size])}>
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </span>
  );
};

/**
 * Agricultural Recommendation Card
 */
export const AgriculturalRecommendation: React.FC<{
  title: string;
  description: string;
  action?: string;
  icon?: LucideIcon;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  onAction?: () => void;
}> = ({ title, description, action, icon: Icon, priority = 'medium', onAction }) => {
  const priorityColors = {
    low: 'border-t-4 border-blue-400 bg-blue-50',
    medium: 'border-t-4 border-yellow-400 bg-yellow-50',
    high: 'border-t-4 border-orange-400 bg-orange-50',
    critical: 'border-t-4 border-red-400 bg-red-50',
  };

  const priorityBadgeColors = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-orange-100 text-orange-800',
    critical: 'bg-red-100 text-red-800',
  };

  return (
    <div className={cn('rounded-lg p-4 flex gap-3', priorityColors[priority])}>
      <div className="flex-shrink-0">
        {Icon && <Icon className="w-6 h-6" />}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-semibold text-gray-900">{title}</h4>
          <span className={cn('text-xs font-semibold px-2 py-1 rounded', priorityBadgeColors[priority])}>
            {priority.toUpperCase()}
          </span>
        </div>
        <p className="text-sm text-gray-700 mb-3">{description}</p>
        {action && onAction && (
          <button
            onClick={onAction}
            className="text-sm font-semibold text-green-600 hover:text-green-700 underline"
          >
            {action} →
          </button>
        )}
      </div>
    </div>
  );
};

/**
 * Agricultural Grid Layout
 */
export const AgriculturalGrid: React.FC<{
  children: React.ReactNode;
  columns?: number;
  gap?: 'sm' | 'md' | 'lg';
}> = ({ children, columns = 2, gap = 'md' }) => {
  const gapMap = {
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6',
  };

  return (
    <div
      className={cn('grid', gapMap[gap])}
      style={{
        gridTemplateColumns: `repeat(auto-fit, minmax(${columns > 2 ? '280px' : '300px'}, 1fr))`,
      }}
    >
      {children}
    </div>
  );
};

/**
 * Agricultural Hero Section
 */
export const AgriculturalHero: React.FC<{
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  backgroundVariant?: 'soil' | 'water' | 'growth' | 'harvest';
  children?: React.ReactNode;
}> = ({ title, subtitle, icon: Icon, backgroundVariant = 'growth', children }) => {
  const bgVariants = {
    soil: 'bg-gradient-to-br from-amber-500 via-orange-400 to-red-500',
    water: 'bg-gradient-to-br from-blue-500 via-cyan-400 to-teal-500',
    growth: 'bg-gradient-to-br from-green-500 via-emerald-400 to-teal-500',
    harvest: 'bg-gradient-to-br from-orange-500 via-yellow-400 to-amber-500',
  };

  return (
    <div className={cn('rounded-2xl text-white p-8 md:p-12 relative overflow-hidden', bgVariants[backgroundVariant])}>
      {/* Decorative background patterns */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-4">
          {Icon && <Icon className="w-12 h-12" />}
          <h1 className="text-4xl md:text-5xl font-bold">{title}</h1>
        </div>
        {subtitle && <p className="text-lg md:text-xl opacity-90 mb-6">{subtitle}</p>}
        {children}
      </div>
    </div>
  );
};

export default {
  AgriculturalCard,
  AgriculturalStat,
  AgriculturalButton,
  AgriculturalProgress,
  AgriculturalAlert,
  AgriculturalBadge,
  AgriculturalRecommendation,
  AgriculturalGrid,
  AgriculturalHero,
};
