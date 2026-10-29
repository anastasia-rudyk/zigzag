import { createContext, useContext, useEffect, useState } from 'react';

const BackdropContext = createContext(null);

/** Фонове розмите фото сторінки (як на головному екрані мобільних застосунків подорожей) */
export function BackdropProvider({ children }) {
  const [url, setUrl] = useState(null);
  return <BackdropContext.Provider value={{ url, setUrl }}>{children}</BackdropContext.Provider>;
}

/** Встановлює фон для поточної сторінки; при виході зі сторінки фон скидається */
export function useBackdrop(url) {
  const { setUrl } = useContext(BackdropContext);
  useEffect(() => {
    setUrl(url || null);
  }, [url, setUrl]);
  useEffect(() => () => setUrl(null), [setUrl]);
}

export const useBackdropUrl = () => useContext(BackdropContext).url;
