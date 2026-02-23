import { useState, useEffect, useMemo, type ReactElement } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

// ── Types ───────────────────────────────────────────────────────────

export interface LogoDef {
  name: string;
  element: ReactElement;
  url?: string;
}


// ── Constants ───────────────────────────────────────────────────────

const SLOT_WIDTH = 240;
const SLOT_HEIGHT = 48;
const INITIAL_DELAY = 2500;
const SLOT_STAGGER = 150;
const CYCLE_INTERVAL = 3000;

// ── Hooks ───────────────────────────────────────────────────────────

/** Returns responsive slot count: 1 on mobile, 2 on tablet, 3 on desktop. */
function useSlotCount(): number {
  const [count, setCount] = useState(3);

  useEffect(() => {
    const mqMd = window.matchMedia("(min-width: 768px)");
    const mqLg = window.matchMedia("(min-width: 1024px)");

    const update = () => {
      if (mqLg.matches) setCount(5);
      else if (mqMd.matches) setCount(3);
      else setCount(3);
    };

    update();
    mqMd.addEventListener("change", update);
    mqLg.addEventListener("change", update);

    return () => {
      mqMd.removeEventListener("change", update);
      mqLg.removeEventListener("change", update);
    };
  }, []);

  return count;
}

/**
 * Cycles through a list of logos.
 * Pauses when the tab is hidden so staggered delays stay in sync on return.
 */
function useLogoCycle(
  logos: LogoDef[],
  initialDelay: number,
  enabled: boolean,
) {
  const [step, setStep] = useState(0);
  const current = logos[step % logos.length];

  useEffect(() => {
    if (!enabled) return;

    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let startedAt = 0;
    let remaining = step === 0 ? initialDelay : CYCLE_INTERVAL;

    const schedule = (delay: number) => {
      remaining = delay;
      startedAt = Date.now();
      timeoutId = setTimeout(() => setStep((s) => s + 1), delay);
    };

    const pause = () => {
      if (timeoutId != null) {
        clearTimeout(timeoutId);
        timeoutId = null;
        remaining = Math.max(0, remaining - (Date.now() - startedAt));
      }
    };

    const onVisibilityChange = () => {
      if (document.hidden) pause();
      else schedule(remaining);
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    if (!document.hidden) schedule(remaining);

    return () => {
      if (timeoutId != null) clearTimeout(timeoutId);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [enabled, step, initialDelay]);

  return { current, hasCycled: step > 0 };
}

// ── LogoSlot ────────────────────────────────────────────────────────

type CarouselVariant = "muted" | "dark";

const variantStyles: Record<CarouselVariant, { base: string; interactive: string }> = {
  muted: {
    base: "opacity-100",
    interactive: "transition-opacity duration-200 hover:opacity-60",
  },
  dark: {
    base: "opacity-100",
    interactive: "transition-opacity duration-200 opacity-80 hover:opacity-100",
  },
};

function LogoSlot({
  logos,
  slotIndex,
  enabled,
  disableLinks,
  variant = "muted",
}: {
  logos: LogoDef[];
  slotIndex: number;
  enabled: boolean;
  disableLinks?: boolean;
  variant?: CarouselVariant;
}) {
  const reducedMotion = useReducedMotion();
  const { current: logo, hasCycled } = useLogoCycle(
    logos,
    INITIAL_DELAY + slotIndex * SLOT_STAGGER,
    enabled,
  );

  const styles = variantStyles[variant];

  const iconEl = (
    <span
      aria-hidden={!disableLinks}
      className={cn(
        "flex items-center justify-center [&_svg]:w-8 [&_svg]:h-8 [&_svg]:fill-current",
        styles.base,
        !disableLinks && styles.interactive,
      )}
    >
      {logo.element}
    </span>
  );

  return (
    <div
      role="group"
      aria-roledescription="slide"
      aria-label={logo.name}
      className="overflow-hidden flex items-center justify-center"
      style={{
        width: SLOT_WIDTH,
        height: SLOT_HEIGHT + 40,
        marginBlock: -20,
      }}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={logo.name}
          initial={
            !hasCycled
              ? false
              : reducedMotion
                ? { opacity: 0 }
                : { y: 20, opacity: 0, filter: "blur(8px)" }
          }
          animate={
            reducedMotion
              ? { opacity: 1 }
              : { y: 0, opacity: 1, filter: "blur(0px)" }
          }
          exit={
            reducedMotion
              ? { opacity: 0 }
              : { y: -20, opacity: 0, filter: "blur(8px)" }
          }
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="flex items-center justify-center will-change-[filter] backface-hidden"
        >
          {disableLinks || !logo.url ? (
            iconEl
          ) : (
            <a
              href={`${logo.url}?ref=arc`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${logo.name} (opens in new tab)`}
            >
              {iconEl}
            </a>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ── LogoCarousel ────────────────────────────────────────────────────

export function LogoCarousel({
  className,
  disableLinks,
  variant = "muted",
  logos
}: {
  className?: string;
  disableLinks?: boolean;
  variant?: CarouselVariant;
  logos: LogoDef[];
}) {
  const slotCount = useSlotCount();

  const slotLogos = useMemo(
    () =>
      Array.from({ length: slotCount }, (_, slot) =>
        logos.filter((_, i) => i % slotCount === slot),
      ),
    [slotCount],
  );

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Skills"
      className={cn("flex items-center gap-4 w-full text-foreground", className)}
    >
      {slotLogos.map((logos, i) => (
        <LogoSlot
          key={i}
          logos={logos}
          slotIndex={i}
          enabled={true}
          disableLinks={disableLinks}
          variant={variant}
        />
      ))}
    </div>
  );
}
