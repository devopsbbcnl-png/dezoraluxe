/**
 * Cookie management utilities
 * Handles setting, getting, and deleting cookies
 */

export type CookieCategory = 'essential' | 'functional' | 'analytics' | 'marketing';

export interface CookiePreferences {
  essential: boolean; // Always true, cannot be disabled
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

export const COOKIE_CONSENT_KEY = 'cookie_consent';
export const COOKIE_PREFERENCES_KEY = 'cookie_preferences';

/**
 * Set a cookie
 */
export function setCookie(
  name: string,
  value: string,
  days: number = 365,
  category?: CookieCategory,
  preferences?: CookiePreferences
): void {
  // Check if category is allowed based on preferences
  if (category && preferences) {
    if (category === 'essential') {
      // Essential cookies are always allowed
    } else if (category === 'functional' && !preferences.functional) {
      return;
    } else if (category === 'analytics' && !preferences.analytics) {
      return;
    } else if (category === 'marketing' && !preferences.marketing) {
      return;
    }
  }

  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  const expiresString = expires.toUTCString();
  
  document.cookie = `${name}=${value}; expires=${expiresString}; path=/; SameSite=Lax`;
}

/**
 * Get a cookie value
 */
export function getCookie(name: string): string | null {
  const nameEQ = name + '=';
  const cookies = document.cookie.split(';');
  
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    while (cookie.charAt(0) === ' ') {
      cookie = cookie.substring(1, cookie.length);
    }
    if (cookie.indexOf(nameEQ) === 0) {
      return cookie.substring(nameEQ.length, cookie.length);
    }
  }
  
  return null;
}

/**
 * Delete a cookie
 */
export function deleteCookie(name: string): void {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

/**
 * Check if user has given consent
 */
export function hasConsent(): boolean {
  const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
  return consent === 'true';
}

/**
 * Get user's cookie preferences
 */
export function getCookiePreferences(): CookiePreferences {
  const stored = localStorage.getItem(COOKIE_PREFERENCES_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // Fallback to defaults
    }
  }
  
  // Default preferences (only essential enabled)
  return {
    essential: true,
    functional: false,
    analytics: false,
    marketing: false,
  };
}

/**
 * Save user's cookie preferences
 */
export function saveCookiePreferences(preferences: CookiePreferences): void {
  localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify(preferences));
  localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
}

/**
 * Clear all non-essential cookies
 */
export function clearNonEssentialCookies(preferences: CookiePreferences): void {
  const allCookies = document.cookie.split(';');
  
  // List of essential cookies that should not be deleted
  const essentialCookies = ['sidebar:state', COOKIE_CONSENT_KEY];
  
  allCookies.forEach((cookie) => {
    const cookieName = cookie.split('=')[0].trim();
    
    // Skip essential cookies
    if (essentialCookies.includes(cookieName)) {
      return;
    }
    
    // Delete cookies based on preferences
    // Note: This is a simplified approach. In production, you'd want to
    // maintain a registry of which cookies belong to which category
    if (!preferences.functional || !preferences.analytics || !preferences.marketing) {
      // For now, we'll rely on the cookie setting function to respect preferences
      // This function can be extended to track cookie categories
    }
  });
}

/**
 * Delete all cookies except essential ones
 */
export function deleteAllCookies(except: string[] = []): void {
  const allCookies = document.cookie.split(';');
  const essentialCookies = ['sidebar:state', COOKIE_CONSENT_KEY, ...except];
  
  allCookies.forEach((cookie) => {
    const cookieName = cookie.split('=')[0].trim();
    if (!essentialCookies.includes(cookieName)) {
      deleteCookie(cookieName);
    }
  });
}

