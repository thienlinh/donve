import lockupDark from "#assets/brand/lockup-dark.png";
import lockupLight from "#assets/brand/lockup-light.png";
import mark from "#assets/brand/mark.png";
import wordmarkDark from "#assets/brand/wordmark-dark.png";
import wordmarkLight from "#assets/brand/wordmark-light.png";
import { cn } from "#lib/utils";

const variants = {
  /** Icon mark only — square, works at small sizes (collapsed sidebar, favicons). */
  mark: { light: mark, dark: mark },
  /** Icon + wordmark lockup — the default full logo. */
  full: { light: lockupLight, dark: lockupDark },
  /** Wordmark only, no icon. */
  wordmark: { light: wordmarkLight, dark: wordmarkDark }
} as const;

// The dark lockup's baked-in icon/wordmark proportions sit smaller inside its
// crop than the light lockup's do, so at equal CSS height the dark wordmark
// reads visibly smaller. Scale it up (from its own top-left, matching where
// the icon sits in both crops) to match apparent text size.
const darkScaleFix: Partial<Record<keyof typeof variants, string>> = {
  full: "dark:origin-top-left dark:scale-[1.11]"
};

export function Logo({
  variant = "full",
  className
}: {
  variant?: keyof typeof variants;
  className?: string;
}) {
  const { light, dark } = variants[variant];
  return (
    <>
      <img
        src={light}
        alt="Donve"
        className={cn(
          "block object-contain object-left dark:hidden",
          className
        )}
      />
      <img
        src={dark}
        alt="Donve"
        className={cn(
          "hidden object-contain object-left dark:block",
          darkScaleFix[variant],
          className
        )}
      />
    </>
  );
}
