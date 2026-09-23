"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { BRAND } from "@/lib/brand";

const FAQ = [
  {
    q: `Is ${BRAND.name} a task manager?`,
    a: "No. It plans hours of attention, not a list of todos. You pick a few focus items, give them a budget, and sit down for a session.",
  },
  {
    q: "Do I need an account?",
    a: "Not to start. Everything runs in this browser. Sign-in is optional later if you want the same data on another device.",
  },
  {
    q: "Where is my data stored?",
    a: "On this device, in local storage. Nothing is sent to a server unless you connect your own backend.",
  },
  {
    q: "What is a focus score?",
    a: "A number you can explain: how much of the plan you delivered, how many sessions you finished, whether you touched what you planned, and how often you were interrupted.",
  },
  {
    q: "Can a team use it?",
    a: `${BRAND.name} is personal. One person, one session at a time, so the numbers stay honest.`,
  },
  {
    q: `What does “${BRAND.name} ${BRAND.byline}” mean?`,
    a: `${BRAND.name} is the product. Meeva is the company that makes it.`,
  },
] as const;

export function LandingFaq() {
  return (
    <Accordion type="single" collapsible className="rounded-2xl border border-border bg-card px-5 sm:px-6">
      {FAQ.map((item, index) => (
        <AccordionItem key={item.q} value={`faq-${index}`}>
          <AccordionTrigger>{item.q}</AccordionTrigger>
          <AccordionContent>{item.a}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
