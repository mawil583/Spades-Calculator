import { useEffect, useState } from 'react';
import ScoreLimitQuestion from './ScoreLimitQuestion';
import ScoreLimitInput from './ScoreLimitInput';

export type ScoreLimitFlowStep = 'ask' | 'enter';

interface ScoreLimitFlowProps {
  /**
   * False while the host modal is closed — resets the flow back to the ask
   * step so reopening always starts fresh.
   */
  isActive: boolean;
  question?: string;
  /**
   * The floor the new limit must clear (e.g. the winner's current score).
   */
  minLimit?: number;
  /** Resolves with the chosen limit, or null on "No"/"Cancel". */
  onResolve: (limit: number | null) => void;
  /** Lets hosts render a step-dependent title / close button. */
  onStepChange?: (step: ScoreLimitFlowStep) => void;
}

/**
 * The shared two-step score-limit flow (ask → optional numeric input) used by
 * every entry point: new-game prompts, the game-over modal, and mid-game
 * edits. Hosts own the modal chrome; this owns the steps and resolution.
 */
const ScoreLimitFlow = ({
  isActive,
  question,
  minLimit = 0,
  onResolve,
  onStepChange,
}: ScoreLimitFlowProps) => {
  const [step, setStep] = useState<ScoreLimitFlowStep>('ask');
  const [previousIsActive, setPreviousIsActive] = useState(isActive);

  // Reset the flow when the host modal closes (state adjustment during render
  // so the reset applies before the reopen paints).
  if (isActive !== previousIsActive) {
    setPreviousIsActive(isActive);
    if (!isActive) {
      setStep('ask');
    }
  }

  useEffect(() => {
    onStepChange?.(step);
  }, [step, onStepChange]);

  if (!isActive) return null;

  return step === 'ask' ? (
    <ScoreLimitQuestion
      question={question}
      onYes={() => setStep('enter')}
      onNo={() => onResolve(null)}
    />
  ) : (
    <ScoreLimitInput
      minLimit={minLimit}
      onSetLimit={onResolve}
      onCancel={() => onResolve(null)}
    />
  );
};

export default ScoreLimitFlow;
