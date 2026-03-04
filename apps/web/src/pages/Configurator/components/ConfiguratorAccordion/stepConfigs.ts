export interface StepConfig {
  stepNumber: number;
  title: string;
}

export const STEP_CONFIGS: StepConfig[] = [
  { stepNumber: 1, title: 'Wardrobe Type' },
  { stepNumber: 2, title: 'Dimensions' },
  { stepNumber: 3, title: 'Door Count' },
  { stepNumber: 4, title: 'Materials' },
  { stepNumber: 5, title: 'Stiles, Tracks & Extras' },
  { stepNumber: 6, title: 'Summary' },
];