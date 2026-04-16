import { useState } from 'react'
import { MagnifyingGlass, Plus, PencilSimple, ToggleLeft, ToggleRight, ShieldCheck, Check } from '@phosphor-icons/react'

const permisosDisponibles = [
  { id: 1, modulo: 'Usuarios', acciones: ['Ver', 'Crear', 'Editar', 'Inactivar'] },
  { id: 2, modulo: 'Departamentos', acciones: ['Ver', 'Crear', 'Editar', 'Inactivar'] },
  { id: 3, modulo: 'Roles', acciones: ['Ver', 'Crear', 'Editar', 'Inactivar'] },
  { id: 4, modulo: 'Órdenes de servicio', acciones: ['Ver', 'Crear', 'Editar', 'Cerrar'] },
  { id: 5, modulo: 'Boletas de tiempo', acciones: ['Ver', 'Registrar', 'Aprobar'] },
  { id: 6, modulo: 'Soporte', acciones: ['Ver', 'Crear', 'Gestionar'] },
  { id: 7, modulo: 'Reportes', acciones: ['Ver', 'Exportar'] },
  { id: 8, modulo: 'Configuración', acciones: ['Ver', 'Editar'] },
]

const rolesSimulados = [
  {
    id: 1, nombre: 'Administrador', descripcion: 'Acceso total al sistema', estado: true,
    permisos: { 1: ['Ver','Crear','Editar','Inactivar'], 2: ['Ver','Crear','Editar','Inactivar'], 3: ['Ver','Crear','Editar','Inactivar'], 4: ['Ver','Crear','Editar','Cerrar'], 5: ['Ver','Registrar','Aprobar'], 6: ['Ver','Crear','Gestionar'], 7: ['Ver','Exportar'], 8: ['Ver','Editar'] }
  },
  {
    id: 2, nombre: 'Coordinador', descripcion: 'Gestión de proyectos y recursos', estado: true,
    permisos: { 1: ['Ver'], 2: ['Ver'], 4: ['Ver','Crear','Editar'], 5: ['Ver','Registrar','Aprobar'], 6: ['Ver','Gestionar'], 7: ['Ver','Exportar'] }
  },
  {
    id: 3, nombre: 'Desarrollador', descripcion: 'Registro de tiempo y tareas', estado: true,
    permisos: { 4: ['Ver'], 5: ['Ver','Registrar'], 6: ['Ver'] }
  },
  {
    id: 4, nombre: 'Soporte', descripcion: 'Atención de solicitudes de soporte', estado: true,
    permisos: { 6: ['Ver','Crear','Gestionar'], 7: ['Ver'] }
  },
  {
    id: 5, nombre: 'Cliente', descripcion: 'Acceso externo para clientes', estado: true,
    permisos: { 6: ['Ver','Crear'] }
  },
]

