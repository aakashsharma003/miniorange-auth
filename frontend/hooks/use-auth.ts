import { useRouter } from 'next/router';

export function useAuth() {
  const router = useRouter();

  const login = (token: string, refreshToken?: string) => {
    localStorage.setItem("token", token);
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }
    router.push("/profile");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    router.push("/");
  };

  const isAuthenticated = () => {
    return !!localStorage.getItem("token");
  };

  return { login, logout, isAuthenticated };
}
