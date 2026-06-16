import { redirect } from "next/navigation";
import { states } from "@/lib/states";

export function generateStaticParams() {
  return states.map((s) => ({ state: s.slug }));
}

export default async function OldStatePage({
  params,
}: {
  params: Promise<{ state: string }>;
}) {
  const { state: slug } = await params;
  redirect(`/${slug}/`);
}