export default function Roles() {
  const [roles, setRoles] = useState(rolesSimulados)
  const [busqueda, setBusqueda] = useState('')
  const [modalAbierto, setModalAbierto] = useState(false)
  const [editando, setEditando] = useState(null)
  const [form, setForm] = useState({ nombre: '', descripcion: '' })
  const [permisosForm, setPermisosForm] = useState({})

  const rolesFiltrados = roles.filter((r) =>
    r.nombre.toLowerCase().includes(busqueda.toLowerCase())
  )

  const abrirCrear = () => {
    setEditando(null)
    setForm({ nombre: '', descripcion: '' })
    setPermisosForm({})
    setModalAbierto(true)
  }

  const abrirEditar = (r) => {
    setEditando(r)
    setForm({ nombre: r.nombre, descripcion: r.descripcion })
    setPermisosForm({ ...r.permisos })
    setModalAbierto(true)
  }

  const toggleAccion = (moduloId, accion) => {
    const actuales = permisosForm[moduloId] || []
    const existe = actuales.includes(accion)
    setPermisosForm({
      ...permisosForm,
      [moduloId]: existe
        ? actuales.filter((a) => a !== accion)
        : [...actuales, accion]
    })
  }

  const toggleModulo = (moduloId, acciones) => {
    const actuales = permisosForm[moduloId] || []
    const todosActivos = acciones.every((a) => actuales.includes(a))
    setPermisosForm({
      ...permisosForm,
      [moduloId]: todosActivos ? [] : [...acciones]
    })
  }

  const guardar = () => {
    if (!form.nombre) return
    if (editando) {
      setRoles(roles.map((r) => r.id === editando.id ? { ...r, ...form, permisos: permisosForm } : r))
    } else {
      setRoles([...roles, { id: Date.now(), ...form, estado: true, permisos: permisosForm }])
    }
    setModalAbierto(false)
  }

  const toggleEstado = (id) => {
    setRoles(roles.map((r) => r.id === id ? { ...r, estado: !r.estado } : r))
  }

  const contarPermisos = (permisos) =>
    Object.values(permisos).reduce((acc, acc2) => acc + acc2.length, 0)

  return (
    <div className="flex flex-col gap-6">

      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Roles y permisos</h1>
          <p className="text-sm text-slate-500 mt-1">Controlá el acceso de cada rol al sistema</p>
        </div>
        <button
          onClick={abrirCrear}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          <Plus size={16} />
          Nuevo rol
        </button>
      </div>

      {/* Lista */}
      <div className="bg-white rounded-xl border border-slate-200">
        <div className="px-5 py-4 border-b border-slate-100">
          <div className="relative max-w-sm">
            <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar rol..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {rolesFiltrados.map((r) => (
            <div key={r.id} className="flex items-center gap-4 px-5 py-4">
              <div className="w-9 h-9 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
                <ShieldCheck size={18} className="text-violet-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900">{r.nombre}</p>
                <p className="text-xs text-slate-500">{r.descripcion}</p>
              </div>
              <div className="hidden sm:block">
                <span className="text-xs text-slate-400">
                  {contarPermisos(r.permisos)} permiso(s) asignado(s)
                </span>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium hidden sm:block ${r.estado ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                {r.estado ? 'Activo' : 'Inactivo'}
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => abrirEditar(r)}
                  className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  title="Editar"
                >
                  <PencilSimple size={15} />
                </button>
                <button
                  onClick={() => toggleEstado(r.id)}
                  className="p-2 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                >
                  {r.estado ? <ToggleRight size={18} className="text-green-500" /> : <ToggleLeft size={18} />}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="px-5 py-3 border-t border-slate-100">
          <p className="text-xs text-slate-400">{rolesFiltrados.length} rol(es) encontrado(s)</p>
        </div>
      </div>

      {/* Modal */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">

            <div className="px-6 py-5 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-900">
                {editando ? 'Editar rol' : 'Nuevo rol'}
              </h2>
            </div>

            <div className="overflow-y-auto flex-1 px-6 py-5 flex flex-col gap-5">

              {/* Datos básicos */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-slate-700">Nombre del rol</label>
                  <input
                    type="text"
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ej: Coordinador"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-slate-700">Descripción</label>
                  <input
                    type="text"
                    value={form.descripcion}
                    onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                    className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Descripción del rol"
                  />
                </div>
              </div>

              {/* Permisos por módulo */}
              <div>
                <p className="text-sm font-medium text-slate-900 mb-3">Permisos por módulo</p>
                <div className="flex flex-col gap-2">
                  {permisosDisponibles.map((m) => {
                    const activos = permisosForm[m.id] || []
                    const todosActivos = m.acciones.every((a) => activos.includes(a))
                    return (
                      <div key={m.id} className="border border-slate-200 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-sm font-medium text-slate-800">{m.modulo}</p>
                          <button
                            onClick={() => toggleModulo(m.id, m.acciones)}
                            className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${todosActivos ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                          >
                            {todosActivos ? 'Quitar todo' : 'Seleccionar todo'}
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {m.acciones.map((accion) => {
                            const activo = activos.includes(accion)
                            return (
                              <button
                                key={accion}
                                onClick={() => toggleAccion(m.id, accion)}
                                className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                                  activo
                                    ? 'bg-blue-600 border-blue-600 text-white'
                                    : 'bg-white border-slate-200 text-slate-600 hover:border-blue-300'
                                }`}
                              >
                                {activo && <Check size={11} weight="bold" />}
                                {accion}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() => setModalAbierto(false)}
                className="px-4 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={guardar}
                className="px-4 py-2 rounded-lg text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
              >
                {editando ? 'Guardar cambios' : 'Crear rol'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}