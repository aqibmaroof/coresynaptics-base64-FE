export const getAccessToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

export const getRefreshToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("refreshToken") : null;

export const setTokens = ({ accessToken, refreshToken }) => {
  if (typeof window === "undefined") return;
  accessToken && localStorage.setItem("accessToken", accessToken);
  refreshToken && localStorage.setItem("refreshToken", refreshToken);
};

export const setUser = (user) => {
  if (typeof window === "undefined") return;
  if (typeof user === "string") {
    localStorage.setItem("user", user);
  } else if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  }
};

export const setOrganization = ({ organization }) => {
  if (typeof window === "undefined") return;
  organization &&
    localStorage.setItem("organization", JSON.stringify(organization));
};

// Mock user for development when no user is stored
const MOCK_USER = {
  firstName: "Dev",
  lastName: "User",
  role: "admin",
  platformRole: "admin",
  activeRole: { name: "admin" },
  organizationName: "Development",
};

export const getUser = () => {
  if (typeof window === "undefined") return null;
  const storedUser = localStorage.getItem("user");
  // Return mock user if no user is stored (for development)
  return storedUser || JSON.stringify(MOCK_USER);
};

export const clearTokens = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
};
