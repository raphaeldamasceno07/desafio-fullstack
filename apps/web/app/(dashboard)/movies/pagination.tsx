import { PagerBtn } from '@/components/page-btn'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(Math.max(page - 1, 1))}
        disabled={page === 1}
        className="grid h-9 w-9 place-items-center rounded-sm border border-border bg-secondary/40 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-secondary transition text-foreground"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {Array.from({ length: totalPages }).map((_, index) => {
        const pageNumber = index + 1
        return (
          <div key={pageNumber} onClick={() => onPageChange(pageNumber)}>
            <PagerBtn active={page === pageNumber}>{pageNumber}</PagerBtn>
          </div>
        )
      })}

      <button
        onClick={() => onPageChange(Math.min(page + 1, totalPages))}
        disabled={page === totalPages}
        className="grid h-9 w-9 place-items-center rounded-sm border border-border bg-secondary/40 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-secondary transition text-foreground"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  )
}
