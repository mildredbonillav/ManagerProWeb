import { useState, useCallback } from 'react'
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors,
} from '@dnd-kit/core'
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates,
  horizontalListSortingStrategy, useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  Clock, Plus, CalendarBlank, ListBullets, CaretDown, CaretRight,
  CaretLeft, ArrowUp, ArrowDown, MagnifyingGlass, FunnelSimple,
  CheckCircle, Circle, ArrowClockwise, Warning, X, Paperclip,
  ChatCircle, ArrowLeft, UploadSimple, DotsSixVertical, Eye,
  CaretUpDown,
} from '@phosphor-icons/react'

// ─── Datos ────────────────────────────────────────────────────────
const misSubtareasFlat = [
  { id: 1, codigo: 'SUB-001', os: 'OS-001', osNombre: 'Plataforma e-commerce', tarea: 'Pantallas principales', nombre: 'Login y registro', estimado: 5, real: 4, estado: 'en_progreso', prioridad: 'alta', esCobrable: true },
  { id: 2, codigo: 'SUB-002', os: 'OS-001', osNombre: 'Plataforma e-commerce', tarea: 'Pantallas principales', nombre: 'Home y catálogo', estimado: 5, real: 5, estado: 'finalizada', prioridad: 'media', esCobrable: true },
  { id: 3, codigo: 'SUB-003', os: 'OS-001', osNombre: 'Plataforma e-commerce', tarea: 'Módulo de pagos', nombre: 'Integración pasarela', estimado: 10, real: 2, estado: 'en_progreso', prioridad: 'alta', esCobrable: true },
  { id: 4, codigo: 'SUB-004', os: 'OS-001', osNombre: 'Plataforma e-commerce', tarea: 'Módulo de pagos', nombre: 'Pantalla confirmación', estimado: 4, real: 0, estado: 'pendiente', prioridad: 'media', esCobrable: true },
  { id: 5, codigo: 'SUB-005', os: 'OS-003', osNombre: 'Incremento módulo reportes', tarea: 'Reportes de ventas', nombre: 'Diseño de vistas', estimado: 6, real: 1, estado: 'en_progreso', prioridad: 'baja', esCobrable: false },
  { id: 6, codigo: 'SUB-006', os: 'OS-003', osNombre: 'Incremento módulo reportes', tarea: 'Reportes de ventas', nombre: 'Exportación PDF', estimado: 8, real: 0, estado: 'pendiente', prioridad: 'media', esCobrable: false },
  { id: 7, codigo: 'SUB-007', os: 'OS-001', osNombre: 'Plataforma e-commerce', tarea: 'Módulo de pagos', nombre: 'Manejo de errores de pago', estimado: 3, real: 0, estado: 'pendiente', prioridad: 'alta', esCobrable: true },
]

const boletasData = [
  { id: 1, subtareaId: 1, subtarea: 'Login y registro', orden: 'OS-001', fecha: '2026-04-10', horaInicio: '08:00', horaFin: '12:00', horas: 4, tipoLabor: 'Desarrollo / Frontend / Implementación', descripcion: 'Implementación del formulario de login', esCobrable: true, estado: 'registrada' },
  { id: 2, subtareaId: 3, subtarea: 'Integración pasarela', orden: 'OS-001', fecha: '2026-04-10', horaInicio: '13:00', horaFin: '15:00', horas: 2, tipoLabor: 'Desarrollo / Backend / API REST', descripcion: 'Configuración inicial de Stripe', esCobrable: true, estado: 'registrada' },
  { id: 3, subtareaId: 5, subtarea: 'Diseño de vistas', orden: 'OS-003', fecha: '2026-04-09', horaInicio: '09:00', horaFin: '11:00', horas: 2, tipoLabor: 'Desarrollo / Frontend / Diseño UI', descripcion: 'Mockups de reportes de ventas', esCobrable: false, estado: 'registrada' },
  { id: 4, subtareaId: 1, subtarea: 'Login y registro', orden: 'OS-001', fecha: '2026-04-08', horaInicio: '08:00', horaFin: '10:00', horas: 2, tipoLabor: 'Desarrollo / Frontend / Implementación', descripcion: 'Validaciones del formulario', esCobrable: true, estado: 'registrada' },
  { id: 5, subtareaId: 3, subtarea: 'Integración pasarela', orden: 'OS-001', fecha: '2026-04-07', horaInicio: '10:00', horaFin: '12:00', horas: 2, tipoLabor: 'Desarrollo / Backend / API REST', descripcion: 'Webhooks de confirmación', esCobrable: true, estado: 'borrador' },
]

const comentariosData = {
  1: [
    { id: 1, usuario: 'Sofía Barboza', fecha: '2026-04-09 14:30', comentario: 'Recordá incluir la validación de correo duplicado.' },
    { id: 2, usuario: 'Armando Núñez', fecha: '2026-04-10 08:15', comentario: 'Ya lo incluí, también agregué el captcha.' },
  ],
  3: [{ id: 3, usuario: 'Mildred Bonilla', fecha: '2026-04-08 10:00', comentario: 'Verificar con el cliente qué pasarela prefieren.' }],
}

const adjuntosData = {
  1: [{ id: 1, nombre: 'Diseño_login_v2.fig', descripcion: 'Diseño actualizado aprobado', fecha: '2026-04-08' }],
  3: [{ id: 2, nombre: 'Documentacion_stripe.pdf', descripcion: 'Guía de integración', fecha: '2026-04-07' }],
}

