import React, { useEffect, useState, useCallback } from 'react';
import { slidingDoorService } from '@/services/slidingDoorService';
import { useWardrobeState } from '@/state/useWardrobeContext';
import Button from '@/components/ui/Button';
import { SkeletonSwatch, SkeletonBox } from '@/components/ui/SkeletonLoader';
import type {
  WardrobeDoorMelamineColour,
  WardrobeDoorInsert,
} from '@/domain/models/slidingDoorConfig';
import styles from './Step4Materials.module.css';

// ─── ColourSwatch ─────────────────────────────────────────────────────────────

interface ColourSwatchProps {
  colour: WardrobeDoorMelamineColour;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const ColourSwatch = React.memo(function ColourSwatch({ colour, isSelected, onSelect }: ColourSwatchProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <button
      type="button"
      className={styles.swatchButton}
      onClick={() => onSelect(colour.id)}
      aria-pressed={isSelected}
      aria-label={colour.name}
      title={colour.name}
    >
      <span
        className={isSelected ? `${styles.swatch} ${styles.swatchActive}` : styles.swatch}
        style={imgError ? { backgroundColor: colour.hexPreview } : undefined}
      >
        {!imgError && (
          <img
            src={colour.image}
            alt={colour.hexPreview}
            className={styles.swatchImg}
            onError={() => setImgError(true)}
            loading="lazy"
          />
        )}
      </span>
      <span className={isSelected ? `${styles.swatchName} ${styles.swatchNameActive}` : styles.swatchName}>
        {colour.name}
      </span>
    </button>
  );
});

// ─── InsertCard ───────────────────────────────────────────────────────────────

interface InsertCardProps {
  insert: WardrobeDoorInsert | null;
  isSelected: boolean;
  onSelect: (id: string | null) => void;
}

