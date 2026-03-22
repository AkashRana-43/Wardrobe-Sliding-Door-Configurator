import React, { useEffect, useState, useCallback } from 'react';
import { slidingDoorService } from '@/services/slidingDoorService';
import { useWardrobeState } from '@/state/useWardrobeContext';
import Button from '@/components/ui/Button';
import { SkeletonBox } from '@/components/ui/SkeletonLoader';
import type {
  WardrobeDoorMelamineColour,
  WardrobeDoorInsert,
} from '@/domain/models/slidingDoorConfig';
import styles from './Step4Materials.module.css';

// ─── ColourSwatch ─────────────────────────────────────────────────────────────

interface ColourSwatchProps {
  colour: WardrobeDoorMelamineColour;
  isSelected: boolean;
  disabled: boolean;
  onSelect: (id: string) => void;
}

const ColourSwatch = React.memo(function ColourSwatch({
  colour, isSelected, disabled, onSelect,
}: ColourSwatchProps) {
  const [imgError, setImgError] = useState(false);
  return (
    <button
      type="button"
      className={[
        styles.swatchButton,
        isSelected ? styles.swatchButtonActive : '',
        disabled ? styles.swatchButtonDisabled : '',
      ].filter(Boolean).join(' ')}
      onClick={() => !disabled && onSelect(colour.id)}
      disabled={disabled}
      aria-pressed={isSelected}
      aria-label={colour.name}
      title={colour.name}
    >
      <div className={[styles.swatch, isSelected ? styles.swatchActive : ''].filter(Boolean).join(' ')}>
        {!imgError ? (
          <img
            src={colour.image?.url ?? ''}
            alt={colour.name}
            className={styles.swatchImg}
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <span className={styles.swatchHex} style={{ backgroundColor: colour.hexPreview }} />
        )}
      </div>
      <span className={[styles.swatchName, isSelected ? styles.swatchNameActive : ''].filter(Boolean).join(' ')}>
        {colour.name}
      </span>
    </button>
  );
});

// ─── InsertCard ───────────────────────────────────────────────────────────────

interface InsertCardProps {
  insert: WardrobeDoorInsert;
  isSelected: boolean;
  onSelect: () => void;
}

const InsertCard = React.memo(function InsertCard({ insert, isSelected, onSelect }: InsertCardProps) {
  const [imgError, setImgError] = useState(false);
  return (
    <button
      type="button"
      className={[
        styles.optionCard,
        isSelected ? styles.optionCardActive : '',
      ].filter(Boolean).join(' ')}
      onClick={onSelect}
      aria-pressed={isSelected}
      aria-label={insert.name}
    >
      <div className={styles.optionImageWrap}>
        {insert.image?.url && !imgError ? (
          <img
            src={insert.image.url}
            alt={insert.name}
            className={styles.optionImage}
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <span className={styles.optionImageFallback} />
        )}
      </div>
      <span className={[styles.optionName, isSelected ? styles.optionNameActive : ''].filter(Boolean).join(' ')}>
        {insert.name}
      </span>
    </button>
  );
});

// ─── DoorIndicator ────────────────────────────────────────────────────────────

interface DoorIndicatorProps {
  doorIndex: number;
  globalColour: WardrobeDoorMelamineColour | null;
  selectedInsert: WardrobeDoorInsert | null;
  isIncomplete: boolean;
}

