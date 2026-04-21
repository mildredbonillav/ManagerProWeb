import { useState } from 'react'
import {
  CheckSquare, X, PencilSimple, ThumbsUp, ThumbsDown,
  XCircle, CheckCircle, TreeStructure,
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

const JERARQUIA = [
  { key: 'fase',       label: 'Fase' },
  { key: 'entregable', label: 'Entregable' },
  { key: 'paquete',    label: 'Paquete de trabajo' },
  { key: 'actividad',  label: 'Actividad' },
]

const inputCls = 'w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white'

export default function AprobacionSubtareas() {
  const { solicitudesNuevaTarea, subtareas, aprobarNuevaTarea, rechazarNuevaTarea } = useBoletasCtx()
  const [filtro, setFiltro] = useState('todos')
  const [modalAprobacion, setModalAprobacion] = useState({ abierto: false, solicitud: null })
  const [modalRechazo, setModalRechazo] = useState({ abierto: false, id: null })
  const [formEdicion, setFormEdicion] = useState({})
  const [motivo, setMotivo] = useState('')

  const filtradas = solicitudesNuevaTarea.filter(s =>
    filtro === 'todos' ? true : s.estado === filtro
  )

  const conteos = {
    pendiente: solicitudesNuevaTarea.filter(s => s.estado === 'pendiente').length,
    aprobada:  solicitudesNuevaTarea.filter(s => s.estado === 'aprobada').length,
    rechazada: solicitudesNuevaTarea.filter(s => s.estado === 'rechazada').length,
  }

  // OS disponibles tomadas de las subtareas existentes
  const osOpciones = [...new Map(subtareas.map(s => [s.os, { os: s.os, nombre: s.osNombre }])).values()]

  const abrirAprobacion = (sol) => {
    setFormEdicion({
      os: sol.os, osNombre: sol.osNombre || '',
      nombre: sol.nombre,
      descripcion: sol.descripcion || '',
      estimacion: sol.estimacion,
      fase: '', entregable: '', paquete: '', actividad: '',
    })
    setModalAprobacion({ abierto: true, solicitud: sol })
  }

  const cerrarAprobacion = () => setModalAprobacion({ abierto: false, solicitud: null })

  const confirmarAprobacion = () => {
    aprobarNuevaTarea(modalAprobacion.solicitud.id, {
      ...modalAprobacion.solicitud,
      ...formEdicion,
    })
    cerrarAprobacion()
  }

  const abrirRechazo = (id) => { setMotivo(''); setModalRechazo({ abierto: true, id }) }
  const cerrarRechazo = () => setModalRechazo({ abierto: false, id: null })

  const confirmarRechazo = () => {
    if (!motivo.trim()) return
    rechazarNuevaTarea(modalRechazo.id, motivo)
    cerrarRechazo()
  }

  const fe = (campo, val) => setFormEdicion(prev => ({ ...prev, [campo]: val }))

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6">

      {/* Encabezado */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Aprobación de subtareas</h1>
        <p className="text-slate-500 text-sm mt-0.5">Revisá, editá y aprobá las solicitudes de nuevas subtareas</p>
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
          <CheckSquare size={32} className="text-slate-200 mx-auto mb-3" />
          <p className="text-sm text-slate-400">No hay solicitudes en esta categoría.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtradas.map(sol => (
            <div key={sol.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">

              {/* Encabezado de la card */}
              <div className="flex items-start gap-4 px-5 py-4">
                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-sm font-bold text-slate-500">
                  {sol.recurso?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-sm font-semibold text-slate-900">{sol.recurso}</span>
                    <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-blue-50 text-blue-700">{sol.os}</span>
                    <span className="text-xs text-slate-400">{sol.osNombre}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${ESTADO_CLS[sol.estado]}`}>
                      {ESTADO_LABEL[sol.estado]}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">Solicitado el {sol.fecha}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-2xl font-bold text-slate-900">{sol.estimacion}h</p>
                  <p className="text-xs text-slate-400">estimadas</p>
                </div>
              </div>

              {/* Cuerpo */}
              <div className="px-5 pb-4 border-t border-slate-100 pt-4 flex flex-col gap-3">
                <div>
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Nombre de la subtarea</p>
                  <p className="text-sm font-semibold text-slate-900 mt-0.5">{sol.nombre}</p>
                </div>

                {sol.descripcion && (
                  <div>
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Descripción</p>
                    <p className="text-sm text-slate-700 mt-0.5">{sol.descripcion}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Causa</p>
                    <p className="text-sm text-slate-700 mt-0.5">{sol.causa}</p>
                  </div>
                  {sol.justificacion && (
                    <div>
                      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Justificación</p>
                      <p className="text-sm text-slate-700 mt-0.5">{sol.justificacion}</p>
                    </div>
                  )}
                </div>

                {/* Jerarquía asignada (si fue aprobada) */}
                {sol.estado === 'aprobada' && (sol.fase || sol.entregable || sol.paquete || sol.actividad) && (
                  <div className="bg-slate-50 rounded-lg px-4 py-3">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                      <TreeStructure size={12} /> Jerarquía asignada
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {JERARQUIA.map(({ key, label }) =>
                        sol[key] ? (
                          <div key={key}>
                            <span className="text-xs text-slate-400">{label}: </span>
                            <span className="text-xs font-medium text-slate-700">{sol[key]}</span>
                          </div>
                        ) : null
                      )}
                    </div>
                  </div>
                )}

                {/* Motivo de rechazo */}
                {sol.estado === 'rechazada' && sol.motivoRechazo && (
                  <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                    <p className="text-xs font-semibold text-red-600 mb-0.5">Motivo de rechazo</p>
                    <p className="text-sm text-red-700">{sol.motivoRechazo}</p>
                  </div>
                )}

                {/* Indicador aprobada */}
                {sol.estado === 'aprobada' && (
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <CheckCircle size={14} weight="fill" className="text-emerald-500" />
                    <span className="text-xs text-emerald-700 font-medium">Subtarea creada y asignada al equipo</span>
                  </div>
                )}

                {/* Acciones */}
                {sol.estado === 'pendiente' && (
                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                    <button onClick={() => abrirRechazo(sol.id)}
                      className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg transition-colors">
                      <ThumbsDown size={13} /> Rechazar
                    </button>
                    <button onClick={() => abrirAprobacion(sol)}
                      className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors">
                      <PencilSimple size={13} /> Revisar y aprobar
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: revisar y aprobar */}
      {modalAprobacion.abierto && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">

            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
              <div>
                <h2 className="text-base font-semibold text-slate-900">Revisar y aprobar subtarea</h2>
                <p className="text-xs text-slate-500 mt-0.5">Podés editar los datos antes de aprobar</p>
              </div>
              <button onClick={cerrarAprobacion} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="overflow-y-auto px-6 py-5 flex flex-col gap-4 flex-1">

              {/* OS */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-700">Orden de servicio</label>
                <select value={formEdicion.os}
                  onChange={e => {
                    const op = osOpciones.find(o => o.os === e.target.value)
                    fe('os', e.target.value)
                    fe('osNombre', op?.nombre || '')
                  }}
                  className={inputCls}>
                  <option value="">Seleccionar OS...</option>
                  {osOpciones.map(o => (
                    <option key={o.os} value={o.os}>{o.os} — {o.nombre}</option>
                  ))}
                </select>
              </div>

              {/* Nombre */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-700">Nombre de la subtarea</label>
                <input type="text" value={formEdicion.nombre || ''} onChange={e => fe('nombre', e.target.value)} className={inputCls} />
              </div>

              {/* Descripción */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-700">Descripción</label>
                <textarea value={formEdicion.descripcion || ''} onChange={e => fe('descripcion', e.target.value)}
                  rows={2} className={`${inputCls} resize-none`} />
              </div>

              {/* Estimación */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-700">Estimación (horas)</label>
                <input type="number" min="1" value={formEdicion.estimacion || ''} onChange={e => fe('estimacion', e.target.value)} className={inputCls} />
              </div>

              {/* Jerarquía */}
              <div className="bg-slate-50 rounded-xl p-4 flex flex-col gap-3">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-2">
                  <TreeStructure size={14} className="text-slate-400" />
                  Jerarquía en la OS
                </p>
                {JERARQUIA.map(({ key, label }) => (
                  <div key={key} className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-slate-600">{label}</label>
                    <input type="text" value={formEdicion[key] || ''} onChange={e => fe(key, e.target.value)}
                      placeholder={`Asignar ${label.toLowerCase()}...`}
                      className={inputCls} />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100 shrink-0">
              <button onClick={cerrarAprobacion}
                className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                Cancelar
              </button>
              <button onClick={confirmarAprobacion}
                className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors">
                <ThumbsUp size={14} /> Aprobar subtarea
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: rechazar */}
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
              <p className="text-sm text-slate-600">Indicá el motivo del rechazo. El recurso podrá ver esta información.</p>
              <textarea value={motivo} onChange={e => setMotivo(e.target.value)}
                rows={4} placeholder="Ej: No está dentro del alcance acordado para esta fase..."
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