const InsertCard = React.memo(function InsertCard({ insert, isSelected, onSelect }: InsertCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <button
      type="button"
      className={isSelected ? `${styles.insertCard} ${styles.insertCardActive}` : styles.insertCard}
      onClick={() => onSelect(insert?.id ?? null)}
      aria-pressed={isSelected}
      aria-label={insert ? insert.name : 'No insert'}
    >
      <div className={styles.insertImageWrap}>
        {insert && !imgError ? (
          <img
            src={insert.image}
            alt={insert.name}
            className={styles.insertImage}
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <span className={styles.insertImageFallback} aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25">
              {insert
                ? <rect x="3" y="3" width="18" height="18" rx="2" />
                : <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
              }
            </svg>
          </span>
        )}
      </div>
      <span className={isSelected ? `${styles.insertName} ${styles.insertNameActive}` : styles.insertName}>
        {insert ? insert.name : 'None'}
      </span>
    </button>
  );
});

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Step4Skeleton() {
  return (
    <div className={styles.root}>
      <div className={styles.section}>
        <SkeletonBox width={120} height={16} borderRadius="var(--radius-sm)" />
        <div className={styles.skeletonSwatches}>
          {Array.from({ length: 6 }, (_, i) => <SkeletonSwatch key={i} size="lg" />)}
        </div>
      </div>
      <div className={styles.section}>
        <SkeletonBox width={160} height={16} borderRadius="var(--radius-sm)" />
        <div className={styles.skeletonInsertGrid}>
          {Array.from({ length: 5 }, (_, i) => (
            <SkeletonBox key={i} width="100%" height={90} borderRadius="var(--radius-card)" />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Step4Materials ───────────────────────────────────────────────────────────

interface Props {
  onComplete: () => void;
}

export default function Step4Materials({ onComplete }: Props) {
  const { state, dispatch } = useWardrobeState();
  const [colours, setColours]     = useState<WardrobeDoorMelamineColour[]>([]);
  const [inserts, setInserts]     = useState<WardrobeDoorInsert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError]         = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      slidingDoorService.getWardrobeDoorMelamineColours(),
      slidingDoorService.getWardrobeDoorInserts(),
    ])
      .then(([coloursData, insertsData]) => {
        if (!cancelled) {
          setColours(coloursData);
          setInserts(insertsData);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError('Failed to load material options.');
          setIsLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, []);

  // ── Declare doorCount BEFORE any callbacks that reference it ───────
  const doorCount = state.wardrobeDoorCount ?? 0;

  const allDoorsHaveInsert =
    doorCount > 0 &&
    state.wardrobeDoorConfigurations.length === doorCount &&
    state.wardrobeDoorConfigurations.every((d) => d.insertId !== null);

  const colourRequired = !allDoorsHaveInsert;
  const canContinue    = colourRequired ? !!state.wardrobeDoorMelamineColourId : true;

  // ── Callbacks ──────────────────────────────────────────────────────
  const handleColourSelect = useCallback(
    (id: string) => dispatch({ type: 'SET_MELAMINE_COLOUR', payload: id }),
    [dispatch]
  );

  const handleInsertSelect = useCallback(
    (doorIndex: number, insertId: string | null) => {
      dispatch({ type: 'SET_DOOR_INSERT', payload: { doorIndex, insertId } });

      // Compute what configs will look like after this update
      const updatedConfigs = state.wardrobeDoorConfigurations.map((d) =>
        d.doorIndex === doorIndex ? { ...d, insertId } : d
      );
      const willAllHaveInserts =
        doorCount > 0 &&
        updatedConfigs.length === doorCount &&
        updatedConfigs.every((d) => d.insertId !== null);

      if (willAllHaveInserts) {
        dispatch({ type: 'CLEAR_MELAMINE_COLOUR' });
      }
    },
    [dispatch, state.wardrobeDoorConfigurations, doorCount]
  );

  const handleContinue = useCallback(() => {
    if (canContinue) onComplete();
  }, [canContinue, onComplete]);

  // ── Render ─────────────────────────────────────────────────────────
  if (isLoading) return <Step4Skeleton />;
  if (error)     return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.root}>

      {/* ── Door Colour ─────────────────────────────────────────────── */}
      <div className={styles.section}>
        <p className={styles.sectionTitle}>Door Colour</p>
        <p className={styles.sectionSubtitle}>
          Applies to all {doorCount} doors
          {!colourRequired && (
            <span className={styles.sectionSubtitleOptional}> — optional, all doors have inserts</span>
          )}
        </p>
        <div className={styles.swatchGrid} role="radiogroup" aria-label="Select door colour">
          {colours.map((colour) => (
            <ColourSwatch
              key={colour.id}
              colour={colour}
              isSelected={state.wardrobeDoorMelamineColourId === colour.id}
              onSelect={handleColourSelect}
            />
          ))}
        </div>
      </div>

      <hr className={styles.divider} />

      {/* ── Door Inserts ────────────────────────────────────────────── */}
      <div className={styles.section}>
        <p className={styles.sectionTitle}>Door Inserts</p>
        <p className={styles.sectionSubtitle}>Optionally add an insert to each door</p>

        {Array.from({ length: doorCount }, (_, doorIndex) => {
          const selectedInsertId =
            state.wardrobeDoorConfigurations.find((d) => d.doorIndex === doorIndex)?.insertId ?? null;

          return (
            <div key={doorIndex} className={styles.doorBlock}>
              <p className={styles.doorLabel}>Door {doorIndex + 1}</p>
              <div className={styles.insertGrid} role="radiogroup" aria-label={`Insert for door ${doorIndex + 1}`}>
                <InsertCard
                  insert={null}
                  isSelected={selectedInsertId === null}
                  onSelect={(id) => handleInsertSelect(doorIndex, id)}
                />
                {inserts.map((insert) => (
                  <InsertCard
                    key={insert.id}
                    insert={insert}
                    isSelected={selectedInsertId === insert.id}
                    onSelect={(id) => handleInsertSelect(doorIndex, id)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

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