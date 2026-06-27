// https://www.figma.com/file/4JXWPc3GzmGYy2T0495nRY/Design-System-My-Pages?node-id=1%3A156
export const paletteLight = {
  mode: 'light' as const,
  transparent: 'transparent',
  common: {
    black: '#000000',
    white: '#ffffff',
    transparent: 'transparent',
  },
  primary: {
    light: '#3B817A',
    main: '#117069',
    dark: '#0C5D57',
    contrastText: '#ffffff',
    background: '#E3ECEB',
  },
  secondary: {
    light: '#414140',
    main: '#2C2C2B',
    dark: '#161616',
    contrastText: '#FFFFFF',
  },
  success: {
    light: '#C2E2C4',
    main: '#228830',
    dark: '#006E1D',
  },
  info: {
    light: '#0084D1',
    main: '#0069A8',
    dark: '#00598A',
    background: '#B8E6FE',
  },
  warning: {
    light: '#FFDF9E',
    main: '#FABD00',
    dark: '#785900',
  },
  error: {
    light: '#FFDAD9',
    main: '#BA1A19',
    dark: '#7E2A2E',
  },
  background: {
    default: '#F5F5F5',
    paper: '#ffffff',
  },
  text: {
    primary: '#000000',
    secondary: '#212529',
  },
  divider: {
    main: '#BCBBC0',
  },
  tabs: {
    container: '#E9ECEF',
    selected: '#ffffff',
  },
  grey: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A1A1A1',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
  chip: {
    light: '#BFDFDE',
    dark: '#00524F',
  },
} as const;
