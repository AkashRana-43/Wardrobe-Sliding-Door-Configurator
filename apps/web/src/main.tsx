import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { WardrobeProvider } from "@/state/WardrobeProvider.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WardrobeProvider>
      <App />
    </WardrobeProvider>
  </StrictMode>,
)
