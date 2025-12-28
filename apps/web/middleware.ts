import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const session = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
    });

    const isLoggedIn = !!session && session.accessToken;
    // 🔹 If user is logged in and tries to access "/" or "/signin", redirect to "/quiz"
    if (isLoggedIn && (path === "/" || path.startsWith("/signin"))) {
        return NextResponse.redirect(new URL("/quiz", request.url));
    }

    // 🔹 If user is NOT logged in and tries to access "/quiz", redirect to "/signin"
    if (!isLoggedIn && path.startsWith("/quiz")) {
        return NextResponse.redirect(new URL("/signin", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api/auth/session|api/auth/callback|_next/static|_next/image|favicon.ico).*)",
    ],
};
