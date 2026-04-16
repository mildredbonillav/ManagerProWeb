import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { EnvelopeSimple, LockSimple, Eye, EyeSlash } from '@phosphor-icons/react'

export default function Login() {
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [verContrasena, setVerContrasena] = useState(false)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setCargando(true)

    setTimeout(() => {
      if (correo === 'admin@managerpro.com' && contrasena === '123456') {
        login({ nombre: 'Mildred Bonilla', correo, rol: 'Administrador' })
        navigate('/dashboard')
      } else {
        setError('Correo o contraseña incorrectos.')
      }
      setCargando(false)
    }, 800)
  }

  return (
    <div className="min-h-screen flex">

      {/* Panel izquierdo */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-slate-900 to-slate-700 flex-col justify-between p-12">
        <div>
          <span className="text-white font-bold text-2xl tracking-tight">
            Manager<span className="text-blue-400">Pro</span>
          </span>
          <p className="text-slate-400 text-sm mt-1">BusinessPro</p>
        </div>

        <div>
          <h1 className="text-white text-4xl font-bold leading-tight mb-4">
            Más de 15 años<br />creando software<br />a la medida.
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed">
            Brindamos soluciones innovadoras que permiten mayor competitividad en el mercado.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <div className="h-px bg-slate-700"></div>
          <p className="text-slate-500 text-sm">
            Gestión de proyectos · Control de tiempos · Soporte
          </p>
        </div>
      </div>

      {/* Panel derecho — formulario */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">

          {/* Logo mobile */}
          <div className="lg:hidden mb-8">
            <span className="font-bold text-2xl tracking-tight text-slate-900">
              Manager<span className="text-blue-500">Pro</span>
            </span>
            <p className="text-slate-500 text-sm mt-0.5">BusinessPro</p>
          </div>

          <h2 className="text-3xl font-bold text-slate-900 mb-2">Bienvenido</h2>
          <p className="text-slate-500 mb-8">Ingresá tus credenciales para continuar</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* Correo */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">
                Correo electrónico
              </label>
              <div className="relative">
                <EnvelopeSimple
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="email"
                  placeholder="correo@empresa.com"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  required
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-shadow"
                />
              </div>
            </div>

            {/* Contraseña */}
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-slate-700">
                  Contraseña
                </label>
                <button
                  type="button"
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              <div className="relative">
                <LockSimple
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type={verContrasena ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  required
                  className="w-full pl-9 pr-10 py-2.5 rounded-lg border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-shadow"
                />
                <button
                  type="button"
                  onClick={() => setVerContrasena(!verContrasena)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {verContrasena ? <EyeSlash size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3">
                {error}
              </div>
            )}

            {/* Botón */}
            <button
              type="submit"
              disabled={cargando}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2.5 rounded-lg transition-colors text-sm mt-1"
            >
              {cargando ? 'Ingresando...' : 'Ingresar'}
            </button>

          </form>

          <p className="text-center text-xs text-slate-400 mt-8">
            Manager Pro © {new Date().getFullYear()} — BusinessPro
          </p>
        </div>
      </div>

    </div>
  )
}