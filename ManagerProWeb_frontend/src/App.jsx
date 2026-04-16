import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Login from './pages/auth/Login'
import MainLayout from './layouts/MainLayout'
import Dashboard from './pages/Dashboard'
import Usuarios from './pages/admin/Usuarios'
import Departamentos from './pages/admin/Departamentos'
import Roles from './pages/admin/Roles'
import Configuracion from './pages/admin/Configuracion'
import OrdenesList from './pages/OrdenesList'
import OrdenDetalle from './pages/OrdenDetalle'
import Boletas from './pages/Boletas'
import PruebaAPI from './pages/PruebaAPI'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin/usuarios" element={<Usuarios />} />
          <Route path="/admin/departamentos" element={<Departamentos />} />
          <Route path="/admin/roles" element={<Roles />} />
          <Route path="/admin/configuracion" element={<Configuracion />} />
          <Route path="/ordenes" element={<OrdenesList />} />
          <Route path="/ordenes/:id" element={<OrdenDetalle />} />
          <Route path="/boletas" element={<Boletas />} />
          <Route path="/pruebaapi" element={<PruebaAPI />} />

        </Route>
      </Routes>
    </AuthProvider>
  )
}

export default App