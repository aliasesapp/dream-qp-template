export function isAuthEnabled(): boolean {
  // Check if we're on the client side
  if (typeof window === 'undefined') {
    return false;
  }

  // Try to get the auth status from a meta tag or data attribute
  // that we'll need to set during server-side rendering
  const authElement = document.querySelector('meta[name="auth-enabled"]');
  return authElement?.getAttribute('content') === 'true';
} 