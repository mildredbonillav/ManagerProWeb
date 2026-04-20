import { useState } from 'react'
import {
  Clock,
  ChartLineUp,
  Headset,
  Users,
  ArrowUp,
  ChartBar,
  Tag,
  Buildings,
  FunnelSimple,
  ArrowDown,
  CheckCircle,
  Warning,
  CalendarBlank,
  CaretUp,
  CaretDown,
} from '@phosphor-icons/react'

// ═══════════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════════

const RECURSOS = ['Sofía Barboza', 'Armando Núñez', 'Mildred Bonilla', 'Matías Vargas', 'Laura Campos', 'Diego Herrera']
const CLIENTES = ['Empresa ABC', 'Empresa XYZ', 'Empresa DEF', 'Empresa GHI']
const ORDENES  = ['OS-001', 'OS-002', 'OS-003', 'OS-004', 'OS-005']
const TIPOS_LABOR = ['Desarrollo / Frontend', 'Desarrollo / Backend', 'Diseño UI', 'QA / Testing', 'Soporte Técnico', 'Documentación', 'Reuniones']

// RQF-037 — Tiempos trabajados
const TIEMPOS_DATA = [
  { id: 1,  fecha: '2026-04-10', recurso: 'Sofía Barboza',   orden: 'OS-001', tipoLabor: 'Desarrollo / Frontend', horas: 4,   cobrable: true  },
  { id: 2,  fecha: '2026-04-10', recurso: 'Mildred Bonilla',  orden: 'OS-001', tipoLabor: 'Desarrollo / Backend',  horas: 5,   cobrable: true  },
  { id: 3,  fecha: '2026-04-10', recurso: 'Armando Núñez',    orden: 'OS-002', tipoLabor: 'Soporte Técnico',       horas: 3,   cobrable: true  },
  { id: 4,  fecha: '2026-04-09', recurso: 'Laura Campos',     orden: 'OS-001', tipoLabor: 'Diseño UI',             horas: 6,   cobrable: true  },
  { id: 5,  fecha: '2026-04-09', recurso: 'Matías Vargas',    orden: 'OS-001', tipoLabor: 'QA / Testing',          horas: 4,   cobrable: true  },
  { id: 6,  fecha: '2026-04-09', recurso: 'Diego Herrera',    orden: 'OS-003', tipoLabor: 'Desarrollo / Backend',  horas: 5,   cobrable: false },
  { id: 7,  fecha: '2026-04-08', recurso: 'Sofía Barboza',    orden: 'OS-001', tipoLabor: 'Desarrollo / Frontend', horas: 3,   cobrable: true  },
  { id: 8,  fecha: '2026-04-08', recurso: 'Mildred Bonilla',  orden: 'OS-003', tipoLabor: 'Desarrollo / Backend',  horas: 7,   cobrable: false },
  { id: 9,  fecha: '2026-04-08', recurso: 'Armando Núñez',    orden: 'OS-004', tipoLabor: 'Soporte Técnico',       horas: 2,   cobrable: false },
  { id: 10, fecha: '2026-04-07', recurso: 'Laura Campos',     orden: 'OS-005', tipoLabor: 'Diseño UI',             horas: 5,   cobrable: true  },
  { id: 11, fecha: '2026-04-07', recurso: 'Diego Herrera',    orden: 'OS-001', tipoLabor: 'Desarrollo / Backend',  horas: 6,   cobrable: true  },
  { id: 12, fecha: '2026-04-07', recurso: 'Matías Vargas',    orden: 'OS-003', tipoLabor: 'QA / Testing',          horas: 3,   cobrable: false },
  { id: 13, fecha: '2026-04-04', recurso: 'Sofía Barboza',    orden: 'OS-005', tipoLabor: 'Documentación',         horas: 2,   cobrable: true  },
  { id: 14, fecha: '2026-04-04', recurso: 'Armando Núñez',    orden: 'OS-002', tipoLabor: 'Soporte Técnico',       horas: 4,   cobrable: true  },
  { id: 15, fecha: '2026-04-03', recurso: 'Mildred Bonilla',  orden: 'OS-001', tipoLabor: 'Reuniones',             horas: 1.5, cobrable: false },
  { id: 16, fecha: '2026-04-03', recurso: 'Laura Campos',     orden: 'OS-001', tipoLabor: 'Diseño UI',             horas: 7,   cobrable: true  },
  { id: 17, fecha: '2026-04-02', recurso: 'Diego Herrera',    orden: 'OS-001', tipoLabor: 'Desarrollo / Backend',  horas: 8,   cobrable: true  },
  { id: 18, fecha: '2026-04-02', recurso: 'Matías Vargas',    orden: 'OS-001', tipoLabor: 'QA / Testing',          horas: 5,   cobrable: true  },
  { id: 19, fecha: '2026-04-01', recurso: 'Sofía Barboza',    orden: 'OS-001', tipoLabor: 'Desarrollo / Frontend', horas: 6,   cobrable: true  },
  { id: 20, fecha: '2026-04-01', recurso: 'Armando Núñez',    orden: 'OS-002', tipoLabor: 'Reuniones',             horas: 1,   cobrable: false },
]

// RQF-038 — Avance de OS
const AVANCE_DATA = [
  { codigo: 'OS-001', nombre: 'Plataforma e-commerce',        cliente: 'Empresa ABC', tipo: 'Proyecto',   estado: 'En progreso', horasEst: 480, horasReal: 312, progreso: 65, fechaEst: '2026-06-30', fechaReal: '—',        enTiempo: true  },
  { codigo: 'OS-002', nombre: 'Mantenimiento módulo fact.',   cliente: 'Empresa XYZ', tipo: 'Soporte',    estado: 'Abierta',     horasEst: 40,  horasReal: 7,   progreso: 10, fechaEst: '2026-03-31', fechaReal: '—',        enTiempo: false },
  { codigo: 'OS-003', nombre: 'Incremento módulo reportes',   cliente: 'Empresa DEF', tipo: 'Incremento', estado: 'En progreso', horasEst: 120, horasReal: 48,  progreso: 40, fechaEst: '2026-04-30', fechaReal: '—',        enTiempo: true  },
  { codigo: 'OS-004', nombre: 'Incidencia crítica prod.',     cliente: 'Empresa GHI', tipo: 'Soporte',    estado: 'Cerrada',     horasEst: 10,  horasReal: 9,   progreso: 100,fechaEst: '2026-01-15', fechaReal: '2026-01-15',enTiempo: true  },
  { codigo: 'OS-005', nombre: 'App móvil gestión interna',    cliente: 'Empresa ABC', tipo: 'Proyecto',   estado: 'Abierta',     horasEst: 600, horasReal: 30,  progreso: 5,  fechaEst: '2026-12-31', fechaReal: '—',        enTiempo: true  },
]

