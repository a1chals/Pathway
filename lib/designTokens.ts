// Design System Tokens for Pathway Heatmap

export const colors = {
  // Base colors (dark mode)
  bg: "#0B1220",
  panel: "rgba(18, 25, 41, 0.8)",
  stroke: "#1E2A44",
  muted: "#8A95AD",
  text: "#E7ECF6",
  
  // Industry accents (modern muted tones)
  consulting: "#18b57f",
  banking: "#2d9bf0",
  tech: "#6557f5",
  pevc: "#e89b2c",
  startup: "#eb4f7e",
  corporate: "#94A3B8",
  education: "#f3c62f",
  other: "#64748b",
} as const;

export const typography = {
  // Font family
  font: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  
  // Font sizes (px)
  size: {
    xs: "12px",
    sm: "14px",
    base: "16px",
    lg: "20px",
    xl: "24px",
    "2xl": "32px",
    "3xl": "40px",
  },
  
  // Font weights
  weight: {
    regular: 400,
    medium: 500,
    semibold: 600,
  },
} as const;

export const spacing = {
  // Spacing scale
  xs: "4px",
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "24px",
  "2xl": "32px",
} as const;

export const borderRadius = {
  sm: "4px",
  md: "8px",
  lg: "12px",
  xl: "16px",
  "2xl": "24px",
} as const;

export const motion = {
  // Durations (ms)
  fast: 150,
  medium: 220,
  slow: 280,
  verySlow: 360,
  
  // Easing
  easeOut: "cubic-bezier(0.16, 1, 0.3, 1)",
  spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
} as const;

export const shadows = {
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.15)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.2)",
  subtle: "0 2px 8px 0 rgba(0, 0, 0, 0.25)",
} as const;

// Helper function to get industry color
export function getIndustryColor(industry: string): string {
  const map: Record<string, string> = {
    Consulting: colors.consulting,
    Banking: colors.banking,
    Tech: colors.tech,
    "PE/VC": colors.pevc,
    Startup: colors.startup,
    Corporate: colors.corporate,
    Education: colors.education,
    Other: colors.other,
  };
  return map[industry] || colors.other;
}

// Helper for transition strings
export function transition(property: string = "all", duration: number = motion.medium): string {
  return `${property} ${duration}ms ${motion.easeOut}`;
}

