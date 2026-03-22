import { useEffect, useState, useCallback, useRef } from 'react';
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

  const [ranges, setRanges] = useState<WardrobeWidthRange[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const autoSelectedRangeRef = useRef<string | null>(null);
  const prevDoorCountRef = useRef<number | null>(state.wardrobeDoorCount);

  // ── Reset autoSelectedRangeRef when door count changes externally
  //    (i.e. LOAD_STATE fired a new snapshot) ─────────────────────────
  useEffect(() => {
    if (prevDoorCountRef.current !== state.wardrobeDoorCount) {
      prevDoorCountRef.current = state.wardrobeDoorCount;
      autoSelectedRangeRef.current = null;
    }
  }, [state.wardrobeDoorCount]);

  // ── Fetch width ranges from service ───────────────────────────────
  useEffect(() => {
    let cancelled = false;
    slidingDoorService
      .getWardrobeWidthRanges()
      .then((data) => {
        if (!cancelled) { setRanges(data); setIsLoading(false); }
      })
      .catch(() => {
        if (!cancelled) { setError('Failed to load door options.'); setIsLoading(false); }
      });
    return () => { cancelled = true; };
  }, []);

  const widthMm = state.wardrobeDimensions?.widthMm ?? null;

  const matchingRange = widthMm !== null
    ? ranges.find((r) => widthMm >= r.minWidthMm && widthMm <= r.maxWidthMm) ?? null
    : null;

  // ── Auto-select when only ONE door count is valid and none is set ──
  useEffect(() => {
    if (!matchingRange) return;
    if (matchingRange.allowedDoorCounts.length !== 1) return;

    // Already have a door count set (restored from snapshot) — skip
    if (state.wardrobeDoorCount !== null) return;

    // Already auto-selected for this range — skip
    if (autoSelectedRangeRef.current === matchingRange.id) return;

    autoSelectedRangeRef.current = matchingRange.id;
    dispatch({
      type: 'SET_RANGE_AND_DOOR_COUNT',
      payload: { rangeId: matchingRange.id, doorCount: matchingRange.allowedDoorCounts[0] },
    });
  }, [matchingRange?.id, state.wardrobeDoorCount]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Snapshot restore race fix ──────────────────────────────────────
  useEffect(() => {
    if (ranges.length === 0) return;
    if (!state.wardrobeDoorCount) return;
    if (!state.wardrobeDimensions?.widthMm) return;

    const range = ranges.find(
      (r) =>
        state.wardrobeDimensions!.widthMm >= r.minWidthMm &&
        state.wardrobeDimensions!.widthMm <= r.maxWidthMm
    );
    if (!range) return;

    // Range already correctly set — nothing to do
    if (state.wardrobeSelectedRangeId === range.id) return;

    dispatch({
      type: 'SET_RANGE_AND_DOOR_COUNT',
      payload: { rangeId: range.id, doorCount: state.wardrobeDoorCount },
    });
  }, [ranges, state.wardrobeDoorCount, state.wardrobeDimensions?.widthMm, state.wardrobeSelectedRangeId, dispatch, state.wardrobeDimensions]);

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

  console.log('[Step3]', {
    wardrobeDoorCount: state.wardrobeDoorCount,
    wardrobeSelectedRangeId: state.wardrobeSelectedRangeId,
    widthMm: state.wardrobeDimensions?.widthMm,
    rangesLoaded: ranges.length,
    matchingRangeId: matchingRange?.id,
  });

  if (isLoading) return <Step3Skeleton />;
  if (error) return <p className={styles.error}>{error}</p>;

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