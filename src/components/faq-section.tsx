import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export type Faq = { q: string; a: string };

export function FaqSection({
  faqs,
  title = "Frequently Asked Questions",
  id = "faq-heading",
}: {
  faqs: Faq[];
  title?: string;
  id?: string;
}) {
  return (
    <section aria-labelledby={id} className="px-4 pb-20 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h2
          id={id}
          className="text-center font-serif text-3xl leading-tight text-courses-heading sm:text-4xl"
        >
          {title}
        </h2>
        <Accordion type="single" collapsible className="mt-8">
          {faqs.map((faq) => (
            <AccordionItem key={faq.q} value={faq.q}>
              <AccordionTrigger className="text-left font-serif text-base text-courses-heading sm:text-lg">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-6 text-courses-body sm:text-base">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
