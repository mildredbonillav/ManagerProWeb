import { useState } from 'react'
import {
  Package,
  TreeStructure,
  GitBranch,
  Globe,
  FileText,
  Plus,
  PencilSimple,
  ToggleLeft,
  ToggleRight,
  MagnifyingGlass,
  X,
} from '@phosphor-icons/react'

// ── Datos simulados ──────────────────────────────────────────────────────────

const productosData = [
  { id: 1, nombre: 'ManagerPro', descripcion: 'Plataforma integral de gestión empresarial', estado: true },
  { id: 2, nombre: 'BillingApp', descripcion: 'Sistema de facturación electrónica', estado: true },
  { id: 3, nombre: 'HelpDesk', descripcion: 'Plataforma de soporte técnico y gestión de tickets', estado: false },
]

const rutasData = [
  { id: 1, productoId: 1, modulo: 'Dashboard', submodulo: 'Principal', accion: 'Ver resumen', estado: true },
  { id: 2, productoId: 1, modulo: 'Administración', submodulo: 'Usuarios', accion: 'Ver listado', estado: true },
  { id: 3, productoId: 1, modulo: 'Administración', submodulo: 'Usuarios', accion: 'Crear usuario', estado: true },
  { id: 4, productoId: 1, modulo: 'Administración', submodulo: 'Roles', accion: 'Asignar permisos', estado: true },
  { id: 5, productoId: 1, modulo: 'Operaciones', submodulo: 'Órdenes', accion: 'Ver órdenes', estado: true },
  { id: 6, productoId: 1, modulo: 'Operaciones', submodulo: 'Órdenes', accion: 'Crear orden', estado: false },
  { id: 7, productoId: 2, modulo: 'Facturación', submodulo: 'Facturas', accion: 'Emitir factura', estado: true },
  { id: 8, productoId: 2, modulo: 'Facturación', submodulo: 'Facturas', accion: 'Anular factura', estado: false },
  { id: 9, productoId: 2, modulo: 'Reportes', submodulo: 'Ventas', accion: 'Ver reporte mensual', estado: true },
]

const versionesData = [
  { id: 1, productoId: 1, nombre: 'v1.0.0', fechaLiberacion: '2024-01-15', estado: true },
  { id: 2, productoId: 1, nombre: 'v1.1.0', fechaLiberacion: '2024-03-20', estado: true },
  { id: 3, productoId: 1, nombre: 'v2.0.0', fechaLiberacion: '2024-09-01', estado: true },
  { id: 4, productoId: 2, nombre: 'v1.0.0', fechaLiberacion: '2024-02-10', estado: true },
  { id: 5, productoId: 2, nombre: 'v1.5.0', fechaLiberacion: '2024-07-15', estado: true },
]

const clientesData = [
  { id: 1, nombre: 'Empresa ABC S.A.' },
  { id: 2, nombre: 'Corporación XYZ Ltda.' },
  { id: 3, nombre: 'Grupo Industrial Norte' },
]

const tiposAmbienteData = [
  { id: 1, nombre: 'Desarrollo' },
  { id: 2, nombre: 'Testing' },
  { id: 3, nombre: 'Producción' },
  { id: 4, nombre: 'Staging' },
]

const ambientesData = [
  { id: 1, productoId: 1, versionId: 3, clienteId: 1, tipoAmbienteId: 3, url: 'https://managerpro.empresa-abc.com' },
  { id: 2, productoId: 1, versionId: 2, clienteId: 1, tipoAmbienteId: 2, url: 'https://test.managerpro.empresa-abc.com' },
  { id: 3, productoId: 1, versionId: 1, clienteId: 1, tipoAmbienteId: 1, url: 'https://dev.managerpro.empresa-abc.com' },
  { id: 4, productoId: 1, versionId: 3, clienteId: 2, tipoAmbienteId: 3, url: 'https://app.corp-xyz.net' },
  { id: 5, productoId: 2, versionId: 5, clienteId: 1, tipoAmbienteId: 3, url: 'https://billing.empresa-abc.com' },
]

