// Renders a JSON-LD structured-data script. Structured data helps search
// engines understand the site and can improve how listings appear in results.
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
