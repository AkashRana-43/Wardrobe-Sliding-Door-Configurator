import React, { Suspense, useCallback } from 'react';
import AccordionStep from '@/pages/Configurator/components/AccordionStep/AccordionStep';
import type { StepStatus } from '@/pages/Configurator/components/AccordionStep/AccordionStep';
import { SkeletonAccordionStep } from '@/components/ui/SkeletonLoader';
import { useAuth } from '@/state/useCartAuth';
import { STEP_CONFIGS } from './stepConfigs';
import styles from './ConfiguratorAccordion.module.css';

// ─── Props ────────────────────────────────────────────────────────────────────

export interface ConfiguratorAccordionProps {
  activeStep: number;
  completedSteps: Set<number>;
  totalPrice: number;
  onStepToggle: (stepNumber: number) => void;
  stepContent: Record<number, React.ReactNode>;
  stepSummaries?: Partial<Record<number, string>>;
  isLoading?: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(dollars: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 2,
  }).format(dollars);
}

function getStepStatus(
  stepNumber: number,
  activeStep: number,
  completedSteps: Set<number>
): StepStatus {
  if (completedSteps.has(stepNumber)) return 'completed';
  if (stepNumber === activeStep) return 'active';
  return 'idle';
}

// ─── Component ────────────────────────────────────────────────────────────────

const ConfiguratorAccordion = React.memo(function ConfiguratorAccordion({
  activeStep,
  completedSteps,
  totalPrice,
  onStepToggle,
  stepContent,
  stepSummaries = {},
  isLoading = false,
}: ConfiguratorAccordionProps) {
  const { authState } = useAuth();

  const isStepDisabled = useCallback(
    (stepNumber: number) => {
      if (stepNumber === 1) return false;
      return !completedSteps.has(stepNumber - 1) && stepNumber !== activeStep;
    },
    [completedSteps, activeStep]
  );

  return (
    <div className={styles.root}>
      {/* ── Steps ──────────────────────────────────────────────────── */}
      <div className={styles.steps}>
        {isLoading
          ? Array.from({ length: 6 }, (_, i) => <SkeletonAccordionStep key={i} />)
          : STEP_CONFIGS.map(({ stepNumber, title }) => {
              const status = getStepStatus(stepNumber, activeStep, completedSteps);
              const isOpen = stepNumber === activeStep;
              return (
                <AccordionStep
                  key={stepNumber}
                  stepNumber={stepNumber}
                  title={title}
                  summary={stepSummaries[stepNumber]}
                  status={status}
                  isOpen={isOpen}
                  disabled={isStepDisabled(stepNumber)}
                  onToggle={onStepToggle}
                >
                  <Suspense fallback={<SkeletonAccordionStep />}>
                    {stepContent[stepNumber]}
                  </Suspense>
                </AccordionStep>
              );
            })}
      </div>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      {authState.isLoggedIn && totalPrice > 0 && (
        <div className={styles.footer}>
          <div className={styles.priceRow}>
            <span className={styles.priceLabel}>Total</span>
            <span className={styles.priceAmount}>{formatPrice(totalPrice)}</span>
          </div>
        </div>
      )}
    </div>
  );
});

export default ConfiguratorAccordion;