// RQF-039 — Soporte
const SOPORTE_DATA = [
  { codigo: 'SS-001', cliente: 'Empresa ABC', contacto: 'Juan Pérez',     subtipo: 'Incidencia de sistema', estado: 'En revisión', fecha: '2026-04-10', responsable: 'Sofía Barboza',  diasRes: null },
  { codigo: 'SS-002', cliente: 'Empresa ABC', contacto: 'María González', subtipo: 'Requerimiento',         estado: 'Pendiente',   fecha: '2026-04-12', responsable: null,             diasRes: null },
  { codigo: 'SS-003', cliente: 'Empresa XYZ', contacto: 'Carlos Vargas',  subtipo: 'Incidencia de sistema', estado: 'Convertida',  fecha: '2026-04-05', responsable: 'Armando Núñez', diasRes: 3    },
  { codigo: 'SS-004', cliente: 'Empresa ABC', contacto: 'Juan Pérez',     subtipo: 'Consulta',              estado: 'Resuelta',    fecha: '2026-03-28', responsable: 'Mildred Bonilla',diasRes: 1    },
  { codigo: 'SS-005', cliente: 'Empresa DEF', contacto: 'Andrea Solano',  subtipo: 'Incidencia de sistema', estado: 'Pendiente',   fecha: '2026-04-17', responsable: null,             diasRes: null },
  { codigo: 'SS-006', cliente: 'Empresa XYZ', contacto: 'Carlos Vargas',  subtipo: 'Mantenimiento',         estado: 'Resuelta',    fecha: '2026-03-20', responsable: 'Armando Núñez', diasRes: 2    },
  { codigo: 'SS-007', cliente: 'Empresa GHI', contacto: 'Luis Torres',    subtipo: 'Capa 8',                estado: 'Resuelta',    fecha: '2026-03-15', responsable: 'Laura Campos',  diasRes: 1    },
]

// RQF-040 — Movimiento de recursos
const MOVIMIENTO_DATA = [
  { recurso: 'Sofía Barboza',   dpto: 'Desarrollo', subdepto: 'Mobile',    ingreso: '2025-09-01', salida: null,         activo: true  },
  { recurso: 'Sofía Barboza',   dpto: 'Desarrollo', subdepto: 'Frontend',  ingreso: '2024-01-15', salida: '2025-08-31', activo: false },
  { recurso: 'Mildred Bonilla', dpto: 'Desarrollo', subdepto: 'Backend',   ingreso: '2023-06-01', salida: null,         activo: true  },
  { recurso: 'Armando Núñez',   dpto: 'Soporte',    subdepto: 'Nivel 2',   ingreso: '2025-01-10', salida: null,         activo: true  },
  { recurso: 'Armando Núñez',   dpto: 'Soporte',    subdepto: 'Nivel 1',   ingreso: '2024-03-01', salida: '2025-01-09', activo: false },
  { recurso: 'Matías Vargas',   dpto: 'QA',         subdepto: 'Automatización', ingreso: '2025-06-01', salida: null,     activo: true  },
  { recurso: 'Matías Vargas',   dpto: 'QA',         subdepto: 'Funcional', ingreso: '2023-09-15', salida: '2025-05-31', activo: false },
  { recurso: 'Laura Campos',    dpto: 'Diseño',     subdepto: 'UX',        ingreso: '2024-07-01', salida: null,         activo: true  },
  { recurso: 'Diego Herrera',   dpto: 'Desarrollo', subdepto: 'Backend',   ingreso: '2024-11-15', salida: null,         activo: true  },
]

// RQF-041 — Solicitudes de incremento de tiempo
const INCREMENTO_DATA = [
  { id: 1, orden: 'OS-001', recurso: 'Sofía Barboza',   horasSol: 10, motivo: 'Cambios en requerimientos del cliente',         estado: 'Aprobada',  fecha: '2026-03-15' },
  { id: 2, orden: 'OS-001', recurso: 'Mildred Bonilla', horasSol: 15, motivo: 'Deuda técnica identificada en code review',     estado: 'Aprobada',  fecha: '2026-03-20' },
  { id: 3, orden: 'OS-003', recurso: 'Diego Herrera',   horasSol: 8,  motivo: 'Ambigüedad en especificación inicial',          estado: 'Rechazada', fecha: '2026-03-10' },
  { id: 4, orden: 'OS-002', recurso: 'Armando Núñez',   horasSol: 5,  motivo: 'Complejidad mayor a la estimada inicialmente',  estado: 'Aprobada',  fecha: '2026-04-02' },
  { id: 5, orden: 'OS-005', recurso: 'Laura Campos',    horasSol: 12, motivo: 'Revisiones adicionales solicitadas por cliente', estado: 'Pendiente', fecha: '2026-04-14' },
  { id: 6, orden: 'OS-001', recurso: 'Matías Vargas',   horasSol: 6,  motivo: 'Scope creep en módulo de pagos',                estado: 'Rechazada', fecha: '2026-02-28' },
  { id: 7, orden: 'OS-003', recurso: 'Mildred Bonilla', horasSol: 10, motivo: 'Integración externa más compleja de lo previsto', estado: 'Aprobada', fecha: '2026-04-05' },
]

// RQF-042 — Productividad
const PRODUCTIVIDAD_DATA = [
  { recurso: 'Sofía Barboza',   dpto: 'Desarrollo', horasEst: 160, horasReg: 142, tareas: 12 },
  { recurso: 'Mildred Bonilla', dpto: 'Desarrollo', horasEst: 160, horasReg: 175, tareas: 9  },
  { recurso: 'Diego Herrera',   dpto: 'Desarrollo', horasEst: 150, horasReg: 138, tareas: 11 },
  { recurso: 'Armando Núñez',   dpto: 'Soporte',    horasEst: 120, horasReg: 95,  tareas: 18 },
  { recurso: 'Matías Vargas',   dpto: 'QA',         horasEst: 130, horasReg: 122, tareas: 15 },
  { recurso: 'Laura Campos',    dpto: 'Diseño',     horasEst: 140, horasReg: 148, tareas: 8  },
]

const PRODUCTIVIDAD_DPTO = [
  { dpto: 'Desarrollo', horasEst: 470, horasReg: 455, recursos: 3 },
  { dpto: 'Soporte',    horasEst: 120, horasReg: 95,  recursos: 1 },
  { dpto: 'QA',         horasEst: 130, horasReg: 122, recursos: 1 },
  { dpto: 'Diseño',     horasEst: 140, horasReg: 148, recursos: 1 },
]

// RQF-043 — Facturable vs No facturable
const FACTURABLE_DATA = [
  { orden: 'OS-001', cliente: 'Empresa ABC', tipo: 'Proyecto',   horasFact: 280, horasNFact: 32 },
  { orden: 'OS-002', cliente: 'Empresa XYZ', tipo: 'Soporte',    horasFact: 7,   horasNFact: 0  },
  { orden: 'OS-003', cliente: 'Empresa DEF', tipo: 'Incremento', horasFact: 0,   horasNFact: 48 },
  { orden: 'OS-004', cliente: 'Empresa GHI', tipo: 'Soporte',    horasFact: 0,   horasNFact: 9  },
  { orden: 'OS-005', cliente: 'Empresa ABC', tipo: 'Proyecto',   horasFact: 25,  horasNFact: 5  },
]

