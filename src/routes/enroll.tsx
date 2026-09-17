import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  ChevronDown,
  Clock3,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Sparkles,
} from "lucide-react";

import logoImg from "@/assets/north-east-yoga-logo.png";
import { Button } from "@/components/ui/button";
import { FloatingHeader } from "@/components/floating-header";
import { FaqSection } from "@/components/faq-section";

const enrollFaqs = [
  {
    q: "What happens after I submit the enrolment form?",
    a: "Your details open a ready-made WhatsApp message to the centre. We reply with batch timings, seat availability and the fee for the course you picked.",
  },
  {
    q: "Is a seat confirmed as soon as I send the form?",
    a: "Not yet. The form is an enquiry — your seat is confirmed once we speak and the joining formalities are completed.",
  },
  {
    q: "Can I enrol for someone else, like my child or parent?",
    a: "Yes. Fill in the participant's name and age, and add a note in the message box so we know who will attend.",
  },
  {
    q: "What if I am not sure which course to choose?",
    a: "Pick the one closest to your goal or leave a note about what you want from your practice. We will suggest the right course and batch for your level.",
  },
  {
    q: "Can I visit the centre before joining?",
    a: "Absolutely. Call us on the listed number and drop in during class hours to meet the teachers and see the space.",
  },
];

// Centre configuration — update these values when details change.
const WHATSAPP_NUMBER = "918135828417"; // international format, no "+"
const WHATSAPP_DISPLAY = "+91 81358 28417";
const CENTRE_ADDRESS =
  "H/No: 34, Ground Floor, Link Road, Kidzee School, Mother Teresa Rd, near Anzel's Home, Hatigarh Chariali, Guwahati, Assam";
const OPENING_HOURS =
  "To be confirmed — message us on WhatsApp for the current batch timings.";

const courseOptions = [
  "Certification in Yoga & Pranayama",
  "Certification in Yoga Education",
  "Diploma in Yoga Education",
  "Diploma Foundations",
  "Meditation Classes",
  "Yoga for Kids",
  "Yoga Retreat Program",
  "Professional Yoga Teacher Training",
  "Complete Health, Fitness & Wellness",
  "Yoga with Props",
];

const genderOptions = ["Female", "Male", "Other"];
const batchOptions = ["Morning", "Afternoon", "Evening", "Flexible (any timing)"];
const experienceOptions = ["Complete beginner", "Practised occasionally", "Regular practitioner"];

const inputBase =
  "h-12 w-full rounded-xl border border-course-border bg-course-surface px-4 text-base text-course-ink shadow-sm outline-none transition-colors placeholder:text-course-muted/80 focus:border-course-accent focus-visible:ring-2 focus-visible:ring-course-accent/30 aria-[invalid=true]:border-destructive aria-[invalid=true]:focus:border-destructive aria-[invalid=true]:focus-visible:ring-destructive/30";

export const Route = createFileRoute("/enroll")({
  staticData: { sitemap: true },
  validateSearch: (search: Record<string, unknown>) => ({
    course: typeof search["course"] === "string" ? search["course"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Enroll — Yoga Classes in Guwahati | North East Yoga" },
      {
        name: "description",
        content:
          "Begin your yoga journey at North East Yoga & Meditation Centre, Guwahati. Fill in the short enrollment form and confirm your batch over WhatsApp.",
      },
      { property: "og:title", content: "Enroll — Yoga Classes in Guwahati | North East Yoga" },
      {
        property: "og:description",
        content:
          "Begin your yoga journey at North East Yoga & Meditation Centre, Guwahati. Fill in the short enrollment form and confirm your batch over WhatsApp.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:url", content: "/enroll" },
    ],
    links: [{ rel: "canonical", href: "/enroll" }],
  }),
  component: EnrollPage,
});

type EnrollmentForm = {
  name: string;
  age: string;
  gender: string;
  phone: string;
  email: string;
  city: string;
  course: string;
  batch: string;
  experience: string;
  message: string;
  consent: boolean;
};

