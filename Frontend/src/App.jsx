import { RouterProvider } from "react-router"
import { router } from "./app.route.jsx"
import { AuthProvider } from "./features/auth/auth.context.jsx"

// 2: 13 min 

function App() {

  return (
    <AuthProvider>
    <RouterProvider router={router}/> 
    </AuthProvider>
  )
}

export default App
