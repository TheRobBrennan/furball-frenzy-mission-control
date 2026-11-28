import Image from "next/image";

const link = "inline-flex min-h-12 items-center underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber";

/** The parade's presenters: Sploosh.AI and Sploosh.AI Hockey Analytics. */
export default function PresentedBy({ onOpen }: { onOpen?: (sponsor: "sploosh" | "hockey") => void }) {
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-600">Presented by</p>
      <a href="https://sploosh.ai" target="_blank" rel="noopener noreferrer" onClick={() => onOpen?.("sploosh")} className={link}>
        <Image src="/images/parade/sploosh-ai.png" alt="Sploosh.AI" width={640} height={176} className="h-auto w-44 sm:w-56" />
      </a>
      <a href="https://hockey-preview.sploosh.ai" target="_blank" rel="noopener noreferrer" onClick={() => onOpen?.("hockey")} className={`${link} text-sm font-bold text-slate-900`}>
        🏒 Sploosh.AI Hockey Analytics
      </a>
    </div>
  );
}
