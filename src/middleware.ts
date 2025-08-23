import { updateSession } from '@/lib/supabase/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

// Rotas que requerem autenticação
const protectedRoutes = ['/minha-conta', '/checkout'];

// Rotas que requerem role admin
const adminRoutes = ['/admin'];

// Rotas que devem redirecionar se já estiver logado
const authRoutes = ['/login', '/cadastro'];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Redirect /produtos para /loja (mantém compatibilidade)
  if (pathname.startsWith('/produtos')) {
    const url = request.nextUrl.clone();
    url.pathname = url.pathname.replace('/produtos', '/loja');
    return NextResponse.redirect(url);
  }

  // Fallback seguro: se variáveis do Supabase não estiverem definidas, não aplica auth
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.next();
  }

  // Atualizar sessão primeiro (sincroniza cookies de sessão)
  const response = await updateSession(request);

  // Criar cliente Supabase no middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: Record<string, unknown>) {
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: Record<string, unknown>) {
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  // Obter usuário atual (método seguro)
  const { data: { user } } = await supabase.auth.getUser();

  // Verificar rotas
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

  // Redirecionar para login se não autenticado em rotas protegidas
  if ((isProtectedRoute || isAdminRoute) && !user) {
    const redirectUrl = new URL('/login', request.url);
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Verificar permissão de admin
  if (isAdminRoute && user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Redirecionar usuários autenticados das páginas de auth (suave)
  if (isAuthRoute && user) {
    // Evitar loops; deixar layouts tratarem quando necessário
    // return NextResponse.redirect(new URL('/', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes that don't need auth
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};