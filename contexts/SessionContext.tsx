import {
  logout as endCurrentSession,
  getSessionUser,
  type SessionUser,
} from "@/services/auth";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AppState } from "react-native";

export type SessionStatus =
  | "checking"
  | "authenticated"
  | "unauthenticated"
  | "error";

type SessionState =
  | { status: "checking"; user: null }
  | { status: "authenticated"; user: SessionUser }
  | { status: "unauthenticated"; user: null }
  | { status: "error"; user: null };

export type SessionContextValue = {
  status: SessionStatus;
  user: SessionUser | null;
  refreshSession: () => Promise<void>;
  logout: () => Promise<void>;
};

export const SessionContext = createContext<SessionContextValue | null>(null);

export const UserContext = createContext<SessionUser | null>(null);

export function useSession(): SessionContextValue {
  const value = useContext(SessionContext);

  if (!value) {
    throw new Error("useSession must be used within a SessionProvider");
  }

  return value;
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SessionState>({
    status: "checking",
    user: null,
  });

  const refreshToken = useRef(0);

  const refreshSession = useCallback(async () => {
    const token = ++refreshToken.current;

    try {
      const user = await getSessionUser();

      if (token !== refreshToken.current) return;

      setSession(
        user
          ? { status: "authenticated", user }
          : { status: "unauthenticated", user: null }
      );
    } catch (error) {
      console.error("Session refresh failed:", error);

      if (token !== refreshToken.current) return;

      setSession({ status: "error", user: null });
    }
  }, []);

  const logout = useCallback(async () => {
    await endCurrentSession();

    refreshToken.current += 1;
    setSession({ status: "unauthenticated", user: null });
  }, []);

  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState !== "active") return;

      void refreshSession();
    });

    return () => subscription.remove();
  }, [refreshSession]);

  const value = useMemo<SessionContextValue>(
    () => ({
      status: session.status,
      user: session.user,
      refreshSession,
      logout,
    }),
    [session.status, session.user, refreshSession, logout]
  );

  return (
    <SessionContext.Provider value={value}>
      <UserContext.Provider value={session.user}>
        {children}
      </UserContext.Provider>
    </SessionContext.Provider>
  );
}
