import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("chat-theme") || "coffee",
  setTheme: (theme) => {
    console.log("Switching theme to:", theme); // ✅ Debugging log
    localStorage.setItem("chat-theme", theme);
    document.documentElement.setAttribute("data-theme", theme); // ✅ Apply theme globally
    set({ theme });
  },
}));  
