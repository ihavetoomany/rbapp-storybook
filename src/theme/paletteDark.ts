// https://www.figma.com/file/4JXWPc3GzmGYy2T0495nRY/Design-System-My-Pages?node-id=1%3A156
export const paletteDark = {
  mode: 'dark' as const,
  transparent: 'transparent',
  common: {
    black: '#000000',
    white: '#ffffff',
    transparent: 'transparent',
  },
  primary: {
    light: '#C0DED4',
    main: '#ABD3C6',
    dark: '#93B6AF',
    contrastText: '#000000',
    background: '#151A19',
  },
  secondary: {
    light: '#FBF8F5',
    main: '#F7F0EB',
    dark: '#E1D8D8',
    contrastText: '#000000',
  },
  success: {
    light: '#B4FBB2',
    main: '#78DC77',
    dark: '#005313',
  },
  info: {
    light: '#0084D1',
    main: '#0069A8',
    dark: '#00598A',
    background: '#B8E6FE',
  },
  warning: {
    light: '#FFDDB0',
    main: '#FFB961',
    dark: '#663E00',
  },
  error: {
    light: '#FFDAD9',
    main: '#FB8B8C',
    dark: '#7E2A2E',
  },
  background: {
    default: '#2C2C2B',
    paper: '#393838',
  },
  text: {
    primary: '#ffffff',
    secondary: '#FFFFFFB2',
  },
  divider: {
    main: '#495057',
  },
  tabs: {
    container: '#343A40',
    selected: '#687078',
  },
  grey: {
    50: '#171717',
    100: '#262626',
    200: '#404040',
    300: '#525252',
    400: '#737373',
    500: '#A1A1A1',
    600: '#D4D4D4',
    700: '#E5E5E5',
    800: '#F5F5F5',
    900: '#FAFAFA',
  },
  chip: {
    light: '#00524F',
    dark: '#BFDFDE',
  },
} as const;
