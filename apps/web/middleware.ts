import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('movie-challenge.token')?.value
  const { pathname } = request.nextUrl

  // Define de forma explícita quais são as rotas de autenticação
  const isAuthPage = pathname === '/login' || pathname === '/register'

  // 1. Se o usuário NÃO está logado e tenta acessar qualquer página protegida (incluindo a raiz '/')
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 2. Se o usuário JÁ está logado e tenta ir para o Login ou Registro, manda para o catálogo
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/movies', request.url))
  }

  // 3. Se o usuário acessar a Home '/' logado, faz um redirecionamento limpo para o catálogo
  if (token && pathname === '/') {
    return NextResponse.redirect(new URL('/movies', request.url))
  }

  return NextResponse.next()
}

// 🎯 CONFIGURAÇÃO AVANÇADA: Monitora o app inteiro na camada do servidor (Edge),
// mas ignora arquivos pesados, imagens e chamadas internas da API do Next.js.
export const config = {
  matcher: [
    /*
     * Ignora:
     * - api (rotas de API internas do Next se houver)
     * - _next/static (arquivos CSS/JS compilados)
     * - _next/image (otimização de imagem do next/image)
     * - favicon.ico (ícone da aba)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
