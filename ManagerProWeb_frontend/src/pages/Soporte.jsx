import { useState } from 'react'
import { useSoporte } from '../context/SoporteContext'
import {
  Headset,
  MagnifyingGlass,
  Eye,
  ArrowRight,
  X,
  UserCircle,
  Paperclip,
  CheckCircle,
  FunnelSimple,
  Warning,
  GitBranch,
} from '@phosphor-icons/react'

// ── Datos auxiliares ─────────────────────────────────────────────────────────

const responsablesData = [
  'Sofía Barboza',
  'Armando Núñez',
  'Mildred Bonilla',
  'Matías Vargas',
  'Laura Campos',
]

const subtiposOS = [
  {
    valor: 'Mantenimiento',
    descripcion: 'Corrección o ajuste en funcionalidades existentes',
    color: 'border-blue-300 bg-blue-50 text-blue-700',
    colorActivo: 'border-blue-600 bg-blue-100 text-blue-900 ring-2 ring-blue-300',
  },
  {
    valor: 'Capa 8',
    descripcion: 'Problema atribuible al uso incorrecto del sistema',
    color: 'border-amber-300 bg-amber-50 text-amber-700',
    colorActivo: 'border-amber-600 bg-amber-100 text-amber-900 ring-2 ring-amber-300',
  },
  {
    valor: 'Incidencia de sistema',
    descripcion: 'Falla técnica o de infraestructura que afecta la operación',
    color: 'border-red-300 bg-red-50 text-red-700',
    colorActivo: 'border-red-600 bg-red-100 text-red-900 ring-2 ring-red-300',
  },
]

const estadosDisponibles = ['Pendiente', 'En revisión', 'Resuelta', 'Rechazada']

// ── Clases de estado y motivo ────────────────────────────────────────────────

const estadoClase = {
  Pendiente:    'bg-amber-100 text-amber-700',
  'En revisión': 'bg-blue-100 text-blue-700',
  Convertida:   'bg-violet-100 text-violet-700',
  Resuelta:     'bg-green-100 text-green-700',
  Rechazada:    'bg-red-100 text-red-700',
}

const motivoClase = {
  Incidencia:    'bg-red-100 text-red-700',
  Requerimiento: 'bg-teal-100 text-teal-700',
  Consulta:      'bg-slate-100 text-slate-600',
}

const inputCls = 'px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full'
const selectCls = 'px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full bg-white'

// ── Componente principal ─────────────────────────────────────────────────────