type FieldErrors = Partial<
  Record<"name" | "age" | "gender" | "phone" | "email" | "course" | "consent", string>
>;

const initialForm: EnrollmentForm = {
  name: "",
  age: "",
  gender: "",
  phone: "",
  email: "",
  city: "",
  course: "",
  batch: "",
  experience: "",
  message: "",
  consent: false,
};

function normalizePhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) return digits.slice(1);
  return digits;
}

function validate(form: EnrollmentForm): FieldErrors {
  const errors: FieldErrors = {};
  if (!form.name.trim()) errors.name = "Please enter your full name.";
  const age = Number(form.age);
  if (!form.age.trim() || Number.isNaN(age) || !Number.isInteger(age) || age < 3 || age > 100) {
    errors.age = "Please enter an age between 3 and 100.";
  }
  if (!form.gender) errors.gender = "Please select your gender.";
  if (!/^[6-9]\d{9}$/.test(normalizePhone(form.phone))) {
    errors.phone = "Please enter a valid 10-digit mobile number.";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }
  if (!form.course) errors.course = "Please choose the course you'd like to join.";
  if (!form.consent) errors.consent = "Please allow us to contact you on WhatsApp to continue.";
  return errors;
}

function buildWhatsAppMessage(form: EnrollmentForm, phone: string) {
  const lines = [
    "Namaste! I would like to enroll at North East Yoga & Meditation Centre.",
    "",
    `Name: ${form.name.trim()}`,
    `Age: ${form.age.trim()}`,
    `Gender: ${form.gender}`,
    `Phone: ${phone}`,
    `Email: ${form.email.trim()}`,
    form.city.trim() ? `Address/City: ${form.city.trim()}` : "",
    `Course: ${form.course}`,
    form.batch ? `Preferred Batch: ${form.batch}` : "",
    form.experience ? `Previous Yoga Experience: ${form.experience}` : "",
    form.message.trim() ? `Message: ${form.message.trim()}` : "",
  ];
  return lines.filter(Boolean).join("\n");
}

