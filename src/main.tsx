import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { KeyboardLayoutProvider } from './contexts/KeyboardLayoutContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <KeyboardLayoutProvider defaultLayout="remington-gail">
      <App />
    </KeyboardLayoutProvider>
  </React.StrictMode>,
)
