export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-(--border/60) bg-(--background) py-4 text-center text-md text-(--muted-foreground) backdrop-blur">
      {' '}
      {currentYear} © Todos os direitos reservados a{' '}
      <span className="font-semibold text-foreground/80">
        <strong>Cubos Movies</strong>
      </span>
    </footer>
  )
}
