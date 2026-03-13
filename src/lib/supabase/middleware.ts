import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/types/database";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Oturumu tazele — token süresi dolmuşsa yenile
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isAuthRoute = pathname.startsWith("/giris") || pathname.startsWith("/kayit");
  const isPublicRoute = pathname === "/" || isAuthRoute;

  // Giriş yapmamış kullanıcıyı koruma altındaki rotalardan giriş sayfasına yönlendir
  if (!user && !isPublicRoute) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/giris";
    return NextResponse.redirect(redirectUrl);
  }

  // Giriş yapmış kullanıcıyı auth sayfalarından dashboard'a yönlendir
  if (user && isAuthRoute) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/dashboard";
    return NextResponse.redirect(redirectUrl);
  }

  return supabaseResponse;
}
