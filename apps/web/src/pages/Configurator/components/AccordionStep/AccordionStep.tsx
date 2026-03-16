import React, { useRef, useEffect } from 'react';
import styles from './AccordionStep.module.css';

export type StepStatus = 'idle' | 'active' | 'completed';

export interface AccordionStepProps {
  stepNumber: number;
  title: string;
  summary?: string;
  status: StepStatus;
  isOpen: boolean;
  disabled?: boolean;
  onToggle: (stepNumber: number) => void;
  children: React.ReactNode;
}

const AccordionStep = React.memo(function AccordionStep({
  stepNumber,
  title,
  summary,
  status,
  isOpen,
  disabled = false,
  onToggle,
  children,
}: AccordionStepProps) {
  const headerRef = useRef<HTMLButtonElement>(null);
  const panelId   = `step-panel-${stepNumber}`;
  const headerId  = `step-header-${stepNumber}`;

  // When this step opens, scroll so the header sits at ~20% from the top
  useEffect(() => {
    if (!isOpen || !headerRef.current) return;

    const header = headerRef.current;

    // Small delay lets the panel start opening before we scroll
    const timer = setTimeout(() => {
      const rect        = header.getBoundingClientRect();
      const targetY     = window.scrollY + rect.top - window.innerHeight * 0.20;
      window.scrollTo({ top: Math.max(0, targetY), behavior: 'smooth' });
    }, 50);

    return () => clearTimeout(timer);
  }, [isOpen]);

  const handleToggle = () => {
    if (!disabled) onToggle(stepNumber);
  };

  const indicatorClass =
    status === 'active'
      ? styles.indicatorActive
      : status === 'completed'
        ? styles.indicatorDone
        : styles.indicatorIdle;

  const stepClass = [
    styles.step,
    status === 'active'    ? styles.active    : '',
    status === 'completed' ? styles.completed : '',
  ].filter(Boolean).join(' ');

  return (
    <div className={stepClass}>

      {/* ── Header ───────────────────────────────────────────────────── */}
      <button
        ref={headerRef}
        id={headerId}
        type="button"
        className={styles.header}
        onClick={handleToggle}
        disabled={disabled}
        aria-expanded={isOpen}
        aria-controls={panelId}
      >
        {/* Step number / check indicator */}
        <span className={`${styles.indicator} ${indicatorClass}`} aria-hidden="true">
          {status === 'completed' ? (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M2 6l3 3 5-5"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            stepNumber
          )}
        </span>

        {/* Title + summary */}
        <span className={styles.titleGroup}>
          <span className={styles.title}>{title}</span>
          {summary && status === 'completed' && !isOpen && (
            <span className={styles.summary}>{summary}</span>
          )}
        </span>

        {/* Chevron */}
        <svg
          className={`${styles.chevron}${isOpen ? ` ${styles.chevronOpen}` : ''}`}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M4 6l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* ── Collapsible panel ─────────────────────────────────────────── */}
      <div
        id={panelId}
        role="region"
        aria-labelledby={headerId}
        className={`${styles.panel}${isOpen ? ` ${styles.panelOpen}` : ''}`}
      >
        <div className={styles.panelInner}>
          {children}
        </div>
      </div>

    </div>
  );
});

export default AccordionStep;