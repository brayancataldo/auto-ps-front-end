import { createContext, ReactNode, useEffect, useState } from "react";
import axios from "axios";
import cookie from "js-cookie";

interface UserProps {
  id: string;
  name: string;
  image: string;
  token: string;
}

interface AuthContextData {
  user: UserProps | null;
  logged: boolean;
  logOut: () => void;
}

export const AuthContext = createContext({} as AuthContextData);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider(props: AuthProviderProps) {
  const [logged, setLogged] = useState(false);
  const [user, setUser] = useState<UserProps | null>(null);

  useEffect(() => {
    checkLogin();

    async function checkLogin() {
      const token = cookie.get("token");

      if (token) {
        try {
          const response = await axios.get("https://api.spotify.com/v1/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUser({
            id: response.data.id,
            name: response.data.display_name,
            token: token,
            image: response.data.images[0].url || "",
          });
          setLogged(true);
        } catch (err) {
          cookie.remove("token");
          setLogged(false);
        }
      }
    }
  }, []);

  function logOut() {
    cookie.remove("token");
    setUser(null);
    setLogged(false);
  }

  return (
    <AuthContext.Provider value={{ user, logged, logOut }}>
      {props.children}
    </AuthContext.Provider>
  );
}
