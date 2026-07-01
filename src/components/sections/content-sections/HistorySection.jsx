"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";

function getButtonDetails(button = {}) {
  const link = button.button_link;

  if (typeof link === "string") {
    return {
      href: link || "#",
      label: button.button_label || "",
      target: button.button_target || undefined,
    };
  }

  return {
    href: link?.url || "#",
    label: button.button_label || link?.title || "",
    target: button.button_target || link?.target || undefined,
  };
}

function wrapIndex(index, length) {
  return ((index % length) + length) % length;
}

function getArcPosition(relative, isMobile) {
  const angleStep = 30;
  const radiusX = isMobile ? 1120 : 500;
  const radiusY = isMobile ? 140 : 550;
  const angle = (relative * angleStep * Math.PI) / 180;
  const x = 600 + Math.sin(angle) * radiusX;
  const y = 30 + (1 - Math.cos(angle)) * radiusY;
  const tangent = Math.atan2(
    radiusY * Math.sin(angle),
    radiusX * Math.cos(angle)
  );

  return {
    left: `${(x / 1200) * 100}%`,
    top: `${(y / 420) * 100}%`,
    rotate: `${isMobile ? relative * 14 : tangent * (180 / Math.PI)}deg`,
  };
}

function TimelineYear({
  activePosition,
  item,
  virtualIndex,
  activeIndex,
  onSelect,
  isMobile,
}) {
  const relativePosition = useTransform(
    activePosition,
    (current) => virtualIndex - current
  );
  const left = useTransform(
    relativePosition,
    (relative) => getArcPosition(relative, isMobile).left
  );
  const top = useTransform(
    relativePosition,
    (relative) => getArcPosition(relative, isMobile).top
  );
  const rotate = useTransform(
    relativePosition,
    (relative) => getArcPosition(relative, isMobile).rotate
  );
  const scale = useTransform(relativePosition, (relative) =>
    Math.max(0.64, 1.22 - Math.abs(relative) * 0.17)
  );
  const opacity = useTransform(relativePosition, (relative) => {
    const distance = Math.abs(relative);
    if (distance <= 1) return 1 - distance * 0.08;
    if (distance <= 2) return 0.92 - (distance - 1) * 0.27;
    if (distance <= 3) return 0.65 - (distance - 2) * 0.48;
    return Math.max(0, 0.17 - (distance - 3) * 0.34);
  });
  const zIndex = useTransform(relativePosition, (relative) =>
    Math.max(1, 20 - Math.round(Math.abs(relative) * 5))
  );
  const isActive = virtualIndex === activeIndex;

  return (
    <motion.button
      type="button"
      aria-label={`Show history for ${item?.year || "timeline item"}`}
      aria-current={isActive ? "step" : undefined}
      onPointerDown={(event) => event.stopPropagation()}
      onClick={() => onSelect(virtualIndex)}
      style={{ left, top, rotate, scale, opacity, zIndex }}
      className="group absolute h-[84px] w-[112px] -translate-x-1/2 -translate-y-1/2 whitespace-nowrap will-change-transform md:h-[96px] md:w-[130px]"
    >
      <span
        className={`font-heading absolute bottom-[calc(50%+15px)] left-1/2 -translate-x-1/2 text-[28px] font-medium leading-none tracking-[-0.5px] transition-colors duration-300 md:bottom-[calc(50%+18px)] md:text-[40px] md:tracking-[-0.6px] ${
          isActive
            ? "text-[var(--color-accent)]"
            : "text-[#000000]"
        }`}
      >
        {item?.year}
      </span>

      <span
        className={`absolute left-1/2 top-1/2 block h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform duration-300 group-hover:scale-150 ${
          isActive
            ? "bg-[var(--color-accent)]"
            : "bg-[#000000]"
        }`}
      />
    </motion.button>
  );
}