const DoorIndicator = React.memo(function DoorIndicator({
  doorIndex, globalColour, selectedInsert, isIncomplete,
}: DoorIndicatorProps) {
  const [imgError, setImgError] = useState(false);

  const image = selectedInsert?.image?.url ?? globalColour?.image?.url ?? null;

  const prevImageRef = React.useRef<string | null>(null);
  if (prevImageRef.current !== image) {
    prevImageRef.current = image;
    if (imgError) setImgError(false);
  }
  const hex   = selectedInsert ? undefined : globalColour?.hexPreview;
  const label = selectedInsert?.name ?? globalColour?.name ?? null;

  return (
    <div className={[
      styles.doorIndicator,
      isIncomplete ? styles.doorIndicatorIncomplete : '',
    ].filter(Boolean).join(' ')}>
      <div className={styles.doorIndicatorThumb}>
        {image && !imgError ? (
          <img
            src={image}
            alt={label ?? ''}
            className={styles.doorIndicatorImg}
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : hex ? (
          <span className={styles.doorIndicatorHex} style={{ backgroundColor: hex }} />
        ) : (
          <span className={styles.doorIndicatorEmpty} aria-hidden="true">?</span>
        )}
      </div>
      <div className={styles.doorIndicatorMeta}>
        <span className={styles.doorIndicatorTitle}>Door {doorIndex + 1}</span>
        <span className={[
          styles.doorIndicatorValue,
          isIncomplete ? styles.doorIndicatorValueWarning : '',
        ].filter(Boolean).join(' ')}>
          {selectedInsert
            ? selectedInsert.name
            : globalColour
              ? globalColour.name
              : 'Select an option'}
        </span>
      </div>
    </div>
  );
});

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Step4Skeleton() {
  return (
    <div className={styles.root}>
      <div className={styles.section}>
        <SkeletonBox width={120} height={13} borderRadius="var(--radius-sm)" />
        <SkeletonBox width={200} height={11} borderRadius="var(--radius-sm)" />
        <div className={styles.swatchRow}>
          {Array.from({ length: 7 }, (_, i) => (
            <SkeletonBox key={i} width={64} height={82} borderRadius="var(--radius-md)" />
          ))}
        </div>
      </div>
      <div className={styles.divider} />
      <div className={styles.section}>
        <SkeletonBox width={100} height={13} borderRadius="var(--radius-sm)" />
        {Array.from({ length: 2 }, (_, i) => (
          <div key={i} className={styles.doorBlock}>
            <SkeletonBox width="100%" height={60} borderRadius="var(--radius-card)" />
            <div className={styles.optionGrid}>
              {Array.from({ length: 4 }, (_, j) => (
                <SkeletonBox key={j} width="100%" height={88} borderRadius="var(--radius-card)" />
              ))}
            </div>
          </div>
        ))}
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

  const doorCount      = state.wardrobeDoorCount ?? 0;
  const globalColourId = state.wardrobeDoorMelamineColourId;
  const globalColour   = colours.find((c) => c.id === globalColourId) ?? null;

  const allDoorsHaveInsert =
    doorCount > 0 &&
    Array.from({ length: doorCount }, (_, i) => i).every((i) => {
      const cfg = state.wardrobeDoorConfigurations.find((d) => d.doorIndex === i);
      return cfg?.insertId != null;
    });

  const canContinue =
    doorCount > 0 &&
    Array.from({ length: doorCount }, (_, i) => i).every((i) => {
      const cfg = state.wardrobeDoorConfigurations.find((d) => d.doorIndex === i);
      return cfg?.insertId != null || globalColourId != null;
    });

  const handleColourSelect = useCallback((colourId: string) => {
    dispatch({ type: 'SET_MELAMINE_COLOUR', payload: colourId });
  }, [dispatch]);

  const handleInsertSelect = useCallback((doorIndex: number, insertId: string) => {
    const currentInsertId = state.wardrobeDoorConfigurations
      .find((d) => d.doorIndex === doorIndex)?.insertId ?? null;

    const nextInsertId = currentInsertId === insertId ? null : insertId;
    dispatch({ type: 'SET_DOOR_INSERT', payload: { doorIndex, insertId: nextInsertId } });

    if (nextInsertId !== null) {
      const updatedConfigs = state.wardrobeDoorConfigurations.map((d) =>
        d.doorIndex === doorIndex ? { ...d, insertId: nextInsertId } : d
      );
      const willAllHaveInsert = Array.from({ length: doorCount }, (_, i) => i).every((i) => {
        const cfg = updatedConfigs.find((d) => d.doorIndex === i);
        return cfg?.insertId != null;
      });
      if (willAllHaveInsert) {
        dispatch({ type: 'CLEAR_MELAMINE_COLOUR' });
      }
    }
  }, [dispatch, state.wardrobeDoorConfigurations, doorCount]);

  const handleContinue = useCallback(() => {
    if (canContinue) onComplete();
  }, [canContinue, onComplete]);

  if (isLoading) return <Step4Skeleton />;
  if (error)     return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.root}>

      {/* ── Section 1: Global melamine colour ───────────────────────── */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <p className={styles.sectionTitle}>Door Colour</p>
          <p className={styles.sectionSubtitle}>
            {allDoorsHaveInsert
              ? 'Not required — all doors are configured.'
              : 'Applies to all non-configured doors.'}
          </p>
        </div>

        <div className={styles.swatchRow} role="radiogroup" aria-label="Door colour">
          {colours.map((colour) => (
            <ColourSwatch
              key={colour.id}
              colour={colour}
              isSelected={globalColourId === colour.id}
              disabled={allDoorsHaveInsert}
              onSelect={handleColourSelect}
            />
          ))}
        </div>
      </div>

      <hr className={styles.divider} />

      {/* ── Section 2: Per-door inserts ─────────────────────────────── */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <p className={styles.sectionTitle}>Door Configuration</p>
          <p className={styles.sectionSubtitle}>
            Configure your door individually by selecting the available options.
          </p>
        </div>

        {Array.from({ length: doorCount }, (_, doorIndex) => {
          const doorCfg          = state.wardrobeDoorConfigurations.find((d) => d.doorIndex === doorIndex);
          const selectedInsertId = doorCfg?.insertId ?? null;
          const selectedInsert   = inserts.find((ins) => ins.id === selectedInsertId) ?? null;
          const isIncomplete     = selectedInsertId === null && globalColourId === null;

          return (
            <div key={doorIndex} className={styles.doorBlock}>
              <DoorIndicator
                doorIndex={doorIndex}
                globalColour={globalColour}
                selectedInsert={selectedInsert}
                isIncomplete={isIncomplete}
              />
              <div className={styles.optionGrid} role="radiogroup" aria-label={`Insert for door ${doorIndex + 1}`}>
                {inserts.map((insert) => (
                  <InsertCard
                    key={insert.id}
                    insert={insert}
                    isSelected={selectedInsertId === insert.id}
                    onSelect={() => handleInsertSelect(doorIndex, insert.id)}
                  />
                ))}
              </div>
              {selectedInsertId !== null && (
                <p className={styles.deselectHint}>
                  Click an option to select or deselect it.
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className={styles.actions}>
        <Button variant="primary" size="md" fullWidth disabled={!canContinue} onClick={handleContinue}>
          Continue
        </Button>
      </div>

    </div>
  );
}