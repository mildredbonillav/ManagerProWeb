import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  SquaresFour,
  Users,
  Buildings,
  FolderOpen,
  Headset,
  Clock,
  ArrowClockwise,
  CheckSquare,
  ChartBar,
  Gear,
  SignOut,
  List,
  X,
  CaretDown,
  UserCircle,
  ShieldCheck,
  Package,
} from '@phosphor-icons/react'

const menuItems = [
  {
    grupo: 'General',
    items: [
      { label: 'Dashboard', icon: SquaresFour, ruta: '/dashboard' },
    ]
  },
  {
    grupo: 'Operaciones',
    items: [
      { label: 'Órdenes de servicio', icon: FolderOpen, ruta: '/ordenes' },
      { label: 'Boletas de tiempo', icon: Clock, ruta: '/boletas' },
      { label: 'Solicitudes de tiempo', icon: ArrowClockwise, ruta: '/solicitudes-incremento' },
      { label: 'Aprobación de subtareas', icon: CheckSquare, ruta: '/aprobacion-subtareas' },
      { label: 'Soporte', icon: Headset, ruta: '/soporte' },
      { label: 'Prueba API', icon: Clock, ruta: '/PruebaAPI' },
    ]
  },
  {
    grupo: 'Administración',
    items: [
      { label: 'Usuarios', icon: Users, ruta: '/admin/usuarios' },
      { label: 'Departamentos', icon: Buildings, ruta: '/admin/departamentos' },
      { label: 'Clientes', icon: Buildings, ruta: '/admin/clientes' },
      { label: 'Productos', icon: Package, ruta: '/admin/productos' },
      { label: 'Configuración', icon: Gear, ruta: '/admin/configuracion' },
      { label: 'Roles y permisos', icon: ShieldCheck, ruta: '/admin/roles' },
    ]
  },
  {
    grupo: 'Reportes',
    items: [
      { label: 'Reportes', icon: ChartBar, ruta: '/reportes' },
    ]
  },
]

export default function MainLayout() {
  const [sidebarAbierto, setSidebarAbierto] = useState(false)
  const [menuUsuarioAbierto, setMenuUsuarioAbierto] = useState(false)
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const linkClase = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
      isActive
        ? 'bg-blue-50 text-blue-600 font-medium'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`

  return (
    <div className="min-h-screen bg-slate-50 flex">

      {/* Overlay mobile */}
      {sidebarAbierto && (
        <div
          className="fixed inset-0 bg-black/30 z-20 lg:hidden"
          onClick={() => setSidebarAbierto(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-white border-r border-slate-200 z-30 flex flex-col
        transition-transform duration-200
        ${sidebarAbierto ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
      `}>

        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <span className="font-bold text-lg text-slate-900">
            Manager<span className="text-blue-600">Pro</span>
          </span>
          <button
            onClick={() => setSidebarAbierto(false)}
            className="lg:hidden text-slate-400 hover:text-slate-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navegación */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-6">
          {menuItems.map((grupo) => (
            <div key={grupo.grupo}>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
                {grupo.grupo}
              </p>
              <div className="flex flex-col gap-0.5">
                {grupo.items.map((item) => (
                  <NavLink
                    key={item.ruta}
                    to={item.ruta}
                    className={linkClase}
                    onClick={() => setSidebarAbierto(false)}
                  >
                    <item.icon size={18} />
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Usuario en sidebar */}
        <div className="px-3 py-4 border-t border-slate-200">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <UserCircle size={20} className="text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{usuario?.nombre}</p>
              <p className="text-xs text-slate-500 truncate">{usuario?.rol}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors mt-1"
          >
            <SignOut size={18} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Navbar top */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 sticky top-0 z-10">
          <button
            onClick={() => setSidebarAbierto(true)}
            className="lg:hidden text-slate-500 hover:text-slate-700"
          >
            <List size={22} />
          </button>

          <div className="flex-1" />

          {/* Menú usuario top */}
          <div className="relative">
            <button
              onClick={() => setMenuUsuarioAbierto(!menuUsuarioAbierto)}
              className="flex items-center gap-2 text-sm text-slate-700 hover:text-slate-900 font-medium"
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <UserCircle size={20} className="text-blue-600" />
              </div>
              <span className="hidden sm:block">{usuario?.nombre}</span>
              <CaretDown size={14} className="text-slate-400" />
            </button>

            {menuUsuarioAbierto && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-sm font-medium text-slate-900">{usuario?.nombre}</p>
                  <p className="text-xs text-slate-500">{usuario?.rol}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <SignOut size={16} />
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Página activa */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}