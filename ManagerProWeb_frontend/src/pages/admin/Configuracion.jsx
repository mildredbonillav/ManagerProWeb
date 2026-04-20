import { useState } from 'react'
import {
  EnvelopeSimple,
  Clock,
  Tag,
  CalendarBlank,
  Globe,
  Plus,
  PencilSimple,
  ToggleLeft,
  ToggleRight,
  FloppyDisk,
  Check,
} from '@phosphor-icons/react'

// ── Sidebar sections ────────────────────────────────────────────────────────
const secciones = [
  { id: 'correo',    label: 'Correo electrónico',  icon: EnvelopeSimple },
  { id: 'jornadas',  label: 'Tipos de jornada',    icon: Clock },
  { id: 'categorias',label: 'Categorías de labor', icon: Tag },
  { id: 'ambientes', label: 'Tipos de ambiente',   icon: Globe },
  { id: 'calendario',label: 'Eventos de calendario',icon: CalendarBlank },
]

const DIAS_SEMANA = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

// ── Jornadas ─────────────────────────────────────────────────────────────────
const jornadasSimuladas = [
  { id: 1, nombre: 'Jornada ordinaria', descripcion: 'Horario regular de oficina', esExtraordinaria: false, estado: true, dias: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'], sinHorario: false, horaEntrada: '08:00', horaSalida: '17:00' },
  { id: 2, nombre: 'Jornada mixta', descripcion: 'Incluye sábados con horario reducido', esExtraordinaria: false, estado: true, dias: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'], sinHorario: false, horaEntrada: '07:00', horaSalida: '15:00' },
  { id: 3, nombre: 'Horas extra', descripcion: 'Fuera del horario ordinario establecido', esExtraordinaria: true, estado: true, dias: [], sinHorario: true, horaEntrada: '', horaSalida: '' },
]

// ── Clasificación de labores ──────────────────────────────────────────────────
const categoriasSimuladas = [
  { id: 1, nombre: 'Desarrollo', descripcion: 'Actividades de desarrollo de software', estado: true },
  { id: 2, nombre: 'Soporte', descripcion: 'Atención y resolución de incidencias', estado: true },
  { id: 3, nombre: 'Consultoría', descripcion: 'Asesoría especializada a clientes', estado: true },
]

const subcategoriasSimuladas = [
  { id: 1, nombre: 'Frontend', descripcion: 'Desarrollo de interfaz de usuario', categoriaId: 1, estado: true },
  { id: 2, nombre: 'Backend', descripcion: 'Desarrollo de lógica de negocio y APIs', categoriaId: 1, estado: true },
  { id: 3, nombre: 'Incidencias', descripcion: 'Gestión de incidencias reportadas', categoriaId: 2, estado: true },
  { id: 4, nombre: 'Implementación', descripcion: 'Puesta en marcha de soluciones', categoriaId: 3, estado: true },
]

const tiposLaborSimulados = [
  { id: 1, nombre: 'Diseño UI', descripcion: 'Diseño de componentes visuales e interfaz', subcategoriaId: 1, estado: true },
  { id: 2, nombre: 'Implementación', descripcion: 'Desarrollo e integración de funcionalidades', subcategoriaId: 1, estado: true },
  { id: 3, nombre: 'API REST', descripcion: 'Desarrollo e integración de servicios REST', subcategoriaId: 2, estado: true },
  { id: 4, nombre: 'Base de datos', descripcion: 'Modelado, consultas y migraciones', subcategoriaId: 2, estado: false },
  { id: 5, nombre: 'Nivel 1', descripcion: 'Soporte de primera línea al usuario', subcategoriaId: 3, estado: true },
  { id: 6, nombre: 'Análisis funcional', descripcion: 'Levantamiento de requerimientos y análisis', subcategoriaId: 4, estado: true },
]

// ── Jerarquía por tipo de OS ──────────────────────────────────────────────────
const NIVELES_JERARQUIA = [
  { key: 'fases',        label: 'Fase' },
  { key: 'entregables',  label: 'Entregable' },
  { key: 'paquetes',     label: 'Paquete de trabajo' },
  { key: 'actividades',  label: 'Actividad' },
]

const tiposOSSimulados = [
  { id: 1, nombre: 'Proyecto de desarrollo', fases: true,  entregables: true,  paquetes: true,  actividades: true,  estado: true },
  { id: 2, nombre: 'Soporte técnico',        fases: false, entregables: false, paquetes: false, actividades: true,  estado: true },
  { id: 3, nombre: 'Consultoría',            fases: true,  entregables: true,  paquetes: false, actividades: true,  estado: true },
  { id: 4, nombre: 'Mantenimiento',          fases: false, entregables: true,  paquetes: true,  actividades: true,  estado: true },
]

// ── Ambientes ─────────────────────────────────────────────────────────────────
const ambientesSimulados = [
  { id: 1, nombre: 'Desarrollo', descripcion: 'Ambiente local de desarrollo', estado: true },
  { id: 2, nombre: 'Testing', descripcion: 'Ambiente de pruebas QA', estado: true },
  { id: 3, nombre: 'Producción', descripcion: 'Ambiente productivo del cliente', estado: true },
  { id: 4, nombre: 'Staging', descripcion: 'Pre-producción', estado: true },
]

// ── Calendario ────────────────────────────────────────────────────────────────
const tiposEventoSimulados = [
  { id: 1, nombre: 'Feriado nacional', estado: true },
  { id: 2, nombre: 'Feriado regional', estado: true },
  { id: 3, nombre: 'Cierre administrativo', estado: true },
  { id: 4, nombre: 'Evento especial', estado: true },
]

const eventosSimulados = [
  { id: 1, nombre: 'Año Nuevo', fecha: '2026-01-01', todoElDia: true, horaInicio: '', horaFin: '', tipo: 'Feriado nacional', estado: true },
  { id: 2, nombre: 'Día del Trabajo', fecha: '2026-05-01', todoElDia: true, horaInicio: '', horaFin: '', tipo: 'Feriado nacional', estado: true },
  { id: 3, nombre: 'Cierre fin de año', fecha: '2026-12-31', todoElDia: false, horaInicio: '12:00', horaFin: '18:00', tipo: 'Cierre administrativo', estado: true },
]

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
const TITULOS_MODAL = {
  jornada:      'tipo de jornada',
  ambiente:     'tipo de ambiente',
  tipoEvento:   'tipo de evento',
  evento:       'evento',
  categoria:    'categoría',
  subcategoria: 'subcategoría',
  tipoLabor:    'tipo de labor',
  tipoOS:       'tipo de orden de servicio',
}

const estadoToggle = (form, setForm) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-medium text-slate-700">Estado</label>
    <div className="flex gap-2">
      <button type="button" onClick={() => setForm({ ...form, estado: true })}
        className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${form.estado !== false ? 'bg-green-100 text-green-700 ring-1 ring-green-300' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
        Activo
      </button>
      <button type="button" onClick={() => setForm({ ...form, estado: false })}
        className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${form.estado === false ? 'bg-slate-200 text-slate-700 ring-1 ring-slate-400' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
        Inactivo
      </button>
    </div>
  </div>
)

// ─────────────────────────────────────────────────────────────────────────────
export default function Configuracion() {
  const [seccionActiva, setSeccionActiva] = useState('correo')

  // Correo
  const [correoForm, setCorreoForm] = useState({ cuenta: 'notificaciones@businesspro.com', contrasena: '', servidor: 'smtp.gmail.com', puerto: '587' })
  const [correoGuardado, setCorreoGuardado] = useState(false)

  // Data
  const [jornadas,      setJornadas]      = useState(jornadasSimuladas)
  const [categorias,    setCategorias]    = useState(categoriasSimuladas)
  const [subcategorias, setSubcategorias] = useState(subcategoriasSimuladas)
  const [tiposLabor,    setTiposLabor]    = useState(tiposLaborSimulados)
  const [tiposOS,       setTiposOS]       = useState(tiposOSSimulados)
  const [ambientes,     setAmbientes]     = useState(ambientesSimulados)
  const [tiposEvento,   setTiposEvento]   = useState(tiposEventoSimulados)
  const [eventos,       setEventos]       = useState(eventosSimulados)

  // Inner tab for categorias section
  const [subSeccion, setSubSeccion] = useState('categorias')

  // Modal
  const [modal, setModal] = useState({ abierto: false, tipo: '', editando: null })
  const [form, setForm]   = useState({})

  // ── Abrir modal ────────────────────────────────────────────────────────────
  const abrirModal = (tipo, editando = null, defaults = {}) => {
    setModal({ abierto: true, tipo, editando })
    if (editando) {
      setForm({ ...editando })
    } else if (tipo === 'jornada') {
      setForm({ estado: true, esExtraordinaria: false, dias: [], sinHorario: false, horaEntrada: '', horaSalida: '' })
    } else if (['categoria', 'subcategoria', 'tipoLabor', 'tipoOS'].includes(tipo)) {
      setForm({ estado: true, ...defaults })
    } else {
      setForm({})
    }
  }

  const cerrarModal = () => setModal({ abierto: false, tipo: '', editando: null })

  // ── Toggles ────────────────────────────────────────────────────────────────
  const toggleJornada      = (id) => setJornadas(jornadas.map((j) => j.id === id ? { ...j, estado: !j.estado } : j))
  const toggleCategoria    = (id) => setCategorias(categorias.map((c) => c.id === id ? { ...c, estado: !c.estado } : c))
  const toggleSubcategoria = (id) => setSubcategorias(subcategorias.map((s) => s.id === id ? { ...s, estado: !s.estado } : s))
  const toggleTipoLabor    = (id) => setTiposLabor(tiposLabor.map((t) => t.id === id ? { ...t, estado: !t.estado } : t))
  const toggleTipoOS       = (id) => setTiposOS(tiposOS.map((t) => t.id === id ? { ...t, estado: !t.estado } : t))
  const toggleNivelOS      = (id, nivel) => setTiposOS(tiposOS.map((t) => t.id === id ? { ...t, [nivel]: !t[nivel] } : t))
  const toggleAmbiente     = (id) => setAmbientes(ambientes.map((a) => a.id === id ? { ...a, estado: !a.estado } : a))
  const toggleTipoEvento   = (id) => setTiposEvento(tiposEvento.map((t) => t.id === id ? { ...t, estado: !t.estado } : t))
  const toggleEvento       = (id) => setEventos(eventos.map((e) => e.id === id ? { ...e, estado: !e.estado } : e))

  // ── Guardar modal ──────────────────────────────────────────────────────────
  const guardarModal = () => {
    const { tipo, editando } = modal
    const upsert = (lista, setter) => {
      if (editando) setter(lista.map((i) => i.id === editando.id ? { ...i, ...form } : i))
      else          setter([...lista, { id: Date.now(), estado: true, ...form }])
    }
    if (tipo === 'jornada')      upsert(jornadas,      setJornadas)
    if (tipo === 'categoria')    upsert(categorias,    setCategorias)
    if (tipo === 'subcategoria') upsert(subcategorias, setSubcategorias)
    if (tipo === 'tipoLabor')    upsert(tiposLabor,    setTiposLabor)
    if (tipo === 'tipoOS')       upsert(tiposOS,       setTiposOS)
    if (tipo === 'ambiente')     upsert(ambientes,     setAmbientes)
    if (tipo === 'tipoEvento')   upsert(tiposEvento,   setTiposEvento)
    if (tipo === 'evento')       upsert(eventos,       setEventos)
    cerrarModal()
  }

  // ── Shared styles ──────────────────────────────────────────────────────────
  const inputCls = 'px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white'
  const btnAccion = 'p-2 rounded-lg text-slate-400 transition-colors'
  const estadoBadge = (on) => `text-xs px-2.5 py-1 rounded-full font-medium ${on ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`

  // ── Sub-tab labels ─────────────────────────────────────────────────────────
  const SUBTABS = [
    { id: 'categorias',    label: 'Categorías' },
    { id: 'subcategorias', label: 'Subcategorías' },
    { id: 'tipos',         label: 'Tipos de labor' },
    { id: 'jerarquia',     label: 'Jerarquía OS' },
  ]

  return (
    <div className="flex flex-col gap-6">

      {/* Encabezado */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Configuración</h1>
        <p className="text-sm text-slate-500 mt-1">Parámetros generales del sistema</p>
      </div>

      <div className="flex gap-6">

        {/* Sidebar */}
        <div className="w-56 shrink-0">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            {secciones.map((s) => (
              <button key={s.id} onClick={() => setSeccionActiva(s.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors border-b border-slate-100 last:border-0 ${
                  seccionActiva === s.id ? 'bg-blue-50 text-blue-600 font-medium' : 'text-slate-600 hover:bg-slate-50'
                }`}>
                <s.icon size={16} />
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Contenido */}
        <div className="flex-1 min-w-0">

          {/* ── Correo ─────────────────────────────────────────────────────── */}
          {seccionActiva === 'correo' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col gap-5">
              <h2 className="text-base font-semibold text-slate-900">Configuración de correo electrónico</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 col-span-2">
                  <label className="text-xs font-medium text-slate-700">Cuenta emisora</label>
                  <input type="email" value={correoForm.cuenta} onChange={(e) => setCorreoForm({ ...correoForm, cuenta: e.target.value })} className={inputCls} />
                </div>
                <div className="flex flex-col gap-1.5 col-span-2">
                  <label className="text-xs font-medium text-slate-700">Contraseña</label>
                  <input type="password" value={correoForm.contrasena} onChange={(e) => setCorreoForm({ ...correoForm, contrasena: e.target.value })} placeholder="••••••••" className={inputCls} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-slate-700">Servidor SMTP</label>
                  <input type="text" value={correoForm.servidor} onChange={(e) => setCorreoForm({ ...correoForm, servidor: e.target.value })} className={inputCls} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-slate-700">Puerto</label>
                  <input type="number" value={correoForm.puerto} onChange={(e) => setCorreoForm({ ...correoForm, puerto: e.target.value })} className={inputCls} />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setCorreoGuardado(true)}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                  <FloppyDisk size={16} /> Guardar configuración
                </button>
                {correoGuardado && <span className="text-xs text-green-600 font-medium">✓ Guardado correctamente</span>}
              </div>
            </div>
          )}

          {/* ── Jornadas ───────────────────────────────────────────────────── */}
          {seccionActiva === 'jornadas' && (
            <div className="bg-white rounded-xl border border-slate-200">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <h2 className="text-base font-semibold text-slate-900">Tipos de jornada</h2>
                <button onClick={() => abrirModal('jornada')}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors">
                  <Plus size={14} /> Nueva jornada
                </button>
              </div>
              <div className="divide-y divide-slate-100">
                {jornadas.map((j) => (
                  <div key={j.id} className="flex items-start gap-4 px-5 py-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-medium text-slate-900">{j.nombre}</p>
                        {j.esExtraordinaria && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">Extraordinaria</span>}
                      </div>
                      {j.descripcion && <p className="text-xs text-slate-500 mt-0.5">{j.descripcion}</p>}
                      {j.dias && j.dias.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {j.dias.map((dia) => <span key={dia} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-medium">{dia}</span>)}
                        </div>
                      )}
                      <p className="text-xs text-slate-400 mt-1.5">
                        {j.sinHorario ? 'Sin horario específico' : j.horaEntrada && j.horaSalida ? `${j.horaEntrada} – ${j.horaSalida}` : 'Horario no definido'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={estadoBadge(j.estado)}>{j.estado ? 'Activo' : 'Inactivo'}</span>
                      <button onClick={() => abrirModal('jornada', j)} className={`${btnAccion} hover:text-blue-600 hover:bg-blue-50`}><PencilSimple size={15} /></button>
                      <button onClick={() => toggleJornada(j.id)} className={`${btnAccion} hover:text-amber-600 hover:bg-amber-50`}>
                        {j.estado ? <ToggleRight size={18} className="text-green-500" /> : <ToggleLeft size={18} />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Clasificación de labores ────────────────────────────────────── */}
          {seccionActiva === 'categorias' && (
            <div className="flex flex-col gap-4">

              {/* Sub-tabs */}
              <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
                {SUBTABS.map((t) => (
                  <button key={t.id} onClick={() => setSubSeccion(t.id)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${subSeccion === t.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                    {t.label}
                  </button>
                ))}
              </div>

              {/* ── Categorías ─────────────────────────────────────────────── */}
              {subSeccion === 'categorias' && (
                <div className="bg-white rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                    <div>
                      <h2 className="text-base font-semibold text-slate-900">Categorías</h2>
                      <p className="text-xs text-slate-500 mt-0.5">Agrupaciones principales de tipos de labor</p>
                    </div>
                    <button onClick={() => abrirModal('categoria')}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors">
                      <Plus size={14} /> Nueva categoría
                    </button>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {categorias.map((c) => (
                      <div key={c.id} className="flex items-center gap-4 px-5 py-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-900">{c.nombre}</p>
                          {c.descripcion && <p className="text-xs text-slate-500 mt-0.5">{c.descripcion}</p>}
                        </div>
                        <span className="text-xs text-slate-400 hidden sm:block">
                          {subcategorias.filter((s) => s.categoriaId === c.id).length} subcategoría(s)
                        </span>
                        <span className={estadoBadge(c.estado)}>{c.estado ? 'Activo' : 'Inactivo'}</span>
                        <div className="flex items-center gap-1">
                          <button onClick={() => abrirModal('categoria', c)} className={`${btnAccion} hover:text-blue-600 hover:bg-blue-50`}><PencilSimple size={15} /></button>
                          <button onClick={() => toggleCategoria(c.id)} className={`${btnAccion} hover:text-amber-600 hover:bg-amber-50`}>
                            {c.estado ? <ToggleRight size={18} className="text-green-500" /> : <ToggleLeft size={18} />}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Subcategorías ──────────────────────────────────────────── */}
              {subSeccion === 'subcategorias' && (
                <div className="bg-white rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                    <div>
                      <h2 className="text-base font-semibold text-slate-900">Subcategorías</h2>
                      <p className="text-xs text-slate-500 mt-0.5">Divisiones dentro de cada categoría</p>
                    </div>
                    <button onClick={() => abrirModal('subcategoria')}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors">
                      <Plus size={14} /> Nueva subcategoría
                    </button>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {subcategorias.map((s) => {
                      const cat = categorias.find((c) => c.id === s.categoriaId)
                      return (
                        <div key={s.id} className="flex items-center gap-4 px-5 py-4">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900">{s.nombre}</p>
                            {s.descripcion && <p className="text-xs text-slate-500 mt-0.5">{s.descripcion}</p>}
                          </div>
                          {cat && (
                            <span className="hidden sm:block text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium whitespace-nowrap">
                              {cat.nombre}
                            </span>
                          )}
                          <span className="text-xs text-slate-400 hidden md:block whitespace-nowrap">
                            {tiposLabor.filter((t) => t.subcategoriaId === s.id).length} tipo(s)
                          </span>
                          <span className={estadoBadge(s.estado)}>{s.estado ? 'Activo' : 'Inactivo'}</span>
                          <div className="flex items-center gap-1">
                            <button onClick={() => abrirModal('subcategoria', s)} className={`${btnAccion} hover:text-blue-600 hover:bg-blue-50`}><PencilSimple size={15} /></button>
                            <button onClick={() => toggleSubcategoria(s.id)} className={`${btnAccion} hover:text-amber-600 hover:bg-amber-50`}>
                              {s.estado ? <ToggleRight size={18} className="text-green-500" /> : <ToggleLeft size={18} />}
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* ── Tipos de labor ─────────────────────────────────────────── */}
              {subSeccion === 'tipos' && (
                <div className="bg-white rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                    <div>
                      <h2 className="text-base font-semibold text-slate-900">Tipos de labor</h2>
                      <p className="text-xs text-slate-500 mt-0.5">Clasificación detallada de las actividades</p>
                    </div>
                    <button onClick={() => abrirModal('tipoLabor')}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors">
                      <Plus size={14} /> Nuevo tipo
                    </button>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {tiposLabor.map((t) => {
                      const sub = subcategorias.find((s) => s.id === t.subcategoriaId)
                      const cat = sub ? categorias.find((c) => c.id === sub.categoriaId) : null
                      return (
                        <div key={t.id} className="flex items-center gap-4 px-5 py-4">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900">{t.nombre}</p>
                            {t.descripcion && <p className="text-xs text-slate-500 mt-0.5">{t.descripcion}</p>}
                          </div>
                          <div className="hidden sm:flex items-center gap-1.5">
                            {cat && <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{cat.nombre}</span>}
                            {sub && <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">{sub.nombre}</span>}
                          </div>
                          <span className={estadoBadge(t.estado)}>{t.estado ? 'Activo' : 'Inactivo'}</span>
                          <div className="flex items-center gap-1">
                            <button onClick={() => abrirModal('tipoLabor', t)} className={`${btnAccion} hover:text-blue-600 hover:bg-blue-50`}><PencilSimple size={15} /></button>
                            <button onClick={() => toggleTipoLabor(t.id)} className={`${btnAccion} hover:text-amber-600 hover:bg-amber-50`}>
                              {t.estado ? <ToggleRight size={18} className="text-green-500" /> : <ToggleLeft size={18} />}
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* ── Jerarquía OS ───────────────────────────────────────────── */}
              {subSeccion === 'jerarquia' && (
                <div className="bg-white rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                    <div>
                      <h2 className="text-base font-semibold text-slate-900">Jerarquía por tipo de orden de servicio</h2>
                      <p className="text-xs text-slate-500 mt-0.5">Definí qué niveles opcionales estarán disponibles al crear cada tipo de OS</p>
                    </div>
                    <button onClick={() => abrirModal('tipoOS')}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors">
                      <Plus size={14} /> Nuevo tipo de OS
                    </button>
                  </div>

                  {/* Column headers */}
                  <div className="hidden md:grid px-5 py-2.5 border-b border-slate-100 bg-slate-50/80 text-xs font-medium text-slate-500"
                    style={{ gridTemplateColumns: '1fr repeat(4, 130px) 72px' }}>
                    <span>Tipo de OS</span>
                    {NIVELES_JERARQUIA.map((n) => <span key={n.key} className="text-center">{n.label}</span>)}
                    <span />
                  </div>

                  <div className="divide-y divide-slate-100">
                    {tiposOS.map((t) => (
                      <div key={t.id} className="px-5 py-4 flex flex-col md:grid gap-3 md:gap-4 md:items-center"
                        style={{ gridTemplateColumns: '1fr repeat(4, 130px) 72px' }}>

                        {/* Nombre + estado */}
                        <div>
                          <p className="text-sm font-medium text-slate-900">{t.nombre}</p>
                          <span className={`mt-1 inline-block ${estadoBadge(t.estado)}`}>{t.estado ? 'Activo' : 'Inactivo'}</span>
                        </div>

                        {/* Nivel toggles */}
                        {NIVELES_JERARQUIA.map((n) => (
                          <div key={n.key} className="flex md:justify-center">
                            <button
                              onClick={() => toggleNivelOS(t.id, n.key)}
                              title={t[n.key] ? `Desactivar ${n.label}` : `Activar ${n.label}`}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                                t[n.key]
                                  ? 'bg-blue-600 border-blue-600 text-white'
                                  : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'
                              }`}
                            >
                              {t[n.key] && <Check size={11} weight="bold" />}
                              <span className="md:hidden">{n.label}: </span>
                              {t[n.key] ? 'Habilitado' : 'Desactivado'}
                            </button>
                          </div>
                        ))}

                        {/* Acciones */}
                        <div className="flex items-center gap-1 md:justify-center">
                          <button onClick={() => abrirModal('tipoOS', t)} className={`${btnAccion} hover:text-blue-600 hover:bg-blue-50`}><PencilSimple size={15} /></button>
                          <button onClick={() => toggleTipoOS(t.id)} className={`${btnAccion} hover:text-amber-600 hover:bg-amber-50`}>
                            {t.estado ? <ToggleRight size={18} className="text-green-500" /> : <ToggleLeft size={18} />}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Ambientes ──────────────────────────────────────────────────── */}
          {seccionActiva === 'ambientes' && (
            <div className="bg-white rounded-xl border border-slate-200">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <h2 className="text-base font-semibold text-slate-900">Tipos de ambiente</h2>
                <button onClick={() => abrirModal('ambiente')}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors">
                  <Plus size={14} /> Nuevo tipo
                </button>
              </div>
              <div className="divide-y divide-slate-100">
                {ambientes.map((a) => (
                  <div key={a.id} className="flex items-center gap-4 px-5 py-4">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">{a.nombre}</p>
                      <p className="text-xs text-slate-500">{a.descripcion}</p>
                    </div>
                    <span className={estadoBadge(a.estado)}>{a.estado ? 'Activo' : 'Inactivo'}</span>
                    <div className="flex items-center gap-1">
                      <button onClick={() => abrirModal('ambiente', a)} className={`${btnAccion} hover:text-blue-600 hover:bg-blue-50`}><PencilSimple size={15} /></button>
                      <button onClick={() => toggleAmbiente(a.id)} className={`${btnAccion} hover:text-amber-600 hover:bg-amber-50`}>
                        {a.estado ? <ToggleRight size={18} className="text-green-500" /> : <ToggleLeft size={18} />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Calendario ─────────────────────────────────────────────────── */}
          {seccionActiva === 'calendario' && (
            <div className="flex flex-col gap-4">
              <div className="bg-white rounded-xl border border-slate-200">
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                  <h2 className="text-base font-semibold text-slate-900">Tipos de evento</h2>
                  <button onClick={() => abrirModal('tipoEvento')}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors">
                    <Plus size={14} /> Nuevo tipo
                  </button>
                </div>
                <div className="divide-y divide-slate-100">
                  {tiposEvento.map((t) => (
                    <div key={t.id} className="flex items-center gap-4 px-5 py-3">
                      <p className="flex-1 text-sm text-slate-900">{t.nombre}</p>
                      <span className={estadoBadge(t.estado)}>{t.estado ? 'Activo' : 'Inactivo'}</span>
                      <div className="flex items-center gap-1">
                        <button onClick={() => abrirModal('tipoEvento', t)} className={`${btnAccion} hover:text-blue-600 hover:bg-blue-50`}><PencilSimple size={15} /></button>
                        <button onClick={() => toggleTipoEvento(t.id)} className={`${btnAccion} hover:text-amber-600 hover:bg-amber-50`}>
                          {t.estado ? <ToggleRight size={18} className="text-green-500" /> : <ToggleLeft size={18} />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200">
                <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                  <h2 className="text-base font-semibold text-slate-900">Eventos registrados</h2>
                  <button onClick={() => abrirModal('evento')}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors">
                    <Plus size={14} /> Nuevo evento
                  </button>
                </div>
                <div className="divide-y divide-slate-100">
                  {eventos.map((e) => (
                    <div key={e.id} className="flex items-center gap-4 px-5 py-4">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-slate-900">{e.nombre}</p>
                        <p className="text-xs text-slate-500">
                          {e.fecha} · {e.todoElDia ? 'Todo el día' : `${e.horaInicio} – ${e.horaFin}`} · {e.tipo}
                        </p>
                      </div>
                      <span className={estadoBadge(e.estado)}>{e.estado ? 'Activo' : 'Inactivo'}</span>
                      <div className="flex items-center gap-1">
                        <button onClick={() => abrirModal('evento', e)} className={`${btnAccion} hover:text-blue-600 hover:bg-blue-50`}><PencilSimple size={15} /></button>
                        <button onClick={() => toggleEvento(e.id)} className={`${btnAccion} hover:text-amber-600 hover:bg-amber-50`}>
                          {e.estado ? <ToggleRight size={18} className="text-green-500" /> : <ToggleLeft size={18} />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          Modal genérico
      ══════════════════════════════════════════════════════════════════════ */}
      {modal.abierto && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className={`bg-white rounded-2xl shadow-xl w-full ${modal.tipo === 'jornada' ? 'max-w-lg' : 'max-w-md'} max-h-[90vh] flex flex-col`}>

            <div className="px-6 py-5 border-b border-slate-100 shrink-0">
              <h2 className="text-lg font-semibold text-slate-900">
                {modal.editando ? 'Editar' : 'Nuevo'} {TITULOS_MODAL[modal.tipo] ?? modal.tipo}
              </h2>
            </div>

            <div className="overflow-y-auto flex-1 px-6 py-5 flex flex-col gap-4">

              {/* Nombre — todos los tipos */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-700">Nombre</label>
                <input type="text" value={form.nombre || ''} onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  className={inputCls} placeholder="Nombre" />
              </div>

              {/* ── Categoría ─────────────────────────────────────────────── */}
              {modal.tipo === 'categoria' && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-slate-700">Descripción</label>
                    <textarea rows={2} value={form.descripcion || ''} onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                      className={`${inputCls} resize-none`} placeholder="Descripción de la categoría" />
                  </div>
                  {estadoToggle(form, setForm)}
                </>
              )}

              {/* ── Subcategoría ───────────────────────────────────────────── */}
              {modal.tipo === 'subcategoria' && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-slate-700">Descripción</label>
                    <textarea rows={2} value={form.descripcion || ''} onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                      className={`${inputCls} resize-none`} placeholder="Descripción de la subcategoría" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-slate-700">Categoría</label>
                    <select value={form.categoriaId || ''} onChange={(e) => setForm({ ...form, categoriaId: Number(e.target.value) })} className={inputCls}>
                      <option value="">Seleccionar categoría...</option>
                      {categorias.filter((c) => c.estado).map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                    </select>
                  </div>
                  {estadoToggle(form, setForm)}
                </>
              )}

              {/* ── Tipo de labor ──────────────────────────────────────────── */}
              {modal.tipo === 'tipoLabor' && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-slate-700">Descripción</label>
                    <textarea rows={2} value={form.descripcion || ''} onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                      className={`${inputCls} resize-none`} placeholder="Descripción del tipo de labor" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-slate-700">Subcategoría</label>
                    <select value={form.subcategoriaId || ''} onChange={(e) => setForm({ ...form, subcategoriaId: Number(e.target.value) })} className={inputCls}>
                      <option value="">Seleccionar subcategoría...</option>
                      {subcategorias.filter((s) => s.estado).map((s) => {
                        const cat = categorias.find((c) => c.id === s.categoriaId)
                        return <option key={s.id} value={s.id}>{s.nombre}{cat ? ` (${cat.nombre})` : ''}</option>
                      })}
                    </select>
                  </div>
                  {estadoToggle(form, setForm)}
                </>
              )}

              {/* ── Tipo de OS ─────────────────────────────────────────────── */}
              {modal.tipo === 'tipoOS' && (
                <>
                  {estadoToggle(form, setForm)}
                  {modal.editando && (
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-medium text-slate-700">Niveles de jerarquía habilitados</label>
                      <p className="text-xs text-slate-400">Podés ajustar los niveles directamente desde la tabla.</p>
                    </div>
                  )}
                </>
              )}

              {/* ── Ambiente ───────────────────────────────────────────────── */}
              {modal.tipo === 'ambiente' && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-slate-700">Descripción</label>
                  <input type="text" value={form.descripcion || ''} onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                    className={inputCls} placeholder="Descripción" />
                </div>
              )}

              {/* ── Jornada ────────────────────────────────────────────────── */}
              {modal.tipo === 'jornada' && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-slate-700">Descripción</label>
                    <textarea rows={2} value={form.descripcion || ''} onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                      className={`${inputCls} resize-none`} placeholder="Descripción de la jornada" />
                  </div>
                  {estadoToggle(form, setForm)}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-medium text-slate-700">Días de trabajo</label>
                    <div className="flex flex-wrap gap-2">
                      {DIAS_SEMANA.map((dia) => {
                        const sel = (form.dias || []).includes(dia)
                        return (
                          <button key={dia} type="button"
                            onClick={() => { const dias = form.dias || []; setForm({ ...form, dias: sel ? dias.filter((d) => d !== dia) : [...dias, dia] }) }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${sel ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                            {dia}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-medium text-slate-700">Horario de trabajo</label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={form.sinHorario || false}
                        onChange={(e) => setForm({ ...form, sinHorario: e.target.checked, horaEntrada: '', horaSalida: '' })}
                        className="w-4 h-4 accent-blue-600" />
                      <span className="text-sm text-slate-700">Sin horario específico</span>
                    </label>
                    {!form.sinHorario && (
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="text-xs text-slate-500">Hora de entrada</label>
                          <input type="time" value={form.horaEntrada || ''} onChange={(e) => setForm({ ...form, horaEntrada: e.target.value })} className={inputCls} />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-xs text-slate-500">Hora de salida</label>
                          <input type="time" value={form.horaSalida || ''} onChange={(e) => setForm({ ...form, horaSalida: e.target.value })} className={inputCls} />
                        </div>
                      </div>
                    )}
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.esExtraordinaria || false}
                      onChange={(e) => setForm({ ...form, esExtraordinaria: e.target.checked })}
                      className="w-4 h-4 accent-blue-600" />
                    <span className="text-sm text-slate-700">Es jornada extraordinaria</span>
                  </label>
                </>
              )}

              {/* ── Tipo de evento ─────────────────────────────────────────── */}
              {modal.tipo === 'tipoEvento' && null}

              {/* ── Evento ─────────────────────────────────────────────────── */}
              {modal.tipo === 'evento' && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-slate-700">Fecha</label>
                    <input type="date" value={form.fecha || ''} onChange={(e) => setForm({ ...form, fecha: e.target.value })} className={inputCls} />
                  </div>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" id="todoElDia" checked={form.todoElDia !== false}
                      onChange={(e) => setForm({ ...form, todoElDia: e.target.checked })}
                      className="w-4 h-4 accent-blue-600" />
                    <span className="text-sm text-slate-700">Todo el día</span>
                  </label>
                  {form.todoElDia === false && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-slate-700">Hora inicio</label>
                        <input type="time" value={form.horaInicio || ''} onChange={(e) => setForm({ ...form, horaInicio: e.target.value })} className={inputCls} />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-slate-700">Hora fin</label>
                        <input type="time" value={form.horaFin || ''} onChange={(e) => setForm({ ...form, horaFin: e.target.value })} className={inputCls} />
                      </div>
                    </div>
                  )}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-slate-700">Tipo de evento</label>
                    <select value={form.tipo || ''} onChange={(e) => setForm({ ...form, tipo: e.target.value })} className={inputCls}>
                      <option value="">Seleccionar...</option>
                      {tiposEvento.map((t) => <option key={t.id}>{t.nombre}</option>)}
                    </select>
                  </div>
                </>
              )}

            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 shrink-0">
              <button onClick={cerrarModal} className="px-4 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-100 transition-colors">
                Cancelar
              </button>
              <button onClick={guardarModal} className="px-4 py-2 rounded-lg text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors">
                {modal.editando ? 'Guardar cambios' : 'Crear'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