function EnrollPage() {
  const { course: preselectedCourse } = Route.useSearch();
  const [form, setForm] = useState<EnrollmentForm>(initialForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submittedUrl, setSubmittedUrl] = useState<string | null>(null);

  useEffect(() => {
    if (preselectedCourse && courseOptions.includes(preselectedCourse)) {
      setForm((current) => ({ ...current, course: preselectedCourse }));
    }
  }, [preselectedCourse]);

  const update = <K extends keyof EnrollmentForm>(key: K, value: EnrollmentForm[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!(key in current)) return current;
      const next = { ...current };
      delete next[key as keyof FieldErrors];
      return next;
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      const firstError = document.querySelector<HTMLElement>("[aria-invalid='true']");
      firstError?.focus();
      return;
    }
    const phone = normalizePhone(form.phone);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      buildWhatsAppMessage(form, phone),
    )}`;
    setSubmittedUrl(url);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <main className="min-h-screen bg-course-canvas text-course-ink">
      {/* Hero */}
      <section className="course-hero relative overflow-hidden px-4 pb-14 pt-28 sm:px-6 sm:pb-16 sm:pt-36 lg:px-8">
        <FloatingHeader />
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-course-hero-muted">
            North East Yoga &amp; Meditation Centre
          </p>
          <h1 className="mt-5 font-serif text-4xl leading-tight text-course-hero-foreground sm:text-6xl">
            Begin Your Yoga Journey
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-course-hero-muted sm:text-lg sm:leading-8">
            Every breath is a new beginning. Share a few details below, and we&rsquo;ll confirm
            your batch on WhatsApp — your mat will be waiting.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-8 h-12 rounded-full bg-course-cta text-course-cta-foreground hover:bg-course-cta-hover sm:h-14 sm:px-10 sm:text-lg"
          >
            <a href="#enroll-form">
              Enroll Now <ArrowUpRight aria-hidden="true" className="size-4" />
            </a>
          </Button>
        </div>
      </section>

      {/* Enrollment form */}
      <section id="enroll-form" aria-labelledby="enroll-heading" className="px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="course-panel mx-auto w-full max-w-2xl rounded-2xl border border-course-border bg-course-surface p-5 sm:p-8 lg:p-10">
          <div className="mb-8">
            <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-course-accent">
              <Sparkles aria-hidden="true" className="size-4" /> Enrollment Form
            </p>
            <h2 id="enroll-heading" className="font-serif text-3xl leading-tight sm:text-4xl">
              Tell us a little about you
            </h2>
            <p className="mt-3 text-sm leading-6 text-course-body">
              Fields marked <span aria-hidden="true" className="font-semibold text-destructive">*</span> are
              required. Your request is sent to us over WhatsApp — nothing is stored on this website.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="grid gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="name" label="Full Name" required error={errors.name}>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  maxLength={100}
                  placeholder="Your full name"
                  value={form.name}
                  onChange={(event) => update("name", event.target.value)}
                  aria-invalid={errors.name ? true : undefined}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  className={inputBase}
                />
              </Field>

              <Field id="age" label="Age" required error={errors.age}>
                <input
                  id="age"
                  name="age"
                  type="number"
                  inputMode="numeric"
                  min={3}
                  max={100}
                  placeholder="e.g. 25"
                  value={form.age}
                  onChange={(event) => update("age", event.target.value)}
                  aria-invalid={errors.age ? true : undefined}
                  aria-describedby={errors.age ? "age-error" : undefined}
                  className={inputBase}
                />
              </Field>

              <Field id="gender" label="Gender" required error={errors.gender}>
                <SelectInput
                  id="gender"
                  placeholder="Select gender"
                  options={genderOptions}
                  value={form.gender}
                  error={errors.gender}
                  onChange={(value) => update("gender", value)}
                />
              </Field>

              <Field id="phone" label="Phone Number" required error={errors.phone}>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  maxLength={16}
                  placeholder="10-digit mobile number"
                  value={form.phone}
                  onChange={(event) => update("phone", event.target.value)}
                  aria-invalid={errors.phone ? true : undefined}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                  className={inputBase}
                />
              </Field>

              <Field id="email" label="Email" required error={errors.email}>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  maxLength={255}
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(event) => update("email", event.target.value)}
                  aria-invalid={errors.email ? true : undefined}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className={inputBase}
                />
              </Field>

              <Field id="city" label="Address / City">
                <input
                  id="city"
                  name="city"
                  type="text"
                  autoComplete="street-address"
                  maxLength={200}
                  placeholder="Address or city"
                  value={form.city}
                  onChange={(event) => update("city", event.target.value)}
                  className={inputBase}
                />
              </Field>
            </div>

            <Field
              id="course"
              label="Select Course"
              required
              error={errors.course}
              hint="Not sure yet? Pick the one you're most drawn to — we can help you decide on WhatsApp."
            >
              <SelectInput
                id="course"
                placeholder="Choose your course"
                options={courseOptions}
                value={form.course}
                error={errors.course}
                onChange={(value) => update("course", value)}
              />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                id="batch"
                label="Preferred Batch"
                hint="Final timings will be confirmed over WhatsApp."
              >
                <SelectInput
                  id="batch"
                  placeholder="Select a preferred batch"
                  options={batchOptions}
                  value={form.batch}
                  onChange={(value) => update("batch", value)}
                />
              </Field>

              <Field id="experience" label="Previous Yoga Experience">
                <SelectInput
                  id="experience"
                  placeholder="Select your experience level"
                  options={experienceOptions}
                  value={form.experience}
                  onChange={(value) => update("experience", value)}
                />
              </Field>
            </div>

            <Field id="message" label="Message">
              <textarea
                id="message"
                name="message"
                rows={4}
                maxLength={600}
                placeholder="Anything you'd like us to know — health conditions, goals, questions…"
                value={form.message}
                onChange={(event) => update("message", event.target.value)}
                className={`${inputBase} h-auto min-h-28 py-3`}
              />
            </Field>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="consent" className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-course-body">
                <input
                  id="consent"
                  name="consent"
                  type="checkbox"
                  checked={form.consent}
                  onChange={(event) => update("consent", event.target.checked)}
                  aria-invalid={errors.consent ? true : undefined}
                  aria-describedby={errors.consent ? "consent-error" : undefined}
                  className="mt-1 size-5 shrink-0 rounded border-course-border accent-course-accent"
                />
                <span>
                  I agree to be contacted on WhatsApp about my enrollment request.{" "}
                  <span aria-hidden="true" className="font-semibold text-destructive">*</span>
                </span>
              </label>
              {errors.consent ? (
                <p id="consent-error" role="alert" className="text-xs font-medium text-destructive">
                  {errors.consent}
                </p>
              ) : null}
            </div>

            <Button
              type="submit"
              size="lg"
              className="h-14 rounded-full bg-enroll-whatsapp text-base font-semibold text-enroll-whatsapp-foreground shadow-lg transition-all duration-300 hover:bg-enroll-whatsapp-hover hover:shadow-xl"
            >
              <MessageCircle aria-hidden="true" className="size-5" />
              Submit &amp; Continue on WhatsApp
            </Button>

            {submittedUrl ? (
              <div
                role="status"
                className="rounded-xl border border-course-accent/40 bg-course-sage/60 p-4 text-sm leading-6 text-course-ink"
              >
                Opening WhatsApp with your details… If nothing opened,{" "}
                <a
                  href={submittedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold underline underline-offset-2"
                >
                  tap here to send your request
                </a>
                .
              </div>
            ) : null}
          </form>
        </div>
      </section>

      {/* What happens next */}
      <section aria-labelledby="next-steps-heading" className="px-4 pb-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 text-center sm:mb-10">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-course-accent">
              Simple &amp; quick
            </p>
            <h2 id="next-steps-heading" className="font-serif text-3xl leading-tight sm:text-4xl">
              What Happens Next?
            </h2>
          </div>
          <ol className="grid gap-5 sm:grid-cols-3">
            {[
              {
                step: "1",
                title: "Submit Request",
                description: "Fill in the short form above with your details — it takes less than two minutes.",
                icon: Send,
              },
              {
                step: "2",
                title: "WhatsApp Confirmation",
                description: `We message you on WhatsApp at ${WHATSAPP_DISPLAY} to confirm your batch, timings, and fee.`,
                icon: MessageCircle,
              },
              {
                step: "3",
                title: "Begin Your Journey",
                description: "Roll out your mat at the centre and take your first breath with us.",
                icon: Sparkles,
              },
            ].map(({ step, title, description, icon: Icon }) => (
              <li
                key={step}
                className="flex flex-col rounded-2xl border border-course-border bg-course-surface p-6 shadow-sm"
              >
                <span
                  aria-hidden="true"
                  className="flex size-11 items-center justify-center rounded-full bg-course-mist font-serif text-xl text-course-accent"
                >
                  {step}
                </span>
                <Icon aria-hidden="true" className="mt-4 size-5 text-course-accent" />
                <h3 className="mt-2 font-serif text-xl text-course-ink">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-course-body">{description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Find us */}
      <section aria-labelledby="find-us-heading" className="px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="course-panel mx-auto max-w-5xl overflow-hidden rounded-2xl border border-course-border bg-course-surface">
          <div className="grid lg:grid-cols-2">
            <div className="flex flex-col p-6 sm:p-10">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-course-accent">
                Visit us
              </p>
              <h2 id="find-us-heading" className="font-serif text-3xl leading-tight sm:text-4xl">
                Find Us
              </h2>

              <div className="mt-6 flex items-start gap-3">
                <MapPin aria-hidden="true" className="mt-1 size-5 shrink-0 text-course-accent" />
                <p className="text-sm leading-6 text-course-body sm:text-base">
                  {CENTRE_ADDRESS}
                </p>
              </div>

              <div className="mt-5 flex items-start gap-3">
                <Clock3 aria-hidden="true" className="mt-1 size-5 shrink-0 text-course-accent" />
                <p className="text-sm leading-6 text-course-body sm:text-base">
                  <span className="font-semibold text-course-ink">Opening hours: </span>
                  {OPENING_HOURS}
                </p>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <Button
                  asChild
                  size="lg"
                  className="h-12 rounded-full bg-course-cta text-course-cta-foreground hover:bg-course-cta-hover"
                >
                  <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(CENTRE_ADDRESS)}`} target="_blank" rel="noopener noreferrer">
                    <MapPin aria-hidden="true" className="size-4" /> Get Directions
                  </a>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-12 rounded-full border-course-accent text-course-accent hover:bg-course-mist hover:text-course-accent"
                >
                  <a href={`tel:+${WHATSAPP_NUMBER}`}>
                    <Phone aria-hidden="true" className="size-4" /> Call {WHATSAPP_DISPLAY}
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  className="h-12 rounded-full bg-enroll-whatsapp font-semibold text-enroll-whatsapp-foreground hover:bg-enroll-whatsapp-hover sm:col-span-2"
                >
                  <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">
                    <MessageCircle aria-hidden="true" className="size-4" /> Chat on WhatsApp
                  </a>
                </Button>
              </div>
            </div>

            <div className="min-h-72 border-t border-course-border lg:border-l lg:border-t-0">
              <iframe
                title="Map to North East Yoga and Meditation Centre"
                src={`https://www.google.com/maps?q=${encodeURIComponent(CENTRE_ADDRESS)}&output=embed`}
                className="h-full min-h-72 w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section aria-labelledby="final-cta-heading" className="course-hero px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="relative z-10 mx-auto max-w-2xl text-center">
          <h2 id="final-cta-heading" className="font-serif text-3xl leading-tight text-course-hero-foreground sm:text-5xl">
            Take the First Step
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-course-hero-muted sm:text-base sm:leading-7">
            Your first breath on the mat is one message away. Send us a hello on WhatsApp and
            we&rsquo;ll take care of the rest.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-8 h-14 rounded-full bg-enroll-whatsapp px-10 text-base font-semibold text-enroll-whatsapp-foreground shadow-xl transition-all duration-300 hover:bg-enroll-whatsapp-hover sm:text-lg"
          >
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">
              <MessageCircle aria-hidden="true" className="size-5" /> Message us on WhatsApp
            </a>
          </Button>
          <p className="mt-6 text-sm text-course-hero-muted">
            <a href={`tel:+${WHATSAPP_NUMBER}`} className="underline underline-offset-2 hover:text-course-hero-foreground">
              Prefer to call? {WHATSAPP_DISPLAY}
            </a>
          </p>
        </div>
      </section>

      <FaqSection faqs={enrollFaqs} title="Enrolment FAQs" />

    </main>
  );
}

function Field({
  id,
  label,
  required,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string | undefined;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-course-ink">
        {label}
        {required ? (
          <span aria-hidden="true" className="ml-1 text-destructive">
            *
          </span>
        ) : null}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-xs font-medium text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-course-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function SelectInput({
  id,
  placeholder,
  options,
  value,
  onChange,
  error,
}: {
  id: string;
  placeholder: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  error?: string | undefined;
}) {
  const describedBy = error ? `${id}-error` : undefined;
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`${inputBase} appearance-none pr-10 ${value ? "" : "text-course-muted/80"}`}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option} value={option} className="text-course-ink">
            {option}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-course-muted"
      />
    </div>
  );
}
