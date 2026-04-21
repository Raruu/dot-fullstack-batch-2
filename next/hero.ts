// hero.ts
import { heroui } from "@heroui/react";

export default heroui({

  themes: {
    light: {
      colors: {
        background: "#f6fbf7",
        foreground: "#171b19",
        focus: "#00d26a",
        divider: "#e5e9e6",
        overlay: "#ffffff",
        primary: {
          DEFAULT: "#00d26a",
          foreground: "#002a11",
        },
        default: {
          DEFAULT: "#edf2ee",
          foreground: "#171b19",
        },
        success: {
          DEFAULT: "#18c962",
          foreground: "#171b19",
        },
        warning: {
          DEFAULT: "#f5a524",
          foreground: "#171b19",
        },
        danger: {
          DEFAULT: "#f31260",
          foreground: "#ffffff",
        },
      },
    },
    dark: {
      colors: {
        background: "#080b09",
        foreground: "#fbfdfc",
        focus: "#00d26a",
        divider: "#1d231f",
        overlay: "#171b19",
        primary: {
          DEFAULT: "#00d26a",
          foreground: "#002a11",
        },
        default: {
          DEFAULT: "#1f2521",
          foreground: "#ffffff",
        },
        success: {
          DEFAULT: "#18c962",
          foreground: "#171b19",
        },
        warning: {
          DEFAULT: "#f5a524",
          foreground: "#171b19",
        },
        danger: {
          DEFAULT: "#f31260",
          foreground: "#ffffff",
        },
      },
    },
  },
});
