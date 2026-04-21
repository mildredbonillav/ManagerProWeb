import { useState } from 'react'
import {
  ArrowClockwise, Clock, ThumbsUp, ThumbsDown, Warning,
  X, CheckCircle, XCircle,
} from '@phosphor-icons/react'
import { useBoletasCtx } from '../context/BoletasContext'

const ESTADO_CLS = {
  pendiente: 'bg-amber-100 text-amber-700',
  aprobada:  'bg-emerald-100 text-emerald-700',
  rechazada: 'bg-red-100 text-red-600',
}
const ESTADO_LABEL = { pendiente: 'Pendiente', aprobada: 'Aprobada', rechazada: 'Rechazada' }

const FILTROS = [
  { id: 'todos',     label: 'Todas' },
  { id: 'pendiente', label: 'Pendientes' },
  { id: 'aprobada',  label: 'Aprobadas' },
  { id: 'rechazada', label: 'Rechazadas' },
]

export default function SolicitudesIncremento() {
  const { solicitudesIncremento, aprobarIncremento, rechazarIncremento } = useBoletasCtx()
  const [filtro, setFiltro] = useState('todos')
  const [expandidos, setExpandidos] = useState({})
  const [modalRechazo, setModalRechazo] = useState({ abierto: false, id: null })
  const [motivo, setMotivo] = useState('')

  const filtradas = solicitudesIncremento.filter(s =>
    filtro === 'todos' ? true : s.estado === filtro
  )

  const conteos = {
    pendiente: solicitudesIncremento.filter(s => s.estado === 'pendiente').length,
    aprobada:  solicitudesIncremento.filter(s => s.estado === 'aprobada').length,
    rechazada: solicitudesIncremento.filter(s => s.estado === 'rechazada').length,
  }

  const toggleExpandido = (id) => setExpandidos(prev => ({ ...prev, [id]: !prev[id] }))

  const abrirRechazo = (id) => { setMotivo(''); setModalRechazo({ abierto: true, id }) }
  const cerrarRechazo = () => setModalRechazo({ abierto: false, id: null })

  const confirmarRechazo = () => {
    if (!motivo.trim()) return
    rechazarIncremento(modalRechazo.id, motivo)
    cerrarRechazo()
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6">

      {/* Encabezado */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Solicitudes de incremento de tiempo</h1>
        <p className="text-slate-500 text-sm mt-0.5">Revisá y gestioná las solicitudes de horas adicionales por subtarea</p>
      </div>

      {/* Tarjetas resumen */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Pendientes', count: conteos.pendiente, cls: 'bg-amber-50 border-amber-200 text-amber-700' },
          { label: 'Aprobadas',  count: conteos.aprobada,  cls: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
          { label: 'Rechazadas', count: conteos.rechazada, cls: 'bg-red-50 border-red-200 text-red-600' },
        ].map(s => (
          <div key={s.label} className={`rounded-xl border px-4 py-3 ${s.cls}`}>
            <p className="text-xs font-medium opacity-70">{s.label}</p>
            <p className="text-2xl font-bold">{s.count}</p>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {FILTROS.map(f => (
          <button key={f.id} onClick={() => setFiltro(f.id)}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${filtro === f.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Lista */}
      {filtradas.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <ArrowClockwise size={32} className="text-slate-200 mx-auto mb-3" />
          <p className="text-sm text-slate-400">No hay solicitudes en esta categoría.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtradas.map(sol => (
            <div key={sol.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">

              {/* Fila principal */}
              <div className="flex items-start gap-4 px-5 py-4">
                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-sm font-bold text-slate-500">
                  {sol.recurso?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-sm font-semibold text-slate-900">{sol.recurso}</span>
                    <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-blue-50 text-blue-700">{sol.os}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${ESTADO_CLS[sol.estado]}`}>
                      {ESTADO_LABEL[sol.estado]}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Subtarea: <span className="font-medium text-slate-800">{sol.subtareaNombre}</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">Solicitado el {sol.fecha}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-2xl font-bold text-slate-900">+{sol.horasAdicionales}h</p>
                  <p className="text-xs text-slate-400">adicionales</p>
                </div>
              </div>

              {/* Detalle */}
              <div className="px-5 pb-4 border-t border-slate-100 pt-4 flex flex-col gap-3">

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Causa</p>
                    <p className="text-sm text-slate-700 mt-0.5">{sol.causa}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Justificación</p>
                    <p className="text-sm text-slate-700 mt-0.5">{sol.justificacion || '—'}</p>
                  </div>
                </div>

                {/* Boleta borrador expandible */}
                {sol.boletaData && (
                  <div>
                    <button onClick={() => toggleExpandido(sol.id)}
                      className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-blue-600 transition-colors">
                      <Clock size={12} />
                      {expandidos[sol.id] ? 'Ocultar boleta borrador' : 'Ver boleta borrador asociada'}
                    </button>
                    {expandidos[sol.id] && (
                      <div className="mt-2 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <Warning size={13} className="text-amber-600" />
                          <span className="text-xs font-semibold text-amber-700">
                            Boleta en borrador — se registrará automáticamente al aprobar
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-3 text-xs text-slate-600">
                          <span><span className="font-medium">Fecha:</span> {sol.boletaData.fecha}</span>
                          <span><span className="font-medium">Horario:</span> {sol.boletaData.horaInicio} – {sol.boletaData.horaFin}</span>
                          <span><span className="font-medium">Horas:</span> {sol.boletaData.horas}h</span>
                        </div>
                        {sol.boletaData.categoria && (
                          <p className="text-xs text-slate-600">
                            <span className="font-medium">Clasificación:</span>{' '}
                            {sol.boletaData.categoria}
                            {sol.boletaData.subcategoria ? ` / ${sol.boletaData.subcategoria}` : ''}
                            {sol.boletaData.tipoLabor ? ` · ${sol.boletaData.tipoLabor}` : ''}
                          </p>
                        )}
                        {sol.boletaData.descripcion && (
                          <p className="text-xs text-slate-600">
                            <span className="font-medium">Descripción:</span> {sol.boletaData.descripcion}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Motivo de rechazo */}
                {sol.estado === 'rechazada' && sol.motivoRechazo && (
                  <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                    <p className="text-xs font-semibold text-red-600 mb-0.5">Motivo de rechazo</p>
                    <p className="text-sm text-red-700">{sol.motivoRechazo}</p>
                  </div>
                )}

                {/* Acciones (solo pendiente) */}
                {sol.estado === 'pendiente' && (
                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                    <button onClick={() => abrirRechazo(sol.id)}
                      className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors">
                      <ThumbsDown size={13} /> Rechazar
                    </button>
                    <button onClick={() => aprobarIncremento(sol.id)}
                      className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors">
                      <ThumbsUp size={13} /> Aprobar
                    </button>
                  </div>
                )}

                {/* Indicador de aprobada */}
                {sol.estado === 'aprobada' && (
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <CheckCircle size={14} weight="fill" className="text-emerald-500" />
                    <span className="text-xs text-emerald-700 font-medium">Solicitud aprobada — boleta registrada y tiempo incrementado</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de rechazo */}
      {modalRechazo.abierto && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-900">Rechazar solicitud</h2>
              <button onClick={cerrarRechazo} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="px-6 py-5 flex flex-col gap-3">
              <p className="text-sm text-slate-600">
                Indicá el motivo del rechazo. El recurso podrá ver esta información.
              </p>
              <textarea value={motivo} onChange={e => setMotivo(e.target.value)}
                rows={4} placeholder="Ej: La estimación original es suficiente dado el alcance definido..."
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none" />
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100">
              <button onClick={cerrarRechazo}
                className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                Cancelar
              </button>
              <button onClick={confirmarRechazo} disabled={!motivo.trim()}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-lg transition-colors">
                <XCircle size={14} /> Confirmar rechazo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
