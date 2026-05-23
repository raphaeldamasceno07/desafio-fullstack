import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 💡 Busca o token nos cookies (ajuste o nome 'movie-challenge.token' se preferir outro)
  const token = request.cookies.get('movie-challenge.token')?.value

  const isAuthPage = request.nextUrl.pathname.startsWith('/login') || 
                     request.nextUrl.pathname.startsWith('/register')

  // 1. Se o usuário NÃO está logado e tenta acessar o dashboard ou rotas de filmes
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 2. Se o usuário JÁ está logado e tenta acessar Login ou Cadastro
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/movies', request.url))
  }

  return NextResponse.next()
}

// 🎯 Configura quais rotas o middleware deve vigiar
export const config = {
  matcher: [
    '/movies/:path*', // Protege a listagem, criação, edição e detalhes
    '/login',
    '/register'
  ],
}