import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { UserRole } from "@/lib/roles";

// Rutas que no requieren autenticación
const publicRoutes = ["/", "/login", "/register", "/api/auth"];

// Rutas que requieren rol de administrador
const adminRoutes = ["/admin"];

// Función para verificar si una ruta es pública
const isPublicRoute = (path: string) => {
  return publicRoutes.some((route) => path === route || path.startsWith(`${route}/`));
};

// Función para verificar si una ruta es de administrador
const isAdminRoute = (path: string) => {
  return adminRoutes.some((route) => path === route || path.startsWith(`${route}/`));
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Verificar si es una ruta pública
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }
  
  // Verificar token de autenticación
  const token = await getToken({ req: request });
  
  // Si no hay token, redirigir al login
  if (!token) {
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", encodeURI(pathname));
    return NextResponse.redirect(url);
  }
  
  // Verificar permisos para rutas de administrador
  if (isAdminRoute(pathname)) {
    const userRole = token.role as UserRole;
    
    if (userRole !== "admin") {
      // Si no es admin, redirigir a la página principal
      return NextResponse.redirect(new URL("/", request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Rutas que requieren autenticación
    "/dashboard/:path*",
    "/profile/:path*",
    "/admin/:path*",
    "/api/((?!auth).)*",
  ],
}; 