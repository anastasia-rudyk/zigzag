import { createContext, useContext, useEffect, useState } from 'react';
import { api, tokenStore } from '../api/client.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  // Відновлюємо сесію за збереженим токеном
  useEffect(() => {
    if (!tokenStore.get()) {
      setReady(true);
      return;
    }
    api
      .me()
      .then(({ user }) => setUser(user))
      .catch(() => tokenStore.set(null))
      .finally(() => setReady(true));
  }, []);

  const signIn = async (email, password) => {
    const { token, user } = await api.login(email, password);
    tokenStore.set(token);
    setUser(user);
    return user;
  };

  const signUp = async (name, email, password) => {
    const { token, user } = await api.register(name, email, password);
    tokenStore.set(token);
    setUser(user);
    return user;
  };

  const signOut = () => {
    tokenStore.set(null);
    setUser(null);
  };

  const toggleFavorite = async (locationId) => {
    const { favorites } = await api.toggleFavorite(locationId);
    setUser((u) => ({ ...u, favorites }));
  };

  return (
    <AuthContext.Provider value={{ user, ready, signIn, signUp, signOut, toggleFavorite }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
