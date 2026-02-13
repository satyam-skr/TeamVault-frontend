/**
 * Layout Constants
 * Consistent spacing and layout values across the app
 */

export const LAYOUT = {
  // Container widths
  container: {
    sm: 'max-w-4xl',
    md: 'max-w-5xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full',
  },
  
  // Spacing scale (using Tailwind)
  spacing: {
    xs: 'p-2',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-12',
  },
  
  // Gaps
  gap: {
    xs: 'gap-2',
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-12',
  },
  
  // Heights
  navbar: 'h-16',
  sidebar: 'w-64',
} as const;

export const SPACING = {
  section: 'space-y-8',
  card: 'p-6',
  form: 'space-y-4',
  list: 'space-y-3',
} as const;
