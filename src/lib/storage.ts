/**
 * Secure Storage Utility
 * Handles localStorage operations with error handling
 */

class StorageUtil {
  private canUseStorage(): boolean {
    try {
      return typeof window !== 'undefined' && window.localStorage !== null;
    } catch {
      return false;
    }
  }

  setItem(key: string, value: string): void {
    if (!this.canUseStorage()) return;
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error(`Failed to set ${key} in localStorage:`, error);
    }
  }

  getItem(key: string): string | null {
    if (!this.canUseStorage()) return null;
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error(`Failed to get ${key} from localStorage:`, error);
      return null;
    }
  }

  removeItem(key: string): void {
    if (!this.canUseStorage()) return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove ${key} from localStorage:`, error);
    }
  }

  clear(): void {
    if (!this.canUseStorage()) return;
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }
}

export const storage = new StorageUtil();
