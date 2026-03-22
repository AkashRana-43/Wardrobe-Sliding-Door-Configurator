import React, { useState, useEffect, useCallback, useRef } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useWardrobeState } from '@/state/useWardrobeContext';
import { useCart } from '@/state/useCartAuth';
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
  if (value < MIN_WIDTH_MM)  return `Minimum width is ${MIN_WIDTH_MM}mm.`;
  if (value > MAX_WIDTH_MM)  return `Maximum width is ${MAX_WIDTH_MM}mm.`;
  return null;
}

function validateHeight(value: number): string | null {
  if (isNaN(value) || value <= 0) return 'Please enter a valid height.';
  if (value < MIN_HEIGHT_MM) return `Minimum height is ${MIN_HEIGHT_MM}mm.`;
  if (value > MAX_HEIGHT_MM) return `Maximum height is ${MAX_HEIGHT_MM}mm.`;
  return null;
}

function getStatus(error: string | null, value: string): InputStatus {
  if (!value)  return 'default';
  if (error)   return 'error';
  return 'success';
}

// ─── Inner form ───────────────────────────────────────────────────────────────

interface FormProps {
  initialWidth: string;
  initialHeight: string;
  onComplete: () => void;
}

function DimensionsForm({ initialWidth, initialHeight, onComplete }: FormProps) {
  const { state, dispatch } = useWardrobeState();

  const [heightRaw, setHeightRaw] = useState<string>(initialHeight);
  const [widthRaw,  setWidthRaw]  = useState<string>(initialWidth);

  // Sync inputs when a new snapshot is loaded externally (switching cart items)
  const prevInitialRef = useRef({ initialWidth, initialHeight });
  useEffect(() => {
    const prev = prevInitialRef.current;
    if (
      prev.initialWidth  !== initialWidth ||
      prev.initialHeight !== initialHeight
    ) {
      prevInitialRef.current = { initialWidth, initialHeight };
      const timer = setTimeout(() => {
        setWidthRaw(initialWidth);
        setHeightRaw(initialHeight);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [initialWidth, initialHeight]);

  const debouncedHeight = useDebounce(heightRaw, 400);
  const debouncedWidth  = useDebounce(widthRaw,  400);

  const heightNum = parseFloat(debouncedHeight);
  const widthNum  = parseFloat(debouncedWidth);

  const heightError = debouncedHeight ? validateHeight(heightNum) : null;
  const widthError  = debouncedWidth  ? validateWidth(widthNum)   : null;

  const isValid =
    debouncedHeight !== '' &&
    debouncedWidth  !== '' &&
    heightError === null &&
    widthError  === null;

  // ── Immediately update validity flag based on raw inputs (no debounce)
  //    so Update Cart disables the moment a field is cleared ────────────
  const isRawValid =
    heightRaw !== '' &&
    widthRaw  !== '' &&
    !validateHeight(parseFloat(heightRaw)) &&
    !validateWidth(parseFloat(widthRaw));

  useEffect(() => {
    if (isRawValid !== state.isDimensionsValid) {
      dispatch({ type: 'SET_DIMENSIONS_VALIDITY', payload: isRawValid });
    }
  }, [isRawValid, state.isDimensionsValid, dispatch]);

  // ── Debounced effect — dispatches SET_DIMENSIONS only when both
  //    fields are valid and the user has stopped typing ─────────────────
  useEffect(() => {
    if (!isValid) return;

    // Skip if reducer already has these exact dimensions — prevents
    // the debounce firing after LOAD_STATE and wiping door count /
    // door configurations.
    const existing = state.wardrobeDimensions;
    if (existing?.widthMm === widthNum && existing?.heightMm === heightNum) return;

    dispatch({
      type: 'SET_DIMENSIONS',
      payload: { widthMm: widthNum, heightMm: heightNum },
    });
  }, [debouncedWidth, debouncedHeight, isValid, widthNum, heightNum,
      state.wardrobeDimensions, dispatch]);

  // ── On unmount restore validity so next fresh session starts clean ──
  useEffect(() => {
    return () => {
      dispatch({ type: 'SET_DIMENSIONS_VALIDITY', payload: true });
    };
  }, [dispatch]);

  const handleHeightChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setHeightRaw(e.target.value),
    []
  );

  const handleWidthChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setWidthRaw(e.target.value),
    []
  );

  const handleContinue = useCallback(() => {
    if (isValid) onComplete();
  }, [isValid, onComplete]);

  const heightHelperText =
    !heightError && debouncedHeight && !isNaN(heightNum)
      ? `${heightNum}mm`
      : undefined;

  const widthHelperText =
    !widthError && debouncedWidth && !isNaN(widthNum)
      ? `${widthNum}mm`
      : undefined;

  return (
    <div className={styles.form}>
      <p className={styles.hint}>
        Enter your opening dimensions in millimetres.
        Height up to <strong>{MAX_HEIGHT_MM}mm</strong>, width up to <strong>{MAX_WIDTH_MM}mm</strong>.
      </p>

      <div className={styles.fieldRow}>
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
          helperText={heightHelperText}
          placeholder="e.g. 2400"
          required
        />
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
          helperText={widthHelperText}
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

// ─── Step2Dimensions ──────────────────────────────────────────────────────────

interface Props {
  onComplete: () => void;
}

export default function Step2Dimensions({ onComplete }: Props) {
  const { state } = useWardrobeState();
  const { cartState } = useCart();

  const initialWidth  = state.wardrobeDimensions?.widthMm.toString()  ?? '';
  const initialHeight = state.wardrobeDimensions?.heightMm.toString() ?? '';
  const formKey = cartState.editingItemId
    ?? (state.wardrobeDimensions === null ? 'empty' : 'filled');

  return (
    <DimensionsForm
      key={formKey}
      initialWidth={initialWidth}
      initialHeight={initialHeight}
      onComplete={onComplete}
    />
  );
}