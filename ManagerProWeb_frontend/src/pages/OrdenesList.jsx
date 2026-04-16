import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  MagnifyingGlass,
  Plus,
  FolderOpen,
  ArrowRight,
  FunnelSimple,
} from '@phosphor-icons/react'

const ordenesSimuladas = [
  { id: 1, codigo: 'OS-001', nombre: 'Desarrollo plataforma e-commerce', cliente: 'Empresa ABC', tipo: 'Proyecto', subtipo: null, estado: 'En progreso', esCobrable: true, fechaInicio: '2026-01-15', fechaFin: '2026-06-30', progreso: 65, responsable: 'Sofía Barboza' },
  { id: 2, codigo: 'OS-002', nombre: 'Mantenimiento módulo facturación', cliente: 'Empresa XYZ', tipo: 'Soporte', subtipo: 'Mantenimiento', estado: 'Abierta', esCobrable: true, fechaInicio: '2026-03-01', fechaFin: '2026-03-31', progreso: 10, responsable: 'Armando Núñez' },
  { id: 3, codigo: 'OS-003', nombre: 'Incremento módulo de reportes', cliente: 'Empresa DEF', tipo: 'Incremento', subtipo: null, estado: 'En progreso', esCobrable: false, fechaInicio: '2026-02-01', fechaFin: '2026-04-30', progreso: 40, responsable: 'Mildred Bonilla' },
  { id: 4, codigo: 'OS-004', nombre: 'Incidencia crítica en producción', cliente: 'Empresa GHI', tipo: 'Soporte', subtipo: 'Incidencia de sistema', estado: 'Cerrada', esCobrable: false, fechaInicio: '2026-01-10', fechaFin: '2026-01-15', progreso: 100, responsable: 'Matías Vargas' },
  { id: 5, codigo: 'OS-005', nombre: 'App móvil de gestión interna', cliente: 'Empresa ABC', tipo: 'Proyecto', subtipo: null, estado: 'Abierta', esCobrable: true, fechaInicio: '2026-04-01', fechaFin: '2026-12-31', progreso: 5, responsable: 'Sofía Barboza' },
]

const estadoClase = {
  'Abierta':     'bg-amber-100 text-amber-700',
  'En progreso': 'bg-blue-100 text-blue-700',
  'Cerrada':     'bg-green-100 text-green-700',
}

const tipoClase = {
  'Proyecto':   'bg-violet-100 text-violet-700',
  'Incremento': 'bg-teal-100 text-teal-700',
  'Soporte':    'bg-orange-100 text-orange-700',
}

