export interface User {
  id: string;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePictureUrl?: string;
  roles: string[];
  currentSubscription?: UserSubscription;
}

export interface UserSubscription {
  id: string;
  planName: string;
  tier: SubscriptionTier;
  startDate: string;
  endDate?: string;
  isActive: boolean;
}

export enum SubscriptionTier {
  Bronze = 1,
  Silver = 2,
  Gold = 3
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  expiresAt: string;
  user: User;
}

export interface LoginRequest {
  emailOrUsername: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterRequest {
  userName: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
}