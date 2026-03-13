import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Şunlar hariç tüm route'ları eşleştir:
     * - _next/static (static dosyalar)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt
     * - Statik uzantılar (svg, png, jpg, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
