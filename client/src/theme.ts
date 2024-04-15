export const tokens = {
  grey: {
    100: "#f0f0f3",
    200: "#e1e2e7",
    300: "#d1d3da",
    400: "#c2c5ce",
    500: "#b3b6c2",
    600: "#8f929b",
    700: "#6b6d74",
    800: "#48494e",
    900: "#242427",
  },
  primary: {
    100: "#cceeff",  // Very light blue
    200: "#99ddff",  // Light blue
    300: "#66ccff",  // Medium blue
    400: "#33bbff",  // Bright blue
    500: "#00aaff",  // Main primary color - vibrant blue
    600: "#0088cc",  // Slightly darker blue
    700: "#006699",  // Dark blue
    800: "#004466",  // Very dark blue
    900: "#002233",  // Nearly black blue
  },
  
  
  
  
  
  secondary: {
    100: "#e6f9f1",  // Very light mint green
    200: "#ccf3e3",  // Light mint green
    300: "#b3edd6",  // Medium mint green
    400: "#99e7c8",  // Bright mint green
    500: "#80e1ba",  // Main secondary color - vibrant mint green
    600: "#66b592",  // Slightly darker mint green
    700: "#4d886a",  // Dark mint green
    800: "#335b42",  // Very dark mint green
    900: "#1a2d21",  // Nearly black mint green
  },
  
  
  tertiary: {
    // purple
    500: "#ccB480",
  },
  background: {
    light: "#2d2d34",
    main: "#1f2026",
  },
};

// mui theme settings
export const themeSettings = {
  palette: {
    primary: {
      ...tokens.primary,
      main: tokens.primary[500],
      light: tokens.primary[400],
    },
    secondary: {
      ...tokens.secondary,
      main: tokens.secondary[500],
    },
    tertiary: {
      ...tokens.tertiary,
    },
    grey: {
      ...tokens.grey,
      main: tokens.grey[500],
    },
    background: {
      default: tokens.background.main,
      light: tokens.background.light,
    },
  },
  typography: {
    fontFamily: ["Inter", "sans-serif"].join(","),
    fontSize: 12,
    h1: {
      fontFamily: ["Inter", "sans-serif"].join(","),
      fontSize: 32,
    },
    h2: {
      fontFamily: ["Inter", "sans-serif"].join(","),
      fontSize: 24,
    },
    h3: {
      fontFamily: ["Inter", "sans-serif"].join(","),
      fontSize: 20,
      fontWeight: 800,
      color: tokens.grey[200],
    },
    h4: {
      fontFamily: ["Inter", "sans-serif"].join(","),
      fontSize: 14,
      fontWeight: 600,
      color: tokens.grey[300],
    },
    h5: {
      fontFamily: ["Inter", "sans-serif"].join(","),
      fontSize: 12,
      fontWeight: 400,
      color: tokens.grey[500],
    },
    h6: {
      fontFamily: ["Inter", "sans-serif"].join(","),
      fontSize: 10,
      color: tokens.grey[700],
    },
  },
};