export default function HistorySection({ data }) {
  const items = useMemo(
    () => (Array.isArray(data?.history_items) ? data.history_items : []),
    [data]
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const activePosition = useMotionValue(0);
  const prefersReducedMotion = useReducedMotion();
  const dragState = useRef(null);
  const arcFadeId = useId().replaceAll(":", "");

  const {
    text_above_title,
    hero_title,
    hero_description,
    button_row = [],
    background_color,
    custom_class,
    custom_id,
  } = data || {};

  const activeItem = items[wrapIndex(activeIndex, items.length)] || {};
  const sectionBackground = background_color || "#F1F1F3";
  const visibleItemCount = isMobile ? 3 : 5;
  const visibleItemOffset = Math.floor(visibleItemCount / 2);
  const virtualItems = useMemo(
    () =>
      Array.from({ length: visibleItemCount }, (_, position) => {
        const virtualIndex = activeIndex + position - visibleItemOffset;

        return {
          item: items[wrapIndex(virtualIndex, items.length)],
          virtualIndex,
        };
      }),
    [activeIndex, items, visibleItemCount, visibleItemOffset]
  );

  useEffect(() => {
    const controls = animate(activePosition, activeIndex, {
      duration: prefersReducedMotion ? 0 : 0.85,
      ease: [0.22, 1, 0.36, 1],
    });

    return () => controls.stop();
  }, [activeIndex, activePosition, prefersReducedMotion]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const updateViewport = () => setIsMobile(mediaQuery.matches);

    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);

    return () => mediaQuery.removeEventListener("change", updateViewport);
  }, []);

  if (!data) return null;

  function moveTo(nextIndex) {
    if (items.length < 2) return;

    setDirection(nextIndex >= activeIndex ? 1 : -1);
    setActiveIndex(nextIndex);
  }

  function moveBy(amount) {
    moveTo(activeIndex + amount);
  }

  function handleKeyDown(event) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveBy(-1);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      moveBy(1);
    }
  }

  function handlePointerDown(event) {
    dragState.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startPosition: activePosition.get(),
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event) {
    if (!dragState.current) return;

    const distance = event.clientX - dragState.current.startX;
    activePosition.set(dragState.current.startPosition - distance / 180);
  }

  function handlePointerUp(event) {
    if (!dragState.current) return;

    const targetIndex = Math.round(activePosition.get());
    dragState.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);

    if (targetIndex === activeIndex) {
      animate(activePosition, activeIndex, {
        duration: prefersReducedMotion ? 0 : 0.45,
        ease: [0.22, 1, 0.36, 1],
      });
      return;
    }

    moveTo(targetIndex);
  }

  return (
    <section
      id={custom_id || undefined}
      className={`relative overflow-hidden bg-[#F1F1F3] ${custom_class || ""}`}
      style={{ backgroundColor: sectionBackground }}
    >
      <div className="web-width relative px-4 pt-12 pb-0 sm:px-6 md:py-20">
        <div className="mb-2 flex flex-col gap-6 md:mb-5 lg:mb-7 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-190">
            {text_above_title && (
              <div className="mb-6 flex items-center gap-2">
                <span className="h-4 w-0.5 bg-[var(--color-yellow)]" />
                <p className="font-body text-[14px] font-medium uppercase leading-[24px] tracking-[0.56px] text-[#000000]">
                  {text_above_title}
                </p>
              </div>
            )}

            {hero_title && (
              <h2
                className="font-heading text-[36px] font-normal leading-[42px] tracking-[-0.72px] text-black md:text-[52px] md:leading-[60px] md:tracking-[-1.04px]"
                dangerouslySetInnerHTML={{ __html: hero_title }}
              />
            )}

            {hero_description && (
              <div
                className="mt-6 max-w-[650px] font-body text-[16px] font-normal leading-[24px] text-[#000000]"
                dangerouslySetInnerHTML={{ __html: hero_description }}
              />
            )}
          </div>

          {button_row?.length > 0 && (
            <div className="flex flex-wrap gap-4 lg:pb-2">
              {button_row.map((button, index) => {
                const { href, label, target } = getButtonDetails(button);
                if (!label) return null;

                return (
                  <Link
                    key={index}
                    href={href}
                    target={target}
                    className="group inline-flex items-center gap-4 rounded-[4px] bg-[image:var(--mpp-gradient)] py-[6px] pr-[6px] pl-6 font-heading text-[14px] font-normal tracking-[-0.28px] text-white transition-opacity hover:opacity-90"
                  >
                    <span>{label}</span>
                    <Image
                      src="/black-white-arrow.svg"
                      alt=""
                      width={40}
                      height={40}
                      className="h-auto w-[40px] object-contain transition-transform"
                    />
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div
            role="region"
            aria-label="History timeline"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            className="mt-[60px] outline-none md:mt-[100px]"
          >
            <div
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerCancel={() => {
                dragState.current = null;
                animate(activePosition, activeIndex, {
                  duration: prefersReducedMotion ? 0 : 0.45,
                  ease: [0.22, 1, 0.36, 1],
                });
              }}
              onPointerUp={handlePointerUp}
              className="relative left-1/2 h-[420px] w-screen max-w-[1680px] -translate-x-1/2 cursor-grab select-none touch-pan-y active:cursor-grabbing md:h-[440px] md:w-[calc(100vw-16px)]"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 1200 420"
                preserveAspectRatio="none"
                className="absolute inset-0 h-full w-full overflow-visible text-black/30"
              >
                <defs>
                  <linearGradient id={arcFadeId} x1="0%" x2="100%" y1="0%" y2="0%">
                    <stop offset="0%" stopColor="white" stopOpacity="0" />
                    <stop offset="12%" stopColor="white" stopOpacity="0.45" />
                    <stop offset="23%" stopColor="white" stopOpacity="1" />
                    <stop offset="77%" stopColor="white" stopOpacity="1" />
                    <stop offset="88%" stopColor="white" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="white" stopOpacity="0" />
                  </linearGradient>
                  <mask id={`${arcFadeId}-mask`}>
                    <rect
                      x="0"
                      y="0"
                      width="1200"
                      height="420"
                      fill={`url(#${arcFadeId})`}
                    />
                  </mask>
                </defs>
                <path
                  d={isMobile
                    ? "M 0 52 A 1120 140 0 0 1 1200 52"
                    : "M 130 392 A 500 550 0 0 1 1070 392"}
                  fill="none"
                  mask={`url(#${arcFadeId}-mask)`}
                  stroke="currentColor"
                  strokeDasharray="2 9"
                  strokeLinecap="round"
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>

              {virtualItems.map(({ item, virtualIndex }) => (
                <TimelineYear
                  key={`${isMobile ? "mobile" : "desktop"}-${virtualIndex}`}
                  activePosition={activePosition}
                  item={item}
                  virtualIndex={virtualIndex}
                  activeIndex={activeIndex}
                  onSelect={moveTo}
                  isMobile={isMobile}
                />
              ))}

              <svg
                aria-hidden="true"
                viewBox="0 0 2 100"
                preserveAspectRatio="none"
                className="absolute left-1/2 top-[44px] h-[100px] w-0.5 -translate-x-1/2 overflow-visible text-black/30 md:top-[50px]"
              >
                <line
                  x1="1"
                  y1="0"
                  x2="1"
                  y2="100"
                  stroke="currentColor"
                  strokeDasharray="2 9"
                  strokeLinecap="round"
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>

              <div className="pointer-events-none absolute inset-x-[5%] top-[31%] z-20 mx-auto max-w-190 px-2 text-center md:inset-x-[20%] md:top-[40%] md:px-8">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={activeIndex}
                    aria-live="polite"
                    initial={{
                      opacity: 0,
                      y: 14,
                      x: prefersReducedMotion ? 0 : direction * 18,
                    }}
                    animate={{ opacity: 1, y: 0, x: 0 }}
                    exit={{
                      opacity: 0,
                      y: -8,
                      x: prefersReducedMotion ? 0 : direction * -12,
                    }}
                    transition={{
                      duration: prefersReducedMotion ? 0 : 0.38,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="mx-auto max-w-155"
                  >
                    {activeItem?.title && (
                      <h3 className="mb-2 font-heading text-[21px] font-medium leading-[27px] tracking-[-0.42px] text-black md:mb-3 md:text-[30px] md:leading-[36px]">
                        {activeItem.title}
                      </h3>
                    )}

                    {activeItem?.description && (
                      <div
                        className="font-body space-y-2 text-[13px] font-semibold leading-[18px] text-[#000000] md:space-y-3 md:text-[16px] md:font-normal md:leading-[24px]"
                        dangerouslySetInnerHTML={{ __html: activeItem.description }}
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

            </div>
          </div>
        )}
      </div>
    </section>
  );
}
