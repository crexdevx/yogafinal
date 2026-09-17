import { createFileRoute } from "@tanstack/react-router";

import { Index } from "../index";

export const Route = createFileRoute("/index/")({
  head: () => ({
    meta: [
      { title: "North East Yoga and Meditation Centre | Home" },
      {
        name: "description",
        content:
          "Explore yoga courses, meditation classes, student achievements, and community stories from North East Yoga and Meditation Centre.",
      },
      {
        property: "og:title",
        content: "North East Yoga and Meditation Centre | Home",
      },
      {
        property: "og:description",
        content:
          "Explore yoga courses, meditation classes, student achievements, and community stories from North East Yoga and Meditation Centre.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});