import { createContext, useContext, useState, useCallback } from 'react';

const AdminContext = createContext(null);

const ADMIN_PASSWORD = 'admindisney';
const STORAGE_KEY = 'apd_admin_session';

export function AdminProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(() => {
    return sessionStorage.getItem(STORAGE_KEY) === 'true';
  });
  const [loginError, setLoginError] = useState('');

  const login = useCallback((password) => {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, 'true');
      setIsAdmin(true);
      setLoginError('');
      return true;
    }
    setLoginError('Incorrect password. Try again!');
    return false;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setIsAdmin(false);
  }, []);

  return (
    <AdminContext.Provider value={{ isAdmin, login, logout, loginError, setLoginError }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  return useContext(AdminContext);
}
