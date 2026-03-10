import React, { useEffect, useState } from 'react';
import { slidingDoorService } from '@/services/slidingDoorService';
import { useWardrobeState } from '@/state/useWardrobeContext';
import { useCart, useAuth } from '@/state/useCartAuth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import type {
  WardrobeStilesAndTracks,
  WardrobeDoorMelamineColour,
  WardrobeExtra,
  WardrobeDoorInsert,
} from '@/domain/models/slidingDoorConfig';
import styles from './Step6Summary.module.css';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 2,
  }).format(cents / 100);
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
}

export default function Step6Summary({ onAddToCart, onQuote }: Props) {
  const { state, dispatch } = useWardrobeState();
  const { addToCart, openCart } = useCart();
  const { authState } = useAuth();

  const [stilesOptions, setStilesOptions] = useState<WardrobeStilesAndTracks[]>([]);
  const [colourOptions, setColourOptions] = useState<WardrobeDoorMelamineColour[]>([]);
  const [extrasOptions, setExtrasOptions] = useState<WardrobeExtra[]>([]);
  const [insertOptions, setInsertOptions] = useState<WardrobeDoorInsert[]>([]);
  const [isLoading, setIsLoading]         = useState(true);
  const [reference, setReference]         = useState('');

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      slidingDoorService.getWardrobeStilesAndTracks(),
      slidingDoorService.getWardrobeDoorMelamineColours(),
      slidingDoorService.getWardrobeExtras(),
      slidingDoorService.getWardrobeDoorInserts(),
    ])
      .then(([stilesData, coloursData, extrasData, insertsData]) => {
        if (!cancelled) {
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

  // ── Derived values ─────────────────────────────────────────────────
  const doorCount = state.wardrobeDoorCount ?? 0;

  const allDoorsHaveInsert =
    doorCount > 0 &&
    state.wardrobeDoorConfigurations.length === doorCount &&
    state.wardrobeDoorConfigurations.every((d) => d.insertId !== null);

  const selectedColour  = colourOptions.find((c) => c.id === state.wardrobeDoorMelamineColourId);
  const selectedStiles  = stilesOptions.find((s) => s.id === state.wardrobeStilesAndTracksId);
  const selectedExtras  = extrasOptions.filter((e) => (state.wardrobeSelectedExtras[e.id] ?? 0) > 0);
  const extrasTotal     = selectedExtras.reduce(
    (sum, e) => sum + e.price * (state.wardrobeSelectedExtras[e.id] ?? 0), 0
  );

  // ── Add to cart — reset configurator after ─────────────────────────
  const handleAddToCart = () => {
    addToCart({
      wardrobeSnapshot: { ...state },
      priceBreakdown: {
        basePrice: 0,
        wardrobeTypePrice: 0,
        insertPrice: 0,
        stilesAndTracksPrice: 0,
        extrasPrice: extrasTotal,
        total: extrasTotal,
      },
      reference: reference.trim() || undefined,
    });
    openCart();
    dispatch({ type: 'RESET' });
    onAddToCart();
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
              ? `${state.wardrobeDimensions.widthMm}mm × ${state.wardrobeDimensions.heightMm}mm`
              : <span className={styles.configEmpty}>—</span>}
          </ConfigRow>

          <ConfigRow label="Doors">
            {doorCount > 0
              ? `${doorCount} doors`
              : <span className={styles.configEmpty}>—</span>}
          </ConfigRow>

          <ConfigRow label="Door Colour">
            {allDoorsHaveInsert ? (
              <span className={styles.configNotRequired}>Not required</span>
            ) : selectedColour ? (
              <>
                <span className={styles.configDot} style={{ backgroundColor: selectedColour.hexPreview }} />
                {selectedColour.name}
              </>
            ) : (
              <span className={styles.configEmpty}>—</span>
            )}
          </ConfigRow>

          {Array.from({ length: doorCount }, (_, i) => {
            const insertId   = state.wardrobeDoorConfigurations.find((d) => d.doorIndex === i)?.insertId ?? null;
            const insertName = insertOptions.find((ins) => ins.id === insertId)?.name;
            return (
              <ConfigRow key={i} label={`Door ${i + 1}`}>
                {insertName ?? <span className={styles.configEmpty}>No insert</span>}
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

          {selectedExtras.map((extra) => (
            <ConfigRow key={extra.id} label={extra.name}>
              × {state.wardrobeSelectedExtras[extra.id]}
            </ConfigRow>
          ))}

        </div>
      </div>

      <hr className={styles.divider} />

      {/* ── Price (logged in only) ───────────────────────────────────── */}
      {authState.isLoggedIn && (
        <div className={styles.section}>
          <p className={styles.sectionTitle}>Pricing</p>
          <div className={styles.priceSection}>
            {selectedExtras.length > 0 ? (
              selectedExtras.map((extra) => {
                const qty = state.wardrobeSelectedExtras[extra.id] ?? 0;
                return (
                  <div key={extra.id} className={styles.priceRow}>
                    <span className={styles.priceLabel}>{extra.name} × {qty}</span>
                    <span className={styles.priceAmount}>{formatPrice(extra.price * qty)}</span>
                  </div>
                );
              })
            ) : (
              <p className={styles.priceEmpty}>No optional extras added</p>
            )}
            <div className={styles.priceTotalRow}>
              <span className={styles.priceTotalLabel}>Total</span>
              <span className={styles.priceTotalAmount}>{formatPrice(extrasTotal)}</span>
            </div>
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
      <div className={styles.actions}>
        {authState.isLoggedIn ? (
          <>
            <Input
              label="Reference"
              placeholder="e.g. Master bedroom, Client name…"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
            />
            <Button variant="primary" size="md" fullWidth onClick={handleAddToCart}>
              Add to Cart
            </Button>
          </>
        ) : (
          <Button variant="primary" size="md" fullWidth onClick={onQuote}>
            Ask a Quote
          </Button>
        )}
      </div>

    </div>
  );
}