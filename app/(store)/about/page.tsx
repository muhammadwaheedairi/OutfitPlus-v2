import type { Metadata } from "next";
import AboutHero from "@/components/about/about-hero";
import Stats from "@/components/about/stats";
import Team from "@/components/about/team";
import Companies from "@/components/about/companies";
import WorkWithUs from "@/components/about/work-with-us";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about OutfitPlus — our story, our team, and our passion for premium fashion.",
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <Stats />
      <Team />
      <Companies />
      <WorkWithUs />
    </>
  );
}
