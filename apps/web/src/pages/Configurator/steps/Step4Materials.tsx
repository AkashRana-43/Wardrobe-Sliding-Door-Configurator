interface Props { onComplete: () => void; }
export default function Step1WardrobeType({ onComplete }: Props) {
  return (
    <div>
      <button type="button" onClick={onComplete}>Continue →</button>
    </div>
  );
}