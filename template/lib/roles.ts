// Tipos de roles disponibles
export type UserRole = "user" | "admin";

// Función para verificar si un usuario tiene un rol específico
export const hasRole = (userRole: UserRole | undefined, requiredRole: UserRole): boolean => {
  if (!userRole) return false;
  
  // Si el rol requerido es 'user', cualquier rol es válido
  if (requiredRole === 'user') return true;
  
  // Si el rol requerido es 'admin', el usuario debe ser 'admin'
  if (requiredRole === 'admin') return userRole === 'admin';
  
  return false;
}; 