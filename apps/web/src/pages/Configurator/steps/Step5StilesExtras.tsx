import React, { useEffect, useState, useCallback, useRef } from 'react';
import { slidingDoorService } from '@/services/slidingDoorService';
import { useWardrobeState } from '@/state/useWardrobeContext';
import Button from '@/components/ui/Button';
import { SkeletonSwatch, SkeletonBox } from '@/components/ui/SkeletonLoader';
import type {
  WardrobeStilesAndTracks,
  WardrobeExtra,
} from '@/domain/models/slidingDoorConfig';
import styles from './Step5StilesExtras.module.css';

const TRACK_IDS = ['extra-top-track', 'extra-bottom-track'];

// ─── StilesCard ───────────────────────────────────────────────────────────────

interface StilesCardProps {
  stiles: WardrobeStilesAndTracks;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const StilesCard = React.memo(function StilesCard({ stiles, isSelected, onSelect }: StilesCardProps) {
  const [imgError, setImgError] = useState(false);
  return (
    <button
      type="button"
      className={[
        styles.stilesButton,
        isSelected ? styles.stilesButtonActive : '',
      ].filter(Boolean).join(' ')}
      onClick={() => onSelect(stiles.id)}
      aria-pressed={isSelected}
      aria-label={stiles.name}
      title={stiles.name}
    >
      <span
        className={styles.stilesSwatch}
        style={imgError ? { backgroundColor: stiles.colour } : undefined}
      >
        {!imgError ? (
          <img
            src={stiles.image?.url ?? ''}
            alt={stiles.colour}
            className={styles.stilesSwatchImg}
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : null}
      </span>
      <span className={[
        styles.stilesName,
        isSelected ? styles.stilesNameActive : '',
      ].filter(Boolean).join(' ')}>
        {stiles.name}
      </span>
    </button>
  );
});

// ─── TrackDisplayRow ──────────────────────────────────────────────────────────

interface TrackDisplayRowProps {
  extra: WardrobeExtra;
}

const TrackDisplayRow = React.memo(function TrackDisplayRow({ extra }: TrackDisplayRowProps) {
  const [imgError, setImgError] = useState(false);
  return (
    <div className={`${styles.extraRow} ${styles.extraRowDisabled}`}>
      <div className={styles.extraThumb}>
        {extra.image?.url && !imgError ? (
          <img src={extra.image.url} alt={extra.name} className={styles.extraThumbImg}
            onError={() => setImgError(true)} loading="lazy" />
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.25" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="2" />
          </svg>
        )}
      </div>
      <div className={styles.extraInfo}>
        <span className={styles.extraName}>{extra.name}</span>
        <span className={styles.extraBadge}>Included</span>
      </div>
      <span className={styles.trackQtyLabel}>× 1</span>
    </div>
  );
});

// ─── ExtraRow ─────────────────────────────────────────────────────────────────

interface ExtraRowProps {
  extra: WardrobeExtra;
  quantity: number;
  onQuantityChange: (id: string, quantity: number) => void;
}

const ExtraRow = React.memo(function ExtraRow({ extra, quantity, onQuantityChange }: ExtraRowProps) {
  const [imgError, setImgError] = useState(false);

  const handleDecrement = useCallback(() => {
    if (quantity > 0) onQuantityChange(extra.id, quantity - 1);
  }, [extra.id, quantity, onQuantityChange]);

  const handleIncrement = useCallback(() => {
    if (quantity < extra.maxQuantity) onQuantityChange(extra.id, quantity + 1);
  }, [extra.id, quantity, extra.maxQuantity, onQuantityChange]);

  return (
    <div className={styles.extraRow}>
      <div className={styles.extraThumb}>
        {extra.image?.url && !imgError ? (
          <img src={extra.image.url} alt={extra.name} className={styles.extraThumbImg}
            onError={() => setImgError(true)} loading="lazy" />
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.25" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="2" />
          </svg>
        )}
      </div>
      <div className={styles.extraInfo}>
        <span className={styles.extraName}>{extra.name}</span>
      </div>
      <div className={styles.stepper}>
        <button type="button" className={styles.stepperBtn}
          onClick={handleDecrement} disabled={quantity <= 0}
          aria-label={`Decrease ${extra.name} quantity`}>−</button>
        <span className={styles.stepperValue} aria-live="polite">{quantity}</span>
        <button type="button" className={styles.stepperBtn}
          onClick={handleIncrement} disabled={quantity >= extra.maxQuantity}
          aria-label={`Increase ${extra.name} quantity`}>+</button>
      </div>
    </div>
  );
});

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Step5Skeleton() {
  return (
    <div className={styles.root}>
      <div className={styles.section}>
        <SkeletonBox width={140} height={16} borderRadius="var(--radius-sm)" />
        <div className={styles.skeletonSwatches}>
          {Array.from({ length: 5 }, (_, i) => <SkeletonSwatch key={i} size="lg" />)}
        </div>
      </div>
      <div className={styles.section}>
        <SkeletonBox width={80} height={16} borderRadius="var(--radius-sm)" />
        <div className={styles.skeletonExtras}>
          {Array.from({ length: 6 }, (_, i) => (
            <SkeletonBox key={i} width="100%" height={68} borderRadius="var(--radius-card)" />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Step5StilesExtras ────────────────────────────────────────────────────────

interface Props {
  onComplete: () => void;
}

export default function Step5StilesExtras({ onComplete }: Props) {
  const { state, dispatch } = useWardrobeState();

  const [stilesOptions, setStilesOptions] = useState<WardrobeStilesAndTracks[]>([]);
  const [extrasOptions, setExtrasOptions] = useState<WardrobeExtra[]>([]);
  const [isLoading, setIsLoading]         = useState(true);
  const [error, setError]                 = useState<string | null>(null);

  // ── Refs to track default application ─────────────────────────────
  const defaultsAppliedRef = useRef(false);
  const prevTypeIdRef       = useRef<string | null>(null);
  const prevExtrasRef       = useRef(state.wardrobeSelectedExtras);

  // Reset defaults flag when wardrobe type is cleared (RESET)
  if (prevTypeIdRef.current !== state.wardrobeTypeId) {
    prevTypeIdRef.current = state.wardrobeTypeId ?? null;
    if (!state.wardrobeTypeId) {
      defaultsAppliedRef.current = false;
    }
  }

  // Reset defaults flag when extras object is replaced wholesale (LOAD_STATE)
  if (prevExtrasRef.current !== state.wardrobeSelectedExtras) {
    prevExtrasRef.current = state.wardrobeSelectedExtras;
    defaultsAppliedRef.current = false;
  }

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      slidingDoorService.getWardrobeStilesAndTracks(),
      slidingDoorService.getWardrobeExtras(),
    ])
      .then(([stilesData, extrasData]) => {
        if (!cancelled) {
          setStilesOptions(stilesData);
          setExtrasOptions(extrasData);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError('Failed to load stiles and extras options.');
          setIsLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, []);

  // ── Apply defaults only for fresh configurations, not edit loads ───
  useEffect(() => {
    if (extrasOptions.length === 0) return;
    if (!state.wardrobeTypeId) return;
    if (defaultsAppliedRef.current) return;

    const hasExistingQuantities = extrasOptions
      .filter((e) => !TRACK_IDS.includes(e.id))
      .some((e) => (state.wardrobeSelectedExtras[e.id] ?? 0) > 0);

    if (hasExistingQuantities) {
      defaultsAppliedRef.current = true;
      return;
    }

    defaultsAppliedRef.current = true;
    const typeId = state.wardrobeTypeId;

    extrasOptions.forEach((extra) => {
      if (!extra.defaultQuantity) return;
      if (!(typeId in extra.defaultQuantity)) return;
      const qty = extra.defaultQuantity[typeId] ?? 0;
      dispatch({ type: 'SET_EXTRA_QUANTITY', payload: { extraId: extra.id, quantity: qty } });
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extrasOptions, state.wardrobeTypeId]);

  const handleStilesSelect = useCallback(
    (id: string) => dispatch({ type: 'SET_STILES_AND_TRACKS', payload: id }),
    [dispatch]
  );

  const handleQuantityChange = useCallback(
    (extraId: string, quantity: number) =>
      dispatch({ type: 'SET_EXTRA_QUANTITY', payload: { extraId, quantity } }),
    [dispatch]
  );

  const canContinue = !!state.wardrobeStilesAndTracksId;

  const handleContinue = useCallback(() => {
    if (canContinue) onComplete();
  }, [canContinue, onComplete]);

  const trackExtras    = extrasOptions.filter((e) => TRACK_IDS.includes(e.id));
  const optionalExtras = extrasOptions.filter((e) => !TRACK_IDS.includes(e.id));

  if (isLoading) return <Step5Skeleton />;
  if (error)     return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.root}>

      {/* ── Section 1: Stiles & Tracks ──────────────────────────────── */}
      <div className={styles.stilesSection}>
        <div className={styles.stilesLeft}>
          <p className={styles.sectionTitle}>Stiles & Tracks</p>
          <p className={styles.sectionSubtitle}>Select a finish.</p>
          <div className={styles.stilesGrid} role="radiogroup" aria-label="Select stiles and tracks">
            {stilesOptions.map((stiles) => (
              <StilesCard
                key={stiles.id}
                stiles={stiles}
                isSelected={state.wardrobeStilesAndTracksId === stiles.id}
                onSelect={handleStilesSelect}
              />
            ))}
          </div>
          <p className={styles.trackIncludedNote}>
            Top and bottom tracks are included with your order.
          </p>
          <div className={styles.trackDisplayList}>
            {trackExtras.map((extra) => (
              <TrackDisplayRow key={extra.id} extra={extra} />
            ))}
          </div>
        </div>
      </div>

      <hr className={styles.divider} />

      {/* ── Section 2: Optional extras ──────────────────────────────── */}
      <div className={styles.section}>
        <p className={styles.sectionTitle}>Extras</p>
        <p className={styles.sectionSubtitle}>
          Quantities are pre-filled based on your wardrobe type. Adjust as needed.
        </p>
        <p className={styles.trackIncludedNote}>
          Extras will be supplied oversize, cutting to size will be required.
        </p>
        <div className={styles.extrasList}>
          {optionalExtras.map((extra) => (
            <ExtraRow
              key={extra.id}
              extra={extra}
              quantity={state.wardrobeSelectedExtras[extra.id] ?? 0}
              onQuantityChange={handleQuantityChange}
            />
          ))}
        </div>
      </div>

      {/* ── Actions ─────────────────────────────────────────────────── */}
      <div className={styles.actions}>
        <Button
          variant="primary"
          size="md"
          fullWidth
          disabled={!canContinue}
          onClick={handleContinue}
        >
          Continue
        </Button>
      </div>

    </div>
  );
}