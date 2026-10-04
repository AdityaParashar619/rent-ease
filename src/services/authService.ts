import { User, PlatformRole, ApiResponse } from '../types';
import { apiClient } from './api/apiClient';

const STORAGE_KEYS = {
  CURRENT_USER: 'rentease_current_user',
  AUTH_TOKEN: 'rentease_auth_token',
  REGISTERED_USERS: 'rentease_registered_accounts',
};

interface StoredAccount extends User {
  password?: string;
}

export const authService = {
  getCurrentUser(): User | null {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.id && parsed.email) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error reading current user from storage:', e);
    }
    return null;
  },

  getAuthToken(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return !!this.getCurrentUser() && !!this.getAuthToken();
  },

  setCurrentUser(user: User, token?: string): void {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      const authToken = token || `jwt_${user.id}_${Date.now()}`;
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, authToken);
    } catch (e) {
      console.warn('Error saving user to storage:', e);
    }
  },

  getRegisteredAccounts(): StoredAccount[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REGISTERED_USERS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveRegisteredAccount(account: StoredAccount): void {
    try {
      const accounts = this.getRegisteredAccounts();
      const existingIdx = accounts.findIndex((a) => a.email.toLowerCase() === account.email.toLowerCase());
      if (existingIdx >= 0) {
        accounts[existingIdx] = account;
      } else {
        accounts.push(account);
      }
      localStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(accounts));
    } catch (e) {
      console.warn('Error saving registered account:', e);
    }
  },

  async loginWithEmail(email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    const trimmedEmail = email.trim().toLowerCase();

    // 1. Try Java backend authentication
    try {
      const res = await apiClient.post<any>('/auth/login', {
        email: trimmedEmail,
        password,
      });

      if (res.success && res.data) {
        const backendUser: User = {
          id: res.data.userId || `usr_${Date.now()}`,
          name: res.data.fullName || trimmedEmail.split('@')[0],
          email: res.data.email || trimmedEmail,
          phone: res.data.phone || '+91 98000 00000',
          role: (res.data.roles && res.data.roles[0]) ? res.data.roles[0].replace('ROLE_', '') as PlatformRole : 'CUSTOMER',
          isVerified: true,
          memberSince: 'Verified Member',
          trustScore: 95,
        };
        const token = res.data.token || `jwt_${backendUser.id}`;
        this.setCurrentUser(backendUser, token);
        return {
          success: true,
          message: 'Authentication successful',
          data: { user: backendUser, token },
        };
      }
    } catch {
      // Backend not running or connection error, check local user store
    }

    // 2. Check local accounts
    const accounts = this.getRegisteredAccounts();
    const matched = accounts.find((a) => a.email.toLowerCase() === trimmedEmail);

    if (matched) {
      if (matched.password && matched.password !== password) {
        return {
          success: false,
          message: 'Incorrect password. Please verify and try again.',
          data: null as any,
        };
      }

      const { password: _, ...userSafe } = matched;
      const token = `jwt_${userSafe.id}_${Date.now()}`;
      this.setCurrentUser(userSafe, token);
      return {
        success: true,
        message: 'Signed in successfully',
        data: { user: userSafe, token },
      };
    }

    // If no account found with that email
    return {
      success: false,
      message: 'No account found with this email address. Please register for a new account.',
      data: null as any,
    };
  },

  async register(
    name: string,
    email: string,
    phone: string,
    password: string,
    role: PlatformRole
  ): Promise<ApiResponse<{ user: User; token: string }>> {
    const trimmedEmail = email.trim().toLowerCase();
    const names = name.trim().split(' ');
    const firstName = names[0] || 'User';
    const lastName = names.slice(1).join(' ') || 'Member';

    // 1. Try Java backend registration
    try {
      const res = await apiClient.post<any>('/auth/register', {
        firstName,
        lastName,
        email: trimmedEmail,
        phone: phone.trim(),
        password,
        role,
      });

      if (res.success && res.data) {
        const backendUser: User = {
          id: res.data.userId || `usr_${Date.now()}`,
          name: res.data.fullName || name,
          email: res.data.email || trimmedEmail,
          phone: phone.trim(),
          role,
          isVerified: true,
          memberSince: 'Just joined',
          trustScore: 85,
        };
        const token = res.data.token || `jwt_${backendUser.id}`;
        this.setCurrentUser(backendUser, token);
        this.saveRegisteredAccount({ ...backendUser, password });
        return {
          success: true,
          message: 'Registration successful! Welcome to RentEase.',
          data: { user: backendUser, token },
        };
      }
    } catch {
      // Backend not running, proceed with local account registration
    }

    // 2. Local Account Registration
    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: name.trim(),
      email: trimmedEmail,
      phone: phone.trim(),
      role,
      isVerified: true,
      memberSince: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      trustScore: 90,
      completedRentals: 0,
      responseRate: 100,
      responseTime: '< 10 mins',
    };

    const token = `jwt_${newUser.id}_${Date.now()}`;
    this.saveRegisteredAccount({ ...newUser, password });
    this.setCurrentUser(newUser, token);

    return {
      success: true,
      message: 'Account created successfully! You are now logged in.',
      data: { user: newUser, token },
    };
  },

  logout(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    } catch (e) {
      console.warn('Error during logout:', e);
    }
  },
};
