import sendRequest from "./instance/sendRequest";
import { setTokens } from "./instance/tokenService";

export const LoginService = async (credentials) => {
  try {
    const data = await sendRequest({
      url: "/auth/login",
      method: "POST",
      data: credentials,
    });
    // Save tokens after successful login
    if (data?.access_token) {
      setTokens({
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
      });
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const AcceptInvite = async (credentials) => {
  try {
    const data = await sendRequest({
      url: "/auth/accept-invite",
      method: "POST",
      data: credentials,
    });
    // Save tokens after successful login
    if (data?.access_token) {
      setTokens({
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
      });
    }

    return data;
  } catch (error) {
    throw error;
  }
};

export const ChangePassword = async (payload) => {
  try {
    const data = await sendRequest({
      url: "/auth/change-password",
      method: "POST",
      data: payload,
    });

    return data;
  } catch (error) {
    throw error;
  }
};

export const ForgotPassword = async (payload) => {
  try {
    const data = await sendRequest({
      url: "/auth/forgot-password",
      method: "POST",
      data: payload,
    });

    return data;
  } catch (error) {
    throw error;
  }
};

export const Logout = async () => {
  try {
    const data = await sendRequest({
      url: "/auth/logout",
      method: "POST",
    });

    return data;
  } catch (error) {
    throw error;
  }
};

export const ResetPassword = async (payload) => {
  try {
    const data = await sendRequest({
      url: "/auth/reset-password",
      method: "POST",
      data: payload,
    });

    return data;
  } catch (error) {
    throw error;
  }
};

export const GetUser = async (credentials) => {
  try {
    const data = await sendRequest({
      url: "/auth/me",
    });

    return data;
  } catch (error) {
    throw error;
  }
};

export const GetOrganization = async (credentials) => {
  try {
    const data = await sendRequest({
      url: "/organizations/me",
    });

    return data;
  } catch (error) {
    throw error;
  }
};

export const RegisterService = async (userInfo) => {
  try {
    const data = await sendRequest({
      url: "/auth/register-company",
      method: "POST",
      data: userInfo,
    });
    // Save tokens after successful registration
    if (data?.access_token) {
      setTokens({
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
      });
    }
    return data;
  } catch (error) {
    throw error;
  }
};
