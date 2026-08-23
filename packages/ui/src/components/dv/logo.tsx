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
        className={cn("block dark:hidden", className)}
      />
      <img
        src={dark}
        alt="Donve"
        className={cn("hidden dark:block", className)}
      />
    </>
  );
}