// ─── Helpers ──────────────────────────────────────────────────────
const prioridadClase = { alta: 'bg-red-100 text-red-600', media: 'bg-amber-100 text-amber-600', baja: 'bg-slate-100 text-slate-500' }
const estadoBadge = { finalizada: 'bg-green-100 text-green-700', en_progreso: 'bg-blue-100 text-blue-700', pendiente: 'bg-slate-100 text-slate-500' }
const estadoLabel = { finalizada: 'Finalizada', en_progreso: 'En progreso', pendiente: 'Pendiente' }

const estadoIcono = (estado, size = 14) => {
  if (estado === 'finalizada') return <CheckCircle size={size} weight="fill" className="text-green-500 shrink-0" />
  if (estado === 'en_progreso') return <Circle size={size} weight="fill" className="text-blue-400 shrink-0" />
  return <Circle size={size} className="text-slate-300 shrink-0" />
}

const DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
const MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

function calcularHoras(inicio, fin) {
  if (!inicio || !fin) return 0
  const [h1, m1] = inicio.split(':').map(Number)
  const [h2, m2] = fin.split(':').map(Number)
  return Math.max(0, Math.round(((h2 * 60 + m2) - (h1 * 60 + m1)) / 60 * 10) / 10)
}

function semanaDeHoy() {
  const hoy = new Date()
  const dia = hoy.getDay()
  const lunes = new Date(hoy)
  lunes.setDate(hoy.getDate() - (dia === 0 ? 6 : dia - 1))
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(lunes)
    d.setDate(lunes.getDate() + i)
    return d
  })
}

function formatFecha(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
}

// ─── Columnas definición ──────────────────────────────────────────
const COLUMNAS_DEFAULT = [
  { id: 'codigo',    label: '#',           visible: true,  width: 90 },
  { id: 'os',        label: 'OS',          visible: true,  width: 90 },
  { id: 'tarea',     label: 'Tarea',       visible: true,  width: 160 },
  { id: 'nombre',    label: 'Subtarea',    visible: true,  width: 200 },
  { id: 'estimado',  label: 'Estimado',    visible: true,  width: 90 },
  { id: 'real',      label: 'Registrado',  visible: true,  width: 100 },
  { id: 'restante',  label: 'Restante',    visible: true,  width: 90 },
  { id: 'progreso',  label: 'Progreso',    visible: true,  width: 130 },
  { id: 'estado',    label: 'Estado',      visible: true,  width: 120 },
  { id: 'prioridad', label: 'Prioridad',   visible: true,  width: 100 },
  { id: 'cobrable',  label: 'Cobrable',    visible: false, width: 90 },
]

// ─── Columna sortable ─────────────────────────────────────────────
function ColHeader({ col, ordenCol, ordenDir, onOrdenar }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: col.id })
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1, width: col.width, minWidth: col.width }

  return (
    <th ref={setNodeRef} style={style}
      className="px-3 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide select-none bg-slate-50 border-b border-slate-200 whitespace-nowrap">
      <div className="flex items-center gap-1">
        <span {...attributes} {...listeners} className="cursor-grab text-slate-300 hover:text-slate-400 shrink-0">
          <DotsSixVertical size={13} />
        </span>
        <button onClick={() => onOrdenar(col.id)} className="flex items-center gap-1 hover:text-slate-700 transition-colors">
          {col.label}
          {ordenCol === col.id
            ? ordenDir === 'asc' ? <ArrowUp size={11} className="text-blue-500" /> : <ArrowDown size={11} className="text-blue-500" />
            : <CaretUpDown size={11} className="text-slate-300" />}
        </button>
      </div>
    </th>
  )
}

