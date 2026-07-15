export function useFonts(_fonts: Record<string, unknown>) {
  return [true, null] as const;
}

export function isLoaded() {
  return true;
}

export const Font = {
  loadAsync: async () => undefined,
  renderToImageAsync: async () => ({}),
};
