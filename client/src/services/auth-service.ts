import axios from "axios";
import {
  authenticatedApiClient,
  apiClient,
} from "@/lib/api";
import { storeAccessToken } from "@/lib/auth-session";

const AUTH_BASE_PATH = "/auth/api/v1";

interface UserResponse {
  id: number;
  name: string;
  email: string;
  is_verified: boolean;
}

interface TokenResponse {
  access_token: string;
  token_type: string;
  user: UserResponse;
}

interface MessageResponse {
  message: string;
}

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface VerifyEmailRequest {
  email: string;
  otp: string;
}

interface EmailRequest {
  email: string;
}

const authService = {
  async login(credentials: LoginRequest) {
    const { data } = await apiClient.post<TokenResponse>(
      `${AUTH_BASE_PATH}/login`,
      credentials,
    );
    storeAccessToken(data.access_token);
    return data.user;
  },

  async register(payload: RegisterRequest) {
    const { data } = await apiClient.post<MessageResponse>(
      `${AUTH_BASE_PATH}/register`,
      payload,
    );
    return data;
  },

  async verifyEmail(payload: VerifyEmailRequest) {
    const { data } = await apiClient.post<MessageResponse>(
      `${AUTH_BASE_PATH}/verify-email`,
      payload,
    );
    return data;
  },

  async resendOtp(payload: EmailRequest) {
    const { data } = await apiClient.post<MessageResponse>(
      `${AUTH_BASE_PATH}/resend-otp`,
      payload,
    );
    return data;
  },

  async getCurrentUser() {
    const { data } = await authenticatedApiClient.get<UserResponse>(
      `${AUTH_BASE_PATH}/me`,
    );
    return data;
  },

  getErrorMessage(error: unknown, fallback: string) {
    if (axios.isAxiosError(error)) {
      const detail: unknown = error.response?.data?.detail;

      if (typeof detail === "string") {
        return detail;
      }

      if (Array.isArray(detail)) {
        const messages = detail
          .map((item: unknown) => {
            if (
              typeof item === "object" &&
              item !== null &&
              "msg" in item &&
              typeof item.msg === "string"
            ) {
              return item.msg;
            }

            return null;
          })
          .filter((message): message is string => message !== null);

        if (messages.length > 0) {
          return messages.join(" ");
        }
      }

      if (!error.response) {
        return "Unable to connect to NyayaAI. Check your connection and try again.";
      }
    }

    return error instanceof Error ? error.message : fallback;
  },
};

export type {
  EmailRequest,
  LoginRequest,
  MessageResponse,
  RegisterRequest,
  TokenResponse,
  UserResponse,
  VerifyEmailRequest,
};
export { authService };
