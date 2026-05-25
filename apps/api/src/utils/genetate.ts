export function generateSlug(title: string, releaseDate: Date): string {
  const year = releaseDate.getFullYear()

  const slug = title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim()

  return `${slug}-${year}`
}
