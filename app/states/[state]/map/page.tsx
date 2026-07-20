import { redirect } from "next/navigation";
import { statesWithListings } from "@/lib/listings";

// The statewide map now lives at /find/karaoke-[state]/. Keep old
// /states/[state]/map/ URLs working by redirecting there.
export function generateStaticParams() {
  return statesWithListings().map((s) => ({ state: s.slug }));
}

export default async function StateMapRedirect({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state } = await params;
  redirect(`/find/karaoke-${state}/`);
}
