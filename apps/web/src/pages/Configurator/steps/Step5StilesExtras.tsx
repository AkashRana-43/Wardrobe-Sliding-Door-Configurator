import React, { useEffect, useState, useCallback } from 'react';
import { slidingDoorService } from '@/services/slidingDoorService';
import { useWardrobeState } from '@/state/useWardrobeContext';
import Button from '@/components/ui/Button';
import { SkeletonSwatch, SkeletonBox } from '@/components/ui/SkeletonLoader';
import type {
  WardrobeStilesAndTracks,
  WardrobeExtra,
} from '@/domain/models/slidingDoorConfig';
import styles from './Step5StilesExtras.module.css';

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
      className={styles.stilesButton}
      onClick={() => onSelect(stiles.id)}
      aria-pressed={isSelected}
      aria-label={stiles.name}
      title={stiles.name}
    >
      <span
        className={isSelected ? `${styles.stilesSwatch} ${styles.stilesSwatchActive}` : styles.stilesSwatch}
        style={imgError ? { backgroundColor: stiles.colour } : undefined}
      >
        {!imgError && (
          <img
            src={stiles.image}
            alt={stiles.colour}
            className={styles.stilesSwatchImg}
            onError={() => setImgError(true)}
            loading="lazy"
          />
        )}
      </span>
      <span className={isSelected ? `${styles.stilesName} ${styles.stilesNameActive}` : styles.stilesName}>
        {stiles.name}
      </span>
    </button>
  );
});

// ─── ExtraRow ─────────────────────────────────────────────────────────────────

interface ExtraRowProps {
  extra: WardrobeExtra;
  quantity: number;
  imageKey: string | null;
  isDefault: boolean;
  onQuantityChange: (id: string, quantity: number) => void;
}

const ExtraRow = React.memo(function ExtraRow({
  extra,
  quantity,
  imageKey,
  isDefault,
  onQuantityChange,
}: ExtraRowProps) {
  const [imgError, setImgError] = useState(false);
  const imageSrc = imageKey ? extra.images[imageKey] : null;

  const handleDecrement = useCallback(() => {
    if (!isDefault && quantity > 0) onQuantityChange(extra.id, quantity - 1);
  }, [extra.id, quantity, isDefault, onQuantityChange]);

  const handleIncrement = useCallback(() => {
    if (quantity < extra.maxQuantity) onQuantityChange(extra.id, quantity + 1);
  }, [extra.id, quantity, extra.maxQuantity, onQuantityChange]);

  return (
    <div className={isDefault ? `${styles.extraRow} ${styles.extraRowDefault}` : styles.extraRow}>
      {/* Thumbnail */}
      <div className={styles.extraThumb}>
        {imageSrc && !imgError ? (
          <img
            src={imageSrc}
            alt={extra.name}
            className={styles.extraThumbImg}
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.25" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="2" />
          </svg>
        )}
      </div>

      {/* Name + badge */}
      <div className={styles.extraInfo}>
        <span className={styles.extraName}>{extra.name}</span>
        {isDefault && (
          <span className={styles.extraBadge}>Included</span>
        )}
      </div>

      {/* Stepper */}
      <div className={styles.stepper}>
        <button
          type="button"
          className={styles.stepperBtn}
          onClick={handleDecrement}
          disabled={isDefault || quantity <= 0}
          aria-label={`Decrease ${extra.name} quantity`}
        >
          −
        </button>
        <span className={styles.stepperValue} aria-live="polite">
          {quantity}
        </span>
        <button
          type="button"
          className={styles.stepperBtn}
          onClick={handleIncrement}
          disabled={quantity >= extra.maxQuantity}
          aria-label={`Increase ${extra.name} quantity`}
        >
          +
        </button>
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
          {Array.from({ length: 4 }, (_, i) => (
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

  // ── Fetch stiles + extras in parallel ─────────────────────────────
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

  // ── Pre-select default extras on first load ────────────────────────
  useEffect(() => {
    if (extrasOptions.length === 0) return;
    extrasOptions
      .filter((e) => e.isDefault)
      .forEach((e) => {
        if (!state.wardrobeSelectedExtras[e.id]) {
          dispatch({ type: 'SET_EXTRA_QUANTITY', payload: { extraId: e.id, quantity: 1 } });
        }
      });
  }, [extrasOptions]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Handlers ───────────────────────────────────────────────────────
  const handleStilesSelect = useCallback(
    (id: string) => dispatch({ type: 'SET_STILES_AND_TRACKS', payload: id }),
    [dispatch]
  );

  const handleQuantityChange = useCallback(
    (extraId: string, quantity: number) =>
      dispatch({ type: 'SET_EXTRA_QUANTITY', payload: { extraId, quantity } }),
    [dispatch]
  );

  const handleContinue = useCallback(() => {
    if (state.wardrobeStilesAndTracksId) onComplete();
  }, [state.wardrobeStilesAndTracksId, onComplete]);

  if (isLoading) return <Step5Skeleton />;
  if (error)     return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.root}>

      {/* ── Section 1: Stiles & Tracks ──────────────────────────────── */}
      <div className={styles.section}>
        <p className={styles.sectionTitle}>Stiles & Tracks</p>
        <p className={styles.sectionSubtitle}>Choose your frame finish</p>
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
      </div>

      <hr className={styles.divider} />

      {/* ── Section 2: Extras ───────────────────────────────────────── */}
      <div className={styles.section}>
        <p className={styles.sectionTitle}>Extras</p>
        <p className={styles.sectionSubtitle}>
          Top and bottom tracks are included. Add optional extras below.
        </p>
        <div className={styles.extrasList}>
          {extrasOptions.map((extra) => {
            // Derive image key — End Panel uses melamine colour, rest use stiles id
            const imageKey = extra.id === 'extra-end-panel'
              ? state.wardrobeDoorMelamineColourId
              : state.wardrobeStilesAndTracksId;

            const quantity = state.wardrobeSelectedExtras[extra.id] ?? 0;

            return (
              <ExtraRow
                key={extra.id}
                extra={extra}
                quantity={quantity}
                imageKey={imageKey}
                isDefault={extra.isDefault}
                onQuantityChange={handleQuantityChange}
              />
            );
          })}
        </div>
      </div>

      {/* ── Actions ─────────────────────────────────────────────────── */}
      <div className={styles.actions}>
        <Button
          variant="primary"
          size="md"
          fullWidth
          disabled={!state.wardrobeStilesAndTracksId}
          onClick={handleContinue}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}