const fichasData = [
  {
    id: 1, productoId: 1,
    lenguaje: 'JavaScript / TypeScript', framework: 'React 19 + Node.js',
    baseDatos: 'PostgreSQL 15', arquitectura: 'SPA + REST API',
    repositorio: 'https://github.com/org/managerpro',
    servidorApp: 'Nginx + PM2', servidorBD: 'AWS RDS',
    descripcionTecnica: 'Aplicación de gestión empresarial con arquitectura cliente-servidor. Frontend React con Vite y Tailwind CSS, backend Express.js con autenticación JWT.',
  },
  {
    id: 2, productoId: 2,
    lenguaje: 'Java', framework: 'Spring Boot 3.2',
    baseDatos: 'MySQL 8', arquitectura: 'Microservicios',
    repositorio: 'https://github.com/org/billingapp',
    servidorApp: 'Docker + Kubernetes', servidorBD: 'AWS Aurora',
    descripcionTecnica: 'Sistema de facturación basado en microservicios con integración a plataformas fiscales y SINPE.',
  },
]

const detallesData = [
  { id: 1, fichaId: 1, versionId: 1, descripcion: 'Primera versión estable', cambios: 'Dashboard, módulo de usuarios y roles, órdenes de servicio básicas', requisitos: 'Node.js 18+, PostgreSQL 14+', notas: 'Requiere migración manual de base de datos' },
  { id: 2, fichaId: 1, versionId: 2, descripcion: 'Mejoras de rendimiento y nuevas funciones', cambios: 'Boletas de tiempo, reportes básicos, optimización de consultas SQL', requisitos: 'Node.js 18+, PostgreSQL 15+', notas: 'Compatible con versiones anteriores' },
  { id: 3, fichaId: 1, versionId: 3, descripcion: 'Versión mayor con rediseño completo de la plataforma', cambios: 'Nuevo diseño UI, módulo de soporte, API pública, autenticación OAuth2', requisitos: 'Node.js 20+, PostgreSQL 15+', notas: 'Migración obligatoria desde v1.x — ver guía de actualización' },
  { id: 4, fichaId: 2, versionId: 4, descripcion: 'Versión inicial del sistema de facturación', cambios: 'Emisión de facturas, gestión de clientes, reportes básicos', requisitos: 'Java 17+, MySQL 8+', notas: 'Requiere certificado digital para emisión' },
]

const secciones = [
  { id: 'productos', label: 'Productos', icon: Package },
  { id: 'rutas', label: 'Rutas de Menú', icon: TreeStructure },
  { id: 'versiones', label: 'Versiones', icon: GitBranch },
  { id: 'ambientes', label: 'Ambientes', icon: Globe },
  { id: 'ficha', label: 'Ficha Técnica', icon: FileText },
]

// ── Componentes auxiliares ───────────────────────────────────────────────────