export default function Soporte() {
  const { solicitudes, actualizarSolicitud } = useSoporte()

  // Filtros
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('Todos')
  const [filtroMotivo, setFiltroMotivo] = useState('Todos')
  const [filtroCliente, setFiltroCliente] = useState('Todos')

  // Modales
  const [modalDetalle, setModalDetalle] = useState(null)
  const [modalConvertir, setModalConvertir] = useState(null)
  const [modalActualizar, setModalActualizar] = useState(null)

  // Forms modales
  const [formConvertir, setFormConvertir] = useState({ subtipo: '', responsable: '', observaciones: '' })
  const [formActualizar, setFormActualizar] = useState({ estado: '', responsable: '', comentario: '' })

  // ── Métricas ──────────────────────────────────────────────
  const total      = solicitudes.length
  const pendientes = solicitudes.filter((s) => s.estado === 'Pendiente').length
  const enRevision = solicitudes.filter((s) => s.estado === 'En revisión').length
  const convertidas = solicitudes.filter((s) => s.estado === 'Convertida').length

  // ── Filtrado ──────────────────────────────────────────────
  const clientesUnicos = [...new Set(solicitudes.map((s) => s.clienteNombre))]

  const solicitudesFiltradas = solicitudes.filter((s) => {
    const txt = busqueda.toLowerCase()
    const matchBusqueda =
      !busqueda ||
      s.codigo.toLowerCase().includes(txt) ||
      s.clienteNombre.toLowerCase().includes(txt) ||
      s.descripcion.toLowerCase().includes(txt) ||
      s.productoNombre.toLowerCase().includes(txt)
    const matchEstado  = filtroEstado === 'Todos' || s.estado === filtroEstado
    const matchMotivo  = filtroMotivo === 'Todos' || s.motivo === filtroMotivo
    const matchCliente = filtroCliente === 'Todos' || s.clienteNombre === filtroCliente
    return matchBusqueda && matchEstado && matchMotivo && matchCliente
  })

  // ── Acciones ──────────────────────────────────────────────
  const abrirConvertir = (s) => {
    setModalConvertir(s)
    setFormConvertir({ subtipo: '', responsable: '', observaciones: '' })
  }

  const abrirActualizar = (s) => {
    setModalActualizar(s)
    setFormActualizar({ estado: s.estado, responsable: s.responsable || '', comentario: s.comentarioAdmin || '' })
  }

  const confirmarConvertir = () => {
    if (!formConvertir.subtipo || !formConvertir.responsable) return
    const osCode = `OS-${String(Math.floor(Math.random() * 900) + 100)}`
    actualizarSolicitud(modalConvertir.id, {
      estado: 'Convertida',
      responsable: formConvertir.responsable,
      ordenServicioCodigo: osCode,
      comentarioAdmin: `Se generó ${osCode} (${formConvertir.subtipo}). ${formConvertir.observaciones}`.trim(),
    })
    setModalConvertir(null)
  }

  const confirmarActualizar = () => {
    actualizarSolicitud(modalActualizar.id, {
      estado: formActualizar.estado,
      responsable: formActualizar.responsable || null,
      comentarioAdmin: formActualizar.comentario,
    })
    setModalActualizar(null)
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Encabezado */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Solicitudes de Soporte</h1>
          <p className="text-sm text-slate-500 mt-1">
            Gestione, atienda y convierta solicitudes en órdenes de servicio
          </p>
        </div>
      </div>

      {/* Tarjetas métricas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total recibidas', valor: total, color: 'text-slate-900', bg: 'bg-slate-50' },
          { label: 'Pendientes', valor: pendientes, color: 'text-amber-700', bg: 'bg-amber-50' },
          { label: 'En revisión', valor: enRevision, color: 'text-blue-700', bg: 'bg-blue-50' },
          { label: 'Convertidas a OS', valor: convertidas, color: 'text-violet-700', bg: 'bg-violet-50' },
        ].map((m) => (
          <div key={m.label} className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-xs text-slate-500 font-medium">{m.label}</p>
            <p className={`text-3xl font-bold mt-1 ${m.color}`}>{m.valor}</p>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <MagnifyingGlass size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por código, cliente, descripción..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="pl-8 pr-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          />
        </div>
        <FunnelSimple size={16} className="text-slate-400 shrink-0" />
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          className={`${selectCls} w-36`}
        >
          <option value="Todos">Todos los estados</option>
          {['Pendiente', 'En revisión', 'Convertida', 'Resuelta', 'Rechazada'].map((e) => (
            <option key={e}>{e}</option>
          ))}
        </select>
        <select
          value={filtroMotivo}
          onChange={(e) => setFiltroMotivo(e.target.value)}
          className={`${selectCls} w-40`}
        >
          <option value="Todos">Todos los motivos</option>
          {['Incidencia', 'Requerimiento', 'Consulta'].map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
        <select
          value={filtroCliente}
          onChange={(e) => setFiltroCliente(e.target.value)}
          className={`${selectCls} w-48`}
        >
          <option value="Todos">Todos los clientes</option>
          {clientesUnicos.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Lista de solicitudes */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
          <p className="text-sm font-medium text-slate-600">
            {solicitudesFiltradas.length} solicitud{solicitudesFiltradas.length !== 1 ? 'es' : ''}
          </p>
        </div>

        {solicitudesFiltradas.length === 0 ? (
          <div className="py-16 text-center">
            <Headset size={36} className="text-slate-200 mx-auto mb-3" />
            <p className="text-sm text-slate-400">No hay solicitudes que coincidan con los filtros.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {solicitudesFiltradas.map((s) => (
              <div key={s.id} className="px-5 py-5">
                <div className="flex items-start justify-between gap-4">
                  {/* Info principal */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {s.codigo}
                      </span>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${estadoClase[s.estado]}`}>
                        {s.estado}
                      </span>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${motivoClase[s.motivo]}`}>
                        {s.motivo}
                      </span>
                      {s.ordenServicioCodigo && (
                        <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded font-medium">
                          → {s.ordenServicioCodigo}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-slate-800 mt-2 line-clamp-2">{s.descripcion}</p>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2.5">
                      <div className="flex items-center gap-1.5">
                        <UserCircle size={13} className="text-slate-400" />
                        <span className="text-xs text-slate-600">
                          <span className="font-medium">{s.clienteNombre}</span>
                          {s.contactoNombre && ` · ${s.contactoNombre}`}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500">
                        📦 {s.productoNombre}
                      </span>
                      <span className="text-xs text-slate-500">
                        🗂 {s.modulo}/{s.submodulo}/{s.accion}
                      </span>
                      <span className="text-xs text-slate-400">{s.fechaRegistro}</span>
                      {s.responsable && (
                        <span className="text-xs text-slate-500">
                          👤 {s.responsable}
                        </span>
                      )}
                      {s.evidencias.length > 0 && (
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Paperclip size={12} /> {s.evidencias.length} archivo{s.evidencias.length > 1 ? 's' : ''}
                        </span>
                      )}
                    </div>

                    {s.comentarioAdmin && (
                      <div className="mt-2.5 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
                        <p className="text-xs text-blue-700">{s.comentarioAdmin}</p>
                      </div>
                    )}
                  </div>

                  {/* Acciones */}
                  <div className="flex flex-col gap-2 shrink-0">
                    <button
                      onClick={() => setModalDetalle(s)}
                      className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-blue-600 border border-slate-200 hover:border-blue-300 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <Eye size={13} /> Ver detalle
                    </button>
                    {s.estado !== 'Convertida' && s.estado !== 'Resuelta' && s.estado !== 'Rechazada' && (
                      <button
                        onClick={() => abrirConvertir(s)}
                        className="flex items-center gap-1.5 text-xs text-violet-700 hover:text-violet-900 border border-violet-200 hover:border-violet-400 bg-violet-50 hover:bg-violet-100 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <GitBranch size={13} /> Convertir a OS
                      </button>
                    )}
                    {s.estado !== 'Convertida' && (
                      <button
                        onClick={() => abrirActualizar(s)}
                        className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-400 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <ArrowRight size={13} /> Actualizar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Modal: Detalle ────────────────────────────────────── */}
      {modalDetalle && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-900">{modalDetalle.codigo}</h2>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${estadoClase[modalDetalle.estado]}`}>
                    {modalDetalle.estado}
                  </span>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${motivoClase[modalDetalle.motivo]}`}>
                    {modalDetalle.motivo}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{modalDetalle.fechaRegistro}</p>
              </div>
              <button onClick={() => setModalDetalle(null)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="px-6 py-5 flex flex-col gap-4 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-slate-500">Cliente</p>
                  <p className="text-sm text-slate-900 mt-0.5">{modalDetalle.clienteNombre}</p>
                  <p className="text-xs text-slate-500">{modalDetalle.contactoNombre}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">Producto</p>
                  <p className="text-sm text-slate-900 mt-0.5">{modalDetalle.productoNombre}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs font-medium text-slate-500">Ruta de menú</p>
                  <p className="text-sm text-slate-900 mt-0.5">
                    {modalDetalle.modulo} / {modalDetalle.submodulo} / {modalDetalle.accion}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Descripción</p>
                <p className="text-sm text-slate-700 mt-1 leading-relaxed">{modalDetalle.descripcion}</p>
              </div>
              {modalDetalle.evidencias.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-1.5">Evidencias adjuntas</p>
                  <div className="flex flex-col gap-1.5">
                    {modalDetalle.evidencias.map((ev) => (
                      <div key={ev} className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2">
                        <Paperclip size={13} className="text-slate-400" />
                        <span className="text-xs font-mono text-slate-700">{ev}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {modalDetalle.responsable && (
                <div>
                  <p className="text-xs font-medium text-slate-500">Responsable asignado</p>
                  <p className="text-sm text-slate-900 mt-0.5">{modalDetalle.responsable}</p>
                </div>
              )}
              {modalDetalle.ordenServicioCodigo && (
                <div className="bg-violet-50 border border-violet-200 rounded-lg px-4 py-3">
                  <p className="text-xs font-medium text-violet-700">Orden de servicio generada</p>
                  <p className="text-sm font-bold text-violet-900 mt-0.5">{modalDetalle.ordenServicioCodigo}</p>
                </div>
              )}
              {modalDetalle.comentarioAdmin && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
                  <p className="text-xs font-medium text-blue-700">Comentario interno</p>
                  <p className="text-sm text-blue-900 mt-0.5">{modalDetalle.comentarioAdmin}</p>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-2 shrink-0">
              {modalDetalle.estado !== 'Convertida' && modalDetalle.estado !== 'Resuelta' && modalDetalle.estado !== 'Rechazada' && (
                <button
                  onClick={() => { setModalDetalle(null); abrirConvertir(modalDetalle) }}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm bg-violet-50 hover:bg-violet-100 text-violet-700 border border-violet-200 rounded-lg font-medium transition-colors"
                >
                  <GitBranch size={14} /> Convertir a OS
                </button>
              )}
              <button onClick={() => setModalDetalle(null)} className="px-4 py-2 rounded-lg text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Convertir a Orden de Servicio ──────────────── */}
      {modalConvertir && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-base font-semibold text-slate-900">Convertir a Orden de Servicio</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {modalConvertir.codigo} · {modalConvertir.clienteNombre}
                </p>
              </div>
              <button onClick={() => setModalConvertir(null)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="px-6 py-5 flex flex-col gap-5 overflow-y-auto">
              {/* Subtipo */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-slate-700">
                  Subtipo de orden <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-col gap-2">
                  {subtiposOS.map((sub) => (
                    <button
                      key={sub.valor}
                      type="button"
                      onClick={() => setFormConvertir({ ...formConvertir, subtipo: sub.valor })}
                      className={`flex flex-col gap-0.5 px-4 py-3 rounded-xl border-2 text-left transition-all ${
                        formConvertir.subtipo === sub.valor ? sub.colorActivo : sub.color
                      }`}
                    >
                      <span className="text-sm font-semibold">{sub.valor}</span>
                      <span className="text-xs opacity-80">{sub.descripcion}</span>
                    </button>
                  ))}
                </div>
                {!formConvertir.subtipo && (
                  <p className="text-xs text-slate-400">Seleccione el subtipo para continuar</p>
                )}
              </div>

              {/* Responsable */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Responsable asignado <span className="text-red-500">*</span>
                </label>
                <select
                  value={formConvertir.responsable}
                  onChange={(e) => setFormConvertir({ ...formConvertir, responsable: e.target.value })}
                  className={selectCls}
                >
                  <option value="">Seleccionar responsable...</option>
                  {responsablesData.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </div>

              {/* Observaciones */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">Observaciones</label>
                <textarea
                  value={formConvertir.observaciones}
                  onChange={(e) => setFormConvertir({ ...formConvertir, observaciones: e.target.value })}
                  rows={3}
                  placeholder="Notas internas sobre la conversión a OS..."
                  className={`${inputCls} resize-none`}
                />
              </div>

              {/* Aviso */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 flex gap-2">
                <Warning size={16} className="text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800">
                  Al convertir, el estado de la solicitud cambiará a <strong>Convertida</strong> y se generará un código de orden de servicio automáticamente.
                </p>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 shrink-0">
              <button onClick={() => setModalConvertir(null)} className="px-4 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-100 transition-colors">
                Cancelar
              </button>
              <button
                onClick={confirmarConvertir}
                disabled={!formConvertir.subtipo || !formConvertir.responsable}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-violet-600 hover:bg-violet-700 disabled:bg-violet-300 text-white font-medium transition-colors"
              >
                <CheckCircle size={15} /> Crear orden de servicio
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Modal: Actualizar Estado / Responsable ─────────────── */}
      {modalActualizar && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md flex flex-col">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-base font-semibold text-slate-900">Actualizar solicitud</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {modalActualizar.codigo} · {modalActualizar.clienteNombre}
                </p>
              </div>
              <button onClick={() => setModalActualizar(null)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="px-6 py-5 flex flex-col gap-4">
              {/* Estado */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">Estado</label>
                <div className="flex flex-wrap gap-2">
                  {estadosDisponibles.map((est) => (
                    <button
                      key={est}
                      type="button"
                      onClick={() => setFormActualizar({ ...formActualizar, estado: est })}
                      className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${
                        formActualizar.estado === est
                          ? `${estadoClase[est]} border-current`
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {est}
                    </button>
                  ))}
                </div>
              </div>

              {/* Responsable */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">Responsable</label>
                <select
                  value={formActualizar.responsable}
                  onChange={(e) => setFormActualizar({ ...formActualizar, responsable: e.target.value })}
                  className={selectCls}
                >
                  <option value="">Sin asignar</option>
                  {responsablesData.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </div>

              {/* Comentario */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">Comentario al cliente</label>
                <textarea
                  value={formActualizar.comentario}
                  onChange={(e) => setFormActualizar({ ...formActualizar, comentario: e.target.value })}
                  rows={3}
                  placeholder="Respuesta o nota visible para el cliente..."
                  className={`${inputCls} resize-none`}
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 shrink-0">
              <button onClick={() => setModalActualizar(null)} className="px-4 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-100 transition-colors">
                Cancelar
              </button>
              <button
                onClick={confirmarActualizar}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
              >
                <CheckCircle size={15} /> Guardar cambios
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
