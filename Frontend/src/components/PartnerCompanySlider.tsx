import {
  useCallback,
  useEffect,
  useRef,
  type CSSProperties,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from 'react';
import SectionHeader from './SectionHeader';
import './PartnerCompanySlider.css';

export interface PartnerCompany {
  id?: string;
  name: string;
  logo?: string;
  website?: string;
  logoAlt?: string;
}

interface PartnerCompanySliderProps {
  partners: PartnerCompany[];
  eyebrow?: string;
  title?: string;
  description?: string;
  durationSeconds?: number;
  className?: string;
}

function getPartnerInitials(name: string) {
  const words = name.trim().split(/\s+/).filter(Boolean);

  if (words.length > 1) {
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  }

  return name.slice(0, 2).toUpperCase();
}

function PartnerCard({
  partner,
  duplicate = false,
}: {
  partner: PartnerCompany;
  duplicate?: boolean;
}) {
  const content = (
    <>
      {partner.logo ? (
        <img
          className={`partner-slider-logo ${partner.id === 'amt' ? 'partner-slider-logo-amt' : ''}`.trim()}
          src={partner.logo}
          alt={duplicate ? '' : partner.logoAlt || `${partner.name} logo`}
          loading="lazy"
        />
      ) : (
        <span className="partner-slider-fallback" aria-hidden="true">
          {getPartnerInitials(partner.name)}
        </span>
      )}
      <span className="partner-slider-name">{partner.name}</span>
    </>
  );

  if (partner.website) {
    return (
      <a
        className="partner-slider-card"
        href={partner.website}
        target="_blank"
        rel="noreferrer"
        tabIndex={duplicate ? -1 : undefined}
        aria-hidden={duplicate || undefined}
        aria-label={duplicate ? undefined : `Visit ${partner.name}`}
      >
        {content}
      </a>
    );
  }

  return (
    <div
      className="partner-slider-card"
      aria-hidden={duplicate || undefined}
    >
      {content}
    </div>
  );
}

export default function PartnerCompanySlider({
  partners,
  eyebrow = 'OUR PARTNERS',
  title = 'Companies We Work With',
  description,
  durationSeconds = 55,
  className = '',
}: PartnerCompanySliderProps) {
  const canAnimate = partners.length > 1;
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const isScrollResettingRef = useRef(false);
  const isPointerDraggingRef = useRef(false);
  const didPointerDragRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartScrollLeftRef = useRef(0);
  const loopGroupCount = canAnimate ? 3 : 1;
  const sliderStyle = {
    '--partner-slider-duration': `${Math.max(durationSeconds, 10)}s`,
  } as CSSProperties;

  const getLoopWidth = useCallback(() => {
    const track = trackRef.current;
    if (!track || !canAnimate) return 0;

    return track.scrollWidth / loopGroupCount;
  }, [canAnimate, loopGroupCount]);

  const finishScrollReset = useCallback(() => {
    requestAnimationFrame(() => {
      isScrollResettingRef.current = false;
    });
  }, []);

  const centerLoop = useCallback(() => {
    const viewport = viewportRef.current;
    const loopWidth = getLoopWidth();
    if (!viewport || !loopWidth) return;

    isScrollResettingRef.current = true;
    viewport.scrollLeft = loopWidth;
    finishScrollReset();
  }, [finishScrollReset, getLoopWidth]);

  const handleScroll = useCallback(() => {
    const viewport = viewportRef.current;
    const loopWidth = getLoopWidth();
    if (!viewport || !loopWidth || isScrollResettingRef.current) return;

    if (viewport.scrollLeft < loopWidth * 0.45) {
      isScrollResettingRef.current = true;
      viewport.scrollLeft += loopWidth;
      finishScrollReset();
    } else if (viewport.scrollLeft > loopWidth * 1.55) {
      isScrollResettingRef.current = true;
      viewport.scrollLeft -= loopWidth;
      finishScrollReset();
    }
  }, [finishScrollReset, getLoopWidth]);

  const handleWheel = useCallback((event: ReactWheelEvent<HTMLDivElement>) => {
    const viewport = viewportRef.current;
    if (!viewport || !canAnimate) return;

    const scrollAmount =
      Math.abs(event.deltaX) > Math.abs(event.deltaY)
        ? event.deltaX
        : event.deltaY;

    if (!scrollAmount) return;

    event.preventDefault();
    viewport.scrollLeft += scrollAmount;
    handleScroll();
  }, [canAnimate, handleScroll]);

  const handlePointerDown = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (!canAnimate || event.pointerType === 'touch') return;

    const viewport = viewportRef.current;
    if (!viewport) return;

    isPointerDraggingRef.current = true;
    didPointerDragRef.current = false;
    dragStartXRef.current = event.clientX;
    dragStartScrollLeftRef.current = viewport.scrollLeft;
    viewport.setPointerCapture(event.pointerId);
  }, [canAnimate]);

  const handlePointerMove = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const viewport = viewportRef.current;
    if (!viewport || !isPointerDraggingRef.current) return;

    const dragDistance = event.clientX - dragStartXRef.current;
    if (Math.abs(dragDistance) > 4) {
      didPointerDragRef.current = true;
    }

    event.preventDefault();
    viewport.scrollLeft = dragStartScrollLeftRef.current - dragDistance;
    handleScroll();
  }, [handleScroll]);

  const stopPointerDrag = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const viewport = viewportRef.current;
    if (!viewport || !isPointerDraggingRef.current) return;

    isPointerDraggingRef.current = false;
    if (viewport.hasPointerCapture(event.pointerId)) {
      viewport.releasePointerCapture(event.pointerId);
    }
  }, []);

  const handleClickCapture = useCallback((event: ReactMouseEvent<HTMLDivElement>) => {
    if (!didPointerDragRef.current) return;

    event.preventDefault();
    event.stopPropagation();
    didPointerDragRef.current = false;
  }, []);

  useEffect(() => {
    if (!canAnimate) return;

    const frame = requestAnimationFrame(centerLoop);
    window.addEventListener('resize', centerLoop);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', centerLoop);
    };
  }, [canAnimate, centerLoop, partners.length]);

  if (!partners.length) return null;

  return (
    <section
      className={`partner-slider-section ${className}`.trim()}
      aria-label="Partner companies"
    >
      <div className="partner-slider-container">
        <SectionHeader
          eyebrow={eyebrow}
          title={title}
          description={description}
        />
      </div>

      <div
        className="partner-slider-viewport"
        ref={viewportRef}
        onScroll={handleScroll}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopPointerDrag}
        onPointerLeave={stopPointerDrag}
        onPointerCancel={stopPointerDrag}
        onClickCapture={handleClickCapture}
      >
        <div
          ref={trackRef}
          className={`partner-slider-track ${
            canAnimate ? 'partner-slider-track-animated' : ''
          }`}
          style={sliderStyle}
        >
          {Array.from({ length: loopGroupCount }).map((_, groupIndex) => {
            const isDuplicate = canAnimate && groupIndex !== 1;

            return (
              <div
                key={`partner-group-${groupIndex}`}
                className="partner-slider-group"
                aria-hidden={isDuplicate || undefined}
              >
              {partners.map((partner, index) => (
                <PartnerCard
                  key={`${groupIndex}-${partner.id || `${partner.name}-${index}`}`}
                  partner={partner}
                  duplicate={isDuplicate}
                />
              ))}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
