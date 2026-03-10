import { useEffect, useState, useCallback } from 'react';
import { slidingDoorService } from '@/services/slidingDoorService';
import { useWardrobeState } from '@/state/useWardrobeContext';
import Button from '@/components/ui/Button';
import { SkeletonBox } from '@/components/ui/SkeletonLoader';
import type { WardrobeWidthRange } from '@/domain/models/slidingDoorConfig';
import styles from './Step3DoorCount.module.css';

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Step3Skeleton() {
  return (
    <div className={styles.root}>
      <SkeletonBox width="100%" height={52} />
      <div className={styles.options}>
        {Array.from({ length: 3 }, (_, i) => (
          <SkeletonBox key={i} width={72} height={72} borderRadius="var(--radius-card)" />
        ))}
      </div>
    </div>
  );
}

// ─── Step3DoorCount ───────────────────────────────────────────────────────────

interface Props {
  onComplete: () => void;
}

export default function Step3DoorCount({ onComplete }: Props) {
  const { state, dispatch } = useWardrobeState();

  const [ranges, setRanges]       = useState<WardrobeWidthRange[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]         = useState<string | null>(null);

  // ── Fetch width ranges ─────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    slidingDoorService
      .getWardrobeWidthRanges()
      .then((data) => {
        if (!cancelled) {
          setRanges(data);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError('Failed to load door options.');
          setIsLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, []);

  // ── Derive matching range from current width ───────────────────────
  const widthMm = state.wardrobeDimensions?.widthMm ?? null;

  const matchingRange = widthMm !== null
    ? ranges.find((r) => widthMm >= r.minWidthMm && widthMm <= r.maxWidthMm) ?? null
    : null;

  // ── Auto-select if only one door count option ──────────────────────
  // Only dispatches to context — does NOT call onComplete.
  // User must press Continue themselves.
  useEffect(() => {
    if (!matchingRange) return;
    if (matchingRange.allowedDoorCounts.length === 1) {
      const doorCount = matchingRange.allowedDoorCounts[0];
      // Only dispatch if not already set to avoid unnecessary renders
      if (state.wardrobeDoorCount !== doorCount) {
        dispatch({
          type: 'SET_RANGE_AND_DOOR_COUNT',
          payload: { rangeId: matchingRange.id, doorCount },
        });
      }
    }
  }, [matchingRange?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Manual select ──────────────────────────────────────────────────
  const handleSelect = useCallback(
    (doorCount: number) => {
      if (!matchingRange) return;
      dispatch({
        type: 'SET_RANGE_AND_DOOR_COUNT',
        payload: { rangeId: matchingRange.id, doorCount },
      });
    },
    [matchingRange, dispatch]
  );

  const handleContinue = useCallback(() => {
    if (state.wardrobeDoorCount) onComplete();
  }, [state.wardrobeDoorCount, onComplete]);

  // ── Guards ─────────────────────────────────────────────────────────
  if (isLoading) return <Step3Skeleton />;
  if (error)     return <p className={styles.error}>{error}</p>;

  if (!widthMm) {
    return (
      <p className={styles.warning}>
        Please complete Step 2 (Dimensions) before selecting door count.
      </p>
    );
  }

  if (!matchingRange) {
    return (
      <p className={styles.error}>
        No door configuration found for {widthMm}mm. Please check your dimensions.
      </p>
    );
  }

  return (
    <div className={styles.root}>
      <p className={styles.rangeBanner}>
        For a width of <strong>{widthMm}mm</strong>,{' '}
        {matchingRange.allowedDoorCounts.length === 1 ? (
          <>your wardrobe requires <strong>{matchingRange.allowedDoorCounts[0]} doors</strong>.</>
        ) : (
          <>you can choose from <strong>{matchingRange.allowedDoorCounts.join(' or ')} doors</strong>.</>
        )}
      </p>

      {/* Always show options — even if only one, so user sees what's selected */}
      <p className={styles.optionsLabel}>Number of doors</p>
      <div className={styles.options} role="radiogroup" aria-label="Door count options">
        {matchingRange.allowedDoorCounts.map((count) => {
          const isSelected = state.wardrobeDoorCount === count;
          return (
            <button
              key={count}
              type="button"
              className={`${styles.optionButton}${isSelected ? ` ${styles.optionSelected}` : ''}`}
              onClick={() => handleSelect(count)}
              aria-pressed={isSelected}
              aria-label={`${count} doors`}
            >
              <span className={styles.optionNumber}>{count}</span>
              <span className={styles.optionLabel}>{count === 1 ? 'door' : 'doors'}</span>
            </button>
          );
        })}
      </div>

      <div className={styles.actions}>
        <Button
          variant="primary"
          size="md"
          fullWidth
          disabled={!state.wardrobeDoorCount}
          onClick={handleContinue}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}