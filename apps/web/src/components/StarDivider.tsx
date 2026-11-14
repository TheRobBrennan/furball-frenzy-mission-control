// A quiet divider between chapters: a hairline with a star in the middle.
export default function StarDivider() {
  return (
    <div aria-hidden="true" className="mx-auto flex max-w-xs items-center gap-4 px-6 py-2 text-white/25">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-current" />
      <span className="text-sm text-amber/70">&#9733;</span>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-current" />
    </div>
  );
}
