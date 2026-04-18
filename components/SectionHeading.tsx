export function SectionHeading({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <div className="mb-10 flex flex-col gap-2">
      <span className="font-[family-name:var(--font-pixel)] text-lg tracking-widest text-[var(--accent)]">
        {eyebrow}
      </span>
      <h2 className="text-3xl font-semibold tracking-tight text-[var(--fg)] md:text-4xl">
        {title}
      </h2>
    </div>
  );
}
