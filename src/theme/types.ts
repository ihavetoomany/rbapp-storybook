export type ResursPaletteColors = {
  mode: 'light' | 'dark';
  common: {
    black: string;
    white: string;
  };
  primary: {
    light: string;
    main: string;
    dark: string;
    contrastText: string;
    background: string;
  };
  secondary: {
    light: string;
    main: string;
    dark: string;
    contrastText: string;
  };
  info: {
    main: string;
    background: string;
    dark: string;
  };
  error: {
    light: string;
    main: string;
    dark: string;
  };
  background: {
    default: string;
    paper: string;
  };
  text: {
    primary: string;
    secondary: string;
  };
  divider: {
    main: string;
  };
  grey: Record<number, string> & {
    50: string;
    100: string;
    200: string;
    300: string;
  };
};
