import React, { useState, useEffect, useCallback } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useWardrobeState } from '@/state/useWardrobeContext';
import { useDebounce } from '@/hooks/useDebounce';
import type { InputStatus } from '@/components/ui/Input';
import styles from './Step2Dimensions.module.css';

// ─── Constants ────────────────────────────────────────────────────────────────

const MIN_WIDTH_MM  = 0;
const MAX_WIDTH_MM  = 5100;
const MIN_HEIGHT_MM = 0;
const MAX_HEIGHT_MM = 2735;

// ─── Validation ───────────────────────────────────────────────────────────────

function validateWidth(value: number): string | null {
  if (isNaN(value) || value <= 0) return 'Please enter a valid width.';
  if (value < MIN_WIDTH_MM) return `Minimum width is ${MIN_WIDTH_MM}mm.`;
  if (value > MAX_WIDTH_MM) return `Maximum width is ${MAX_WIDTH_MM}mm.`;
  return null;
}

function validateHeight(value: number): string | null {
  if (isNaN(value) || value <= 0) return 'Please enter a valid height.';
  if (value < MIN_HEIGHT_MM) return `Minimum height is ${MIN_HEIGHT_MM}mm.`;
  if (value > MAX_HEIGHT_MM) return `Maximum height is ${MAX_HEIGHT_MM}mm.`;
  return null;
}

function getStatus(error: string | null, value: string): InputStatus {
  if (!value) return 'default';
  if (error) return 'error';
  return 'success';
}

// ─── Step2Dimensions ──────────────────────────────────────────────────────────

interface Props {
  onComplete: () => void;
}

export default function Step2Dimensions({ onComplete }: Props) {
  const { state, dispatch } = useWardrobeState();

  // ── Local input state (string to allow empty/partial input) ────────
  const [widthRaw, setWidthRaw]   = useState<string>(
    state.wardrobeDimensions?.widthMm.toString() ?? ''
  );
  const [heightRaw, setHeightRaw] = useState<string>(
    state.wardrobeDimensions?.heightMm.toString() ?? ''
  );

  // ── Sync local state when reducer resets (wardrobeDimensions → null) ─
  useEffect(() => {
    if (state.wardrobeDimensions === null) {
      setWidthRaw('');
      setHeightRaw('');
    }
  }, [state.wardrobeDimensions]);

  // ── Debounced values — only dispatch after user stops typing ───────
  const debouncedWidth  = useDebounce(widthRaw,  400);
  const debouncedHeight = useDebounce(heightRaw, 400);

  // ── Derived validation ─────────────────────────────────────────────
  const widthNum  = parseFloat(debouncedWidth);
  const heightNum = parseFloat(debouncedHeight);

  const widthError  = debouncedWidth  ? validateWidth(widthNum)   : null;
  const heightError = debouncedHeight ? validateHeight(heightNum) : null;

  const isValid =
    debouncedWidth !== '' &&
    debouncedHeight !== '' &&
    widthError === null &&
    heightError === null;

  // ── Dispatch to context when debounced values are valid ────────────
  useEffect(() => {
    if (isValid) {
      dispatch({
        type: 'SET_DIMENSIONS',
        payload: { widthMm: widthNum, heightMm: heightNum },
      });
    }
  }, [debouncedWidth, debouncedHeight, isValid, widthNum, heightNum, dispatch]);

  // ── Handlers ───────────────────────────────────────────────────────
  const handleWidthChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setWidthRaw(e.target.value),
    []
  );

  const handleHeightChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setHeightRaw(e.target.value),
    []
  );

  const handleContinue = useCallback(() => {
    if (isValid) onComplete();
  }, [isValid, onComplete]);

  return (
    <div className={styles.form}>
      <p className={styles.hint}>
        Enter your opening dimensions in millimetres.
        Width up to <strong>{MAX_WIDTH_MM}mm</strong>, height up to <strong>{MAX_HEIGHT_MM}mm</strong>.
      </p>

      <div className={styles.fieldRow}>
        <Input
          label="Width"
          type="number"
          suffix="mm"
          min={MIN_WIDTH_MM}
          max={MAX_WIDTH_MM}
          step={1}
          value={widthRaw}
          onChange={handleWidthChange}
          status={getStatus(widthError, widthRaw)}
          errorText={widthError ?? undefined}
          helperText={!widthError && widthRaw ? `${widthNum}mm` : undefined}
          placeholder="e.g. 2400"
          required
        />

        <Input
          label="Height"
          type="number"
          suffix="mm"
          min={MIN_HEIGHT_MM}
          max={MAX_HEIGHT_MM}
          step={1}
          value={heightRaw}
          onChange={handleHeightChange}
          status={getStatus(heightError, heightRaw)}
          errorText={heightError ?? undefined}
          helperText={!heightError && heightRaw ? `${heightNum}mm` : undefined}
          placeholder="e.g. 2400"
          required
        />
      </div>

      <div className={styles.actions}>
        <Button
          variant="primary"
          size="md"
          fullWidth
          disabled={!isValid}
          onClick={handleContinue}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}