interface Props { onAddToCart: () => void; onQuote: () => void; }
export default function Step6Summary({ onAddToCart, onQuote }: Props) {
  return (
    <div>
      <button type="button" onClick={onAddToCart}>Add to Cart</button>
      <button type="button" onClick={onQuote}>Ask a Quote</button>
    </div>
  );
}