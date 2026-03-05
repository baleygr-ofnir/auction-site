import { AuthProvider } from '@/context/AuthContext.tsx';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/router';
import './App.css'

function App() {

  return (
      <div className="w-full max-w-full overflow-x-hidden min-h-screen bg-slate-950">
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </div>
  )
}

export default App
