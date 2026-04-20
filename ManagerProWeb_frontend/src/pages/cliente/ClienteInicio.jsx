import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useSoporte } from '../../context/SoporteContext'
import {
  Headset,
  Clock,
  CheckCircle,
  ArrowRight,
  WarningCircle,
  ChatCircleText,
} from '@phosphor-icons/react'

const estadoClase = {
  Pendiente:    'bg-amber-100 text-amber-700',
  'En revisión': 'bg-blue-100 text-blue-700',
  Convertida:   'bg-violet-100 text-violet-700',
  Resuelta:     'bg-green-100 text-green-700',
  Rechazada:    'bg-red-100 text-red-700',
}

const motivoClase = {
  Incidencia:   'bg-red-100 text-red-700',
  Requerimiento:'bg-teal-100 text-teal-700',
  Consulta:     'bg-slate-100 text-slate-600',
}

export default function ClienteInicio() {
  const { usuario } = useAuth()
  const { solicitudes } = useSoporte()
  const navigate = useNavigate()

  // Filtrar solicitudes del cliente actual
  const misSolicitudes = solicitudes.filter(
    (s) => s.clienteId === usuario?.clienteId
  )

  const pendientes   = misSolicitudes.filter((s) => s.estado === 'Pendiente').length
  const enRevision   = misSolicitudes.filter((s) => s.estado === 'En revisión').length
  const resueltas    = misSolicitudes.filter((s) => s.estado === 'Resuelta').length
  const recientes    = [...misSolicitudes].reverse().slice(0, 3)

  const tarjetas = [
    {
      label: 'Total de solicitudes',
      valor: misSolicitudes.length,
      icon: Headset,
      bg: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Pendientes / En revisión',
      valor: pendientes + enRevision,
      icon: Clock,
      bg: 'bg-amber-50',
      iconColor: 'text-amber-600',
    },
    {
      label: 'Resueltas',
      valor: resueltas,
      icon: CheckCircle,
      bg: 'bg-green-50',
      iconColor: 'text-green-600',
    },
  ]

  return (
    <div className="flex flex-col gap-7">

      {/* Saludo */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Bienvenido, {usuario?.nombre?.split(' ')[0]} 👋
        </h1>
        <p className="text-sm text-slate-500 mt-1">{usuario?.empresa}</p>
      </div>

      {/* Tarjetas resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {tarjetas.map((t) => (
          <div
            key={t.label}
            className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4"
          >
            <div className={`w-11 h-11 rounded-xl ${t.bg} flex items-center justify-center shrink-0`}>
              <t.icon size={22} className={t.iconColor} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{t.valor}</p>
              <p className="text-xs text-slate-500 mt-0.5">{t.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-5 flex items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-white">¿Tiene un problema o requerimiento?</p>
          <p className="text-sm text-blue-100 mt-0.5">
            Registre una solicitud de soporte y nuestro equipo la atenderá a la brevedad.
          </p>
        </div>
        <button
          onClick={() => navigate('/cliente/soporte?tab=nueva')}
          className="flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 font-medium text-sm px-4 py-2.5 rounded-lg transition-colors shrink-0"
        >
          Nueva solicitud
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Solicitudes recientes */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <ChatCircleText size={18} className="text-slate-400" />
            <h2 className="text-sm font-semibold text-slate-900">Solicitudes recientes</h2>
          </div>
          <button
            onClick={() => navigate('/cliente/soporte')}
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            Ver todas <ArrowRight size={13} />
          </button>
        </div>

        {recientes.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <Headset size={32} className="text-slate-200 mx-auto mb-2" />
            <p className="text-sm text-slate-400">Aún no ha registrado solicitudes.</p>
            <button
              onClick={() => navigate('/cliente/soporte?tab=nueva')}
              className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Registrar primera solicitud
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recientes.map((s) => (
              <div key={s.id} className="flex items-start gap-4 px-5 py-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold text-slate-500">{s.codigo}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${estadoClase[s.estado]}`}>
                      {s.estado}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${motivoClase[s.motivo]}`}>
                      {s.motivo}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700 mt-1 line-clamp-1">{s.descripcion}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {s.productoNombre} · {s.modulo}/{s.submodulo} · {s.fechaRegistro}
                  </p>
                </div>
                {s.estado === 'En revisión' && (
                  <div className="shrink-0 mt-1">
                    <WarningCircle size={18} className="text-amber-500" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
