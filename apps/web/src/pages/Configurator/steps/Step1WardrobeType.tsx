import React, { useEffect, useState, useCallback } from 'react';
import { slidingDoorService } from '@/services/slidingDoorService';
import { useWardrobeState } from '@/state/useWardrobeContext';
import { SkeletonBox, SkeletonText } from '@/components/ui/SkeletonLoader';
import type { WardrobeType, WardrobeTypeId } from '@/domain/models/slidingDoorConfig';
import styles from './Step1WardrobeType.module.css';

// ─── WardrobeTypeCard ─────────────────────────────────────────────────────────

interface WardrobeTypeCardProps {
  type: WardrobeType;
  isSelected: boolean;
  onSelect: (id: WardrobeTypeId) => void;
}

const WardrobeTypeCard = React.memo(function WardrobeTypeCard({
  type,
  isSelected,
  onSelect,
}: WardrobeTypeCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <button
      type="button"
      className={`${styles.card}${isSelected ? ` ${styles.selected}` : ''}`}
      onClick={() => onSelect(type.id)}
      aria-pressed={isSelected}
      aria-label={`${type.name}: ${type.description}`}
    >
      {/* Image */}
      <div className={styles.imageWrap}>
        {!imgError ? (
          <img
            src={type.image}
            alt={type.name}
            className={styles.image}
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className={styles.imageFallback} aria-hidden="true">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18M9 21V9" />
            </svg>
          </div>
        )}

        {/* Selected check */}
        {isSelected && (
          <span className={styles.checkBadge} aria-hidden="true">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        )}
      </div>

      {/* Body */}
      <div className={styles.cardBody}>
        <span className={styles.cardTitle}>{type.name}</span>
        <span className={styles.cardDesc}>{type.description}</span>
      </div>
    </button>
  );
});

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Step1Skeleton() {
  return (
    <div className={styles.skeletonGrid}>
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className={styles.skeletonCard}>
          <div className={styles.skeletonImage}>
            <SkeletonBox width="100%" height="100%" borderRadius="0" />
          </div>
          <div className={styles.skeletonBody}>
            <SkeletonText lines={1} />
            <SkeletonText lines={2} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Step1WardrobeType ────────────────────────────────────────────────────────

interface Props {
  onComplete: () => void;
}

export default function Step1WardrobeType({ onComplete }: Props) {
  const { state, dispatch } = useWardrobeState();
  const [types, setTypes] = useState<WardrobeType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Fetch wardrobe types on mount ──────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    slidingDoorService
      .getWardrobeTypes()
      .then((data) => {
        if (!cancelled) {
          setTypes(data);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError('Failed to load wardrobe types. Please try again.');
          setIsLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, []);

  // ── Select handler ─────────────────────────────────────────────────
  const handleSelect = useCallback(
    (id: WardrobeTypeId) => {
      dispatch({ type: 'SET_WARDROBE_TYPE', payload: id });
      onComplete();
    },
    [dispatch, onComplete]
  );

  if (isLoading) return <Step1Skeleton />;

  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div
      role="radiogroup"
      aria-label="Select wardrobe type"
    >
      <div className={styles.grid}>
        {types.map((type) => (
          <WardrobeTypeCard
            key={type.id}
            type={type}
            isSelected={state.wardrobeTypeId === type.id}
            onSelect={handleSelect}
          />
        ))}
      </div>
    </div>
  );
}