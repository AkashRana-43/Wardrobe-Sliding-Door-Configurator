import React, { lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ConfiguratorAccordion from '@/pages/Configurator/components/ConfiguratorAccordion/ConfiguratorAccordion';
import { useWardrobeState } from '@/state/useWardrobeContext';
import { useCart } from '@/state/useCartAuth';
import { slidingDoorService } from '@/services/slidingDoorService';
import type { WardrobeDoorMelamineColour } from '@/domain/models/slidingDoorConfig';
import styles from './ConfiguratorPage.module.css';

// ─── Lazy-loaded step components ──────────────────────────────────────────────

const Step1WardrobeType = lazy(() => import('./steps/Step1WardrobeType'));
const Step2Dimensions   = lazy(() => import('./steps/Step2Dimensions'));
const Step3DoorCount    = lazy(() => import('./steps/Step3DoorCount'));
const Step4Materials    = lazy(() => import('./steps/Step4Materials'));
const Step5StilesExtras = lazy(() => import('./steps/Step5StilesExtras'));
const Step6Summary      = lazy(() => import('./steps/Step6Summary'));

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Build a completed-steps Set from a lastCompletedStep number. */
function buildCompletedSteps(lastCompletedStep: number): Set<number> {
  const s = new Set<number>();
  for (let i = 1; i <= lastCompletedStep; i++) s.add(i);
  return s;
}

// ─── ConfiguratorPage ─────────────────────────────────────────────────────────

function ConfiguratorPage() {
  const { state: wardrobeState, dispatch } = useWardrobeState();
  const { openCart, cartState, stopEditing } = useCart();

  const [activeStep,     setActiveStep]     = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  // ── Colour catalogue for Step 4 summary label ─────────────────────
  const [colourOptions, setColourOptions] = useState<WardrobeDoorMelamineColour[]>([]);

  useEffect(() => {
    slidingDoorService.getWardrobeDoorMelamineColours()
      .then(setColourOptions)
      .catch(() => {});
  }, []);

  // ── Sync accordion state when LOAD_STATE fires during edit ─────────
  const lastSyncedCompletedStepRef = useRef<number>(0);
  const prevEditingIdRef           = useRef<string | null>(null);

  useEffect(() => {
    const last = wardrobeState.wardrobeDoorLastCompletedStep;
    if (last === lastSyncedCompletedStepRef.current) return;

    lastSyncedCompletedStepRef.current = last;

    if (last >= 6) {
      const timer = setTimeout(() => {
        setCompletedSteps(buildCompletedSteps(6));
        setActiveStep(1);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [wardrobeState.wardrobeDoorLastCompletedStep]);

  useEffect(() => {
    const editingId  = cartState.editingItemId;
    const wasEditing = prevEditingIdRef.current !== null;
    const isEditing  = editingId !== null;
    prevEditingIdRef.current = editingId;

    if (wasEditing && !isEditing) {
      const timer = setTimeout(() => {
        lastSyncedCompletedStepRef.current = 0;
        setActiveStep(1);
        setCompletedSteps(new Set());
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [cartState.editingItemId]);

  // ── Step navigation ────────────────────────────────────────────────

  const handleStepToggle = useCallback((stepNumber: number) => {
    setActiveStep((prev) => (prev === stepNumber ? 0 : stepNumber));
  }, []);

  const handleStepComplete = useCallback((stepNumber: number) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      next.add(stepNumber);
      return next;
    });
    if (stepNumber < 6) setActiveStep(stepNumber + 1);
  }, []);

  const handleAddToCart = useCallback(() => {
    lastSyncedCompletedStepRef.current = 0;
    setActiveStep(1);
    setCompletedSteps(new Set());
    openCart();
  }, [openCart]);

  const handleQuote = useCallback(() => {
    alert('Requesting a quote…');
  }, []);

  const handleCancelEdit = useCallback(() => {
    stopEditing();
    dispatch({ type: 'RESET' });
  }, [stopEditing, dispatch]);

  // ── Step content ───────────────────────────────────────────────────

  const stepContent = useMemo<Record<number, React.ReactNode>>(
    () => ({
      1: <Step1WardrobeType onComplete={() => handleStepComplete(1)} />,
      2: <Step2Dimensions   onComplete={() => handleStepComplete(2)} />,
      3: <Step3DoorCount    onComplete={() => handleStepComplete(3)} />,
      4: <Step4Materials    onComplete={() => handleStepComplete(4)} />,
      5: <Step5StilesExtras onComplete={() => handleStepComplete(5)} />,
      6: <Step6Summary onAddToCart={handleAddToCart} onQuote={handleQuote} onCancelEdit={handleCancelEdit} />,
    }),
    [handleStepComplete, handleAddToCart, handleQuote, handleCancelEdit]
  );

  // ── Step summaries ─────────────────────────────────────────────────

  const stepSummaries = useMemo<Partial<Record<number, string>>>(() => {
    const s: Partial<Record<number, string>> = {};

    // Step 1 — Wardrobe type
    if (wardrobeState.wardrobeTypeId) {
      s[1] = wardrobeState.wardrobeTypeId
        .replace(/_/g, ' ')
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase());
    }

    // Step 2 — Dimensions
    if (wardrobeState.wardrobeDimensions) {
      const { widthMm, heightMm } = wardrobeState.wardrobeDimensions;
      s[2] = `${heightMm}mm × ${widthMm}mm`;
    }

    // Step 3 — Door count
    if (wardrobeState.wardrobeDoorCount) {
      s[3] = `${wardrobeState.wardrobeDoorCount} doors`;
    }

    // Step 4 — Materials
    const doorCount       = wardrobeState.wardrobeDoorCount ?? 0;
    const hasGlobalColour = wardrobeState.wardrobeDoorMelamineColourId !== null;

    if (doorCount > 0 && (hasGlobalColour || wardrobeState.wardrobeDoorConfigurations.length > 0)) {
      const doorsWithInsert = wardrobeState.wardrobeDoorConfigurations.filter(
        (d) => d.insertId !== null
      ).length;

      const colourName = colourOptions.find(
        (c) => c.id === wardrobeState.wardrobeDoorMelamineColourId
      )?.name ?? null;

      if (doorsWithInsert === doorCount) {
        // All doors have inserts — no global colour involved
        s[4] = `${doorCount} door${doorCount === 1 ? '' : 's'} configured`;
      } else if (doorsWithInsert > 0 && hasGlobalColour) {
        // Mix: some doors have inserts, rest use global colour
        s[4] = colourName
          ? `${colourName} ( ${doorsWithInsert} of ${doorCount} doors configured )`
          : `${doorsWithInsert} of ${doorCount} doors configured`;
      } else if (hasGlobalColour) {
        // All doors use global colour only
        s[4] = colourName
          ? `${colourName} ( ${doorCount} door${doorCount === 1 ? '' : 's'} configured )`
          : `${doorCount} door${doorCount === 1 ? '' : 's'} configured`;
      }
    }

    // Step 5 — Stiles & Tracks
    if (wardrobeState.wardrobeStilesAndTracksId) {
      s[5] = wardrobeState.wardrobeStilesAndTracksId
        .replace('stiles-tracks-', '')
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
    }

    return s;
  }, [wardrobeState, colourOptions]);

  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Configure Your Wardrobe Sliding Door</h1>
          <p className={styles.pageSubtitle}>
            Work through each step to build your perfect wardrobe sliding door.
          </p>
        </div>
        <div className={styles.accordionWrap}>
          <ConfiguratorAccordion
            activeStep={activeStep}
            completedSteps={completedSteps}
            totalPrice={0}
            onStepToggle={handleStepToggle}
            stepContent={stepContent}
            stepSummaries={stepSummaries}
          />
        </div>
      </div>
    </div>
  );
}

export default ConfiguratorPage;