// RQF-044 — OS por cliente
const OS_CLIENTE_DATA = [
  { codigo: 'OS-001', nombre: 'Plataforma e-commerce',      cliente: 'Empresa ABC', tipo: 'Proyecto',   estado: 'En progreso', progreso: 65,  horasReg: 312 },
  { codigo: 'OS-005', nombre: 'App móvil gestión interna',  cliente: 'Empresa ABC', tipo: 'Proyecto',   estado: 'Abierta',     progreso: 5,   horasReg: 30  },
  { codigo: 'OS-002', nombre: 'Mantenimiento módulo fact.', cliente: 'Empresa XYZ', tipo: 'Soporte',    estado: 'Abierta',     progreso: 10,  horasReg: 7   },
  { codigo: 'OS-003', nombre: 'Incremento módulo reportes', cliente: 'Empresa DEF', tipo: 'Incremento', estado: 'En progreso', progreso: 40,  horasReg: 48  },
  { codigo: 'OS-004', nombre: 'Incidencia crítica prod.',   cliente: 'Empresa GHI', tipo: 'Soporte',    estado: 'Cerrada',     progreso: 100, horasReg: 9   },
]

// ═══════════════════════════════════════════════════════════════════
// COMPONENTES AUXILIARES
// ═══════════════════════════════════════════════════════════════════

const selectCls = 'px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white'
const inputCls  = 'px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'

const Badge = ({ children, color = 'slate' }) => {
  const map = {
    green:  'bg-green-100 text-green-700',
    red:    'bg-red-100 text-red-700',
    amber:  'bg-amber-100 text-amber-700',
    blue:   'bg-blue-100 text-blue-700',
    violet: 'bg-violet-100 text-violet-700',
    teal:   'bg-teal-100 text-teal-700',
    slate:  'bg-slate-100 text-slate-600',
    orange: 'bg-orange-100 text-orange-700',
  }
  return <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${map[color]}`}>{children}</span>
}

const MetricCard = ({ label, value, sub, color = 'slate' }) => {
  const map = { blue: 'text-blue-600', green: 'text-green-600', amber: 'text-amber-600', red: 'text-red-600', slate: 'text-slate-900', violet: 'text-violet-600' }
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <p className="text-xs text-slate-500 font-medium">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${map[color]}`}>{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
  )
}

const BarH = ({ value, max, color = 'bg-blue-500', h = 'h-2.5' }) => (
  <div className={`${h} bg-slate-100 rounded-full overflow-hidden w-full`}>
    <div className={`h-full ${color} rounded-full`} style={{ width: `${max > 0 ? Math.min((value / max) * 100, 100) : 0}%` }} />
  </div>
)

const BarComparativa = ({ est, real, maxVal }) => {
  const max = maxVal || Math.max(est, real, 1)
  const overBudget = real > est
  return (
    <div className="flex flex-col gap-1 min-w-[160px]">
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-slate-400 w-14 shrink-0">Estimado</span>
        <BarH value={est}  max={max} color="bg-blue-400" />
        <span className="text-xs text-slate-600 w-10 text-right font-medium">{est}h</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-slate-400 w-14 shrink-0">Real</span>
        <BarH value={real} max={max} color={overBudget ? 'bg-red-400' : 'bg-green-400'} />
        <span className={`text-xs w-10 text-right font-medium ${overBudget ? 'text-red-600' : 'text-green-600'}`}>{real}h</span>
      </div>
    </div>
  )
}

const BarStacked = ({ a, b, labelA, labelB }) => {
  const total = a + b
  const pct = total > 0 ? (a / total) * 100 : 0
  return (
    <div>
      <div className="h-5 w-full rounded-lg overflow-hidden flex">
        <div className="bg-blue-500 h-full transition-all" style={{ width: `${pct}%` }} />
        <div className="bg-slate-200 h-full flex-1" />
      </div>
      <div className="flex gap-4 mt-1.5">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-blue-500 shrink-0" />
          <span className="text-xs text-slate-600">{labelA}: <strong>{a}h</strong> ({pct.toFixed(0)}%)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-sm bg-slate-300 shrink-0" />
          <span className="text-xs text-slate-600">{labelB}: <strong>{b}h</strong> ({(100 - pct).toFixed(0)}%)</span>
        </div>
      </div>
    </div>
  )
}

const ReportHeader = ({ titulo, descripcion, onExport, exportado }) => (
  <div className="flex items-start justify-between gap-4 mb-5">
    <div>
      <h2 className="text-base font-semibold text-slate-900">{titulo}</h2>
      <p className="text-xs text-slate-500 mt-0.5">{descripcion}</p>
    </div>
    <div className="flex items-center gap-2 shrink-0">
      {exportado && (
        <span className="text-xs text-green-700 bg-green-100 px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
          <CheckCircle size={12} /> Exportado
        </span>
      )}
      <button
        onClick={onExport}
        className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-400 px-3 py-1.5 rounded-lg transition-colors"
      >
        <ArrowDown size={13} /> Exportar CSV
      </button>
    </div>
  </div>
)

const FiltroWrapper = ({ children }) => (
  <div className="flex flex-wrap gap-3 items-center bg-slate-50 border border-slate-200 rounded-xl p-3 mb-5">
    <FunnelSimple size={15} className="text-slate-400 shrink-0" />
    {children}
  </div>
)

const Th = ({ children, className = '' }) => (
  <th className={`text-left text-xs font-semibold text-slate-500 uppercase tracking-wide px-4 py-3 ${className}`}>{children}</th>
)
const Td = ({ children, className = '' }) => (
  <td className={`px-4 py-3 text-sm text-slate-700 ${className}`}>{children}</td>
)

const tipoClase = { Proyecto: 'violet', Incremento: 'teal', Soporte: 'orange' }
const estadoOSClase = { 'Abierta': 'amber', 'En progreso': 'blue', 'Cerrada': 'green' }
const estadoSSClase = { 'Pendiente': 'amber', 'En revisión': 'blue', 'Convertida': 'violet', 'Resuelta': 'green', 'Rechazada': 'red' }
const subtipoBadge = (s) => {
  if (s === 'Incidencia de sistema') return 'red'
  if (s === 'Mantenimiento') return 'blue'
  if (s === 'Capa 8') return 'amber'
  if (s === 'Requerimiento') return 'teal'
  return 'slate'
}

function useExport() {
  const [exportado, setExportado] = useState(false)
  const handleExport = () => { setExportado(true); setTimeout(() => setExportado(false), 2500) }
  return [exportado, handleExport]
}

