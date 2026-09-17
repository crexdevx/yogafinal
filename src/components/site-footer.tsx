import { Link } from "@tanstack/react-router";
import { ArrowUpRight, MapPin, MessageCircle, Phone } from "lucide-react";

import logoImg from "@/assets/north-east-yoga-logo.png";
import { Button } from "@/components/ui/button";

const WHATSAPP_NUMBER = "918135828417";
const WHATSAPP_DISPLAY = "+91 81358 28417";
const CENTRE_ADDRESS =
  "H/No: 34, Ground Floor, Link Road, Hatigarh Chariali, Guwahati, Assam";

const FOOTER_LINKS = [
  { to: "/about", label: "Who are we" },
  { to: "/programs", label: "Programs" },
  { to: "/gallery", label: "Gallery" },
  { to: "/enroll", label: "Enroll" },
];

export function SiteFooter() {
  return (
    <footer className="bg-course-footer text-course-footer-foreground">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-14 sm:px-8 sm:py-16 lg:grid-cols-[1.3fr_0.7fr_1fr] lg:gap-16 lg:px-10">
        <div>
          <Link to="/" preload="render" className="inline-flex items-center gap-3" aria-label="North East Yoga and Meditation Centre home">
            <img
              src={logoImg}
              alt="North East Yoga and Meditation Centre logo"
              className="size-14 object-contain"
              width={320}
              height={320}
              loading="lazy"
              decoding="async"
            />
            <span className="max-w-[13rem] font-serif text-lg leading-tight">
              North East Yoga &amp; Meditation Centre
            </span>
          </Link>
          <p className="mt-6 max-w-sm text-sm leading-6 text-course-hero-muted">
            A welcoming space for mindful movement, meditation, and professional yoga education in Guwahati.
          </p>
          <Button
            asChild
            className="mt-6 rounded-full bg-enroll-whatsapp px-5 text-enroll-whatsapp-foreground hover:bg-enroll-whatsapp-hover"
          >
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">
              <MessageCircle aria-hidden="true" />
              Message us
            </a>
          </Button>
        </div>

        <nav aria-label="Footer navigation">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-course-gallery-active">
            Explore
          </p>
          <ul className="mt-5 space-y-3 text-sm">
            {FOOTER_LINKS.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  preload="render"
                  className="transition-colors hover:text-course-gallery-active"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-course-gallery-active">
            Visit us
          </p>
          <div className="mt-5 space-y-4 text-sm leading-6 text-course-hero-muted">
            <p className="flex gap-3">
              <MapPin aria-hidden="true" className="mt-1 size-4 shrink-0 text-course-gallery-active" />
              <span>{CENTRE_ADDRESS}</span>
            </p>
            <a
              href={`tel:+${WHATSAPP_NUMBER}`}
              className="flex items-center gap-3 transition-colors hover:text-course-gallery-active"
            >
              <Phone aria-hidden="true" className="size-4 shrink-0 text-course-gallery-active" />
              {WHATSAPP_DISPLAY}
            </a>
          </div>
          <Link
            to="/enroll"
            search={{ course: undefined }}
            preload="render"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-course-footer-foreground transition-colors hover:text-course-gallery-active"
          >
            Find your practice
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </div>
      <div className="border-t border-course-hero-line px-6 py-5 text-center text-xs text-course-hero-muted sm:px-8">
        © {new Date().getFullYear()} North East Yoga and Meditation Centre. All rights reserved.
      </div>
    </footer>
  );
}