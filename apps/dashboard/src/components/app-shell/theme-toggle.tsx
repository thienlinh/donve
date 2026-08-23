import { Button } from "@dv/ui/components/shadcn/button";
import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/components/theme-provider";
import * as m from "@/paraglide/messages.js";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={
        isDark ? m.shellThemeToggleToLight() : m.shellThemeToggleToDark()
      }
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <Sun /> : <Moon />}
    </Button>
  );
}