// ─── Selector de columnas ─────────────────────────────────────────
function SelectorColumnas({ columnas, onChange }) {
  const [abierto, setAbierto] = useState(false)
  return (
    <div className="relative">
      <button onClick={() => setAbierto(!abierto)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-xs text-slate-600 hover:bg-slate-50 transition-colors">
        <Eye size={13} /> Columnas
      </button>
      {abierto && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setAbierto(false)} />
          <div className="absolute right-0 top-9 z-20 bg-white border border-slate-200 rounded-xl shadow-lg p-3 w-48 flex flex-col gap-1">
            <p className="text-xs font-semibold text-slate-500 mb-1 px-1">Mostrar columnas</p>
            {columnas.map((col) => (
              <label key={col.id} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-50 cursor-pointer">
                <input type="checkbox" checked={col.visible}
                  onChange={() => onChange(col.id)}
                  className="w-3.5 h-3.5 accent-blue-600" />
                <span className="text-xs text-slate-700">{col.label}</span>
              </label>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ─── Tabla configurable ───────────────────────────────────────────
function TablaSubtareas({ subtareas, onVerDetalle }) {
  const [columnas, setColumnas] = useState(COLUMNAS_DEFAULT)
  const [ordenCol, setOrdenCol] = useState('codigo')
  const [ordenDir, setOrdenDir] = useState('asc')

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const colsVisibles = columnas.filter(c => c.visible)

  const toggleColumna = (id) => {
    setColumnas(cols => cols.map(c => c.id === id ? { ...c, visible: !c.visible } : c))
  }

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIdx = colsVisibles.findIndex(c => c.id === active.id)
    const newIdx = colsVisibles.findIndex(c => c.id === over.id)
    const reordenadas = arrayMove(colsVisibles, oldIdx, newIdx)
    const invisibles = columnas.filter(c => !c.visible)
    setColumnas([...reordenadas, ...invisibles])
  }

  const handleOrdenar = (colId) => {
    if (ordenCol === colId) setOrdenDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setOrdenCol(colId); setOrdenDir('asc') }
  }

  const subtareasOrdenadas = [...subtareas].sort((a, b) => {
    let va = a[ordenCol] ?? ''
    let vb = b[ordenCol] ?? ''
    if (typeof va === 'string') va = va.toLowerCase()
    if (typeof vb === 'string') vb = vb.toLowerCase()
    if (va < vb) return ordenDir === 'asc' ? -1 : 1
    if (va > vb) return ordenDir === 'asc' ? 1 : -1
    return 0
  })

  const renderCelda = (col, sub) => {
    const restante = Math.max(0, sub.estimado - sub.real)
    const pct = Math.min(100, Math.round((sub.real / sub.estimado) * 100))
    switch (col.id) {
      case 'codigo': return <span className="text-xs font-mono text-slate-500">{sub.codigo}</span>
      case 'os': return <span className="text-xs font-medium text-blue-600">{sub.os}</span>
      case 'tarea': return <span className="text-xs text-slate-500 truncate block max-w-[150px]">{sub.tarea}</span>
      case 'nombre': return (
        <div className="flex items-center gap-2">
          {estadoIcono(sub.estado, 12)}
          <span className="text-sm font-medium text-slate-900 truncate max-w-[180px]">{sub.nombre}</span>
        </div>
      )
      case 'estimado': return <span className="text-xs text-slate-600">{sub.estimado}h</span>
      case 'real': return <span className="text-xs text-slate-600">{sub.real}h</span>
      case 'restante': return (
        <span className={`text-xs font-medium ${restante === 0 ? 'text-red-500' : 'text-slate-700'}`}>
          {restante > 0 ? `${restante}h` : '—'}
        </span>
      )
      case 'progreso': return (
        <div className="flex items-center gap-2 min-w-[110px]">
          <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${pct >= 100 ? 'bg-red-400' : pct >= 80 ? 'bg-amber-400' : 'bg-blue-400'}`}
              style={{ width: `${pct}%` }} />
          </div>
          <span className="text-xs text-slate-500 shrink-0">{pct}%</span>
        </div>
      )
      case 'estado': return (
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${estadoBadge[sub.estado]}`}>
          {estadoLabel[sub.estado]}
        </span>
      )
      case 'prioridad': return (
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${prioridadClase[sub.prioridad]}`}>
          {sub.prioridad}
        </span>
      )
      case 'cobrable': return (
        <span className={`text-xs ${sub.esCobrable ? 'text-green-600' : 'text-slate-400'}`}>
          {sub.esCobrable ? 'Sí' : 'No'}
        </span>
      )
      default: return null
    }
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <p className="text-xs text-slate-400">{subtareas.length} subtarea(s)</p>
        <SelectorColumnas columnas={columnas} onChange={toggleColumna} />
      </div>
      <div className="overflow-x-auto">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <SortableContext items={colsVisibles.map(c => c.id)} strategy={horizontalListSortingStrategy}>
                  {colsVisibles.map(col => (
                    <ColHeader key={col.id} col={col} ordenCol={ordenCol} ordenDir={ordenDir} onOrdenar={handleOrdenar} />
                  ))}
                </SortableContext>
                <th className="px-3 py-2.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide bg-slate-50 border-b border-slate-200 w-20">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {subtareasOrdenadas.map((sub) => (
                <tr key={sub.id}
                  onClick={() => onVerDetalle(sub)}
                  className="hover:bg-blue-50/50 cursor-pointer transition-colors group">
                  {colsVisibles.map(col => (
                    <td key={col.id} className="px-3 py-3 whitespace-nowrap" style={{ width: col.width }}>
                      {renderCelda(col, sub)}
                    </td>
                  ))}
                  <td className="px-3 py-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); onVerDetalle(sub) }}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Ver detalle →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </DndContext>
      </div>
    </div>
  )
}

// ─── Vista detalle subtarea ───────────────────────────────────────
function SubtareaDetalle({ subtarea, boletas, setBoletas, onVolver }) {
  const [tabActiva, setTabActiva] = useState('boletas')
  const [comentarios, setComentarios] = useState(comentariosData[subtarea.id] || [])
  const [adjuntos] = useState(adjuntosData[subtarea.id] || [])
  const [modalBoleta, setModalBoleta] = useState(false)
  const [modalTiempo, setModalTiempo] = useState(false)
  const [modalTarea, setModalTarea] = useState(false)
  const [nuevoComentario, setNuevoComentario] = useState('')
  const [form, setForm] = useState({ fecha: formatFecha(new Date()), horaInicio: '', horaFin: '', tipoLabor: '', descripcion: '', esCobrable: subtarea.esCobrable })
  const [formTiempo, setFormTiempo] = useState({ horasAdicionales: '', causa: '', justificacion: '' })
  const [formTarea, setFormTarea] = useState({ nombre: '', descripcion: '', estimacion: '', causa: '', justificacion: '' })

  const boletasSub = boletas.filter(b => b.subtareaId === subtarea.id)
  const totalHoras = boletasSub.reduce((a, b) => a + b.horas, 0)
  const restante = Math.max(0, subtarea.estimado - subtarea.real)
  const pct = Math.min(100, Math.round((subtarea.real / subtarea.estimado) * 100))

  const guardarBoleta = (esBorrador = false) => {
    if (!form.fecha || !form.horaInicio || !form.horaFin) return
    const horas = calcularHoras(form.horaInicio, form.horaFin)
    setBoletas(prev => [...prev, {
      id: Date.now(), subtareaId: subtarea.id, subtarea: subtarea.nombre,
      orden: subtarea.os, ...form, horas, estado: esBorrador ? 'borrador' : 'registrada',
    }])
    setModalBoleta(false)
    setForm({ fecha: formatFecha(new Date()), horaInicio: '', horaFin: '', tipoLabor: '', descripcion: '', esCobrable: subtarea.esCobrable })
  }

  const agregarComentario = () => {
    if (!nuevoComentario.trim()) return
    setComentarios([...comentarios, { id: Date.now(), usuario: 'Sofía Barboza', fecha: new Date().toLocaleString(), comentario: nuevoComentario }])
    setNuevoComentario('')
  }

  return (
    <div className="flex flex-col gap-5">
      <button onClick={onVolver} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors w-fit">
        <ArrowLeft size={16} /> Volver a mis boletas
      </button>

      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap text-xs text-slate-400">
              <span className="font-mono font-semibold text-slate-600">{subtarea.codigo}</span>
              <span>·</span><span>{subtarea.os}</span>
              <span>·</span><span>{subtarea.osNombre}</span>
              <span>·</span><span>{subtarea.tarea}</span>
            </div>
            <div className="flex items-center gap-3 mb-3">
              {estadoIcono(subtarea.estado, 18)}
              <h1 className="text-xl font-bold text-slate-900">{subtarea.nombre}</h1>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${prioridadClase[subtarea.prioridad]}`}>Prioridad {subtarea.prioridad}</span>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${estadoBadge[subtarea.estado]}`}>{estadoLabel[subtarea.estado]}</span>
              {!subtarea.esCobrable && <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-500">No cobrable</span>}
            </div>
          </div>
          <div className="flex gap-2 shrink-0 flex-wrap justify-end">
            <button onClick={() => setModalTiempo(true)}
              className="flex items-center gap-1.5 border border-amber-300 text-amber-700 bg-amber-50 hover:bg-amber-100 text-xs font-medium px-3 py-2 rounded-lg transition-colors">
              <ArrowClockwise size={13} /> Solicitar tiempo
            </button>
            <button onClick={() => setModalTarea(true)}
              className="flex items-center gap-1.5 border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-medium px-3 py-2 rounded-lg transition-colors">
              <Plus size={13} /> Solicitar tarea
            </button>
            {subtarea.estado !== 'finalizada' && (
              <button onClick={() => setModalBoleta(true)}
                className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors">
                <Plus size={13} /> Registrar boleta
              </button>
            )}
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-slate-500">Progreso de tiempo</span>
            <span className="text-xs font-semibold text-slate-700">{pct}%</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${pct >= 100 ? 'bg-red-400' : pct >= 80 ? 'bg-amber-400' : 'bg-blue-500'}`}
              style={{ width: `${pct}%` }} />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-slate-400">Registrado: {subtarea.real}h de {subtarea.estimado}h</span>
            <span className={`text-xs font-medium ${restante === 0 ? 'text-red-500' : 'text-slate-600'}`}>
              {restante > 0 ? `Restante: ${restante}h` : 'Sin tiempo restante'}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-200">
        {[
          { id: 'boletas', label: 'Boletas', count: boletasSub.length },
          { id: 'comentarios', label: 'Comentarios', count: comentarios.length },
          { id: 'adjuntos', label: 'Adjuntos', count: adjuntos.length },
        ].map(tab => (
          <button key={tab.id} onClick={() => setTabActiva(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${tabActiva === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
            {tab.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${tabActiva === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Tab boletas */}
      {tabActiva === 'boletas' && (
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
            <p className="text-sm font-medium text-slate-900">Boletas registradas</p>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400">Total: <span className="font-semibold text-slate-700">{totalHoras}h</span></span>
              <button onClick={() => setModalBoleta(true)} className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-medium">
                <Plus size={13} /> Nueva
              </button>
            </div>
          </div>
          {boletasSub.length === 0 ? (
            <div className="px-6 py-10 text-center">
              <Clock size={28} className="text-slate-200 mx-auto mb-2" />
              <p className="text-sm text-slate-400">No hay boletas para esta subtarea.</p>
              <button onClick={() => setModalBoleta(true)} className="mt-2 text-xs text-blue-600 font-medium">Registrar la primera</button>
            </div>
          ) : boletasSub.map(b => (
            <div key={b.id} className="flex items-center gap-4 px-5 py-4 border-b border-slate-100 last:border-0">
              <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
                <Clock size={15} className="text-violet-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-medium text-slate-900">{b.tipoLabor || '—'}</span>
                  {b.estado === 'borrador' && <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Borrador</span>}
                  {!b.esCobrable && <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">No cobrable</span>}
                </div>
                {b.descripcion && <p className="text-xs text-slate-500 truncate">{b.descripcion}</p>}
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-slate-500">{b.fecha}</p>
                <p className="text-xs text-slate-400">{b.horaInicio} – {b.horaFin}</p>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Clock size={12} className="text-slate-400" />
                <span className="text-sm font-bold text-slate-900">{b.horas}h</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab comentarios */}
      {tabActiva === 'comentarios' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col gap-4">
          {comentarios.length === 0
            ? <div className="py-8 text-center"><ChatCircle size={28} className="text-slate-200 mx-auto mb-2" /><p className="text-sm text-slate-400">Sin comentarios.</p></div>
            : comentarios.map(c => (
              <div key={c.id} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 text-xs font-bold text-blue-600">{c.usuario.charAt(0)}</div>
                <div className="flex-1 bg-slate-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-slate-900">{c.usuario}</span>
                    <span className="text-xs text-slate-400">{c.fecha}</span>
                  </div>
                  <p className="text-sm text-slate-700">{c.comentario}</p>
                </div>
              </div>
            ))
          }
          <div className="flex gap-3 pt-2 border-t border-slate-100">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 text-xs font-bold text-blue-600">S</div>
            <div className="flex-1 flex gap-2">
              <input type="text" value={nuevoComentario} onChange={e => setNuevoComentario(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && agregarComentario()}
                placeholder="Escribí un comentario..." className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <button onClick={agregarComentario} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors">Enviar</button>
            </div>
          </div>
        </div>
      )}

      {/* Tab adjuntos */}
      {tabActiva === 'adjuntos' && (
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
            <p className="text-sm font-medium text-slate-900">Archivos adjuntos</p>
            <button className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-medium"><UploadSimple size={13} /> Subir</button>
          </div>
          {adjuntos.length === 0
            ? <div className="px-6 py-10 text-center"><Paperclip size={28} className="text-slate-200 mx-auto mb-2" /><p className="text-sm text-slate-400">Sin archivos adjuntos.</p></div>
            : adjuntos.map(a => (
              <div key={a.id} className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 last:border-0">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0"><Paperclip size={15} className="text-slate-500" /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900">{a.nombre}</p>
                  <p className="text-xs text-slate-400">{a.descripcion} · {a.fecha}</p>
                </div>
              </div>
            ))
          }
        </div>
      )}

      {/* Modal boleta */}
      {modalBoleta && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Registrar boleta</h2>
                <p className="text-xs text-slate-500 mt-0.5">{subtarea.codigo} · {subtarea.nombre}</p>
              </div>
              <button onClick={() => setModalBoleta(false)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"><X size={18} /></button>
            </div>
            <div className="px-6 py-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-700">Tipo de labor</label>
                <select value={form.tipoLabor} onChange={e => setForm({ ...form, tipoLabor: e.target.value })}
                  className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  <option value="">Seleccionar...</option>
                  <option>Desarrollo / Frontend / Diseño UI</option>
                  <option>Desarrollo / Frontend / Implementación</option>
                  <option>Desarrollo / Backend / API REST</option>
                  <option>Soporte / Incidencias / Nivel 1</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-700">Descripción</label>
                <textarea value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })}
                  rows={2} placeholder="Describí las labores realizadas..."
                  className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-slate-700">Fecha</label>
                  <input type="date" value={form.fecha} onChange={e => setForm({ ...form, fecha: e.target.value })}
                    className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-slate-700">Hora inicio</label>
                  <input type="time" value={form.horaInicio} onChange={e => setForm({ ...form, horaInicio: e.target.value })}
                    className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-slate-700">Hora fin</label>
                  <input type="time" value={form.horaFin} onChange={e => setForm({ ...form, horaFin: e.target.value })}
                    className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              {form.horaInicio && form.horaFin && calcularHoras(form.horaInicio, form.horaFin) > 0 && (
                <div className="flex items-center gap-2 bg-blue-50 rounded-lg px-4 py-2.5">
                  <Clock size={15} className="text-blue-600" />
                  <span className="text-sm text-blue-700 font-semibold">Total: {calcularHoras(form.horaInicio, form.horaFin)}h</span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <input type="checkbox" id="cob" checked={form.esCobrable} onChange={e => setForm({ ...form, esCobrable: e.target.checked })} className="w-4 h-4 accent-blue-600" />
                <label htmlFor="cob" className="text-sm text-slate-700">Es cobrable</label>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setModalBoleta(false)} className="px-4 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-100 transition-colors">Cancelar</button>
              <button onClick={() => guardarBoleta(true)} className="px-4 py-2 rounded-lg text-sm border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors">Borrador</button>
              <button onClick={() => guardarBoleta(false)} className="px-4 py-2 rounded-lg text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors">Registrar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal solicitar tiempo */}
      {modalTiempo && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Solicitar incremento de tiempo</h2>
              <button onClick={() => setModalTiempo(false)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"><X size={18} /></button>
            </div>
            <div className="px-6 py-5 flex flex-col gap-4">
              <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
                <Warning size={16} className="text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800">Debe ser aprobada por tu responsable. Podés guardar la boleta en borrador mientras tanto.</p>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-700">Horas adicionales</label>
                <input type="number" min="0.5" step="0.5" value={formTiempo.horasAdicionales}
                  onChange={e => setFormTiempo({ ...formTiempo, horasAdicionales: e.target.value })}
                  placeholder="Ej: 4" className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-700">Causa</label>
                <select value={formTiempo.causa} onChange={e => setFormTiempo({ ...formTiempo, causa: e.target.value })}
                  className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  <option value="">Seleccionar...</option>
                  <option>Estimación incorrecta</option>
                  <option>Cambio en requerimientos</option>
                  <option>Complejidad inesperada</option>
                  <option>Dependencia externa</option>
                  <option>Otro</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-700">Justificación</label>
                <textarea value={formTiempo.justificacion} onChange={e => setFormTiempo({ ...formTiempo, justificacion: e.target.value })}
                  rows={3} placeholder="Explicá por qué se necesitan más horas..."
                  className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setModalTiempo(false)} className="px-4 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-100 transition-colors">Cancelar</button>
              <button onClick={() => setModalTiempo(false)} className="px-4 py-2 rounded-lg text-sm bg-amber-500 hover:bg-amber-600 text-white font-medium transition-colors">Enviar solicitud</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal solicitar tarea */}
      {modalTarea && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Solicitar nueva tarea</h2>
              <button onClick={() => setModalTarea(false)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"><X size={18} /></button>
            </div>
            <div className="px-6 py-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-700">Nombre de la tarea</label>
                <input type="text" value={formTarea.nombre} onChange={e => setFormTarea({ ...formTarea, nombre: e.target.value })}
                  placeholder="Ej: Implementar notificaciones" className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-700">Descripción</label>
                <textarea value={formTarea.descripcion} onChange={e => setFormTarea({ ...formTarea, descripcion: e.target.value })}
                  rows={2} placeholder="Describí la tarea..."
                  className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-slate-700">Estimación (horas)</label>
                  <input type="number" min="1" value={formTarea.estimacion} onChange={e => setFormTarea({ ...formTarea, estimacion: e.target.value })}
                    placeholder="Ej: 8" className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-slate-700">Causa</label>
                  <select value={formTarea.causa} onChange={e => setFormTarea({ ...formTarea, causa: e.target.value })}
                    className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    <option value="">Seleccionar...</option>
                    <option>Alcance no contemplado</option>
                    <option>Solicitud del cliente</option>
                    <option>Mejora identificada</option>
                    <option>Otro</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-700">Justificación</label>
                <textarea value={formTarea.justificacion} onChange={e => setFormTarea({ ...formTarea, justificacion: e.target.value })}
                  rows={2} placeholder="Explicá por qué es necesaria..."
                  className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setModalTarea(false)} className="px-4 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-100 transition-colors">Cancelar</button>
              <button onClick={() => setModalTarea(false)} className="px-4 py-2 rounded-lg text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors">Enviar solicitud</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Componente principal ─────────────────────────────────────────
export default function Boletas() {
  const [boletas, setBoletas] = useState(boletasData)
  const [tabActiva, setTabActiva] = useState('subtareas')
  const [vistaActiva, setVistaActiva] = useState('lista')
  const [periodoActivo, setPeriodoActivo] = useState('semana')
  const [subtareaDetalle, setSubtareaDetalle] = useState(null)
  const [busqueda, setBusqueda] = useState('')
  const [filtroOS, setFiltroOS] = useState('Todos')
  const [filtroEstado, setFiltroEstado] = useState('Todos')
  const [filtroPrioridad, setFiltroPrioridad] = useState('Todos')
  const [semana] = useState(semanaDeHoy())
  const [modalBoleta, setModalBoleta] = useState(false)
  const [form, setForm] = useState({ fecha: formatFecha(new Date()), horaInicio: '', horaFin: '', tipoLabor: '', descripcion: '', esCobrable: true, orden: '', subtareaId: '' })

  const hoy = formatFecha(new Date())

  const horasHoy = boletas.filter(b => b.fecha === hoy).reduce((a, b) => a + b.horas, 0)
  const horasSemana = boletas.filter(b => semana.some(d => formatFecha(d) === b.fecha)).reduce((a, b) => a + b.horas, 0)
  const horasMes = boletas.filter(b => b.fecha.startsWith('2026-04')).reduce((a, b) => a + b.horas, 0)
  const tiempoRestante = misSubtareasFlat.filter(s => s.estado !== 'finalizada').reduce((a, s) => a + Math.max(0, s.estimado - s.real), 0)

  const osUnicas = [...new Set(misSubtareasFlat.map(s => s.os))]

  const subtareasFiltradas = misSubtareasFlat.filter(s => {
    const matchBusqueda = `${s.codigo} ${s.nombre} ${s.tarea} ${s.os} ${s.osNombre}`.toLowerCase().includes(busqueda.toLowerCase())
    const matchOS = filtroOS === 'Todos' || s.os === filtroOS
    const matchEstado = filtroEstado === 'Todos' || s.estado === filtroEstado
    const matchPrioridad = filtroPrioridad === 'Todos' || s.prioridad === filtroPrioridad
    return matchBusqueda && matchOS && matchEstado && matchPrioridad
  })

  const boletasFiltradas = boletas.filter(b => {
    if (periodoActivo === 'dia') return b.fecha === hoy
    if (periodoActivo === 'semana') return semana.some(d => formatFecha(d) === b.fecha)
    return b.fecha.startsWith('2026-04')
  })

  const guardarBoleta = () => {
    if (!form.fecha || !form.horaInicio || !form.horaFin || !form.orden) return
    const horas = calcularHoras(form.horaInicio, form.horaFin)
    setBoletas([...boletas, { id: Date.now(), subtareaId: Number(form.subtareaId), subtarea: 'Subtarea', orden: form.orden, ...form, horas, estado: 'registrada' }])
    setModalBoleta(false)
  }

  if (subtareaDetalle) {
    return <SubtareaDetalle subtarea={subtareaDetalle} boletas={boletas} setBoletas={setBoletas} onVolver={() => setSubtareaDetalle(null)} />
  }

  return (
    <div className="flex flex-col gap-4">

      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mis boletas de tiempo</h1>
          <p className="text-sm text-slate-500 mt-0.5">Registrá y consultá tus horas trabajadas</p>
        </div>
        <button onClick={() => setModalBoleta(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors">
          <Plus size={16} /> Nueva boleta
        </button>
      </div>

      {/* Resumen compacto */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Hoy', valor: `${horasHoy}h`, sub: hoy },
          { label: 'Esta semana', valor: `${horasSemana}h`, sub: 'Lun – Dom' },
          { label: 'Este mes', valor: `${horasMes}h`, sub: 'Abril 2026' },
          { label: 'Tiempo restante', valor: `${tiempoRestante}h`, sub: 'En subtareas activas' },
        ].map(t => (
          <div key={t.label} className="bg-white rounded-xl border border-slate-200 px-4 py-3 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-500">{t.label}</p>
              <p className="text-xl font-bold text-slate-900">{t.valor}</p>
              <p className="text-xs text-slate-400">{t.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs principales */}
      <div className="flex gap-1 border-b border-slate-200">
        {[
          { id: 'subtareas', label: 'Mis subtareas', count: misSubtareasFlat.length },
          { id: 'boletas', label: 'Mis boletas', count: boletas.length },
        ].map(tab => (
          <button key={tab.id} onClick={() => setTabActiva(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${tabActiva === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
            {tab.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${tabActiva === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Tab subtareas */}
      {tabActiva === 'subtareas' && (
        <div className="flex flex-col gap-3">
          {/* Filtros */}
          <div className="bg-white rounded-xl border border-slate-200 p-3 flex flex-wrap gap-3 items-center">
            <FunnelSimple size={15} className="text-slate-400" />
            <div className="relative flex-1 min-w-48">
              <MagnifyingGlass size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Buscar por #, nombre, tarea, OS..." value={busqueda}
                onChange={e => setBusqueda(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>
            <select value={filtroOS} onChange={e => setFiltroOS(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option>Todos</option>
              {osUnicas.map(os => <option key={os}>{os}</option>)}
            </select>
            <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option>Todos</option>
              <option value="en_progreso">En progreso</option>
              <option value="pendiente">Pendiente</option>
              <option value="finalizada">Finalizada</option>
            </select>
            <select value={filtroPrioridad} onChange={e => setFiltroPrioridad(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
              <option>Todos</option>
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </select>
          </div>

          <TablaSubtareas subtareas={subtareasFiltradas} onVerDetalle={setSubtareaDetalle} />
        </div>
      )}

      {/* Tab boletas */}
      {tabActiva === 'boletas' && (
        <div className="flex flex-col gap-3">
          <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex bg-slate-100 rounded-lg p-1 gap-1">
              {['dia', 'semana', 'mes'].map(p => (
                <button key={p} onClick={() => setPeriodoActivo(p)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${periodoActivo === p ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                  {p === 'dia' ? 'Hoy' : p === 'semana' ? 'Esta semana' : 'Este mes'}
                </button>
              ))}
            </div>
            <div className="flex bg-slate-100 rounded-lg p-1 gap-1">
              <button onClick={() => setVistaActiva('lista')}
                className={`p-1.5 rounded-md transition-colors ${vistaActiva === 'lista' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}>
                <ListBullets size={15} />
              </button>
              <button onClick={() => setVistaActiva('calendario')}
                className={`p-1.5 rounded-md transition-colors ${vistaActiva === 'calendario' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400 hover:text-slate-600'}`}>
                <CalendarBlank size={15} />
              </button>
            </div>
          </div>

          {vistaActiva === 'lista' && (
            <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
              {boletasFiltradas.length === 0
                ? <div className="px-6 py-12 text-center"><Clock size={28} className="text-slate-200 mx-auto mb-2" /><p className="text-sm text-slate-400">No hay boletas en este período.</p></div>
                : boletasFiltradas.map(b => (
                  <div key={b.id} className="flex items-center gap-4 px-5 py-3.5">
                    <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center shrink-0"><Clock size={15} className="text-violet-600" /></div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <span className="text-sm font-medium text-slate-900">{b.subtarea}</span>
                        <span className="text-xs text-slate-400">{b.orden}</span>
                        {b.estado === 'borrador' && <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Borrador</span>}
                        {!b.esCobrable && <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">No cobrable</span>}
                      </div>
                      {b.descripcion && <p className="text-xs text-slate-400 truncate">{b.descripcion}</p>}
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-slate-500">{b.fecha}</p>
                      <p className="text-xs text-slate-400">{b.horaInicio} – {b.horaFin}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Clock size={12} className="text-slate-400" />
                      <span className="text-sm font-bold text-slate-900">{b.horas}h</span>
                    </div>
                  </div>
                ))
              }
              {boletasFiltradas.length > 0 && (
                <div className="px-5 py-3 flex justify-between">
                  <span className="text-xs text-slate-400">{boletasFiltradas.length} boleta(s)</span>
                  <span className="text-xs font-semibold text-slate-900">Total: {boletasFiltradas.reduce((a, b) => a + b.horas, 0)}h</span>
                </div>
              )}
            </div>
          )}

          {vistaActiva === 'calendario' && (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
                <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"><CaretLeft size={15} /></button>
                <p className="text-sm font-semibold text-slate-900">{MESES[semana[0].getMonth()]} {semana[0].getFullYear()}</p>
                <button className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400"><CaretRight size={15} /></button>
              </div>
              <div className="grid grid-cols-7 border-b border-slate-100">
                {semana.map(d => {
                  const esHoy = formatFecha(d) === hoy
                  const horasDia = boletas.filter(b => b.fecha === formatFecha(d)).reduce((a, b) => a + b.horas, 0)
                  return (
                    <div key={formatFecha(d)} className={`px-2 py-3 text-center border-r border-slate-100 last:border-0 ${esHoy ? 'bg-blue-50' : ''}`}>
                      <p className="text-xs text-slate-400">{DIAS[d.getDay()]}</p>
                      <p className={`text-lg font-bold mt-0.5 ${esHoy ? 'text-blue-600' : 'text-slate-900'}`}>{d.getDate()}</p>
                      {horasDia > 0 && <p className="text-xs font-medium text-blue-600 mt-0.5">{horasDia}h</p>}
                    </div>
                  )
                })}
              </div>
              <div className="grid grid-cols-7 min-h-40">
                {semana.map(d => {
                  const fechaStr = formatFecha(d)
                  const esHoy = fechaStr === hoy
                  const boletasDia = boletas.filter(b => b.fecha === fechaStr)
                  return (
                    <div key={fechaStr} className={`p-2 border-r border-slate-100 last:border-0 ${esHoy ? 'bg-blue-50/30' : ''}`}>
                      {boletasDia.map(b => (
                        <div key={b.id} className={`mb-1.5 p-2 rounded-lg text-xs ${b.esCobrable ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-600'}`}>
                          <p className="font-medium truncate">{b.subtarea}</p>
                          <p className="opacity-70">{b.horaInicio}–{b.horaFin}</p>
                          <p className="font-bold">{b.horas}h</p>
                        </div>
                      ))}
                      {boletasDia.length === 0 && esHoy && (
                        <button onClick={() => setModalBoleta(true)}
                          className="w-full h-10 border border-dashed border-blue-300 rounded-lg text-xs text-blue-400 hover:bg-blue-50 transition-colors flex items-center justify-center gap-1">
                          <Plus size={11} /> Agregar
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal nueva boleta */}
      {modalBoleta && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Nueva boleta de tiempo</h2>
              <button onClick={() => setModalBoleta(false)} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"><X size={18} /></button>
            </div>
            <div className="px-6 py-5 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-slate-700">Orden de servicio</label>
                  <select value={form.orden} onChange={e => setForm({ ...form, orden: e.target.value })}
                    className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    <option value="">Seleccionar...</option>
                    {osUnicas.map(os => <option key={os}>{os}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-slate-700">Subtarea</label>
                  <select className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    <option value="">Seleccionar...</option>
                    {misSubtareasFlat.filter(s => s.estado !== 'finalizada').map(s => (
                      <option key={s.id} value={s.id}>{s.codigo} — {s.nombre}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-700">Tipo de labor</label>
                <select value={form.tipoLabor} onChange={e => setForm({ ...form, tipoLabor: e.target.value })}
                  className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  <option value="">Seleccionar...</option>
                  <option>Desarrollo / Frontend / Implementación</option>
                  <option>Desarrollo / Backend / API REST</option>
                  <option>Soporte / Incidencias / Nivel 1</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-700">Descripción</label>
                <textarea value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })}
                  rows={2} placeholder="Describí las labores realizadas..."
                  className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-slate-700">Fecha</label>
                  <input type="date" value={form.fecha} onChange={e => setForm({ ...form, fecha: e.target.value })}
                    className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-slate-700">Hora inicio</label>
                  <input type="time" value={form.horaInicio} onChange={e => setForm({ ...form, horaInicio: e.target.value })}
                    className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-slate-700">Hora fin</label>
                  <input type="time" value={form.horaFin} onChange={e => setForm({ ...form, horaFin: e.target.value })}
                    className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              {form.horaInicio && form.horaFin && calcularHoras(form.horaInicio, form.horaFin) > 0 && (
                <div className="flex items-center gap-2 bg-blue-50 rounded-lg px-4 py-2.5">
                  <Clock size={15} className="text-blue-600" />
                  <span className="text-sm text-blue-700 font-semibold">Total: {calcularHoras(form.horaInicio, form.horaFin)}h</span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <input type="checkbox" id="cob2" checked={form.esCobrable} onChange={e => setForm({ ...form, esCobrable: e.target.checked })} className="w-4 h-4 accent-blue-600" />
                <label htmlFor="cob2" className="text-sm text-slate-700">Es cobrable</label>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setModalBoleta(false)} className="px-4 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-100 transition-colors">Cancelar</button>
              <button onClick={guardarBoleta} className="px-4 py-2 rounded-lg text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors">Registrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}