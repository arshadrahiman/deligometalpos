import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRouter } from './router/AppRouter';
import { useThemeStore } from './store/useThemeStore';
import { initializeFreshProductionStorage } from './services/dataInit';

export const App: React.FC = () => {
  const { initTheme } = useThemeStore();

  useEffect(() => {
    initializeFreshProductionStorage();
    initTheme();
  }, [initTheme]);

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AppRouter />
    </BrowserRouter>
  );
};

export default App;

