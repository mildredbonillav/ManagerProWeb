import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useSoporte } from '../../context/SoporteContext'
import {
  Plus,
  Paperclip,
  X,
  CheckCircle,
  Clock,
  MagnifyingGlass,
  Headset,
  Warning,
  Eye,
} from '@phosphor-icons/react'

// ── Catálogo de productos y rutas (simulado) ─────────────────────────────────

const productosForm = [
  { id: 1, nombre: 'ManagerPro' },
  { id: 2, nombre: 'BillingApp' },
]

const rutasForm = [
  { id: 1, productoId: 1, modulo: 'Dashboard', submodulo: 'Principal', accion: 'Ver resumen' },
  { id: 2, productoId: 1, modulo: 'Administración', submodulo: 'Usuarios', accion: 'Ver listado' },
  { id: 3, productoId: 1, modulo: 'Administración', submodulo: 'Usuarios', accion: 'Crear usuario' },
  { id: 4, productoId: 1, modulo: 'Administración', submodulo: 'Roles', accion: 'Asignar permisos' },
  { id: 5, productoId: 1, modulo: 'Operaciones', submodulo: 'Órdenes', accion: 'Ver órdenes' },
  { id: 6, productoId: 1, modulo: 'Operaciones', submodulo: 'Órdenes', accion: 'Crear orden' },
  { id: 7, productoId: 1, modulo: 'Operaciones', submodulo: 'Boletas', accion: 'Registrar boleta' },
  { id: 8, productoId: 2, modulo: 'Facturación', submodulo: 'Facturas', accion: 'Emitir factura' },
  { id: 9, productoId: 2, modulo: 'Facturación', submodulo: 'Facturas', accion: 'Anular factura' },
  { id: 10, productoId: 2, modulo: 'Reportes', submodulo: 'Ventas', accion: 'Ver reporte mensual' },
]

const evidenciasSimuladas = [
  'captura_pantalla.png',
  'log_error.txt',
  'grabacion_pantalla.mp4',
  'reporte_falla.pdf',
  'screenshot_2026.jpg',
]

const motivosConfig = [
  {
    valor: 'Incidencia',
    descripcion: 'Algo no funciona correctamente',
    color: 'border-red-300 bg-red-50 text-red-700',
    colorActivo: 'border-red-500 bg-red-100 text-red-800 ring-2 ring-red-300',
  },
  {
    valor: 'Requerimiento',
    descripcion: 'Solicitud de nueva funcionalidad',
    color: 'border-teal-300 bg-teal-50 text-teal-700',
    colorActivo: 'border-teal-500 bg-teal-100 text-teal-800 ring-2 ring-teal-300',
  },
  {
    valor: 'Consulta',
    descripcion: 'Duda o pregunta sobre el sistema',
    color: 'border-slate-300 bg-slate-50 text-slate-600',
    colorActivo: 'border-slate-500 bg-slate-100 text-slate-800 ring-2 ring-slate-300',
  },
]

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

const inputCls = 'px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full'
const selectCls = 'px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full bg-white'

// ── Componente ───────────────────────────────────────────────────────────────

