import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({
            request: { headers: request.headers },
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // Refresh session token
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // ── Protected routes ──

  // Student dashboard — must be logged in
  if (pathname.startsWith("/student")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    // Check role
    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "student") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Instructor dashboard
  if (pathname.startsWith("/instructor")) {
    if (!user) {
      return NextResponse.redirect(new URL("/admin-login", request.url));
    }
    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "instructor") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Admin dashboard
  if (pathname.startsWith("/admin")) {
    if (!user) {
      return NextResponse.redirect(new URL("/admin-login", request.url));
    }
    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Redirect logged-in users away from login pages
  if (pathname === "/login" || pathname === "/admin-login") {
    if (user) {
      const { data: profile } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role === "admin") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      if (profile?.role === "instructor") {
        return NextResponse.redirect(new URL("/instructor", request.url));
      }
      if (profile?.role === "student") {
        return NextResponse.redirect(new URL("/student", request.url));
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/student/:path*",
    "/instructor/:path*",
    "/admin/:path*",
    "/login",
    "/admin-login",
  ],
};
