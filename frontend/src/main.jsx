import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
// Шинээр нэмсэн мөр:
import { AuthProvider } from './context/AuthContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* AuthProvider-аар App-ийг ороож өгнө */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
)