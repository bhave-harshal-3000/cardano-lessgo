// Receipt-themed styling for all pages
export const receiptTheme = {
  // Page wrapper styles
  pageWrapper: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #fafaf8 0%, #f0f0ea 100%)',
    fontFamily: "'Courier Prime', 'Courier New', Courier, monospace",
    position: 'relative' as const,
    color: '#000000',
  },
  
  // Paper texture overlay
  paperTexture: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      repeating-linear-gradient(
        0deg,
        rgba(0,0,0,0.02) 0px,
        transparent 1px,
        transparent 2px,
        rgba(0,0,0,0.02) 3px
      )
    `,
    pointerEvents: 'none' as const,
    zIndex: 1,
  },

  // Override CSS variables for receipt theme
  cssVariables: {
    '--color-primary': '#000000',
    '--color-secondary': '#333333',
    '--color-accent': '#000000',
    '--color-background': '#fafaf8',
    '--color-surface': 'rgba(255,255,255,0.6)',
    '--color-border': 'rgba(0,0,0,0.1)',
    '--color-text': '#000000',
    '--color-text-primary': '#000000',
    '--color-text-secondary': '#333333',
    '--color-success': '#000000',
    '--color-warning': '#000000',
    '--color-danger': '#000000',
  } as React.CSSProperties,
};
