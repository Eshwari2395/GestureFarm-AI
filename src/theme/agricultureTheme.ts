/**
 * Agricultural Theme Configuration
 * Inspired by nature, soil, crops, and farming
 */

export const agriculturePalette = {
  // Primary Colors - Earth & Growth
  primary: {
    light: '#E8F5E9', // Light green background
    main: '#4CAF50', // Main green
    dark: '#2E7D32', // Deep forest green
    darker: '#1B5E20', // Very dark green
  },
  
  // Secondary Colors - Soil & Harvest
  secondary: {
    light: '#FFF3E0', // Light orange background
    main: '#FF9800', // Harvest orange
    dark: '#E65100', // Dark orange
    darker: '#BF360C', // Deep harvest
  },
  
  // Tertiary Colors - Water
  tertiary: {
    light: '#E1F5FE', // Light blue background
    main: '#03A9F4', // Water blue
    dark: '#01579B', // Deep blue
    darker: '#004374', // Very dark blue
  },
  
  // Status Colors
  success: '#4CAF50', // Green
  warning: '#FFC107', // Amber
  danger: '#F44336', // Red
  info: '#03A9F4', // Blue
  
  // Neutral Colors
  neutral: {
    50: '#FAFAF9',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  
  // Soil tones
  soil: {
    light: '#D7CCC8', // Light sand
    main: '#A1887F', // Soil brown
    dark: '#6D4C41', // Dark soil
  },
  
  // Seasonal colors
  seasonal: {
    monsoon: '#4A90E2', // Rainy season blue
    harvest: '#FF8C00', // Autumn orange
    sowing: '#7CB342', // Spring green
    fallow: '#A1887F', // Rest brown
  },
};

export const agricultureTypography = {
  fontFamily: {
    primary: '"Poppins", "Segoe UI", sans-serif',
    secondary: '"Inter", "Roboto", sans-serif',
    mono: '"JetBrains Mono", "Courier New", monospace',
  },
  
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
  },
  
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  
  lineHeight: {
    tight: 1.2,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
};

export const agricultureSpacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '2.5rem',
  '3xl': '3rem',
  '4xl': '4rem',
};

export const agricultureShadows = {
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  
  // Custom agricultural shadows
  'nature': '0 10px 30px -10px rgba(76, 175, 80, 0.3)',
  'soil': '0 8px 20px -8px rgba(161, 136, 127, 0.3)',
  'water': '0 12px 25px -10px rgba(3, 169, 244, 0.3)',
};

export const agricultureBorderRadius = {
  none: '0',
  xs: '0.25rem',
  sm: '0.375rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  '2xl': '1.5rem',
  '3xl': '2rem',
  full: '9999px',
  
  // Organic shapes for agriculture
  'organic-sm': '25% 35% 30% 40% / 35% 25% 40% 30%',
  'organic-md': '30% 35% 35% 30% / 25% 30% 35% 40%',
  'organic-lg': '35% 40% 30% 35% / 30% 35% 35% 30%',
};

export const agricultureTransitions = {
  fast: '150ms ease-in-out',
  base: '200ms ease-in-out',
  slow: '300ms ease-in-out',
  slower: '500ms ease-in-out',
};

// CSS Variables for easy theming
export const agricultureCSSVariables = `
  :root {
    /* Primary Colors */
    --color-primary-light: ${agriculturePalette.primary.light};
    --color-primary: ${agriculturePalette.primary.main};
    --color-primary-dark: ${agriculturePalette.primary.dark};
    
    /* Secondary Colors */
    --color-secondary-light: ${agriculturePalette.secondary.light};
    --color-secondary: ${agriculturePalette.secondary.main};
    --color-secondary-dark: ${agriculturePalette.secondary.dark};
    
    /* Tertiary Colors */
    --color-tertiary-light: ${agriculturePalette.tertiary.light};
    --color-tertiary: ${agriculturePalette.tertiary.main};
    --color-tertiary-dark: ${agriculturePalette.tertiary.dark};
    
    /* Status Colors */
    --color-success: ${agriculturePalette.success};
    --color-warning: ${agriculturePalette.warning};
    --color-danger: ${agriculturePalette.danger};
    --color-info: ${agriculturePalette.info};
    
    /* Neutral Colors */
    --color-neutral-50: ${agriculturePalette.neutral[50]};
    --color-neutral-900: ${agriculturePalette.neutral[900]};
    
    /* Soil Colors */
    --color-soil-light: ${agriculturePalette.soil.light};
    --color-soil: ${agriculturePalette.soil.main};
    --color-soil-dark: ${agriculturePalette.soil.dark};
    
    /* Fonts */
    --font-primary: ${agricultureTypography.fontFamily.primary};
    --font-secondary: ${agricultureTypography.fontFamily.secondary};
    --font-mono: ${agricultureTypography.fontFamily.mono};
    
    /* Spacing */
    --spacing-sm: ${agricultureSpacing.sm};
    --spacing-md: ${agricultureSpacing.md};
    --spacing-lg: ${agricultureSpacing.lg};
    --spacing-xl: ${agricultureSpacing.xl};
  }
`;

export default {
  palette: agriculturePalette,
  typography: agricultureTypography,
  spacing: agricultureSpacing,
  shadows: agricultureShadows,
  borderRadius: agricultureBorderRadius,
  transitions: agricultureTransitions,
};
