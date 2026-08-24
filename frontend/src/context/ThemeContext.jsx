import React, { createContext, useState, useEffect, useContext } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState('teal');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', 'teal');
    document.documentElement.classList.remove('dark-theme', 'light-theme');
    document.documentElement.classList.add('teal-theme');
    localStorage.setItem('theme', 'teal');
    localStorage.setItem('creatorsync_theme', 'teal');
  }, []);

  const toggleTheme = () => {};
  const setTheme = () => {};

  return (
    <ThemeContext.Provider value={{ theme: 'teal', toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
