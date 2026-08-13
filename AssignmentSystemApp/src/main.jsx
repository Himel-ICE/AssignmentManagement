import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'react-hot-toast'
import 'katex/dist/katex.min.css'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
          <Toaster position="top-right" reverseOrder={false}
            toastOptions={{
              duration: 1000,
              style: {
                borderRadius: "10px",
              },
            }}
          />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
