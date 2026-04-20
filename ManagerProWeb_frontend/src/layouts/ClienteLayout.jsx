import { useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  Headset,
  House,
  SignOut,
  UserCircle,
  CaretDown,
  List,
  X,
} from '@phosphor-icons/react'

const navItems = [
  { label: 'Inicio', icon: House, ruta: '/cliente/inicio' },
  { label: 'Soporte', icon: Headset, ruta: '/cliente/soporte' },
]

export default function ClienteLayout() {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()
  const [menuUsuario, setMenuUsuario] = useState(false)
  const [menuMovil, setMenuMovil] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

          {/* Logo + nav */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
                <Headset size={14} className="text-white" />
              </div>
              <span className="font-bold text-slate-900 text-base leading-none">
                Manager<span className="text-blue-600">Pro</span>
              </span>
            </div>

            {/* Nav desktop */}
            <nav className="hidden sm:flex items-center gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.ruta}
                  to={item.ruta}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`
                  }
                >
                  <item.icon size={16} />
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            {/* Portal badge */}
            <span className="hidden sm:block text-xs bg-blue-100 text-blue-700 font-medium px-2.5 py-1 rounded-full">
              Portal de Clientes
            </span>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setMenuUsuario(!menuUsuario)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <UserCircle size={20} className="text-blue-600" />
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-slate-900 leading-none">{usuario?.nombre}</p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-none">{usuario?.empresa}</p>
                </div>
                <CaretDown size={13} className="text-slate-400 hidden sm:block" />
              </button>

              {menuUsuario && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-semibold text-slate-900">{usuario?.nombre}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{usuario?.empresa}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <SignOut size={16} />
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>

            {/* Mobile nav toggle */}
            <button
              onClick={() => setMenuMovil(!menuMovil)}
              className="sm:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100"
            >
              {menuMovil ? <X size={20} /> : <List size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {menuMovil && (
          <div className="sm:hidden border-t border-slate-100 bg-white px-4 py-2">
            {navItems.map((item) => (
              <NavLink
                key={item.ruta}
                to={item.ruta}
                onClick={() => setMenuMovil(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`
                }
              >
                <item.icon size={16} />
                {item.label}
              </NavLink>
            ))}
          </div>
        )}
      </header>

      {/* ── Contenido ──────────────────────────────────────────── */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <Outlet />
      </main>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <p className="text-xs text-slate-400">
            Manager Pro © {new Date().getFullYear()} — BusinessPro
          </p>
          <p className="text-xs text-slate-400">Portal de Clientes</p>
        </div>
      </footer>

    </div>
  )
}