export default function ClienteSoporte() {
  const { usuario } = useAuth()
  const { solicitudes, agregarSolicitud } = useSoporte()
  const [searchParams] = useSearchParams()

  const tabInicial = searchParams.get('tab') === 'nueva' ? 'nueva' : 'mis'
  const [tabActiva, setTabActiva] = useState(tabInicial)
  const [enviada, setEnviada] = useState(false)

  // Filtros
  const [filtroEstado, setFiltroEstado] = useState('Todos')
  const [busqueda, setBusqueda] = useState('')

  // Modal detalle
  const [solicitudDetalle, setSolicitudDetalle] = useState(null)

  // Form
  const [form, setForm] = useState({
    productoId: '',
    rutaId: '',
    motivo: '',
    descripcion: '',
    evidencias: [],
  })
  const [errores, setErrores] = useState({})

  // Sync tab from URL params on mount
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab === 'nueva') setTabActiva('nueva')
  }, [searchParams])

  const misSolicitudes = solicitudes.filter(
    (s) => s.clienteId === usuario?.clienteId
  )

  const solicitudesFiltradas = misSolicitudes.filter((s) => {
    const matchEstado = filtroEstado === 'Todos' || s.estado === filtroEstado
    const matchBusqueda =
      s.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
      s.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
      s.productoNombre.toLowerCase().includes(busqueda.toLowerCase())
    return matchEstado && matchBusqueda
  })

  const rutasFiltradas = form.productoId
    ? rutasForm.filter((r) => r.productoId === +form.productoId)
    : []

  const rutaSeleccionada = rutasForm.find((r) => r.id === +form.rutaId)
  const productoSeleccionado = productosForm.find((p) => p.id === +form.productoId)

  const agregarEvidencia = () => {
    const idx = Math.floor(Math.random() * evidenciasSimuladas.length)
    const nombre = evidenciasSimuladas[idx]
    if (!form.evidencias.includes(nombre)) {
      setForm({ ...form, evidencias: [...form.evidencias, nombre] })
    }
  }

  const quitarEvidencia = (nombre) => {
    setForm({ ...form, evidencias: form.evidencias.filter((e) => e !== nombre) })
  }

  const validar = () => {
    const e = {}
    if (!form.productoId) e.productoId = 'Seleccione un producto'
    if (!form.rutaId) e.rutaId = 'Seleccione la ruta de menú'
    if (!form.motivo) e.motivo = 'Seleccione el motivo'
    if (!form.descripcion.trim()) e.descripcion = 'Ingrese una descripción'
    else if (form.descripcion.trim().length < 20)
      e.descripcion = 'La descripción debe tener al menos 20 caracteres'
    return e
  }

  const handleEnviar = (e) => {
    e.preventDefault()
    const e2 = validar()
    if (Object.keys(e2).length > 0) { setErrores(e2); return }

    agregarSolicitud({
      clienteId: usuario.clienteId,
      clienteNombre: usuario.empresa,
      contactoNombre: usuario.nombre,
      productoId: +form.productoId,
      productoNombre: productoSeleccionado?.nombre || '',
      modulo: rutaSeleccionada?.modulo || '',
      submodulo: rutaSeleccionada?.submodulo || '',
      accion: rutaSeleccionada?.accion || '',
      descripcion: form.descripcion,
      motivo: form.motivo,
      evidencias: form.evidencias,
    })

    setForm({ productoId: '', rutaId: '', motivo: '', descripcion: '', evidencias: [] })
    setErrores({})
    setEnviada(true)
  }

  const handleNueva = () => {
    setEnviada(false)
    setTabActiva('nueva')
  }

  const estadosOpciones = ['Todos', 'Pendiente', 'En revisión', 'Convertida', 'Resuelta', 'Rechazada']

  return (
    <div className="flex flex-col gap-6">

      {/* Encabezado */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Solicitudes de Soporte</h1>
        <p className="text-sm text-slate-500 mt-1">
          Registre y consulte el estado de sus solicitudes
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1 w-fit">
        {[
          { id: 'mis', label: 'Mis solicitudes' },
          { id: 'nueva', label: 'Nueva solicitud' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setTabActiva(tab.id); setEnviada(false) }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tabActiva === tab.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab: Mis Solicitudes ──────────────────────────────── */}
      {tabActiva === 'mis' && (
        <div className="flex flex-col gap-4">
          {/* Filtros */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-48">
              <MagnifyingGlass size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por descripción, código..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="pl-8 pr-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              />
            </div>
            <div className="flex gap-1 flex-wrap">
              {estadosOpciones.map((est) => (
                <button
                  key={est}
                  onClick={() => setFiltroEstado(est)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                    filtroEstado === est
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {est}
                </button>
              ))}
            </div>
          </div>

          {/* Lista */}
          {solicitudesFiltradas.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 py-16 text-center">
              <Headset size={36} className="text-slate-200 mx-auto mb-3" />
              <p className="text-sm text-slate-400 font-medium">Sin solicitudes</p>
              <p className="text-xs text-slate-400 mt-1">
                {filtroEstado === 'Todos'
                  ? 'Aún no ha registrado solicitudes.'
                  : `No hay solicitudes con estado "${filtroEstado}".`}
              </p>
              {filtroEstado === 'Todos' && (
                <button
                  onClick={() => setTabActiva('nueva')}
                  className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  Registrar primera solicitud
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {solicitudesFiltradas.map((s) => (
                <div
                  key={s.id}
                  className="bg-white rounded-xl border border-slate-200 p-5"
                >
                  {/* Header fila */}
                  <div className="flex items-start justify-between gap-3">
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
                    </div>
                    <button
                      onClick={() => setSolicitudDetalle(s)}
                      className="shrink-0 flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 border border-slate-200 hover:border-blue-300 px-2.5 py-1.5 rounded-lg transition-colors"
                    >
                      <Eye size={13} /> Ver detalle
                    </button>
                  </div>

                  {/* Info */}
                  <p className="text-sm text-slate-700 mt-2.5 line-clamp-2">{s.descripcion}</p>

                  <div className="flex flex-wrap gap-4 mt-3">
                    <div>
                      <p className="text-xs font-medium text-slate-500">Producto</p>
                      <p className="text-xs text-slate-700 mt-0.5">{s.productoNombre}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500">Ruta de menú</p>
                      <p className="text-xs text-slate-700 mt-0.5">
                        {s.modulo} / {s.submodulo} / {s.accion}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-slate-500">Fecha de registro</p>
                      <p className="text-xs text-slate-700 mt-0.5">{s.fechaRegistro}</p>
                    </div>
                    {s.ordenServicioCodigo && (
                      <div>
                        <p className="text-xs font-medium text-slate-500">Orden de servicio</p>
                        <p className="text-xs text-violet-700 font-semibold mt-0.5">{s.ordenServicioCodigo}</p>
                      </div>
                    )}
                  </div>

                  {/* Comentario admin */}
                  {s.comentarioAdmin && (
                    <div className="mt-3 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2.5">
                      <p className="text-xs font-medium text-blue-700">Respuesta del equipo</p>
                      <p className="text-xs text-blue-800 mt-0.5">{s.comentarioAdmin}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Tab: Nueva Solicitud ──────────────────────────────── */}
      {tabActiva === 'nueva' && (
        <div>
          {enviada ? (
            /* Confirmación */
            <div className="bg-white rounded-xl border border-slate-200 p-10 flex flex-col items-center text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle size={32} className="text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">¡Solicitud enviada!</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Su solicitud ha sido registrada correctamente. Nuestro equipo la revisará a la brevedad.
                </p>
              </div>
              <div className="flex gap-3 mt-2">
                <button
                  onClick={() => { setTabActiva('mis'); setEnviada(false) }}
                  className="px-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Ver mis solicitudes
                </button>
                <button
                  onClick={handleNueva}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
                >
                  <Plus size={15} /> Nueva solicitud
                </button>
              </div>
            </div>
          ) : (
            /* Formulario */
            <form onSubmit={handleEnviar} noValidate>
              <div className="bg-white rounded-xl border border-slate-200">
                <div className="px-6 py-5 border-b border-slate-100">
                  <h2 className="text-base font-semibold text-slate-900">Registro de solicitud de soporte</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Complete todos los campos para que el equipo pueda atender su solicitud.
                  </p>
                </div>

                <div className="px-6 py-6 flex flex-col gap-6">

                  {/* Producto */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-700">
                        Producto afectado <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={form.productoId}
                        onChange={(e) => setForm({ ...form, productoId: e.target.value, rutaId: '' })}
                        className={`${selectCls} ${errores.productoId ? 'border-red-400 ring-1 ring-red-300' : ''}`}
                      >
                        <option value="">Seleccionar producto...</option>
                        {productosForm.map((p) => (
                          <option key={p.id} value={p.id}>{p.nombre}</option>
                        ))}
                      </select>
                      {errores.productoId && (
                        <p className="text-xs text-red-500">{errores.productoId}</p>
                      )}
                    </div>

                    {/* Ruta de menú */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-slate-700">
                        Ruta de menú afectada <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={form.rutaId}
                        onChange={(e) => setForm({ ...form, rutaId: e.target.value })}
                        disabled={!form.productoId}
                        className={`${selectCls} ${!form.productoId ? 'opacity-50 cursor-not-allowed' : ''} ${errores.rutaId ? 'border-red-400 ring-1 ring-red-300' : ''}`}
                      >
                        <option value="">
                          {form.productoId ? 'Seleccionar ruta...' : 'Primero seleccione un producto'}
                        </option>
                        {rutasFiltradas.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.modulo} / {r.submodulo} / {r.accion}
                          </option>
                        ))}
                      </select>
                      {errores.rutaId && (
                        <p className="text-xs text-red-500">{errores.rutaId}</p>
                      )}
                    </div>
                  </div>

                  {/* Motivo */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-slate-700">
                      Motivo de la solicitud <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {motivosConfig.map((m) => (
                        <button
                          key={m.valor}
                          type="button"
                          onClick={() => setForm({ ...form, motivo: m.valor })}
                          className={`flex flex-col gap-1 px-4 py-3.5 rounded-xl border-2 text-left transition-all ${
                            form.motivo === m.valor ? m.colorActivo : `${m.color} hover:opacity-90`
                          }`}
                        >
                          <span className="text-sm font-semibold">{m.valor}</span>
                          <span className="text-xs opacity-80">{m.descripcion}</span>
                        </button>
                      ))}
                    </div>
                    {errores.motivo && (
                      <p className="text-xs text-red-500">{errores.motivo}</p>
                    )}
                  </div>

                  {/* Descripción */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Descripción del problema <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={form.descripcion}
                      onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                      rows={5}
                      placeholder="Describa el problema o requerimiento con el mayor detalle posible. Incluya los pasos para reproducir el error, mensajes de error, etc."
                      className={`${inputCls} resize-none ${errores.descripcion ? 'border-red-400 ring-1 ring-red-300' : ''}`}
                    />
                    <div className="flex items-center justify-between">
                      {errores.descripcion ? (
                        <p className="text-xs text-red-500">{errores.descripcion}</p>
                      ) : (
                        <span />
                      )}
                      <p className="text-xs text-slate-400 ml-auto">
                        {form.descripcion.length} caracteres
                      </p>
                    </div>
                  </div>

                  {/* Evidencias */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-slate-700">
                        Evidencias adjuntas{' '}
                        <span className="text-slate-400 font-normal">(opcional, simulado)</span>
                      </label>
                      <button
                        type="button"
                        onClick={agregarEvidencia}
                        className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-medium border border-blue-200 hover:border-blue-400 px-2.5 py-1.5 rounded-lg transition-colors"
                      >
                        <Paperclip size={13} /> Adjuntar archivo
                      </button>
                    </div>
                    {form.evidencias.length === 0 ? (
                      <div className="border-2 border-dashed border-slate-200 rounded-xl px-4 py-6 text-center">
                        <Paperclip size={20} className="text-slate-300 mx-auto mb-1" />
                        <p className="text-xs text-slate-400">
                          Haga clic en "Adjuntar archivo" para agregar capturas de pantalla, logs u otros archivos.
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {form.evidencias.map((ev) => (
                          <div
                            key={ev}
                            className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5"
                          >
                            <Paperclip size={14} className="text-slate-400 shrink-0" />
                            <span className="text-sm text-slate-700 flex-1 font-mono text-xs">{ev}</span>
                            <button
                              type="button"
                              onClick={() => quitarEvidencia(ev)}
                              className="text-slate-400 hover:text-red-500 transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>

                {/* Footer form */}
                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 rounded-b-xl flex items-center justify-between gap-4">
                  <p className="text-xs text-slate-500">
                    <Warning size={13} className="inline mr-1 text-amber-500" />
                    Los campos marcados con * son obligatorios
                  </p>
                  <button
                    type="submit"
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-5 py-2.5 rounded-lg transition-colors"
                  >
                    <Headset size={16} />
                    Enviar solicitud
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      )}

      {/* ── Modal: Detalle de solicitud ────────────────────────── */}
      {solicitudDetalle && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-slate-900">{solicitudDetalle.codigo}</h2>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${estadoClase[solicitudDetalle.estado]}`}>
                    {solicitudDetalle.estado}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Registrada el {solicitudDetalle.fechaRegistro}
                </p>
              </div>
              <button
                onClick={() => setSolicitudDetalle(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="px-6 py-5 flex flex-col gap-4 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-slate-500">Producto</p>
                  <p className="text-sm text-slate-900 mt-0.5">{solicitudDetalle.productoNombre}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500">Motivo</p>
                  <span className={`inline-block mt-0.5 text-xs px-2.5 py-1 rounded-full font-medium ${motivoClase[solicitudDetalle.motivo]}`}>
                    {solicitudDetalle.motivo}
                  </span>
                </div>
                <div className="col-span-2">
                  <p className="text-xs font-medium text-slate-500">Ruta de menú</p>
                  <p className="text-sm text-slate-900 mt-0.5">
                    {solicitudDetalle.modulo} / {solicitudDetalle.submodulo} / {solicitudDetalle.accion}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-500">Descripción</p>
                <p className="text-sm text-slate-700 mt-1 leading-relaxed">{solicitudDetalle.descripcion}</p>
              </div>

              {solicitudDetalle.evidencias.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-slate-500 mb-1.5">Evidencias adjuntas</p>
                  <div className="flex flex-col gap-1.5">
                    {solicitudDetalle.evidencias.map((ev) => (
                      <div key={ev} className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2">
                        <Paperclip size={13} className="text-slate-400" />
                        <span className="text-xs font-mono text-slate-700">{ev}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {solicitudDetalle.responsable && (
                <div>
                  <p className="text-xs font-medium text-slate-500">Responsable asignado</p>
                  <p className="text-sm text-slate-900 mt-0.5">{solicitudDetalle.responsable}</p>
                </div>
              )}

              {solicitudDetalle.ordenServicioCodigo && (
                <div className="bg-violet-50 border border-violet-200 rounded-lg px-4 py-3">
                  <p className="text-xs font-medium text-violet-700">Orden de servicio generada</p>
                  <p className="text-sm font-bold text-violet-900 mt-0.5">{solicitudDetalle.ordenServicioCodigo}</p>
                </div>
              )}

              {solicitudDetalle.comentarioAdmin && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
                  <p className="text-xs font-medium text-blue-700">Respuesta del equipo de soporte</p>
                  <p className="text-sm text-blue-900 mt-0.5">{solicitudDetalle.comentarioAdmin}</p>
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex justify-end shrink-0">
              <button
                onClick={() => setSolicitudDetalle(null)}
                className="px-4 py-2 rounded-lg text-sm bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
