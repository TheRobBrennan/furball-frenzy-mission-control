import Image from "next/image";

const link = "inline-flex min-h-11 items-center underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber";

/** The parade's presenters: Sploosh.AI and Sploosh.AI Hockey Analytics. */
export default function PresentedBy({ onOpen, compact = false }: { onOpen?: (sponsor: "sploosh" | "hockey") => void; compact?: boolean }) {
  return (
    <div className={`flex flex-col items-center text-center ${compact ? "" : "gap-1"}`}>
      <p className={`font-mono uppercase tracking-[0.2em] text-slate-600 ${compact ? "text-[0.65rem]" : "text-xs"}`}>Presented by</p>
      <a href="https://sploosh.ai" target="_blank" rel="noopener noreferrer" onClick={() => onOpen?.("sploosh")} className={link}>
        <Image src="/images/parade/sploosh-ai.png" alt="Sploosh.AI" width={640} height={176} className={`h-auto ${compact ? "w-36" : "w-44 sm:w-56"}`} />
      </a>
      <a href="https://hockey-preview.sploosh.ai" target="_blank" rel="noopener noreferrer" onClick={() => onOpen?.("hockey")} className={`${link} font-bold text-slate-900 ${compact ? "text-xs" : "text-sm"}`}>
        🏒 Sploosh.AI Hockey Analytics
      </a>
    </div>
  );
}
