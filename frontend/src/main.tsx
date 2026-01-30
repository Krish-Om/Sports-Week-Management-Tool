import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AsyncBoundary } from './components/AsyncBoundary'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AsyncBoundary>
      <App />
    </AsyncBoundary>
  </StrictMode>,
)
