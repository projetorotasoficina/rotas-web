import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/home'
import LoginPage from './pages/login'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<HomePage />} index />
        <Route element={<LoginPage />} path="/login" />
      </Routes>
    </BrowserRouter>
  )
}
