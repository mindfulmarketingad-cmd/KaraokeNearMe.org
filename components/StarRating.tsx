const STAR =
  "M10 1.5l2.47 5.18 5.53.62-4.12 3.78 1.12 5.42L10 13.9l-5 2.6 1.12-5.42L2 7.3l5.53-.62z";

function Stars({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 100 20"
      width="100%"
      height="100%"
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <path key={i} transform={`translate(${i * 20},0)`} d={STAR} fill={color} />
      ))}
    </svg>
  );
}

export default function StarRating({
  rating,
  reviews,
  size = 16,
  showCount = true,
}: {
  rating: number | null;
  reviews?: number | null;
  size?: number;
  showCount?: boolean;
}) {
  if (rating == null) {
    return showCount ? <span className="muted">No rating yet</span> : null;
  }
  const pct = Math.max(0, Math.min(100, (rating / 5) * 100));
  return (
    <span className="rating">
      <span
        className="rating-stars"
        style={{ width: size * 5, height: size }}
        role="img"
        aria-label={`${rating.toFixed(1)} out of 5 stars`}
      >
        <Stars color="#e6e6e6" />
        <span className="rating-fill" style={{ width: `${pct}%` }}>
          <Stars color="#ff8066" />
        </span>
      </span>
      {showCount && (
        <span className="rating-text">
          <strong>{rating.toFixed(1)}</strong>
          {reviews != null && (
            <span className="muted"> ({reviews.toLocaleString()} reviews)</span>
          )}
        </span>
      )}
    </span>
  );
}