// ═══════════════════════════════════════════════════════════════════
// RQF-037 — TIEMPOS TRABAJADOS
// ═══════════════════════════════════════════════════════════════════
function R037_Tiempos() {
  const [recurso, setRecurso] = useState('')
  const [orden, setOrden] = useState('')
  const [labor, setLabor] = useState('')
  const [desde, setDesde] = useState('')
  const [hasta, setHasta] = useState('')
  const [exportado, handleExport] = useExport()

  const datos = TIEMPOS_DATA.filter(d =>
    (!recurso || d.recurso === recurso) &&
    (!orden   || d.orden === orden)     &&
    (!labor   || d.tipoLabor === labor) &&
    (!desde   || d.fecha >= desde)      &&
    (!hasta   || d.fecha <= hasta)
  )

  const totalH   = datos.reduce((s, d) => s + d.horas, 0)
  const factH    = datos.filter(d => d.cobrable).reduce((s, d) => s + d.horas, 0)
  const nFactH   = totalH - factH

  return (
    <div>
      <ReportHeader titulo="Tiempos Trabajados" descripcion="Esfuerzo registrado por recurso, orden de servicio y tipo de labor" onExport={handleExport} exportado={exportado} />
      <FiltroWrapper>
        <select value={recurso} onChange={e => setRecurso(e.target.value)} className={`${selectCls} w-44`}>
          <option value="">Todos los recursos</option>
          {RECURSOS.map(r => <option key={r}>{r}</option>)}
        </select>
        <select value={orden} onChange={e => setOrden(e.target.value)} className={`${selectCls} w-32`}>
          <option value="">Todas las OS</option>
          {ORDENES.map(o => <option key={o}>{o}</option>)}
        </select>
        <select value={labor} onChange={e => setLabor(e.target.value)} className={`${selectCls} w-48`}>
          <option value="">Todos los tipos</option>
          {TIPOS_LABOR.map(t => <option key={t}>{t}</option>)}
        </select>
        <div className="flex items-center gap-2">
          <CalendarBlank size={14} className="text-slate-400" />
          <input type="date" value={desde} onChange={e => setDesde(e.target.value)} className={`${inputCls} w-36`} />
          <span className="text-slate-400 text-xs">–</span>
          <input type="date" value={hasta} onChange={e => setHasta(e.target.value)} className={`${inputCls} w-36`} />
        </div>
        {(recurso || orden || labor || desde || hasta) && (
          <button onClick={() => { setRecurso(''); setOrden(''); setLabor(''); setDesde(''); setHasta('') }}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium">Limpiar</button>
        )}
      </FiltroWrapper>

      <div className="grid grid-cols-3 gap-4 mb-5">
        <MetricCard label="Total de horas" value={`${totalH.toFixed(1)}h`} sub={`${datos.length} registros`} color="slate" />
        <MetricCard label="Horas facturables" value={`${factH.toFixed(1)}h`} sub={`${totalH > 0 ? ((factH / totalH) * 100).toFixed(0) : 0}% del total`} color="blue" />
        <MetricCard label="Horas no facturables" value={`${nFactH.toFixed(1)}h`} sub={`${totalH > 0 ? ((nFactH / totalH) * 100).toFixed(0) : 0}% del total`} color="amber" />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr><Th>Fecha</Th><Th>Recurso</Th><Th>OS</Th><Th>Tipo de labor</Th><Th className="text-right">Horas</Th><Th>Cobrable</Th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {datos.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-400">Sin registros con los filtros aplicados</td></tr>
            ) : datos.map(d => (
              <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                <Td>{d.fecha}</Td>
                <Td className="font-medium text-slate-900">{d.recurso}</Td>
                <Td><Badge color="violet">{d.orden}</Badge></Td>
                <Td>{d.tipoLabor}</Td>
                <Td className="text-right font-semibold text-slate-900">{d.horas}h</Td>
                <Td>{d.cobrable ? <Badge color="green">Sí</Badge> : <Badge color="slate">No</Badge>}</Td>
              </tr>
            ))}
          </tbody>
          {datos.length > 0 && (
            <tfoot className="bg-slate-50 border-t border-slate-200">
              <tr>
                <td colSpan={4} className="px-4 py-2.5 text-xs font-semibold text-slate-500">TOTAL — {datos.length} registros</td>
                <td className="px-4 py-2.5 text-sm font-bold text-slate-900 text-right">{totalH.toFixed(1)}h</td>
                <td />
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// RQF-038 — AVANCE DE ÓRDENES DE SERVICIO
// ═══════════════════════════════════════════════════════════════════
function R038_AvanceOS() {
  const [filtroCliente, setFiltroCliente] = useState('')
  const [filtroEstado,  setFiltroEstado]  = useState('')
  const [exportado, handleExport] = useExport()

  const datos = AVANCE_DATA.filter(d =>
    (!filtroCliente || d.cliente === filtroCliente) &&
    (!filtroEstado  || d.estado === filtroEstado)
  )

  const enTiempo   = datos.filter(d => d.enTiempo).length
  const atrasadas  = datos.filter(d => !d.enTiempo).length
  const avgProgreso = datos.length > 0 ? (datos.reduce((s, d) => s + d.progreso, 0) / datos.length).toFixed(0) : 0
  const maxHoras = Math.max(...datos.map(d => Math.max(d.horasEst, d.horasReal)), 1)

  return (
    <div>
      <ReportHeader titulo="Avance de Órdenes de Servicio" descripcion="Comparativa de tiempo estimado vs real y cumplimiento de fechas" onExport={handleExport} exportado={exportado} />
      <FiltroWrapper>
        <select value={filtroCliente} onChange={e => setFiltroCliente(e.target.value)} className={`${selectCls} w-40`}>
          <option value="">Todos los clientes</option>
          {CLIENTES.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)} className={`${selectCls} w-36`}>
          <option value="">Todos los estados</option>
          {['Abierta', 'En progreso', 'Cerrada'].map(e => <option key={e}>{e}</option>)}
        </select>
        {(filtroCliente || filtroEstado) && (
          <button onClick={() => { setFiltroCliente(''); setFiltroEstado('') }} className="text-xs text-blue-600 hover:text-blue-800 font-medium">Limpiar</button>
        )}
      </FiltroWrapper>

      <div className="grid grid-cols-3 gap-4 mb-5">
        <MetricCard label="En tiempo / dentro de fecha" value={enTiempo} sub="órdenes dentro del plazo" color="green" />
        <MetricCard label="Con desviación" value={atrasadas} sub="requieren atención" color={atrasadas > 0 ? 'red' : 'slate'} />
        <MetricCard label="Progreso promedio" value={`${avgProgreso}%`} sub="avance del portafolio" color="blue" />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-x-auto">
        <table className="w-full min-w-[720px]">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr><Th>OS</Th><Th>Nombre</Th><Th>Cliente</Th><Th>Estado</Th><Th>Horas Est. vs Real</Th><Th>Progreso</Th><Th>Fecha límite</Th><Th>Desviación</Th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {datos.length === 0 ? (
              <tr><td colSpan={8} className="px-4 py-10 text-center text-sm text-slate-400">Sin órdenes con los filtros aplicados</td></tr>
            ) : datos.map(d => {
              const desvH  = d.horasReal - d.horasEst
              const pctDev = d.horasEst > 0 ? ((desvH / d.horasEst) * 100).toFixed(0) : 0
              return (
                <tr key={d.codigo} className="hover:bg-slate-50 transition-colors">
                  <Td><Badge color="violet">{d.codigo}</Badge></Td>
                  <Td className="font-medium text-slate-900 max-w-[180px] truncate">{d.nombre}</Td>
                  <Td>{d.cliente}</Td>
                  <Td><Badge color={estadoOSClase[d.estado]}>{d.estado}</Badge></Td>
                  <Td className="min-w-[200px]"><BarComparativa est={d.horasEst} real={d.horasReal} maxVal={maxHoras} /></Td>
                  <Td>
                    <div className="flex items-center gap-2">
                      <BarH value={d.progreso} max={100} color="bg-blue-500" h="h-2" />
                      <span className="text-xs font-medium text-slate-700 w-8 shrink-0">{d.progreso}%</span>
                    </div>
                  </Td>
                  <Td>{d.fechaEst}</Td>
                  <Td>
                    {desvH > 0
                      ? <span className="flex items-center gap-1 text-xs text-red-600 font-medium"><CaretUp size={12} />+{desvH}h ({pctDev}%)</span>
                      : desvH < 0
                        ? <span className="flex items-center gap-1 text-xs text-green-600 font-medium"><CaretDown size={12} />{desvH}h ({pctDev}%)</span>
                        : <span className="text-xs text-slate-400">—</span>
                    }
                  </Td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// RQF-039 — REPORTE DE SOPORTE
// ═══════════════════════════════════════════════════════════════════
function R039_Soporte() {
  const [filtroCliente,  setFiltroCliente]  = useState('')
  const [filtroSubtipo,  setFiltroSubtipo]  = useState('')
  const [filtroEstado,   setFiltroEstado]   = useState('')
  const [exportado, handleExport] = useExport()

  const datos = SOPORTE_DATA.filter(d =>
    (!filtroCliente || d.cliente === filtroCliente) &&
    (!filtroSubtipo || d.subtipo === filtroSubtipo) &&
    (!filtroEstado  || d.estado  === filtroEstado)
  )

  const subtiposDistrib = ['Incidencia de sistema', 'Mantenimiento', 'Capa 8', 'Requerimiento', 'Consulta'].map(s => ({
    nombre: s, count: datos.filter(d => d.subtipo === s).length,
  })).filter(x => x.count > 0)

  const maxCount = Math.max(...subtiposDistrib.map(x => x.count), 1)
  const resueltas = datos.filter(d => d.estado === 'Resuelta' || d.estado === 'Convertida').length
  const avgDias = datos.filter(d => d.diasRes).reduce((s, d, _, a) => s + d.diasRes / a.length, 0).toFixed(1)

  return (
    <div>
      <ReportHeader titulo="Reporte de Soporte" descripcion="Estadísticas de solicitudes de soporte por cliente, subtipo y estado" onExport={handleExport} exportado={exportado} />
      <FiltroWrapper>
        <select value={filtroCliente} onChange={e => setFiltroCliente(e.target.value)} className={`${selectCls} w-40`}>
          <option value="">Todos los clientes</option>
          {CLIENTES.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={filtroSubtipo} onChange={e => setFiltroSubtipo(e.target.value)} className={`${selectCls} w-48`}>
          <option value="">Todos los subtipos</option>
          {['Incidencia de sistema', 'Mantenimiento', 'Capa 8', 'Requerimiento', 'Consulta'].map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)} className={`${selectCls} w-40`}>
          <option value="">Todos los estados</option>
          {['Pendiente', 'En revisión', 'Convertida', 'Resuelta'].map(e => <option key={e}>{e}</option>)}
        </select>
        {(filtroCliente || filtroSubtipo || filtroEstado) && (
          <button onClick={() => { setFiltroCliente(''); setFiltroSubtipo(''); setFiltroEstado('') }} className="text-xs text-blue-600 hover:text-blue-800 font-medium">Limpiar</button>
        )}
      </FiltroWrapper>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <MetricCard label="Total solicitudes" value={datos.length} color="slate" />
        <MetricCard label="Resueltas / Convertidas" value={resueltas} sub={`${datos.length > 0 ? ((resueltas/datos.length)*100).toFixed(0) : 0}% de resolución`} color="green" />
        <MetricCard label="Pendientes" value={datos.filter(d => d.estado === 'Pendiente').length} color="amber" />
        <MetricCard label="Días prom. resolución" value={avgDias === '0.0' ? '—' : `${avgDias}d`} color="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <p className="text-xs font-semibold text-slate-500 mb-3">Distribución por subtipo</p>
          <div className="flex flex-col gap-2">
            {subtiposDistrib.length === 0
              ? <p className="text-xs text-slate-400">Sin datos</p>
              : subtiposDistrib.map(s => (
                  <div key={s.nombre} className="flex items-center gap-2">
                    <span className="text-xs text-slate-600 w-36 shrink-0">{s.nombre}</span>
                    <BarH value={s.count} max={maxCount} color="bg-blue-500" h="h-3" />
                    <span className="text-xs font-semibold text-slate-800 w-4 shrink-0">{s.count}</span>
                  </div>
                ))
            }
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr><Th>Código</Th><Th>Cliente</Th><Th>Subtipo</Th><Th>Estado</Th><Th>Fecha</Th><Th>Responsable</Th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {datos.length === 0
                ? <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-400">Sin registros</td></tr>
                : datos.map(d => (
                    <tr key={d.codigo} className="hover:bg-slate-50 transition-colors">
                      <Td className="font-semibold text-slate-800">{d.codigo}</Td>
                      <Td>{d.cliente}</Td>
                      <Td><Badge color={subtipoBadge(d.subtipo)}>{d.subtipo}</Badge></Td>
                      <Td><Badge color={estadoSSClase[d.estado]}>{d.estado}</Badge></Td>
                      <Td>{d.fecha}</Td>
                      <Td>{d.responsable || <span className="text-slate-400">Sin asignar</span>}</Td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// RQF-040 — MOVIMIENTO DE RECURSOS
// ═══════════════════════════════════════════════════════════════════
function R040_Movimiento() {
  const [filtroRecurso, setFiltroRecurso] = useState('')
  const [filtroDpto,    setFiltroDpto]    = useState('')
  const [filtroActivo,  setFiltroActivo]  = useState('')
  const [exportado, handleExport] = useExport()

  const datos = MOVIMIENTO_DATA.filter(d =>
    (!filtroRecurso || d.recurso === filtroRecurso) &&
    (!filtroDpto    || d.dpto === filtroDpto)       &&
    (filtroActivo === '' || (filtroActivo === '1' ? d.activo : !d.activo))
  )

  const duracion = (ing, sal) => {
    if (!sal) return '—'
    const d1 = new Date(ing), d2 = new Date(sal)
    const meses = Math.round((d2 - d1) / (1000 * 60 * 60 * 24 * 30))
    return `${meses} mes${meses !== 1 ? 'es' : ''}`
  }

  return (
    <div>
      <ReportHeader titulo="Movimiento de Recursos" descripcion="Historial de pertenencia de recursos a subdepartamentos" onExport={handleExport} exportado={exportado} />
      <FiltroWrapper>
        <select value={filtroRecurso} onChange={e => setFiltroRecurso(e.target.value)} className={`${selectCls} w-44`}>
          <option value="">Todos los recursos</option>
          {RECURSOS.map(r => <option key={r}>{r}</option>)}
        </select>
        <select value={filtroDpto} onChange={e => setFiltroDpto(e.target.value)} className={`${selectCls} w-36`}>
          <option value="">Todos los dpto.</option>
          {['Desarrollo', 'Soporte', 'QA', 'Diseño'].map(d => <option key={d}>{d}</option>)}
        </select>
        <select value={filtroActivo} onChange={e => setFiltroActivo(e.target.value)} className={`${selectCls} w-36`}>
          <option value="">Todos</option>
          <option value="1">Solo activos</option>
          <option value="0">Solo históricos</option>
        </select>
        {(filtroRecurso || filtroDpto || filtroActivo) && (
          <button onClick={() => { setFiltroRecurso(''); setFiltroDpto(''); setFiltroActivo('') }} className="text-xs text-blue-600 hover:text-blue-800 font-medium">Limpiar</button>
        )}
      </FiltroWrapper>

      <div className="grid grid-cols-3 gap-4 mb-5">
        <MetricCard label="Registros totales" value={datos.length} color="slate" />
        <MetricCard label="Asignaciones activas" value={datos.filter(d => d.activo).length} color="green" />
        <MetricCard label="Historial (finalizadas)" value={datos.filter(d => !d.activo).length} color="slate" />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr><Th>Recurso</Th><Th>Departamento</Th><Th>Subdepartamento</Th><Th>Fecha ingreso</Th><Th>Fecha salida</Th><Th>Duración</Th><Th>Estado</Th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {datos.length === 0
              ? <tr><td colSpan={7} className="px-4 py-10 text-center text-sm text-slate-400">Sin registros</td></tr>
              : datos.map((d, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <Td className="font-medium text-slate-900">{d.recurso}</Td>
                    <Td><Badge color="blue">{d.dpto}</Badge></Td>
                    <Td>{d.subdepto}</Td>
                    <Td>{d.ingreso}</Td>
                    <Td>{d.salida || <span className="text-slate-400">Actual</span>}</Td>
                    <Td>{duracion(d.ingreso, d.salida)}</Td>
                    <Td>{d.activo ? <Badge color="green">Activo</Badge> : <Badge color="slate">Finalizado</Badge>}</Td>
                  </tr>
                ))
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// RQF-041 — SOLICITUDES DE INCREMENTO DE TIEMPO
// ═══════════════════════════════════════════════════════════════════
function R041_Incrementos() {
  const [filtroOrden,   setFiltroOrden]   = useState('')
  const [filtroRecurso, setFiltroRecurso] = useState('')
  const [filtroEstado,  setFiltroEstado]  = useState('')
  const [exportado, handleExport] = useExport()

  const datos = INCREMENTO_DATA.filter(d =>
    (!filtroOrden   || d.orden === filtroOrden)     &&
    (!filtroRecurso || d.recurso === filtroRecurso) &&
    (!filtroEstado  || d.estado === filtroEstado)
  )

  const aprobadas  = datos.filter(d => d.estado === 'Aprobada').length
  const rechazadas = datos.filter(d => d.estado === 'Rechazada').length
  const tasaAprob  = datos.length > 0 ? ((aprobadas / datos.length) * 100).toFixed(0) : 0
  const totalH     = datos.reduce((s, d) => s + d.horasSol, 0)

  return (
    <div>
      <ReportHeader titulo="Solicitudes de Incremento de Tiempo" descripcion="Análisis de solicitudes de ampliación de horas por orden y recurso" onExport={handleExport} exportado={exportado} />
      <FiltroWrapper>
        <select value={filtroOrden} onChange={e => setFiltroOrden(e.target.value)} className={`${selectCls} w-32`}>
          <option value="">Todas las OS</option>
          {ORDENES.map(o => <option key={o}>{o}</option>)}
        </select>
        <select value={filtroRecurso} onChange={e => setFiltroRecurso(e.target.value)} className={`${selectCls} w-44`}>
          <option value="">Todos los recursos</option>
          {RECURSOS.map(r => <option key={r}>{r}</option>)}
        </select>
        <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)} className={`${selectCls} w-36`}>
          <option value="">Todos los estados</option>
          {['Pendiente', 'Aprobada', 'Rechazada'].map(e => <option key={e}>{e}</option>)}
        </select>
        {(filtroOrden || filtroRecurso || filtroEstado) && (
          <button onClick={() => { setFiltroOrden(''); setFiltroRecurso(''); setFiltroEstado('') }} className="text-xs text-blue-600 hover:text-blue-800 font-medium">Limpiar</button>
        )}
      </FiltroWrapper>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <MetricCard label="Total solicitudes" value={datos.length} color="slate" />
        <MetricCard label="Aprobadas" value={aprobadas} sub={`${tasaAprob}% de aprobación`} color="green" />
        <MetricCard label="Rechazadas" value={rechazadas} color="red" />
        <MetricCard label="Horas solicitadas" value={`${totalH}h`} sub="en solicitudes filtradas" color="blue" />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr><Th>OS</Th><Th>Recurso</Th><Th className="text-right">Horas sol.</Th><Th>Motivo</Th><Th>Estado</Th><Th>Fecha</Th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {datos.length === 0
              ? <tr><td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-400">Sin registros</td></tr>
              : datos.map(d => (
                  <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                    <Td><Badge color="violet">{d.orden}</Badge></Td>
                    <Td className="font-medium text-slate-900">{d.recurso}</Td>
                    <Td className="text-right font-semibold text-slate-900">{d.horasSol}h</Td>
                    <Td className="max-w-[240px] text-slate-600">{d.motivo}</Td>
                    <Td>
                      {d.estado === 'Aprobada'  && <Badge color="green">Aprobada</Badge>}
                      {d.estado === 'Rechazada' && <Badge color="red">Rechazada</Badge>}
                      {d.estado === 'Pendiente' && <Badge color="amber">Pendiente</Badge>}
                    </Td>
                    <Td>{d.fecha}</Td>
                  </tr>
                ))
            }
          </tbody>
        </table>
      </div>

      {datos.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <p className="text-xs font-semibold text-slate-500 mb-3">Distribución por estado</p>
            {[{ label: 'Aprobadas', n: aprobadas, color: 'bg-green-500' }, { label: 'Rechazadas', n: rechazadas, color: 'bg-red-400' }, { label: 'Pendientes', n: datos.filter(d => d.estado === 'Pendiente').length, color: 'bg-amber-400' }]
              .filter(x => x.n > 0).map(x => (
                <div key={x.label} className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-slate-600 w-20 shrink-0">{x.label}</span>
                  <BarH value={x.n} max={datos.length} color={x.color} h="h-4" />
                  <span className="text-xs font-semibold text-slate-800 w-4 shrink-0">{x.n}</span>
                </div>
              ))
            }
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <Warning size={18} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-900">Tasa de aprobación: {tasaAprob}%</p>
              <p className="text-xs text-amber-700 mt-1">
                {+tasaAprob >= 70 ? 'Las estimaciones iniciales muestran precisión aceptable.' : 'Alta tasa de incrementos puede indicar problemas en la estimación inicial.'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// RQF-042 — PRODUCTIVIDAD POR RECURSO Y DEPARTAMENTO
// ═══════════════════════════════════════════════════════════════════
function R042_Productividad() {
  const [vistaTab, setVistaTab]  = useState('recurso')
  const [filtroDpto, setFiltroDpto] = useState('')
  const [exportado, handleExport] = useExport()

  const datos = vistaTab === 'recurso'
    ? PRODUCTIVIDAD_DATA.filter(d => !filtroDpto || d.dpto === filtroDpto)
    : PRODUCTIVIDAD_DPTO.filter(d => !filtroDpto || d.dpto === filtroDpto)

  const eficiencia = (r) => r.horasEst > 0 ? ((r.horasReg / r.horasEst) * 100).toFixed(0) : '—'
  const efColor = (e) => +e > 100 ? 'text-red-600' : +e >= 85 ? 'text-green-600' : 'text-amber-600'
  const barColor = (e) => +e > 100 ? 'bg-red-400' : +e >= 85 ? 'bg-green-500' : 'bg-amber-400'
  const maxHoras = Math.max(...datos.map(d => Math.max(d.horasEst, d.horasReg)), 1)

  return (
    <div>
      <ReportHeader titulo="Productividad por Recurso y Departamento" descripcion="Comparación de horas registradas vs estimadas por mes" onExport={handleExport} exportado={exportado} />

      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1">
          {[{ id: 'recurso', label: 'Por recurso' }, { id: 'dpto', label: 'Por departamento' }].map(t => (
            <button key={t.id} onClick={() => setVistaTab(t.id)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${vistaTab === t.id ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}>
              {t.label}
            </button>
          ))}
        </div>
        <select value={filtroDpto} onChange={e => setFiltroDpto(e.target.value)} className={`${selectCls} w-40`}>
          <option value="">Todos los dpto.</option>
          {['Desarrollo', 'Soporte', 'QA', 'Diseño'].map(d => <option key={d}>{d}</option>)}
        </select>
      </div>

      {/* Gráfico de barras */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 mb-5">
        <p className="text-xs font-semibold text-slate-500 mb-4">
          Horas estimadas vs registradas — {vistaTab === 'recurso' ? 'por recurso' : 'por departamento'}
        </p>
        <div className="flex flex-col gap-4">
          {datos.map((d, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-xs text-slate-700 w-36 shrink-0 truncate font-medium">{vistaTab === 'recurso' ? d.recurso.split(' ')[0] : d.dpto}</span>
              <div className="flex-1"><BarComparativa est={d.horasEst} real={d.horasReg} maxVal={maxHoras} /></div>
              <span className={`text-sm font-bold w-14 text-right shrink-0 ${efColor(eficiencia(d))}`}>{eficiencia(d)}%</span>
            </div>
          ))}
        </div>
        <div className="flex gap-5 mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-1.5"><div className="w-3 h-2 rounded-sm bg-blue-400" /><span className="text-xs text-slate-500">Estimado</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-2 rounded-sm bg-green-400" /><span className="text-xs text-slate-500">Real (eficiente)</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-2 rounded-sm bg-red-400" /><span className="text-xs text-slate-500">Real (sobre estimado)</span></div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <Th>{vistaTab === 'recurso' ? 'Recurso' : 'Departamento'}</Th>
              {vistaTab === 'recurso' && <Th>Departamento</Th>}
              <Th className="text-right">H. Estimadas</Th>
              <Th className="text-right">H. Registradas</Th>
              <Th className="text-right">Desviación</Th>
              <Th className="text-right">Eficiencia</Th>
              {vistaTab === 'dpto' && <Th className="text-right">Recursos</Th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {datos.map((d, i) => {
              const ef = eficiencia(d)
              const desv = d.horasReg - d.horasEst
              return (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <Td className="font-medium text-slate-900">{vistaTab === 'recurso' ? d.recurso : d.dpto}</Td>
                  {vistaTab === 'recurso' && <Td><Badge color="blue">{d.dpto}</Badge></Td>}
                  <Td className="text-right">{d.horasEst}h</Td>
                  <Td className="text-right">{d.horasReg}h</Td>
                  <Td className={`text-right font-medium ${desv > 0 ? 'text-red-600' : desv < 0 ? 'text-green-600' : 'text-slate-400'}`}>
                    {desv > 0 ? `+${desv}h` : desv < 0 ? `${desv}h` : '—'}
                  </Td>
                  <Td className="text-right">
                    <span className={`font-bold text-sm ${efColor(ef)}`}>{ef}%</span>
                  </Td>
                  {vistaTab === 'dpto' && <Td className="text-right">{d.recursos}</Td>}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// RQF-043 — TRABAJO FACTURABLE VS NO FACTURABLE
// ═══════════════════════════════════════════════════════════════════
function R043_Facturable() {
  const [filtroCliente, setFiltroCliente] = useState('')
  const [filtroOrden,   setFiltroOrden]   = useState('')
  const [exportado, handleExport] = useExport()

  const datos = FACTURABLE_DATA.filter(d =>
    (!filtroCliente || d.cliente === filtroCliente) &&
    (!filtroOrden   || d.orden === filtroOrden)
  )

  const totFact  = datos.reduce((s, d) => s + d.horasFact, 0)
  const totNFact = datos.reduce((s, d) => s + d.horasNFact, 0)
  const totTotal = totFact + totNFact
  const pctFact  = totTotal > 0 ? ((totFact / totTotal) * 100).toFixed(1) : 0

  return (
    <div>
      <ReportHeader titulo="Trabajo Facturable vs No Facturable" descripcion="Diferenciación de horas cobrables por cliente y orden de servicio" onExport={handleExport} exportado={exportado} />
      <FiltroWrapper>
        <select value={filtroCliente} onChange={e => setFiltroCliente(e.target.value)} className={`${selectCls} w-40`}>
          <option value="">Todos los clientes</option>
          {CLIENTES.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={filtroOrden} onChange={e => setFiltroOrden(e.target.value)} className={`${selectCls} w-32`}>
          <option value="">Todas las OS</option>
          {ORDENES.map(o => <option key={o}>{o}</option>)}
        </select>
        {(filtroCliente || filtroOrden) && (
          <button onClick={() => { setFiltroCliente(''); setFiltroOrden('') }} className="text-xs text-blue-600 hover:text-blue-800 font-medium">Limpiar</button>
        )}
      </FiltroWrapper>

      <div className="grid grid-cols-3 gap-4 mb-5">
        <MetricCard label="Total horas facturables"     value={`${totFact}h`}  sub={`${pctFact}% del total`} color="blue" />
        <MetricCard label="Total horas no facturables"  value={`${totNFact}h`} sub={`${(100 - +pctFact).toFixed(1)}% del total`} color="amber" />
        <MetricCard label="Total horas trabajadas"      value={`${totTotal}h`} color="slate" />
      </div>

      {totTotal > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 mb-5">
          <p className="text-xs font-semibold text-slate-500 mb-3">Distribución global — Facturable vs No facturable</p>
          <BarStacked a={totFact} b={totNFact} labelA="Facturable" labelB="No facturable" />
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr><Th>OS</Th><Th>Cliente</Th><Th>Tipo</Th><Th className="text-right">Fact.</Th><Th className="text-right">No Fact.</Th><Th className="text-right">Total</Th><Th>Distribución</Th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {datos.length === 0
              ? <tr><td colSpan={7} className="px-4 py-10 text-center text-sm text-slate-400">Sin registros</td></tr>
              : datos.map(d => {
                  const total = d.horasFact + d.horasNFact
                  return (
                    <tr key={d.orden} className="hover:bg-slate-50 transition-colors">
                      <Td><Badge color="violet">{d.orden}</Badge></Td>
                      <Td className="font-medium text-slate-900">{d.cliente}</Td>
                      <Td><Badge color={tipoClase[d.tipo]}>{d.tipo}</Badge></Td>
                      <Td className="text-right font-semibold text-blue-700">{d.horasFact}h</Td>
                      <Td className="text-right font-semibold text-amber-700">{d.horasNFact}h</Td>
                      <Td className="text-right font-bold text-slate-900">{total}h</Td>
                      <Td className="min-w-[140px]">
                        {total > 0 ? <BarStacked a={d.horasFact} b={d.horasNFact} labelA="" labelB="" /> : <span className="text-slate-400 text-xs">—</span>}
                      </Td>
                    </tr>
                  )
                })
            }
          </tbody>
          {datos.length > 0 && (
            <tfoot className="bg-slate-50 border-t border-slate-200">
              <tr>
                <td colSpan={3} className="px-4 py-2.5 text-xs font-semibold text-slate-500">TOTALES</td>
                <td className="px-4 py-2.5 text-sm font-bold text-blue-700 text-right">{totFact}h</td>
                <td className="px-4 py-2.5 text-sm font-bold text-amber-700 text-right">{totNFact}h</td>
                <td className="px-4 py-2.5 text-sm font-bold text-slate-900 text-right">{totTotal}h</td>
                <td />
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// RQF-044 — ÓRDENES POR CLIENTE
// ═══════════════════════════════════════════════════════════════════
function R044_PorCliente() {
  const [filtroCliente, setFiltroCliente] = useState('')
  const [filtroTipo,    setFiltroTipo]    = useState('')
  const [filtroEstado,  setFiltroEstado]  = useState('')
  const [exportado, handleExport] = useExport()

  const datos = OS_CLIENTE_DATA.filter(d =>
    (!filtroCliente || d.cliente === filtroCliente) &&
    (!filtroTipo    || d.tipo === filtroTipo)       &&
    (!filtroEstado  || d.estado === filtroEstado)
  )

  const clientes = [...new Set(datos.map(d => d.cliente))]
  const totalHoras = datos.reduce((s, d) => s + d.horasReg, 0)
  const avgProg = datos.length > 0 ? (datos.reduce((s, d) => s + d.progreso, 0) / datos.length).toFixed(0) : 0

  return (
    <div>
      <ReportHeader titulo="Órdenes de Servicio por Cliente" descripcion="Visión consolidada del portafolio de trabajo agrupado por organización" onExport={handleExport} exportado={exportado} />
      <FiltroWrapper>
        <select value={filtroCliente} onChange={e => setFiltroCliente(e.target.value)} className={`${selectCls} w-40`}>
          <option value="">Todos los clientes</option>
          {CLIENTES.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)} className={`${selectCls} w-36`}>
          <option value="">Todos los tipos</option>
          {['Proyecto', 'Incremento', 'Soporte'].map(t => <option key={t}>{t}</option>)}
        </select>
        <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)} className={`${selectCls} w-36`}>
          <option value="">Todos los estados</option>
          {['Abierta', 'En progreso', 'Cerrada'].map(e => <option key={e}>{e}</option>)}
        </select>
        {(filtroCliente || filtroTipo || filtroEstado) && (
          <button onClick={() => { setFiltroCliente(''); setFiltroTipo(''); setFiltroEstado('') }} className="text-xs text-blue-600 hover:text-blue-800 font-medium">Limpiar</button>
        )}
      </FiltroWrapper>

      <div className="grid grid-cols-3 gap-4 mb-5">
        <MetricCard label="Clientes activos" value={clientes.length} color="slate" />
        <MetricCard label="Órdenes totales" value={datos.length} color="blue" />
        <MetricCard label="Horas registradas" value={`${totalHoras}h`} sub={`Progreso promedio: ${avgProg}%`} color="violet" />
      </div>

      {datos.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 py-14 text-center">
          <p className="text-sm text-slate-400">Sin órdenes con los filtros aplicados</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {clientes.map(cliente => {
            const osCliente = datos.filter(d => d.cliente === cliente)
            const totalCli = osCliente.reduce((s, d) => s + d.horasReg, 0)
            const avgCliProg = (osCliente.reduce((s, d) => s + d.progreso, 0) / osCliente.length).toFixed(0)
            return (
              <div key={cliente} className="bg-white rounded-xl border border-slate-200">
                <div className="flex items-center justify-between px-5 py-3.5 bg-slate-50 border-b border-slate-200 rounded-t-xl">
                  <div className="flex items-center gap-3">
                    <Buildings size={16} className="text-slate-500" />
                    <span className="text-sm font-semibold text-slate-900">{cliente}</span>
                    <span className="text-xs text-slate-500">{osCliente.length} orden{osCliente.length !== 1 ? 'es' : ''}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-slate-500">{totalCli}h registradas</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">Avance gral.</span>
                      <div className="w-20">
                        <BarH value={+avgCliProg} max={100} color="bg-blue-500" h="h-2" />
                      </div>
                      <span className="text-xs font-semibold text-slate-700">{avgCliProg}%</span>
                    </div>
                  </div>
                </div>
                <div className="divide-y divide-slate-100">
                  {osCliente.map(os => (
                    <div key={os.codigo} className="flex items-center gap-4 px-5 py-3.5">
                      <Badge color="violet">{os.codigo}</Badge>
                      <p className="flex-1 text-sm text-slate-800 font-medium min-w-0 truncate">{os.nombre}</p>
                      <Badge color={tipoClase[os.tipo]}>{os.tipo}</Badge>
                      <Badge color={estadoOSClase[os.estado]}>{os.estado}</Badge>
                      <div className="flex items-center gap-2 w-36 shrink-0">
                        <BarH value={os.progreso} max={100} color={os.progreso === 100 ? 'bg-green-500' : 'bg-blue-500'} h="h-2" />
                        <span className="text-xs font-medium text-slate-700 w-8 shrink-0 text-right">{os.progreso}%</span>
                      </div>
                      <span className="text-xs text-slate-500 w-14 text-right shrink-0">{os.horasReg}h</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════
// COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════════════════

const REPORTES_NAV = [
  { id: 'tiempos',      label: 'Tiempos trabajados',         codigo: 'RQF-037', icon: Clock,        component: R037_Tiempos   },
  { id: 'avance',       label: 'Avance de OS',               codigo: 'RQF-038', icon: ChartLineUp,  component: R038_AvanceOS  },
  { id: 'soporte',      label: 'Reporte de soporte',         codigo: 'RQF-039', icon: Headset,      component: R039_Soporte   },
  { id: 'movimiento',   label: 'Movimiento de recursos',     codigo: 'RQF-040', icon: Users,        component: R040_Movimiento},
  { id: 'incrementos',  label: 'Incrementos de tiempo',      codigo: 'RQF-041', icon: ArrowUp,      component: R041_Incrementos},
  { id: 'productividad',label: 'Productividad',              codigo: 'RQF-042', icon: ChartBar,     component: R042_Productividad},
  { id: 'facturable',   label: 'Facturable vs No facturable',codigo: 'RQF-043', icon: Tag,          component: R043_Facturable},
  { id: 'porCliente',   label: 'OS por cliente',             codigo: 'RQF-044', icon: Buildings,    component: R044_PorCliente},
]

export default function Reportes() {
  const [reporteActivo, setReporteActivo] = useState('tiempos')

  const reporte = REPORTES_NAV.find(r => r.id === reporteActivo)
  const ComponenteActivo = reporte?.component

  return (
    <div className="flex flex-col gap-6">

      {/* Encabezado */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Reportes</h1>
        <p className="text-sm text-slate-500 mt-1">Métricas, estadísticas y análisis operativos del sistema</p>
      </div>

      <div className="flex gap-6 items-start">

        {/* Menú lateral */}
        <aside className="w-56 shrink-0">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            {REPORTES_NAV.map((r) => (
              <button
                key={r.id}
                onClick={() => setReporteActivo(r.id)}
                className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors border-b border-slate-100 last:border-0 ${
                  reporteActivo === r.id
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <r.icon size={16} className={`mt-0.5 shrink-0 ${reporteActivo === r.id ? 'text-blue-600' : 'text-slate-400'}`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm leading-tight ${reporteActivo === r.id ? 'font-semibold' : 'font-medium'}`}>{r.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{r.codigo}</p>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* Contenido del reporte */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            {ComponenteActivo && <ComponenteActivo />}
          </div>
        </div>

      </div>
    </div>
  )
}
