import type { Metadata } from "next";
import { Github, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactCard } from "@/components/ui/ContactCard";
import { CopyEmailButton } from "@/components/ui/CopyEmailButton";
import { PageHero } from "@/components/ui/PageHero";
import { siteConfig } from "@/data/site";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Contact",
  description:
    "Contact Abdulelah Alkhathami for AI engineering roles, AI specialist opportunities, internships, collaborations, and innovation programs.",
  path: "/contact"
});

const contactProfiles = [
  {
    icon: Linkedin,
    label: "LinkedIn",
    href: siteConfig.social.linkedin,
    value: "Open LinkedIn profile"
  },
  {
    icon: Github,
    label: "GitHub",
    href: siteConfig.social.github,
    value: "Open GitHub profile"
  }
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's build intelligent solutions."
        subtitle="Open to AI engineering roles, AI specialist opportunities, collaborations, hackathons, and innovation programs."
      />
      <section className="container-shell section-space">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <div className="grid gap-4">
              <ContactCard
                icon={Mail}
                label="Email"
                value={siteConfig.email}
                href={`mailto:${siteConfig.email}`}
              />
              <ContactCard
                icon={Phone}
                label="Phone"
                value={siteConfig.phone}
                href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
              />
              <ContactCard icon={MapPin} label="Location" value={siteConfig.location} />
              {contactProfiles.map((profile) => (
                <ContactCard
                  key={profile.label}
                  icon={profile.icon}
                  label={profile.label}
                  value={profile.value}
                  href={profile.href || undefined}
                />
              ))}
            </div>
            <div className="mt-6 rounded-2xl border border-gold/25 bg-gold/10 p-5">
              <p className="text-sm leading-7 text-amber-100">
                Prefer direct contact? Email me at{" "}
                <a href={`mailto:${siteConfig.email}`} className="font-semibold text-white">
                  {siteConfig.email}
                </a>
              </p>
              <div className="mt-4">
                <CopyEmailButton email={siteConfig.email} />
              </div>
            </div>
          </div>

          <div>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
