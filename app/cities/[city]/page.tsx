import { redirect } from "next/navigation";
import { allCities } from "@/lib/listings";

export function generateStaticParams() {
  return allCities().map((c) => ({ city: c.slug }));
}

export default async function OldCityPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city: citySlug } = await params;
  const city = allCities().find((c) => c.slug === citySlug);
  if (city) {
    redirect(`/${city.stateSlug}/${citySlug}/`);
  }
  redirect("/cities/");
}