export default function OrdenesList() {
  const navigate = useNavigate()
  const [ordenes, setOrdenes] = useState(ordenesSimuladas)
  const [busqueda, setBusqueda] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('Todos')
  const [filtroTipo, setFiltroTipo] = useState('Todos')
  const [modalCrear, setModalCrear] = useState(false)
  const [form, setForm] = useState({ nombre: '', cliente: '', tipo: 'Proyecto', subtipo: '', responsable: '', fechaInicio: '', fechaFin: '', esCobrable: true })

  const ordenesFiltradas = ordenes.filter((o) => {
    const matchBusqueda = `${o.codigo} ${o.nombre} ${o.cliente}`.toLowerCase().includes(busqueda.toLowerCase())
    const matchEstado = filtroEstado === 'Todos' || o.estado === filtroEstado
    const matchTipo = filtroTipo === 'Todos' || o.tipo === filtroTipo
    return matchBusqueda && matchEstado && matchTipo
  })

  const crear = () => {
    if (!form.nombre || !form.cliente) return
    const nueva = {
      id: Date.now(),
      codigo: `OS-00${ordenes.length + 1}`,
      ...form,
      estado: 'Abierta',
      progreso: 0,
    }
    setOrdenes([...ordenes, nueva])
    setModalCrear(false)
    setForm({ nombre: '', cliente: '', tipo: 'Proyecto', subtipo: '', responsable: '', fechaInicio: '', fechaFin: '', esCobrable: true })
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Órdenes de servicio</h1>
          <p className="text-sm text-slate-500 mt-1">Gestión de proyectos, incrementos y soporte</p>
        </div>
        <button
          onClick={() => setModalCrear(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          <Plus size={16} />
          Nueva orden
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap gap-3 items-center">
        <FunnelSimple size={16} className="text-slate-400" />
        <div className="relative flex-1 min-w-48">
          <MagnifyingGlass size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por código, nombre o cliente..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}
          className="px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
          <option>Todos</option>
          <option>Abierta</option>
          <option>En progreso</option>
          <option>Cerrada</option>
        </select>
        <select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}
          className="px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
          <option>Todos</option>
          <option>Proyecto</option>
          <option>Incremento</option>
          <option>Soporte</option>
        </select>
      </div>

      {/* Lista */}
      <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
        {ordenesFiltradas.length === 0 ? (
          <div className="px-6 py-12 text-center text-slate-400 text-sm">No se encontraron órdenes.</div>
        ) : (
          ordenesFiltradas.map((o) => (
            <div
              key={o.id}
              onClick={() => navigate(`/ordenes/${o.id}`)}
              className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 cursor-pointer transition-colors"
            >
              {/* Ícono */}
              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                <FolderOpen size={18} className="text-blue-600" />
              </div>

              {/* Info principal */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-sm font-semibold text-slate-900">{o.codigo}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tipoClase[o.tipo]}`}>
                    {o.subtipo || o.tipo}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${estadoClase[o.estado]}`}>
                    {o.estado}
                  </span>
                  {!o.esCobrable && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">No cobrable</span>
                  )}
                </div>
                <p className="text-sm text-slate-700 truncate">{o.nombre}</p>
                <p className="text-xs text-slate-400">{o.cliente} · {o.responsable}</p>
              </div>

              {/* Fechas */}
              <div className="hidden lg:block text-xs text-slate-400 text-right shrink-0">
                <p>{o.fechaInicio}</p>
                <p>{o.fechaFin}</p>
              </div>

              {/* Progreso */}
              <div className="w-28 hidden sm:block shrink-0">
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-slate-400">Progreso</span>
                  <span className="text-xs font-medium text-slate-700">{o.progreso}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${o.progreso}%` }} />
                </div>
              </div>

              <ArrowRight size={16} className="text-slate-300 shrink-0" />
            </div>
          ))
        )}

        <div className="px-5 py-3">
          <p className="text-xs text-slate-400">{ordenesFiltradas.length} orden(es) encontrada(s)</p>
        </div>
      </div>

      {/* Modal crear */}
      {modalCrear && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
            <div className="px-6 py-5 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-900">Nueva orden de servicio</h2>
            </div>
            <div className="px-6 py-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-700">Nombre de la orden</label>
                <input type="text" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Ej: Desarrollo módulo de pagos" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-slate-700">Cliente</label>
                  <select value={form.cliente} onChange={(e) => setForm({ ...form, cliente: e.target.value })}
                    className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    <option value="">Seleccionar...</option>
                    <option>Empresa ABC</option>
                    <option>Empresa XYZ</option>
                    <option>Empresa DEF</option>
                    <option>Empresa GHI</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-slate-700">Responsable</label>
                  <select value={form.responsable} onChange={(e) => setForm({ ...form, responsable: e.target.value })}
                    className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    <option value="">Seleccionar...</option>
                    <option>Sofía Barboza</option>
                    <option>Armando Núñez</option>
                    <option>Mildred Bonilla</option>
                    <option>Matías Vargas</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-slate-700">Tipo</label>
                  <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value, subtipo: '' })}
                    className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    <option>Proyecto</option>
                    <option>Incremento</option>
                    <option>Soporte</option>
                  </select>
                </div>
                {form.tipo === 'Soporte' && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-slate-700">Subtipo</label>
                    <select value={form.subtipo} onChange={(e) => setForm({ ...form, subtipo: e.target.value })}
                      className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                      <option value="">Seleccionar...</option>
                      <option>Mantenimiento</option>
                      <option>Capa8</option>
                      <option>Incidencia de sistema</option>
                    </select>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-slate-700">Fecha inicio</label>
                  <input type="date" value={form.fechaInicio} onChange={(e) => setForm({ ...form, fechaInicio: e.target.value })}
                    className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-slate-700">Fecha fin estimada</label>
                  <input type="date" value={form.fechaFin} onChange={(e) => setForm({ ...form, fechaFin: e.target.value })}
                    className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="cobrable" checked={form.esCobrable}
                  onChange={(e) => setForm({ ...form, esCobrable: e.target.checked })}
                  className="w-4 h-4 accent-blue-600" />
                <label htmlFor="cobrable" className="text-sm text-slate-700">Es cobrable al cliente</label>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
              <button onClick={() => setModalCrear(false)} className="px-4 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-100 transition-colors">
                Cancelar
              </button>
              <button onClick={crear} className="px-4 py-2 rounded-lg text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors">
                Crear orden
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}