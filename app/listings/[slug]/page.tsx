import { redirect } from "next/navigation";
import { listings } from "@/lib/listings";

// Venue pages moved from /listings/[slug]/ to /partners/[slug]/. This keeps
// old links and any indexed search results working instead of 404ing.
export function generateStaticParams() {
  return listings.map((l) => ({ slug: l.slug }));
}

export default async function LegacyListingRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  redirect(`/partners/${slug}/`);
}
