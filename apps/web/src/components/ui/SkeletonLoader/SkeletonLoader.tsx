import React from 'react';
import styles from './SkeletonLoader.module.css';

// ─── SkeletonBox ──────────────────────────────────────────────────────────────

export interface SkeletonBoxProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  className?: string;
  'aria-label'?: string;
}

/**
 * SkeletonBox
 */
export const SkeletonBox = React.memo(function SkeletonBox({
  width = '100%',
  height,
  borderRadius,
  className,
  'aria-label': ariaLabel,
}: SkeletonBoxProps) {
  return (
    <span
      role="status"
      aria-label={ariaLabel ?? 'Loading…'}
      aria-busy="true"
      className={[styles.box, className].filter(Boolean).join(' ')}
      style={{
        width,
        height,
        borderRadius,
        display: 'block',
      }}
    />
  );
});

// ─── SkeletonText ─────────────────────────────────────────────────────────────

export interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

/**
 * SkeletonText
 */
export const SkeletonText = React.memo(function SkeletonText({
  lines = 2,
  className,
}: SkeletonTextProps) {
  return (
    <span
      role="status"
      aria-label="Loading…"
      aria-busy="true"
      style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}
    >
      {Array.from({ length: lines }, (_, i) => (
        <span
          key={i}
          className={[
            styles.text,
            i === lines - 1 && lines > 1 ? styles.textShort : '',
            className ?? '',
          ]
            .filter(Boolean)
            .join(' ')}
        />
      ))}
    </span>
  );
});

// ─── SkeletonSwatch ───────────────────────────────────────────────────────────

export interface SkeletonSwatchProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SWATCH_SIZE_MAP: Record<NonNullable<SkeletonSwatchProps['size']>, string> = {
  sm: 'var(--size-swatch-sm)',
  md: 'var(--size-swatch-md)',
  lg: 'var(--size-swatch-lg)',
};

/**
 * SkeletonSwatch
 */
export const SkeletonSwatch = React.memo(function SkeletonSwatch({
  size = 'md',
  className,
}: SkeletonSwatchProps) {
  const dim = SWATCH_SIZE_MAP[size];
  return (
    <span
      role="status"
      aria-label="Loading…"
      aria-busy="true"
      className={[styles.swatch, className].filter(Boolean).join(' ')}
      style={{ width: dim, height: dim }}
    />
  );
});

// ─── SkeletonButton ───────────────────────────────────────────────────────────

export interface SkeletonButtonProps {
  width?: string | number;
  className?: string;
}

export const SkeletonButton = React.memo(function SkeletonButton({
  width = '100%',
  className,
}: SkeletonButtonProps) {
  return (
    <span
      role="status"
      aria-label="Loading…"
      aria-busy="true"
      className={[styles.buttonSkeleton, className].filter(Boolean).join(' ')}
      style={{ width }}
    />
  );
});

// ─── SkeletonAccordionStep ────────────────────────────────────────────────────

/**
 * SkeletonAccordionStep
 */
export const SkeletonAccordionStep = React.memo(
  function SkeletonAccordionStep() {
    return (
      <div
        role="status"
        aria-label="Loading step…"
        aria-busy="true"
        className={styles.accordionStep}
      >
        <div className={styles.accordionStepHeader}>
          <span className={styles.accordionStepIcon} />
          <span className={styles.accordionStepTitle} />
          <span className={styles.accordionStepChevron} />
        </div>
      </div>
    );
  }
);

// ─── SkeletonPreview ──────────────────────────────────────────────────────────

export const SkeletonPreview = React.memo(function SkeletonPreview() {
  return (
    <div
      role="status"
      aria-label="Loading preview…"
      aria-busy="true"
      className={styles.preview}
    >
      <span className={styles.previewCanvas} />
      <div className={styles.previewMeta}>
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className={styles.previewMetaItem}>
            <span className={styles.previewMetaLabel} />
            <span className={styles.previewMetaValue} />
          </div>
        ))}
      </div>
    </div>
  );
});