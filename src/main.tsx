import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ThemeLanguageProvider } from './components/ThemeLanguageContext.tsx';
import { ClerkProvider } from '@clerk/clerk-react';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || "";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeLanguageProvider>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY || "pk_test_ZW1wdHlfY2xlcmtfayQ"}>
        <App />
      </ClerkProvider>
    </ThemeLanguageProvider>
  </StrictMode>,
);

