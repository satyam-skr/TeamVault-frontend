/**
 * Cookie Utilities
 * Secure cookie management for tokens
 */

export const COOKIE_NAMES = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
} as const;

interface CookieOptions {
  maxAge?: number;
  path?: string;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: 'strict' | 'lax' | 'none';
}

class CookieManager {
  /**
   * Set a cookie (client-side)
   */
  setCookie(name: string, value: string, options: CookieOptions = {}): void {
    if (typeof window === 'undefined') return;

    const {
      maxAge = 7 * 24 * 60 * 60, // 7 days default
      path = '/',
      secure = process.env.NODE_ENV === 'production',
      sameSite = 'lax',
    } = options;

    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
    cookieString += `; max-age=${maxAge}`;
    cookieString += `; path=${path}`;
    cookieString += `; samesite=${sameSite}`;
    
    if (secure) {
      cookieString += '; secure';
    }

    document.cookie = cookieString;
  }

  /**
   * Get a cookie value (client-side)
   */
  getCookie(name: string): string | null {
    if (typeof window === 'undefined') return null;

    const cookies = document.cookie.split(';');
    
    for (const cookie of cookies) {
      const [cookieName, cookieValue] = cookie.trim().split('=');
      
      if (decodeURIComponent(cookieName) === name) {
        return decodeURIComponent(cookieValue);
      }
    }
    
    return null;
  }

  /**
   * Remove a cookie (client-side)
   */
  removeCookie(name: string, path: string = '/'): void {
    if (typeof window === 'undefined') return;
    
    document.cookie = `${encodeURIComponent(name)}=; max-age=0; path=${path}`;
  }

  /**
   * Clear all auth cookies
   */
  clearAuthCookies(): void {
    this.removeCookie(COOKIE_NAMES.ACCESS_TOKEN);
    this.removeCookie(COOKIE_NAMES.REFRESH_TOKEN);
  }

  /**
   * Store auth tokens
   */
  setAuthTokens(accessToken: string, refreshToken: string): void {
    // Access token - shorter expiry (15 minutes)
    this.setCookie(COOKIE_NAMES.ACCESS_TOKEN, accessToken, {
      maxAge: 15 * 60, // 15 minutes
    });

    // Refresh token - longer expiry (7 days)
    this.setCookie(COOKIE_NAMES.REFRESH_TOKEN, refreshToken, {
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });
  }

  /**
   * Get access token
   */
  getAccessToken(): string | null {
    return this.getCookie(COOKIE_NAMES.ACCESS_TOKEN);
  }

  /**
   * Get refresh token
   */
  getRefreshToken(): string | null {
    return this.getCookie(COOKIE_NAMES.REFRESH_TOKEN);
  }

  /**
   * Check if user is authenticated (has access token)
   */
  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }
}

export const cookieManager = new CookieManager();
