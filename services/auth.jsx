import { setTokens, setUser, clearTokens } from "./instance/tokenService";
import { createItem, getCollection, getById, updateItem } from "./instance/localStorageDB";

// Generate mock JWT-like token
const generateMockToken = () => {
  return `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Mock user data
const MOCK_USER = {
  id: "user-admin",
  _id: "user-admin",
  firstName: "Dev",
  lastName: "Admin",
  email: "admin@example.com",
  phone: "+1 555-0100",
  role: "admin",
  platformRole: "admin",
  activeRole: { name: "admin" },
  organizationName: "Development Org",
  organizationId: "org-1",
  emailVerified: true,
  phoneVerified: true,
  profileComplete: true,
};

export const LoginService = async (credentials) => {
  // Simulate login - accept any credentials for development
  const accessToken = generateMockToken();
  const refreshToken = generateMockToken();

  setTokens({ accessToken, refreshToken });
  setUser(JSON.stringify(MOCK_USER));

  return {
    success: true,
    message: "Login successful",
    accessToken,
    refreshToken,
    access_token: accessToken,
    refresh_token: refreshToken,
    user: MOCK_USER,
    role: MOCK_USER.role,
    userId: MOCK_USER.id,
    emailVerified: true,
    phoneVerified: true,
    profileComplete: true,
  };
};

export const AcceptInvite = async (credentials) => {
  const accessToken = generateMockToken();
  const refreshToken = generateMockToken();

  const newUser = {
    ...MOCK_USER,
    id: `user-${Date.now()}`,
    email: credentials.email || "invited@example.com",
  };

  setTokens({ accessToken, refreshToken });
  setUser(JSON.stringify(newUser));

  return {
    success: true,
    message: "Invite accepted successfully",
    accessToken,
    refreshToken,
    access_token: accessToken,
    refresh_token: refreshToken,
    user: newUser,
  };
};

export const ChangePassword = async (payload) => {
  return {
    success: true,
    message: "Password changed successfully",
  };
};

export const ForgotPassword = async (payload) => {
  return {
    success: true,
    message: "Password reset email sent",
  };
};

export const Logout = async () => {
  clearTokens();
  return {
    success: true,
    message: "Logged out successfully",
  };
};

export const ResetPassword = async (payload) => {
  return {
    success: true,
    message: "Password reset successfully",
  };
};

export const GetUser = async () => {
  // Return the mock user
  return {
    success: true,
    data: MOCK_USER,
  };
};

export const GetOrganization = async () => {
  return {
    success: true,
    data: {
      id: "org-1",
      _id: "org-1",
      name: "Development Organization",
      description: "Local development organization",
      industry: "Technology",
      size: "50-100",
      address: "123 Dev Street, Code City, CA 94000",
      website: "https://example.com",
      createdAt: new Date().toISOString(),
    },
  };
};

export const RegisterService = async (userInfo) => {
  const accessToken = generateMockToken();
  const refreshToken = generateMockToken();

  const newUser = {
    ...MOCK_USER,
    id: `user-${Date.now()}`,
    _id: `user-${Date.now()}`,
    firstName: userInfo.firstName || "New",
    lastName: userInfo.lastName || "User",
    email: userInfo.email || "newuser@example.com",
    phone: userInfo.phone || "+1 555-0000",
  };

  // Save to localStorage
  createItem("users", newUser);
  setTokens({ accessToken, refreshToken });
  setUser(JSON.stringify(newUser));

  return {
    success: true,
    message: `User registered successfully with email ${newUser.email}`,
    accessToken,
    refreshToken,
    access_token: accessToken,
    refresh_token: refreshToken,
    role: "admin",
    userId: newUser.id,
    emailVerified: false,
    phoneVerified: false,
    profileComplete: false,
  };
};
