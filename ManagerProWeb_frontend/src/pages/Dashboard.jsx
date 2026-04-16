import {
  FolderOpen,
  Clock,
  Headset,
  CheckCircle,
  ChartLineUp,
  ArrowRight,
} from '@phosphor-icons/react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const tarjetas = [
  {
    label: 'Órdenes activas',
    valor: 12,
    icono: FolderOpen,
    color: 'blue',
    descripcion: '3 por vencer esta semana',
  },
  {
    label: 'Horas registradas',
    valor: '142h',
    icono: Clock,
    color: 'violet',
    descripcion: 'Este mes',
  },
  {
    label: 'Solicitudes de soporte',
    valor: 8,
    icono: Headset,
    color: 'amber',
    descripcion: '2 sin atender',
  },
  {
    label: 'Tareas finalizadas',
    valor: 34,
    icono: CheckCircle,
    color: 'green',
    descripcion: 'Este mes',
  },
]

const colores = {
  blue:   { bg: 'bg-blue-50',   icon: 'text-blue-600',   badge: 'bg-blue-100' },
  violet: { bg: 'bg-violet-50', icon: 'text-violet-600', badge: 'bg-violet-100' },
  amber:  { bg: 'bg-amber-50',  icon: 'text-amber-600',  badge: 'bg-amber-100' },
  green:  { bg: 'bg-green-50',  icon: 'text-green-600',  badge: 'bg-green-100' },
}

const ordenesRecientes = [
  { id: 'OS-001', cliente: 'Empresa ABC', tipo: 'Proyecto', estado: 'En progreso', progreso: 65 },
  { id: 'OS-002', cliente: 'Empresa XYZ', tipo: 'Soporte',  estado: 'Abierta',     progreso: 10 },
  { id: 'OS-003', cliente: 'Empresa DEF', tipo: 'Incremento', estado: 'En progreso', progreso: 40 },
  { id: 'OS-004', cliente: 'Empresa GHI', tipo: 'Proyecto', estado: 'Cerrada',     progreso: 100 },
]

const estadoClase = {
  'En progreso': 'bg-blue-100 text-blue-700',
  'Abierta':     'bg-amber-100 text-amber-700',
  'Cerrada':     'bg-green-100 text-green-700',
}

export default function Dashboard() {
  const { usuario } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-6">

      {/* Encabezado */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Hola, {usuario?.nombre?.split(' ')[0]} 👋
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Aquí tenés un resumen de lo que está pasando hoy.
        </p>
      </div>

      {/* Tarjetas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {tarjetas.map((t) => {
          const c = colores[t.color]
          return (
            <div
              key={t.label}
              className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-4"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500 font-medium">{t.label}</p>
                <div className={`w-9 h-9 rounded-lg ${c.bg} flex items-center justify-center`}>
                  <t.icono size={18} className={c.icon} />
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900">{t.valor}</p>
                <p className="text-xs text-slate-400 mt-1">{t.descripcion}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Órdenes recientes */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ChartLineUp size={18} className="text-slate-400" />
            <h2 className="text-sm font-semibold text-slate-900">Órdenes recientes</h2>
          </div>
          <button
            onClick={() => navigate('/ordenes')}
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            Ver todas <ArrowRight size={14} />
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {ordenesRecientes.map((os) => (
            <div key={os.id} className="flex items-center gap-4 px-6 py-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-slate-900">{os.id}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${estadoClase[os.estado]}`}>
                    {os.estado}
                  </span>
                </div>
                <p className="text-xs text-slate-500 truncate">{os.cliente} · {os.tipo}</p>
              </div>
              <div className="w-32 hidden sm:block">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-slate-400">Progreso</span>
                  <span className="text-xs font-medium text-slate-700">{os.progreso}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all"
                    style={{ width: `${os.progreso}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}