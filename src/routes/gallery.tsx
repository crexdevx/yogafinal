import { createFileRoute } from "@tanstack/react-router";

import { FloatingHeader } from "@/components/floating-header";
import { FaqSection, type Faq } from "@/components/faq-section";

const galleryFaqs: Faq[] = [
  {
    q: "Where are these photos taken?",
    a: "All photos are from our own classes, workshops, and championship events in and around Guwahati.",
  },
  {
    q: "Are the people in the photos students of the centre?",
    a: "Yes. Every picture shows our students, instructors, and teams at real sessions and competitions.",
  },
  {
    q: "Can I see photos of a specific course?",
    a: "Yes. Each course on the Courses page has its own photo gallery you can open by tapping the preview images.",
  },
  {
    q: "How often are new photos added?",
    a: "We add fresh photos after major workshops, Yoga Day events, and championships through the year.",
  },
  {
    q: "Can I use these photos?",
    a: "The photos belong to North East Yoga and Meditation Centre. Please contact us before using any of them.",
  },
];

export const Route = createFileRoute("/gallery")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "Gallery | North East Yoga and Meditation Centre" },
      {
        name: "description",
        content:
          "Photos from classes, workshops, and championships at North East Yoga and Meditation Centre in Guwahati.",
      },
      { property: "og:title", content: "Gallery | North East Yoga and Meditation Centre" },
      {
        property: "og:description",
        content: "Moments from our classes, workshops, and yoga championships.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/gallery" },
    ],
    links: [{ rel: "canonical", href: "/gallery" }],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  return (
    <main className="pt-28">
      <FloatingHeader />
      <FaqSection faqs={galleryFaqs} title="Gallery FAQs" />
    </main>
  );
}
