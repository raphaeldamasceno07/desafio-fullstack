export function Footer() {
    const currentYear = new Date().getFullYear()
  
    return (
      <footer className="border-t border-border/60 bg-background/60 py-4 text-center text-xs text-muted backdrop-blur-sm">
        {currentYear} © Todos os direitos reservados a <span className="font-semibold text-foreground/80">Cubos Movies</span>
      </footer>
    )
  }