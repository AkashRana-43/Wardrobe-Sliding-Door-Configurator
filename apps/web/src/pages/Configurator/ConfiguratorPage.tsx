import React, { lazy, useCallback, useMemo, useState } from 'react';
import ConfiguratorAccordion from '@/pages/Configurator/components/ConfiguratorAccordion/ConfiguratorAccordion';
import { useWardrobeState } from '@/state/useWardrobeContext';
import { useCart } from '@/state/useCartAuth';
import styles from './ConfiguratorPage.module.css';

// ─── Lazy-loaded step components ──────────────────────────────────────────────

const Step1WardrobeType = lazy(() => import('./steps/Step1WardrobeType'));
const Step2Dimensions   = lazy(() => import('./steps/Step2Dimensions'));
const Step3DoorCount    = lazy(() => import('./steps/Step3DoorCount'));
const Step4Materials    = lazy(() => import('./steps/Step4Materials'));
const Step5StilesExtras = lazy(() => import('./steps/Step5StilesExtras'));
const Step6Summary      = lazy(() => import('./steps/Step6Summary'));

// ─── ConfiguratorPage ─────────────────────────────────────────────────────────

function ConfiguratorPage() {
  const { state: wardrobeState } = useWardrobeState();
  const { openCart } = useCart();

  const [activeStep,     setActiveStep]     = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

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
    setActiveStep(1);
    setCompletedSteps(new Set());
    openCart();
  }, [openCart]);

  const handleQuote = useCallback(() => {
    alert('Requesting a quote…');
  }, []);

  // ── Step content ───────────────────────────────────────────────────

  const stepContent = useMemo<Record<number, React.ReactNode>>(
    () => ({
      1: <Step1WardrobeType onComplete={() => handleStepComplete(1)} />,
      2: <Step2Dimensions   onComplete={() => handleStepComplete(2)} />,
      3: <Step3DoorCount    onComplete={() => handleStepComplete(3)} />,
      4: <Step4Materials    onComplete={() => handleStepComplete(4)} />,
      5: <Step5StilesExtras onComplete={() => handleStepComplete(5)} />,
      6: <Step6Summary onAddToCart={handleAddToCart} onQuote={handleQuote} />,
    }),
    [handleStepComplete, handleAddToCart, handleQuote]
  );

  // ── Step summaries ─────────────────────────────────────────────────

  const stepSummaries = useMemo<Partial<Record<number, string>>>(() => {
    const s: Partial<Record<number, string>> = {};

    if (wardrobeState.wardrobeTypeId) {
      s[1] = wardrobeState.wardrobeTypeId
        .replace(/_/g, ' ')
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase());
    }

    if (wardrobeState.wardrobeDimensions) {
      const { widthMm, heightMm } = wardrobeState.wardrobeDimensions;
      s[2] = `${heightMm}mm × ${widthMm}mm`;
    }

    if (wardrobeState.wardrobeDoorCount) {
      s[3] = `${wardrobeState.wardrobeDoorCount} doors`;
    }

    // Step 4 — count doors with insert OR rely on global colour
    const doorCount = wardrobeState.wardrobeDoorCount ?? 0;
    const hasGlobalColour = wardrobeState.wardrobeDoorMelamineColourId !== null;
    if (doorCount > 0 && (hasGlobalColour || wardrobeState.wardrobeDoorConfigurations.length > 0)) {
      const doorsWithInsert = wardrobeState.wardrobeDoorConfigurations.filter(
        (d) => d.insertId !== null
      ).length;

      if (hasGlobalColour && doorsWithInsert === 0) {
        s[4] = `${doorCount} door${doorCount === 1 ? '' : 's'} configured`;
      } else if (doorsWithInsert > 0) {
        s[4] = hasGlobalColour
          ? `Colour + ${doorsWithInsert} insert${doorsWithInsert === 1 ? '' : 's'}`
          : doorsWithInsert === doorCount
            ? `${doorCount} insert${doorCount === 1 ? '' : 's'}`
            : `${doorsWithInsert} of ${doorCount} doors with insert`;
      }
    }

    if (wardrobeState.wardrobeStilesAndTracksId) {
      s[5] = wardrobeState.wardrobeStilesAndTracksId
        .replace('stiles-tracks-', '')
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
    }

    return s;
  }, [wardrobeState]);

  return (
    <div className={styles.page}>
      <div className={styles.content}>

        {/* ── Page header ─────────────────────────────────────────── */}
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Configure Your Wardrobe Sliding Door</h1>
          <p className={styles.pageSubtitle}>
            Work through each step to build your perfect wardrobe sliding door.
          </p>
        </div>

        {/* ── Accordion ───────────────────────────────────────────── */}
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