import React, { useEffect, useRef, useState } from 'react';
import { slidingDoorService } from '@/services/slidingDoorService';
import { useWardrobeState } from '@/state/useWardrobeContext';
import { useCart, useAuth } from '@/state/useCartAuth';
import { calculateWardrobePrice } from '@/domain/pricing/wardrobePricing';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import type {
  WardrobeStilesAndTracks,
  WardrobeDoorMelamineColour,
  WardrobeExtra,
  WardrobeDoorInsert,
  WardrobeType,
  WardrobeWidthRange,
} from '@/domain/models/slidingDoorConfig';
import styles from './Step6Summary.module.css';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(dollars: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 2,
  }).format(dollars);
}

function formatType(id: string): string {
  return id.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

// ─── ConfigRow ────────────────────────────────────────────────────────────────

function ConfigRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className={styles.configRow}>
      <span className={styles.configLabel}>{label}</span>
      <span className={styles.configValue}>{children}</span>
    </div>
  );
}

// ─── Step6Summary ─────────────────────────────────────────────────────────────

interface Props {
  onAddToCart: () => void;
  onQuote: () => void;
  onCancelEdit?: () => void;
}

export default function Step6Summary({ onAddToCart, onQuote, onCancelEdit }: Props) {
  const { state, dispatch } = useWardrobeState();
  const { addToCart, openCart, updateItem, stopEditing, cartState } = useCart();
  const { authState } = useAuth();

  const editingId = cartState.editingItemId;

  const [wardrobeTypes, setWardrobeTypes] = useState<WardrobeType[]>([]);
  const [widthRanges, setWidthRanges] = useState<WardrobeWidthRange[]>([]);
  const [stilesOptions, setStilesOptions] = useState<WardrobeStilesAndTracks[]>([]);
  const [colourOptions, setColourOptions] = useState<WardrobeDoorMelamineColour[]>([]);
  const [extrasOptions, setExtrasOptions] = useState<WardrobeExtra[]>([]);
  const [insertOptions, setInsertOptions] = useState<WardrobeDoorInsert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reference, setReference] = useState('');

  // ── Tracks which editingId has already been loaded into state ──────
  // Stored as a ref so it never triggers re-renders and resets
  // correctly when switching between two cart items
  const loadedEditingIdRef = useRef<string | null>(null);

  // ── Load catalogue data ────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    Promise.all([
      slidingDoorService.getWardrobeTypes(),
      slidingDoorService.getWardrobeWidthRanges(),
      slidingDoorService.getWardrobeStilesAndTracks(),
      slidingDoorService.getWardrobeDoorMelamineColours(),
      slidingDoorService.getWardrobeExtras(),
      slidingDoorService.getWardrobeDoorInserts(),
    ])
      .then(([typesData, rangesData, stilesData, coloursData, extrasData, insertsData]) => {
        if (!cancelled) {
          setWardrobeTypes(typesData);
          setWidthRanges(rangesData);
          setStilesOptions(stilesData);
          setColourOptions(coloursData);
          setExtrasOptions(extrasData);
          setInsertOptions(insertsData);
          setIsLoading(false);
        }
      })
      .catch(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, []);

  // ── Load snapshot when a new editingId appears ─────────────────────
  useEffect(() => {
    // editingId cleared — reset the ref so next edit loads fresh
    if (!editingId) {
      loadedEditingIdRef.current = null;
      return;
    }

    // Already loaded this exact item — don't reload
    if (editingId === loadedEditingIdRef.current) return;

    // Mark as loaded immediately to prevent double-fire in StrictMode
    loadedEditingIdRef.current = editingId;

    const item = cartState.items.find((i) => i.id === editingId);
    if (!item) return;

    const snapshot = { ...item.wardrobeSnapshot };
    const ref = item.reference ?? '';

    // Defer to next microtask to avoid setState-in-effect warning
    Promise.resolve().then(() => {
      dispatch({
        type: 'LOAD_STATE',
        payload: {
          ...snapshot,
          wardrobeDoorLastCompletedStep: 6, // unlock all steps
        },
      });
      setReference(ref);
    });
  }, [editingId, cartState.items, dispatch]);

  // ── Derived values ─────────────────────────────────────────────────
  const doorCount = state.wardrobeDoorCount ?? 0;
  const globalColour = colourOptions.find((c) => c.id === state.wardrobeDoorMelamineColourId);
  const selectedStiles = stilesOptions.find((s) => s.id === state.wardrobeStilesAndTracksId);

  const priceBreakdown = isLoading ? null : calculateWardrobePrice(state, {
    wardrobeTypes,
    widthRanges,
    doorInserts: insertOptions,
    stilesAndTracks: stilesOptions,
    extras: extrasOptions,
  });

  const TRACK_IDS = ['extra-top-track', 'extra-bottom-track'];
  const selectedExtras = extrasOptions.filter(
    (e) => !TRACK_IDS.includes(e.id) && (state.wardrobeSelectedExtras[e.id] ?? 0) > 0
  );

  const topTrack = extrasOptions.find((e) => e.id === 'extra-top-track');
  const bottomTrack = extrasOptions.find((e) => e.id === 'extra-bottom-track');

  // ── Incomplete step detection ──────────────────────────────────────
  const incompleteSteps: string[] = [];
  if (!state.wardrobeTypeId) incompleteSteps.push('Wardrobe Type');
  if (!state.wardrobeDimensions) incompleteSteps.push('Dimensions');
  if (!state.wardrobeDoorCount) incompleteSteps.push('Door Count');
  if (
    !state.wardrobeDoorMelamineColourId &&
    !state.wardrobeDoorConfigurations.every(d => d.insertId !== null)
  ) incompleteSteps.push('Materials');
  if (!state.wardrobeStilesAndTracksId) incompleteSteps.push('Stiles, Tracks & Extras');

  const isReadyToOrder = incompleteSteps.length === 0 && !!priceBreakdown;

  // ── Add to cart / Update cart ──────────────────────────────────────
  const handleAddToCart = () => {
    if (!priceBreakdown) return;

    if (editingId) {
      updateItem(editingId, {
        wardrobeSnapshot: { ...state },
        priceBreakdown,
        reference: reference.trim() || undefined,
      });
      stopEditing();
      loadedEditingIdRef.current = null;
    } else {
      addToCart({
        wardrobeSnapshot: { ...state },
        priceBreakdown,
        reference: reference.trim() || undefined,
      });
    }

    openCart();
    dispatch({ type: 'RESET' });
    setReference('');
    onAddToCart();
  };

  const handleCancelEdit = () => {
    setReference('');
    onCancelEdit?.();
  };

  if (isLoading) return null;

  return (
    <div className={styles.root}>

      {/* ── Config recap ────────────────────────────────────────────── */}
      <div className={styles.section}>
        <p className={styles.sectionTitle}>Configuration</p>
        <div className={styles.configList}>

          <ConfigRow label="Type">
            {state.wardrobeTypeId
              ? formatType(state.wardrobeTypeId)
              : <span className={styles.configEmpty}>—</span>}
          </ConfigRow>

          <ConfigRow label="Dimensions">
            {state.wardrobeDimensions
              ? `${state.wardrobeDimensions.heightMm}mm × ${state.wardrobeDimensions.widthMm}mm`
              : <span className={styles.configEmpty}>—</span>}
          </ConfigRow>

          <ConfigRow label="Doors">
            {doorCount > 0
              ? `${doorCount} doors`
              : <span className={styles.configEmpty}>—</span>}
          </ConfigRow>

          {globalColour && (
            <ConfigRow label={
              state.wardrobeDoorConfigurations.some(d => d.insertId !== null)
                ? 'Door Colour (remaining)'
                : 'Door Colour'
            }>
              <span className={styles.configDot} style={{ backgroundColor: globalColour.hexPreview }} />
              {globalColour.name}
            </ConfigRow>
          )}

          {Array.from({ length: doorCount }, (_, i) => {
            const doorCfg = state.wardrobeDoorConfigurations.find((d) => d.doorIndex === i);
            const insert = insertOptions.find((ins) => ins.id === doorCfg?.insertId);
            if (!insert) return null;
            return (
              <ConfigRow key={i} label={`Door ${i + 1}`}>
                {insert.name}
              </ConfigRow>
            );
          })}

          <ConfigRow label="Stiles & Tracks">
            {selectedStiles ? (
              <>
                <span className={styles.configDot} style={{ backgroundColor: selectedStiles.colour }} />
                {selectedStiles.name}
              </>
            ) : (
              <span className={styles.configEmpty}>—</span>
            )}
          </ConfigRow>

          {topTrack && (state.wardrobeSelectedExtras[topTrack.id] ?? 0) > 0 && (
            <ConfigRow label="Top Track">
              {state.wardrobeTrackLengthMm.top != null
                ? `${state.wardrobeTrackLengthMm.top}mm × ${state.wardrobeSelectedExtras[topTrack.id]}`
                : `× ${state.wardrobeSelectedExtras[topTrack.id]}`}
            </ConfigRow>
          )}

          {bottomTrack && (state.wardrobeSelectedExtras[bottomTrack.id] ?? 0) > 0 && (
            <ConfigRow label="Bottom Track">
              {state.wardrobeTrackLengthMm.bottom != null
                ? `${state.wardrobeTrackLengthMm.bottom}mm × ${state.wardrobeSelectedExtras[bottomTrack.id]}`
                : `× ${state.wardrobeSelectedExtras[bottomTrack.id]}`}
            </ConfigRow>
          )}

          {selectedExtras.map((extra) => (
            <ConfigRow key={extra.id} label={extra.name}>
              × {state.wardrobeSelectedExtras[extra.id]}
            </ConfigRow>
          ))}

        </div>
      </div>

      <hr className={styles.divider} />

      {/* ── Price (logged in only) ───────────────────────────────────── */}
      {authState.isLoggedIn && priceBreakdown && (
        <div className={styles.section}>
          <p className={styles.sectionTitle}>Pricing</p>
          <div className={styles.priceSection}>
            <div className={styles.priceTotalRow}>
              <span className={styles.priceTotalLabel}>Total</span>
              <span className={styles.priceTotalAmount}>{formatPrice(priceBreakdown.total)}</span>
            </div>
            <p className={styles.priceGstNote}>Price excludes GST</p>
          </div>
        </div>
      )}

      {/* ── Quote note (logged out) ──────────────────────────────────── */}
      {!authState.isLoggedIn && (
        <p className={styles.quoteNote}>
          Create an account or log in to see pricing. Submit a quote request and we'll be in touch.
        </p>
      )}

      {/* ── Actions ─────────────────────────────────────────────────── */}
      {authState.isLoggedIn && (
        <div className={styles.actions}>
          {!isReadyToOrder && incompleteSteps.length > 0 && (
            <p className={styles.incompleteNote}>
              Please complete: <strong>{incompleteSteps.join(', ')}</strong> to proceed.
            </p>
          )}
          <Input
            label="Reference"
            placeholder="e.g. Master bedroom, Client name…"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
          />
          <Button
            variant="primary"
            size="md"
            fullWidth
            disabled={!isReadyToOrder}
            onClick={handleAddToCart}
          >
            {editingId ? 'Update Cart' : 'Add to Cart'}
          </Button>
        </div>
      )}

      {editingId && onCancelEdit && (
        <Button
          variant="secondary"
          size="md"
          fullWidth
          onClick={handleCancelEdit}
        >
          Cancel Edit
        </Button>
      )}

      {!authState.isLoggedIn && (
        <div className={styles.actions}>
          {!isReadyToOrder && incompleteSteps.length > 0 && (
            <p className={styles.incompleteNote}>
              Please complete: <strong>{incompleteSteps.join(', ')}</strong> to proceed.
            </p>
          )}
          <Button
            variant="primary"
            size="md"
            fullWidth
            disabled={!isReadyToOrder}
            onClick={onQuote}
          >
            Ask a Quote
          </Button>
        </div>
      )}

    </div>
  );
}