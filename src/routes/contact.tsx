import { createFileRoute } from "@tanstack/react-router";

import { FloatingHeader } from "@/components/floating-header";
import { FaqSection, type Faq } from "@/components/faq-section";

const contactFaqs: Faq[] = [
  {
    q: "What are your class timings?",
    a: "We run morning and evening batches through the week. Contact us to confirm the timing that suits you.",
  },
  {
    q: "How quickly will you reply to my message?",
    a: "We usually reply within one working day. For anything urgent, a phone call is the fastest way to reach us.",
  },
  {
    q: "Can I visit the centre before joining?",
    a: "Yes. You are welcome to visit, see the space, and speak with an instructor before deciding.",
  },
  {
    q: "Do you offer classes outside Guwahati or online?",
    a: "Our classes run at our Guwahati centre, and some programmes can be arranged online. Ask us about your course.",
  },
  {
    q: "Who should I contact about corporate or group sessions?",
    a: "Reach out through any of the contact details here and mention your group size — we will plan a schedule with you.",
  },
];

export const Route = createFileRoute("/contact")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { title: "Contact | North East Yoga and Meditation Centre" },
      {
        name: "description",
        content:
          "Get in touch with North East Yoga and Meditation Centre in Guwahati for class timings, course details, and visits.",
      },
      { property: "og:title", content: "Contact | North East Yoga and Meditation Centre" },
      {
        property: "og:description",
        content: "Reach us for class timings, course details, and centre visits in Guwahati.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <main className="pt-28">
      <FloatingHeader />
      <FaqSection faqs={contactFaqs} title="Contact FAQs" />
    </main>
  );
}
