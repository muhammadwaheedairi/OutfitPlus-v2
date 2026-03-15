import type { Metadata } from "next";
import ContactHero from "@/components/contact/contact-hero";
import ContactOffices from "@/components/contact/contact-offices";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with OutfitPlus — we're here to help.",
};

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <ContactOffices />
    </>
  );
}
