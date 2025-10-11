import { create } from 'zustand';

const useThemeStore = create((set) => ({
  theme: 'normal',
  // Cycle through themes: normal -> dark -> glow -> normal
  toggleTheme: () => set((state) => {
    const themes = ['normal', 'dark', 'glow'];
    const currentIndex = themes.indexOf(state.theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    return { theme: themes[nextIndex] };
  }),
  setTheme: (theme) => set({ theme }),
}));

export default useThemeStore;
