'use client'
import { MessageSquareText } from "lucide-react";

function SupportBtn() {
  return (
    <a
      href="https://tally.so/r/gDeEaD"
      target="_blank"
      rel="noreferrer noopener"
      aria-label="Support"
      title="Support"
      className="fixed bottom-5 right-5 z-20 inline-flex h-12 w-12 items-center justify-center rounded-full btn-gradient glow-accent transition-transform hover:-translate-y-[1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
    >
      <MessageSquareText className="h-5 w-5 text-white" aria-hidden="true" />
    </a>
  );
}

export default SupportBtn