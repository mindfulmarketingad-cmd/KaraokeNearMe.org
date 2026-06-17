import { redirect } from "next/navigation";
import { listings } from "@/lib/listings";

export function generateStaticParams() {
  return listings.map((l) => ({ slug: l.slug }));
}

export default async function OldListingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const l = listings.find((x) => x.slug === slug);
  if (l) redirect(`/${l.stateSlug}/${l.citySlug}/${l.slug}/`);
  // fallback — just redirect to listings index
  redirect("/listings/");
}
