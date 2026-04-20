import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { SoporteProvider } from './context/SoporteContext'
import Login from './pages/auth/Login'
import ForgotPassword from './pages/auth/ForgotPassword'
import MainLayout from './layouts/MainLayout'
import ClienteLayout from './layouts/ClienteLayout'
import Dashboard from './pages/Dashboard'
import Usuarios from './pages/admin/Usuarios'
import Departamentos from './pages/admin/Departamentos'
import Roles from './pages/admin/Roles'
import Configuracion from './pages/admin/Configuracion'
import Clientes from './pages/admin/Clientes'
import OrdenesList from './pages/OrdenesList'
import OrdenDetalle from './pages/OrdenDetalle'
import Boletas from './pages/Boletas'
import PruebaAPI from './pages/PruebaAPI'
import Productos from './pages/admin/Productos'
import Soporte from './pages/Soporte'
import ClienteInicio from './pages/cliente/ClienteInicio'
import ClienteSoporte from './pages/cliente/ClienteSoporte'
import Reportes from './pages/Reportes'

function App() {
  return (
    <AuthProvider>
      <SoporteProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Layout principal (usuarios internos) */}
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin/usuarios" element={<Usuarios />} />
            <Route path="/admin/departamentos" element={<Departamentos />} />
            <Route path="/admin/roles" element={<Roles />} />
            <Route path="/admin/configuracion" element={<Configuracion />} />
            <Route path="/admin/productos" element={<Productos />} />
            <Route path="/admin/clientes" element={<Clientes />} />
            <Route path="/ordenes" element={<OrdenesList />} />
            <Route path="/ordenes/:id" element={<OrdenDetalle />} />
            <Route path="/boletas" element={<Boletas />} />
            <Route path="/soporte" element={<Soporte />} />
            <Route path="/pruebaapi" element={<PruebaAPI />} />
            <Route path="/reportes" element={<Reportes />} />

          </Route>

          {/* Portal cliente (layout diferenciado) */}
          <Route element={<ClienteLayout />}>
            <Route path="/cliente/inicio" element={<ClienteInicio />} />
            <Route path="/cliente/soporte" element={<ClienteSoporte />} />
          </Route>
        </Routes>
      </SoporteProvider>
    </AuthProvider>
  )
}

export default App
