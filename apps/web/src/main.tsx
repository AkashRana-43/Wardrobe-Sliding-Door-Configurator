import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import '@/styles/variables.module.css';
import { WardrobeProvider } from "@/state/WardrobeProvider.tsx";
import { CartAuthProvider } from "@/state/CartAuthProvider.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <CartAuthProvider>
        <WardrobeProvider>
          <App />
        </WardrobeProvider>
      </CartAuthProvider>
    </BrowserRouter>
  </StrictMode>
)