const Badge = ({ activo }) => (
  <span className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${activo ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
    {activo ? 'Activo' : 'Inactivo'}
  </span>
)

const BtnEditar = ({ onClick }) => (
  <button onClick={onClick} className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
    <PencilSimple size={15} />
  </button>
)

const BtnToggle = ({ activo, onClick }) => (
  <button onClick={onClick} className="p-2 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors">
    {activo ? <ToggleRight size={18} className="text-green-500" /> : <ToggleLeft size={18} />}
  </button>
)

const Campo = ({ label, children }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-medium text-slate-700">{label}</label>
    {children}
  </div>
)

const inputCls = 'px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
const selectCls = 'px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white'

const badgeTipoAmbiente = (nombre) => {
  if (nombre === 'Producción') return 'bg-green-100 text-green-700'
  if (nombre === 'Testing') return 'bg-amber-100 text-amber-700'
  if (nombre === 'Staging') return 'bg-violet-100 text-violet-700'
  return 'bg-slate-100 text-slate-600'
}

// ── Componente principal ─────────────────────────────────────────────────────

export default function Productos() {
  const [seccionActiva, setSeccionActiva] = useState('productos')

  const [productos, setProductos] = useState(productosData)
  const [rutas, setRutas] = useState(rutasData)
  const [versiones, setVersiones] = useState(versionesData)
  const [ambientes, setAmbientes] = useState(ambientesData)
  const [fichas, setFichas] = useState(fichasData)
  const [detalles, setDetalles] = useState(detallesData)

  const [prodRutas, setProdRutas] = useState('')
  const [prodVersiones, setProdVersiones] = useState('')
  const [prodAmbientes, setProdAmbientes] = useState('')
  const [prodFicha, setProdFicha] = useState('')

  const [searchProductos, setSearchProductos] = useState('')
  const [searchRutas, setSearchRutas] = useState('')

  const [modal, setModal] = useState({ abierto: false, tipo: '', editando: null })
  const [form, setForm] = useState({})

  const abrirModal = (tipo, editando = null) => {
    setModal({ abierto: true, tipo, editando })
    if (editando) {
      setForm({ ...editando })
    } else {
      const defaults = {
        producto: { nombre: '', descripcion: '', estado: true },
        ruta: { productoId: prodRutas || '', modulo: '', submodulo: '', accion: '', estado: true },
        version: { productoId: prodVersiones || '', nombre: '', fechaLiberacion: '', estado: true },
        ambiente: { productoId: prodAmbientes || '', versionId: '', clienteId: '', tipoAmbienteId: '', url: '' },
        ficha: { productoId: prodFicha || '', lenguaje: '', framework: '', baseDatos: '', arquitectura: '', repositorio: '', servidorApp: '', servidorBD: '', descripcionTecnica: '' },
        detalle: { fichaId: '', versionId: '', descripcion: '', cambios: '', requisitos: '', notas: '' },
      }
      setForm(defaults[tipo] || {})
    }
  }

  const cerrarModal = () => setModal({ abierto: false, tipo: '', editando: null })

  const guardar = () => {
    if (modal.tipo === 'producto') {
      if (modal.editando) setProductos(productos.map(p => p.id === modal.editando.id ? { ...p, ...form } : p))
      else setProductos([...productos, { id: Date.now(), estado: true, ...form }])
    }
    if (modal.tipo === 'ruta') {
      if (modal.editando) setRutas(rutas.map(r => r.id === modal.editando.id ? { ...r, ...form } : r))
      else setRutas([...rutas, { id: Date.now(), estado: true, ...form }])
    }
    if (modal.tipo === 'version') {
      if (modal.editando) setVersiones(versiones.map(v => v.id === modal.editando.id ? { ...v, ...form } : v))
      else setVersiones([...versiones, { id: Date.now(), estado: true, ...form }])
    }
    if (modal.tipo === 'ambiente') {
      if (modal.editando) setAmbientes(ambientes.map(a => a.id === modal.editando.id ? { ...a, ...form } : a))
      else setAmbientes([...ambientes, { id: Date.now(), ...form }])
    }
    if (modal.tipo === 'ficha') {
      if (modal.editando) setFichas(fichas.map(f => f.id === modal.editando.id ? { ...f, ...form } : f))
      else setFichas([...fichas, { id: Date.now(), ...form }])
    }
    if (modal.tipo === 'detalle') {
      if (modal.editando) setDetalles(detalles.map(d => d.id === modal.editando.id ? { ...d, ...form } : d))
      else setDetalles([...detalles, { id: Date.now(), ...form }])
    }
    cerrarModal()
  }

  const nombreProducto = (id) => productos.find(p => p.id === +id)?.nombre || '—'
  const nombreVersion = (id) => versiones.find(v => v.id === +id)?.nombre || '—'
  const nombreCliente = (id) => clientesData.find(c => c.id === +id)?.nombre || '—'
  const nombreTipoAmbiente = (id) => tiposAmbienteData.find(t => t.id === +id)?.nombre || '—'

  const productosFiltrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(searchProductos.toLowerCase()) ||
    p.descripcion.toLowerCase().includes(searchProductos.toLowerCase())
  )

  const rutasFiltradas = rutas.filter(r =>
    (!prodRutas || r.productoId === +prodRutas) &&
    [r.modulo, r.submodulo, r.accion].some(s => s.toLowerCase().includes(searchRutas.toLowerCase()))
  )

  const versionesFiltradas = versiones.filter(v => !prodVersiones || v.productoId === +prodVersiones)
  const ambientesFiltrados = ambientes.filter(a => !prodAmbientes || a.productoId === +prodAmbientes)

  const fichaActual = fichas.find(f => f.productoId === +prodFicha)
  const detallesFiltrados = fichaActual ? detalles.filter(d => d.fichaId === fichaActual.id) : []
  const versionesDelProductoFicha = versiones.filter(v => v.productoId === +prodFicha)
  const versionesModalAmbiente = versiones.filter(v => v.productoId === +form.productoId)

  return (
    <div className="flex flex-col gap-6">

      {/* Encabezado */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Gestión de Productos</h1>
        <p className="text-sm text-slate-500 mt-1">Administre productos, versiones, rutas de menú y fichas técnicas</p>
      </div>

      <div className="flex gap-6">

        {/* Menú lateral */}
        <div className="w-56 shrink-0">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            {secciones.map((s) => (
              <button
                key={s.id}
                onClick={() => setSeccionActiva(s.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors border-b border-slate-100 last:border-0 ${
                  seccionActiva === s.id
                    ? 'bg-blue-50 text-blue-600 font-medium'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <s.icon size={16} />
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Contenido */}
        <div className="flex-1 min-w-0">

          {/* ── Sección: Productos ─────────────────────────── */}
          {seccionActiva === 'productos' && (
            <div className="bg-white rounded-xl border border-slate-200">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 gap-4 flex-wrap">
                <h2 className="text-base font-semibold text-slate-900">Productos</h2>
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="relative">
                    <MagnifyingGlass size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Buscar producto..."
                      value={searchProductos}
                      onChange={e => setSearchProductos(e.target.value)}
                      className="pl-8 pr-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-52"
                    />
                  </div>
                  <button
                    onClick={() => abrirModal('producto')}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors whitespace-nowrap"
                  >
                    <Plus size={14} /> Nuevo producto
                  </button>
                </div>
              </div>
              <div className="divide-y divide-slate-100">
                {productosFiltrados.length === 0 && (
                  <p className="text-sm text-slate-400 text-center py-10">Sin resultados</p>
                )}
                {productosFiltrados.map(p => (
                  <div key={p.id} className="flex items-center gap-4 px-5 py-4">
                    <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                      <Package size={18} className="text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900">{p.nombre}</p>
                      <p className="text-xs text-slate-500 truncate">{p.descripcion}</p>
                    </div>
                    <Badge activo={p.estado} />
                    <div className="flex items-center gap-1">
                      <BtnEditar onClick={() => abrirModal('producto', p)} />
                      <BtnToggle activo={p.estado} onClick={() => setProductos(productos.map(x => x.id === p.id ? { ...x, estado: !x.estado } : x))} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Sección: Rutas de Menú ─────────────────────── */}
          {seccionActiva === 'rutas' && (
            <div className="bg-white rounded-xl border border-slate-200">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 gap-4 flex-wrap">
                <h2 className="text-base font-semibold text-slate-900">Catálogo de Rutas de Menú</h2>
                <div className="flex items-center gap-3 flex-wrap">
                  <select
                    value={prodRutas}
                    onChange={e => setProdRutas(e.target.value)}
                    className={`${selectCls} w-44`}
                  >
                    <option value="">Todos los productos</option>
                    {productos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                  </select>
                  <div className="relative">
                    <MagnifyingGlass size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Buscar ruta..."
                      value={searchRutas}
                      onChange={e => setSearchRutas(e.target.value)}
                      className="pl-8 pr-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-40"
                    />
                  </div>
                  <button
                    onClick={() => abrirModal('ruta')}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors whitespace-nowrap"
                  >
                    <Plus size={14} /> Nueva ruta
                  </button>
                </div>
              </div>
              <div className="divide-y divide-slate-100">
                {rutasFiltradas.length === 0 && (
                  <p className="text-sm text-slate-400 text-center py-10">Sin rutas registradas</p>
                )}
                {rutasFiltradas.map(r => (
                  <div key={r.id} className="flex items-center gap-4 px-5 py-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium shrink-0">{nombreProducto(r.productoId)}</span>
                        <span className="text-xs text-slate-400">·</span>
                        <span className="text-sm font-medium text-slate-800">{r.modulo}</span>
                        <span className="text-xs text-slate-400">/</span>
                        <span className="text-sm text-slate-700">{r.submodulo}</span>
                        <span className="text-xs text-slate-400">/</span>
                        <span className="text-sm text-slate-600">{r.accion}</span>
                      </div>
                    </div>
                    <Badge activo={r.estado} />
                    <div className="flex items-center gap-1">
                      <BtnEditar onClick={() => abrirModal('ruta', r)} />
                      <BtnToggle activo={r.estado} onClick={() => setRutas(rutas.map(x => x.id === r.id ? { ...x, estado: !x.estado } : x))} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Sección: Versiones ─────────────────────────── */}
          {seccionActiva === 'versiones' && (
            <div className="bg-white rounded-xl border border-slate-200">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 gap-4 flex-wrap">
                <h2 className="text-base font-semibold text-slate-900">Versiones de Producto</h2>
                <div className="flex items-center gap-3">
                  <select
                    value={prodVersiones}
                    onChange={e => setProdVersiones(e.target.value)}
                    className={`${selectCls} w-48`}
                  >
                    <option value="">Todos los productos</option>
                    {productos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                  </select>
                  <button
                    onClick={() => abrirModal('version')}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors whitespace-nowrap"
                  >
                    <Plus size={14} /> Nueva versión
                  </button>
                </div>
              </div>
              <div className="divide-y divide-slate-100">
                {versionesFiltradas.length === 0 && (
                  <p className="text-sm text-slate-400 text-center py-10">Sin versiones registradas</p>
                )}
                {versionesFiltradas.map(v => (
                  <div key={v.id} className="flex items-center gap-4 px-5 py-4">
                    <div className="w-9 h-9 rounded-lg bg-violet-100 flex items-center justify-center shrink-0">
                      <GitBranch size={18} className="text-violet-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-slate-900">{v.nombre}</p>
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{nombreProducto(v.productoId)}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">Liberación: {v.fechaLiberacion}</p>
                    </div>
                    <Badge activo={v.estado} />
                    <div className="flex items-center gap-1">
                      <BtnEditar onClick={() => abrirModal('version', v)} />
                      <BtnToggle activo={v.estado} onClick={() => setVersiones(versiones.map(x => x.id === v.id ? { ...x, estado: !x.estado } : x))} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Sección: Ambientes ─────────────────────────── */}
          {seccionActiva === 'ambientes' && (
            <div className="bg-white rounded-xl border border-slate-200">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 gap-4 flex-wrap">
                <h2 className="text-base font-semibold text-slate-900">Ambientes por Cliente</h2>
                <div className="flex items-center gap-3 flex-wrap">
                  <select
                    value={prodAmbientes}
                    onChange={e => setProdAmbientes(e.target.value)}
                    className={`${selectCls} w-48`}
                  >
                    <option value="">Todos los productos</option>
                    {productos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                  </select>
                  <button
                    onClick={() => abrirModal('ambiente')}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors whitespace-nowrap"
                  >
                    <Plus size={14} /> Nuevo ambiente
                  </button>
                </div>
              </div>
              <div className="divide-y divide-slate-100">
                {ambientesFiltrados.length === 0 && (
                  <p className="text-sm text-slate-400 text-center py-10">Sin ambientes configurados</p>
                )}
                {ambientesFiltrados.map(a => {
                  const tipoNombre = nombreTipoAmbiente(a.tipoAmbienteId)
                  return (
                    <div key={a.id} className="flex items-center gap-4 px-5 py-4">
                      <div className="w-9 h-9 rounded-lg bg-teal-100 flex items-center justify-center shrink-0">
                        <Globe size={18} className="text-teal-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-medium text-slate-900">{nombreCliente(a.clienteId)}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badgeTipoAmbiente(tipoNombre)}`}>
                            {tipoNombre}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 truncate mt-0.5">
                          {nombreProducto(a.productoId)} · {nombreVersion(a.versionId)} · <span className="font-mono">{a.url}</span>
                        </p>
                      </div>
                      <BtnEditar onClick={() => abrirModal('ambiente', a)} />
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* ── Sección: Ficha Técnica ─────────────────────── */}
          {seccionActiva === 'ficha' && (
            <div className="flex flex-col gap-4">

              {/* Selector de producto */}
              <div className="bg-white rounded-xl border border-slate-200 px-5 py-4 flex items-center gap-4">
                <FileText size={20} className="text-slate-400 shrink-0" />
                <div className="flex-1">
                  <label className="text-xs font-medium text-slate-700 block mb-1">Seleccionar producto</label>
                  <select
                    value={prodFicha}
                    onChange={e => setProdFicha(e.target.value)}
                    className={`${selectCls} w-full max-w-xs`}
                  >
                    <option value="">Seleccionar producto...</option>
                    {productos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                  </select>
                </div>
              </div>

              {!prodFicha && (
                <div className="bg-white rounded-xl border border-slate-200 px-5 py-16 text-center">
                  <FileText size={36} className="text-slate-200 mx-auto mb-3" />
                  <p className="text-sm text-slate-400">Seleccione un producto para ver o gestionar su ficha técnica.</p>
                </div>
              )}

              {prodFicha && (
                <>
                  {/* Información técnica general */}
                  <div className="bg-white rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                      <div>
                        <h2 className="text-base font-semibold text-slate-900">Información técnica general</h2>
                        <p className="text-xs text-slate-500 mt-0.5">{nombreProducto(prodFicha)}</p>
                      </div>
                      {fichaActual ? (
                        <button
                          onClick={() => abrirModal('ficha', fichaActual)}
                          className="flex items-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium px-3 py-2 rounded-lg transition-colors"
                        >
                          <PencilSimple size={14} /> Editar ficha
                        </button>
                      ) : (
                        <button
                          onClick={() => abrirModal('ficha')}
                          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors"
                        >
                          <Plus size={14} /> Crear ficha
                        </button>
                      )}
                    </div>

                    {fichaActual ? (
                      <div className="px-5 py-5">
                        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                          {[
                            ['Lenguaje(s)', fichaActual.lenguaje],
                            ['Framework', fichaActual.framework],
                            ['Base de datos', fichaActual.baseDatos],
                            ['Arquitectura', fichaActual.arquitectura],
                            ['Servidor de aplicación', fichaActual.servidorApp],
                            ['Servidor de BD', fichaActual.servidorBD],
                          ].map(([label, value]) => (
                            <div key={label}>
                              <p className="text-xs font-medium text-slate-500">{label}</p>
                              <p className="text-sm text-slate-900 mt-0.5">{value}</p>
                            </div>
                          ))}
                          <div className="col-span-2">
                            <p className="text-xs font-medium text-slate-500">Repositorio</p>
                            <p className="text-sm text-blue-600 font-mono mt-0.5 break-all">{fichaActual.repositorio}</p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-xs font-medium text-slate-500">Descripción técnica</p>
                            <p className="text-sm text-slate-700 mt-0.5">{fichaActual.descripcionTecnica}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="px-5 py-12 text-center">
                        <p className="text-sm text-slate-400">No hay ficha técnica registrada para este producto.</p>
                        <p className="text-xs text-slate-400 mt-1">Use el botón "Crear ficha" para registrarla.</p>
                      </div>
                    )}
                  </div>

                  {/* Detalle por versión */}
                  {fichaActual && (
                    <div className="bg-white rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                        <div>
                          <h2 className="text-base font-semibold text-slate-900">Detalle por versión</h2>
                          <p className="text-xs text-slate-500 mt-0.5">Historial de cambios y características por versión</p>
                        </div>
                        <button
                          onClick={() => {
                            setForm({ fichaId: fichaActual.id, versionId: '', descripcion: '', cambios: '', requisitos: '', notas: '' })
                            setModal({ abierto: true, tipo: 'detalle', editando: null })
                          }}
                          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors"
                        >
                          <Plus size={14} /> Agregar detalle
                        </button>
                      </div>
                      <div className="divide-y divide-slate-100">
                        {detallesFiltrados.length === 0 && (
                          <p className="text-sm text-slate-400 text-center py-10">Sin detalles por versión registrados</p>
                        )}
                        {detallesFiltrados.map(d => (
                          <div key={d.id} className="px-5 py-5">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs bg-violet-100 text-violet-700 px-2.5 py-1 rounded-full font-medium">
                                  {nombreVersion(d.versionId)}
                                </span>
                                <p className="text-sm font-medium text-slate-900">{d.descripcion}</p>
                              </div>
                              <BtnEditar onClick={() => abrirModal('detalle', d)} />
                            </div>
                            <div className="mt-3 flex flex-col gap-3">
                              <div>
                                <p className="text-xs font-medium text-slate-500">Cambios incluidos</p>
                                <p className="text-sm text-slate-700 mt-0.5">{d.cambios}</p>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-xs font-medium text-slate-500">Requisitos técnicos</p>
                                  <p className="text-sm text-slate-700 mt-0.5">{d.requisitos}</p>
                                </div>
                                <div>
                                  <p className="text-xs font-medium text-slate-500">Notas</p>
                                  <p className="text-sm text-slate-700 mt-0.5">{d.notas}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

        </div>
      </div>

      {/* ── Modal ─────────────────────────────────────────── */}
      {modal.abierto && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">

            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between shrink-0">
              <h2 className="text-lg font-semibold text-slate-900">
                {modal.editando ? 'Editar' : 'Nuevo'}{' '}
                {{
                  producto: 'producto',
                  ruta: 'ruta de menú',
                  version: 'versión',
                  ambiente: 'ambiente',
                  ficha: 'ficha técnica',
                  detalle: 'detalle de versión',
                }[modal.tipo]}
              </h2>
              <button onClick={cerrarModal} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="px-6 py-5 flex flex-col gap-4 overflow-y-auto">

              {/* Formulario: Producto */}
              {modal.tipo === 'producto' && (
                <>
                  <Campo label="Nombre">
                    <input type="text" value={form.nombre || ''} onChange={e => setForm({ ...form, nombre: e.target.value })}
                      className={inputCls} placeholder="Nombre del producto" />
                  </Campo>
                  <Campo label="Descripción">
                    <textarea value={form.descripcion || ''} onChange={e => setForm({ ...form, descripcion: e.target.value })}
                      className={`${inputCls} resize-none`} rows={3} placeholder="Descripción del producto" />
                  </Campo>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={form.estado !== false} onChange={e => setForm({ ...form, estado: e.target.checked })}
                      className="w-4 h-4 accent-blue-600" />
                    <span className="text-sm text-slate-700">Activo</span>
                  </label>
                </>
              )}

              {/* Formulario: Ruta de menú */}
              {modal.tipo === 'ruta' && (
                <>
                  <Campo label="Producto">
                    <select value={form.productoId || ''} onChange={e => setForm({ ...form, productoId: e.target.value })} className={selectCls}>
                      <option value="">Seleccionar...</option>
                      {productos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                    </select>
                  </Campo>
                  <div className="grid grid-cols-2 gap-4">
                    <Campo label="Módulo">
                      <input type="text" value={form.modulo || ''} onChange={e => setForm({ ...form, modulo: e.target.value })}
                        className={inputCls} placeholder="Ej: Administración" />
                    </Campo>
                    <Campo label="Submódulo">
                      <input type="text" value={form.submodulo || ''} onChange={e => setForm({ ...form, submodulo: e.target.value })}
                        className={inputCls} placeholder="Ej: Usuarios" />
                    </Campo>
                  </div>
                  <Campo label="Acción específica">
                    <input type="text" value={form.accion || ''} onChange={e => setForm({ ...form, accion: e.target.value })}
                      className={inputCls} placeholder="Ej: Crear usuario" />
                  </Campo>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={form.estado !== false} onChange={e => setForm({ ...form, estado: e.target.checked })}
                      className="w-4 h-4 accent-blue-600" />
                    <span className="text-sm text-slate-700">Activo</span>
                  </label>
                </>
              )}

              {/* Formulario: Versión */}
              {modal.tipo === 'version' && (
                <>
                  <Campo label="Producto">
                    <select value={form.productoId || ''} onChange={e => setForm({ ...form, productoId: e.target.value })} className={selectCls}>
                      <option value="">Seleccionar...</option>
                      {productos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                    </select>
                  </Campo>
                  <div className="grid grid-cols-2 gap-4">
                    <Campo label="Nombre / Número de versión">
                      <input type="text" value={form.nombre || ''} onChange={e => setForm({ ...form, nombre: e.target.value })}
                        className={inputCls} placeholder="Ej: v2.1.0" />
                    </Campo>
                    <Campo label="Fecha de liberación">
                      <input type="date" value={form.fechaLiberacion || ''} onChange={e => setForm({ ...form, fechaLiberacion: e.target.value })}
                        className={inputCls} />
                    </Campo>
                  </div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={form.estado !== false} onChange={e => setForm({ ...form, estado: e.target.checked })}
                      className="w-4 h-4 accent-blue-600" />
                    <span className="text-sm text-slate-700">Activo</span>
                  </label>
                </>
              )}

              {/* Formulario: Ambiente */}
              {modal.tipo === 'ambiente' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <Campo label="Producto">
                      <select value={form.productoId || ''} onChange={e => setForm({ ...form, productoId: e.target.value, versionId: '' })} className={selectCls}>
                        <option value="">Seleccionar...</option>
                        {productos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                      </select>
                    </Campo>
                    <Campo label="Versión">
                      <select value={form.versionId || ''} onChange={e => setForm({ ...form, versionId: +e.target.value })} className={selectCls} disabled={!form.productoId}>
                        <option value="">Seleccionar...</option>
                        {versionesModalAmbiente.map(v => <option key={v.id} value={v.id}>{v.nombre}</option>)}
                      </select>
                    </Campo>
                    <Campo label="Cliente">
                      <select value={form.clienteId || ''} onChange={e => setForm({ ...form, clienteId: +e.target.value })} className={selectCls}>
                        <option value="">Seleccionar...</option>
                        {clientesData.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                      </select>
                    </Campo>
                    <Campo label="Tipo de ambiente">
                      <select value={form.tipoAmbienteId || ''} onChange={e => setForm({ ...form, tipoAmbienteId: +e.target.value })} className={selectCls}>
                        <option value="">Seleccionar...</option>
                        {tiposAmbienteData.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
                      </select>
                    </Campo>
                  </div>
                  <Campo label="URL de despliegue">
                    <input type="url" value={form.url || ''} onChange={e => setForm({ ...form, url: e.target.value })}
                      className={inputCls} placeholder="https://app.cliente.com" />
                  </Campo>
                </>
              )}

              {/* Formulario: Ficha técnica */}
              {modal.tipo === 'ficha' && (
                <>
                  <Campo label="Producto">
                    <select value={form.productoId || ''} onChange={e => setForm({ ...form, productoId: e.target.value })} className={selectCls}>
                      <option value="">Seleccionar...</option>
                      {productos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                    </select>
                  </Campo>
                  <div className="grid grid-cols-2 gap-4">
                    <Campo label="Lenguaje(s)">
                      <input type="text" value={form.lenguaje || ''} onChange={e => setForm({ ...form, lenguaje: e.target.value })}
                        className={inputCls} placeholder="Ej: JavaScript / TypeScript" />
                    </Campo>
                    <Campo label="Framework">
                      <input type="text" value={form.framework || ''} onChange={e => setForm({ ...form, framework: e.target.value })}
                        className={inputCls} placeholder="Ej: React + Node.js" />
                    </Campo>
                    <Campo label="Base de datos">
                      <input type="text" value={form.baseDatos || ''} onChange={e => setForm({ ...form, baseDatos: e.target.value })}
                        className={inputCls} placeholder="Ej: PostgreSQL 15" />
                    </Campo>
                    <Campo label="Arquitectura">
                      <input type="text" value={form.arquitectura || ''} onChange={e => setForm({ ...form, arquitectura: e.target.value })}
                        className={inputCls} placeholder="Ej: SPA + REST API" />
                    </Campo>
                    <Campo label="Servidor de aplicación">
                      <input type="text" value={form.servidorApp || ''} onChange={e => setForm({ ...form, servidorApp: e.target.value })}
                        className={inputCls} placeholder="Ej: Nginx + PM2" />
                    </Campo>
                    <Campo label="Servidor de BD">
                      <input type="text" value={form.servidorBD || ''} onChange={e => setForm({ ...form, servidorBD: e.target.value })}
                        className={inputCls} placeholder="Ej: AWS RDS" />
                    </Campo>
                  </div>
                  <Campo label="Repositorio">
                    <input type="url" value={form.repositorio || ''} onChange={e => setForm({ ...form, repositorio: e.target.value })}
                      className={inputCls} placeholder="https://github.com/org/repo" />
                  </Campo>
                  <Campo label="Descripción técnica">
                    <textarea value={form.descripcionTecnica || ''} onChange={e => setForm({ ...form, descripcionTecnica: e.target.value })}
                      className={`${inputCls} resize-none`} rows={3} placeholder="Descripción técnica del producto..." />
                  </Campo>
                </>
              )}

              {/* Formulario: Detalle de versión */}
              {modal.tipo === 'detalle' && (
                <>
                  <Campo label="Versión">
                    <select value={form.versionId || ''} onChange={e => setForm({ ...form, versionId: +e.target.value })} className={selectCls}>
                      <option value="">Seleccionar versión...</option>
                      {versionesDelProductoFicha.map(v => <option key={v.id} value={v.id}>{v.nombre}</option>)}
                    </select>
                  </Campo>
                  <Campo label="Descripción">
                    <input type="text" value={form.descripcion || ''} onChange={e => setForm({ ...form, descripcion: e.target.value })}
                      className={inputCls} placeholder="Descripción general de la versión" />
                  </Campo>
                  <Campo label="Cambios incluidos">
                    <textarea value={form.cambios || ''} onChange={e => setForm({ ...form, cambios: e.target.value })}
                      className={`${inputCls} resize-none`} rows={3} placeholder="Funcionalidades y cambios incluidos en esta versión..." />
                  </Campo>
                  <Campo label="Requisitos técnicos">
                    <input type="text" value={form.requisitos || ''} onChange={e => setForm({ ...form, requisitos: e.target.value })}
                      className={inputCls} placeholder="Ej: Node.js 20+, PostgreSQL 15+" />
                  </Campo>
                  <Campo label="Notas adicionales">
                    <textarea value={form.notas || ''} onChange={e => setForm({ ...form, notas: e.target.value })}
                      className={`${inputCls} resize-none`} rows={2} placeholder="Notas de migración, advertencias, etc." />
                  </Campo>
                </>
              )}

            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 shrink-0">
              <button onClick={cerrarModal} className="px-4 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-100 transition-colors">
                Cancelar
              </button>
              <button onClick={guardar} className="px-4 py-2 rounded-lg text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors">
                {modal.editando ? 'Guardar cambios' : 'Crear'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
