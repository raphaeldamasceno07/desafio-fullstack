export function PagerBtn({
  children,
  active,
}: {
  children: React.ReactNode
  active?: boolean
}) {
  return (
    <button
      className={`grid h-9 min-w-9 place-items-center rounded-sm px-3 text-sm font-medium transition active:scale-95 ${
        active
          ? 'bg-primary text-primary-foreground'
          : 'border border-border bg-secondary/60 text-foreground/80 hover:bg-secondary'
      }`}
    >
      {children}
    </button>
  )
}
