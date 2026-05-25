export function Backdrop({
  children,
  onClose,
}: {
  children: React.ReactNode
  onClose: () => void
}) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in duration-200"
    >
      {children}
    </div>
  )
}
