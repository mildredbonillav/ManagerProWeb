import { useState } from 'react'
import {
  MagnifyingGlass,
  Plus,
  PencilSimple,
  ToggleLeft,
  ToggleRight,
  UserCircle,
} from '@phosphor-icons/react'

const usuariosSimulados = [
  { id: 1, nombre: 'Sofía Barboza', apellidos: 'Vargas', correo: 'sofia@businesspro.com', rol: 'Administrador', departamento: 'Gerencia', estado: true },
  { id: 2, nombre: 'Armando', apellidos: 'Núñez Rojas', correo: 'armando@businesspro.com', rol: 'Desarrollador', departamento: 'Tecnología', estado: true },
  { id: 3, nombre: 'Mildred', apellidos: 'Bonilla Valerín', correo: 'mildred@businesspro.com', rol: 'Coordinador', departamento: 'Operaciones', estado: true },
  { id: 4, nombre: 'Matías', apellidos: 'Vargas Umaña', correo: 'matias@businesspro.com', rol: 'Desarrollador', departamento: 'Tecnología', estado: false },
  { id: 5, nombre: 'Laura', apellidos: 'Mora Jiménez', correo: 'laura@businesspro.com', rol: 'Soporte', departamento: 'Atención al cliente', estado: true },
]

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState(usuariosSimulados)
  const [busqueda, setBusqueda] = useState('')
  const [modalAbierto, setModalAbierto] = useState(false)
  const [usuarioEditando, setUsuarioEditando] = useState(null)
  const [form, setForm] = useState({ nombre: '', apellidos: '', correo: '', rol: '', departamento: '' })

  const usuariosFiltrados = usuarios.filter((u) =>
    `${u.nombre} ${u.apellidos} ${u.correo} ${u.rol}`
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  )

  const abrirCrear = () => {
    setUsuarioEditando(null)
    setForm({ nombre: '', apellidos: '', correo: '', rol: '', departamento: '' })
    setModalAbierto(true)
  }

  const abrirEditar = (u) => {
    setUsuarioEditando(u)
    setForm({ nombre: u.nombre, apellidos: u.apellidos, correo: u.correo, rol: u.rol, departamento: u.departamento })
    setModalAbierto(true)
  }

  const toggleEstado = (id) => {
    setUsuarios(usuarios.map((u) => u.id === id ? { ...u, estado: !u.estado } : u))
  }

  const guardar = () => {
    if (!form.nombre || !form.correo || !form.rol) return
    if (usuarioEditando) {
      setUsuarios(usuarios.map((u) => u.id === usuarioEditando.id ? { ...u, ...form } : u))
    } else {
      setUsuarios([...usuarios, { id: Date.now(), ...form, estado: true }])
    }
    setModalAbierto(false)
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Usuarios</h1>
          <p className="text-sm text-slate-500 mt-1">Administrá los usuarios del sistema</p>
        </div>
        <button
          onClick={abrirCrear}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          <Plus size={16} />
          Nuevo usuario
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-xl border border-slate-200">

        {/* Buscador */}
        <div className="px-5 py-4 border-b border-slate-100">
          <div className="relative max-w-sm">
            <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar usuario..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Lista */}
        <div className="divide-y divide-slate-100">
          {usuariosFiltrados.length === 0 ? (
            <div className="px-6 py-12 text-center text-slate-400 text-sm">
              No se encontraron usuarios.
            </div>
          ) : (
            usuariosFiltrados.map((u) => (
              <div key={u.id} className="flex items-center gap-4 px-5 py-4">

                {/* Avatar */}
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                  <UserCircle size={22} className="text-blue-600" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900">
                    {u.nombre} {u.apellidos}
                  </p>
                  <p className="text-xs text-slate-500 truncate">{u.correo}</p>
                </div>

                {/* Rol */}
                <div className="hidden sm:block w-32">
                  <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium">
                    {u.rol}
                  </span>
                </div>

                {/* Departamento */}
                <div className="hidden md:block w-40">
                  <p className="text-xs text-slate-500">{u.departamento}</p>
                </div>

                {/* Estado */}
                <div className="hidden sm:block w-20">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${u.estado ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                    {u.estado ? 'Activo' : 'Inactivo'}
                  </span>
                </div>

                {/* Acciones */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => abrirEditar(u)}
                    className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    title="Editar"
                  >
                    <PencilSimple size={16} />
                  </button>
                  <button
                    onClick={() => toggleEstado(u.id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                    title={u.estado ? 'Inactivar' : 'Activar'}
                  >
                    {u.estado ? <ToggleRight size={18} className="text-green-500" /> : <ToggleLeft size={18} />}
                  </button>
                </div>

              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100">
          <p className="text-xs text-slate-400">{usuariosFiltrados.length} usuario(s) encontrado(s)</p>
        </div>
      </div>

      {/* Modal */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">

            <div className="px-6 py-5 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-900">
                {usuarioEditando ? 'Editar usuario' : 'Nuevo usuario'}
              </h2>
            </div>

            <div className="px-6 py-5 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-slate-700">Nombre</label>
                  <input
                    type="text"
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nombre"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-slate-700">Apellidos</label>
                  <input
                    type="text"
                    value={form.apellidos}
                    onChange={(e) => setForm({ ...form, apellidos: e.target.value })}
                    className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Apellidos"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-700">Correo electrónico</label>
                <input
                  type="email"
                  value={form.correo}
                  onChange={(e) => setForm({ ...form, correo: e.target.value })}
                  className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="correo@empresa.com"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-slate-700">Rol</label>
                  <select
                    value={form.rol}
                    onChange={(e) => setForm({ ...form, rol: e.target.value })}
                    className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">Seleccionar...</option>
                    <option>Administrador</option>
                    <option>Coordinador</option>
                    <option>Desarrollador</option>
                    <option>Soporte</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-slate-700">Departamento</label>
                  <select
                    value={form.departamento}
                    onChange={(e) => setForm({ ...form, departamento: e.target.value })}
                    className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">Seleccionar...</option>
                    <option>Gerencia</option>
                    <option>Tecnología</option>
                    <option>Operaciones</option>
                    <option>Atención al cliente</option>
                  </select>
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
                {usuarioEditando ? 'Guardar cambios' : 'Crear usuario'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}