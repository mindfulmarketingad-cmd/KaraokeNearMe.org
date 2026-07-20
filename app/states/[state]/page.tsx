import { redirect } from "next/navigation";
import { states } from "@/lib/states";

// State pages are now "Karaoke in [State]" search-map pages under /find/.
// This redirect keeps old /states/[state]/ URLs and inbound links working.
export function generateStaticParams() {
  return states.map((s) => ({ state: s.slug }));
}

export default async function StateRedirect({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state } = await params;
  redirect(`/find/karaoke-${state}/`);
}
