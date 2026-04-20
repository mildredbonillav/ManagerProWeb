import { useState } from 'react'
import {
  MagnifyingGlass,
  Plus,
  PencilSimple,
  ToggleLeft,
  ToggleRight,
  UserCircle,
  Eye,
  EyeSlash,
  ClockCounterClockwise,
  Star,
  X,
} from '@phosphor-icons/react'

const ROLES = ['Administrador', 'Coordinador', 'Desarrollador', 'Soporte', 'Cliente']

const SUBDEPARTAMENTOS_CATALOGO = [
  { id: 1, nombre: 'Dirección ejecutiva', departamento: 'Gerencia' },
  { id: 2, nombre: 'Desarrollo web', departamento: 'Tecnología' },
  { id: 3, nombre: 'QA', departamento: 'Tecnología' },
  { id: 4, nombre: 'Coordinación', departamento: 'Operaciones' },
  { id: 5, nombre: 'Logística', departamento: 'Operaciones' },
]

const JORNADAS_CATALOGO = [
  { id: 1, nombre: 'Jornada ordinaria', esExtraordinaria: false },
  { id: 2, nombre: 'Jornada mixta', esExtraordinaria: false },
  { id: 3, nombre: 'Horas extra', esExtraordinaria: true },
]

const getDepto = (subNombre) =>
  SUBDEPARTAMENTOS_CATALOGO.find((s) => s.nombre === subNombre)?.departamento || ''

const formatFecha = (f) => {
  if (!f) return '—'
  const [y, m, d] = f.split('-')
  return `${d}/${m}/${y}`
}

const usuariosSimulados = [
  {
    id: 1, nombre: 'Sofía', apellidos: 'Barboza Vargas',
    correo: 'sofia@businesspro.com', rol: 'Administrador', estado: true,
    asignaciones: [
      { id: 11, subNombre: 'Dirección ejecutiva', departamento: 'Gerencia', fechaInicio: '2023-01-01', fechaFin: '', esLider: true },
    ],
    jornadas: ['Jornada ordinaria'],
  },
  {
    id: 2, nombre: 'Armando', apellidos: 'Núñez Rojas',
    correo: 'armando@businesspro.com', rol: 'Desarrollador', estado: true,
    asignaciones: [
      { id: 21, subNombre: 'Desarrollo web', departamento: 'Tecnología', fechaInicio: '2023-02-01', fechaFin: '', esLider: false },
    ],
    jornadas: ['Jornada ordinaria'],
  },
  {
    id: 3, nombre: 'Mildred', apellidos: 'Bonilla Valerín',
    correo: 'mildred@businesspro.com', rol: 'Coordinador', estado: true,
    asignaciones: [
      { id: 31, subNombre: 'Coordinación', departamento: 'Operaciones', fechaInicio: '2022-06-01', fechaFin: '', esLider: true },
      { id: 32, subNombre: 'QA', departamento: 'Tecnología', fechaInicio: '2023-09-01', fechaFin: '2024-03-01', esLider: false },
    ],
    jornadas: ['Jornada ordinaria', 'Horas extra'],
  },
  {
    id: 4, nombre: 'Matías', apellidos: 'Vargas Umaña',
    correo: 'matias@businesspro.com', rol: 'Desarrollador', estado: false,
    asignaciones: [
      { id: 41, subNombre: 'Desarrollo web', departamento: 'Tecnología', fechaInicio: '2023-03-15', fechaFin: '', esLider: false },
    ],
    jornadas: ['Jornada mixta'],
  },
  {
    id: 5, nombre: 'Laura', apellidos: 'Mora Jiménez',
    correo: 'laura@businesspro.com', rol: 'Soporte', estado: true,
    asignaciones: [],
    jornadas: ['Jornada ordinaria'],
  },
]

const FORM_VACIO = {
  nombre: '', apellidos: '', correo: '', contrasena: '',
  rol: '', asignaciones: [], jornadas: [], estado: true,
}

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState(usuariosSimulados)
  const [busqueda, setBusqueda] = useState('')
  const [modalAbierto, setModalAbierto] = useState(false)
  const [usuarioEditando, setUsuarioEditando] = useState(null)
  const [form, setForm] = useState(FORM_VACIO)
  const [verContrasena, setVerContrasena] = useState(false)
  const [modalHistorial, setModalHistorial] = useState({ abierto: false, usuario: null })

  const usuariosFiltrados = usuarios.filter((u) =>
    `${u.nombre} ${u.apellidos} ${u.correo} ${u.rol}`
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  )

  const abrirCrear = () => {
    setUsuarioEditando(null)
    setForm(FORM_VACIO)
    setVerContrasena(false)
    setModalAbierto(true)
  }

  const abrirEditar = (u) => {
    setUsuarioEditando(u)
    setForm({
      nombre: u.nombre,
      apellidos: u.apellidos,
      correo: u.correo,
      contrasena: '',
      rol: u.rol,
      asignaciones: (u.asignaciones || []).map((a) => ({ ...a })),
      jornadas: u.jornadas || [],
      estado: u.estado,
    })
    setVerContrasena(false)
    setModalAbierto(true)
  }

  const toggleEstado = (id) =>
    setUsuarios(usuarios.map((u) => u.id === id ? { ...u, estado: !u.estado } : u))

  const toggleJornada = (nombre) => {
    const actual = form.jornadas || []
    setForm({
      ...form,
      jornadas: actual.includes(nombre) ? actual.filter((v) => v !== nombre) : [...actual, nombre],
    })
  }

  const agregarAsignacion = () =>
    setForm({
      ...form,
      asignaciones: [
        ...form.asignaciones,
        { id: Date.now(), subNombre: '', departamento: '', fechaInicio: '', fechaFin: '', esLider: false },
      ],
    })

  const eliminarAsignacion = (id) =>
    setForm({ ...form, asignaciones: form.asignaciones.filter((a) => a.id !== id) })

  const actualizarAsignacion = (id, campo, valor) =>
    setForm({
      ...form,
      asignaciones: form.asignaciones.map((a) =>
        a.id === id
          ? { ...a, [campo]: valor, ...(campo === 'subNombre' ? { departamento: getDepto(valor) } : {}) }
          : a
      ),
    })

  const guardar = () => {
    if (!form.nombre || !form.correo || !form.rol) return
    const datos = { ...form }
    if (usuarioEditando && !datos.contrasena) delete datos.contrasena
    if (usuarioEditando) {
      setUsuarios(usuarios.map((u) => u.id === usuarioEditando.id ? { ...u, ...datos } : u))
    } else {
      setUsuarios([...usuarios, { id: Date.now(), ...datos }])
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

      {/* Lista */}
      <div className="bg-white rounded-xl border border-slate-200">

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

        <div className="divide-y divide-slate-100">
          {usuariosFiltrados.length === 0 ? (
            <div className="px-6 py-12 text-center text-slate-400 text-sm">No se encontraron usuarios.</div>
          ) : (
            usuariosFiltrados.map((u) => {
              const activas = (u.asignaciones || []).filter((a) => !a.fechaFin)
              return (
                <div key={u.id} className="flex items-center gap-4 px-5 py-4">

                  <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                    <UserCircle size={22} className="text-blue-600" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900">{u.nombre} {u.apellidos}</p>
                    <p className="text-xs text-slate-500 truncate">{u.correo}</p>
                  </div>

                  <div className="hidden sm:block w-28 shrink-0">
                    <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium">
                      {u.rol}
                    </span>
                  </div>

                  {/* Asignaciones activas */}
                  <div className="hidden lg:flex items-center gap-1.5 w-52 shrink-0 flex-wrap">
                    {activas.length > 0 ? (
                      <>
                        {activas.slice(0, 2).map((a) => (
                          <span key={a.id} className="flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-medium whitespace-nowrap">
                            {a.esLider && <Star size={9} weight="fill" className="text-amber-500" />}
                            {a.subNombre}
                          </span>
                        ))}
                        {activas.length > 2 && (
                          <span className="text-xs text-slate-400">+{activas.length - 2}</span>
                        )}
                      </>
                    ) : (
                      <span className="text-xs text-slate-300">Sin asignaciones</span>
                    )}
                  </div>

                  <div className="hidden sm:block w-20 shrink-0">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${u.estado ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                      {u.estado ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button onClick={() => abrirEditar(u)} className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors" title="Editar">
                      <PencilSimple size={16} />
                    </button>
                    <button onClick={() => setModalHistorial({ abierto: true, usuario: u })} className="p-2 rounded-lg text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition-colors" title="Historial de asignaciones">
                      <ClockCounterClockwise size={16} />
                    </button>
                    <button onClick={() => toggleEstado(u.id)} className="p-2 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors" title={u.estado ? 'Inactivar' : 'Activar'}>
                      {u.estado ? <ToggleRight size={18} className="text-green-500" /> : <ToggleLeft size={18} />}
                    </button>
                  </div>

                </div>
              )
            })
          )}
        </div>

        <div className="px-5 py-3 border-t border-slate-100">
          <p className="text-xs text-slate-400">{usuariosFiltrados.length} usuario(s) encontrado(s)</p>
        </div>
      </div>

      {/* ── Modal crear / editar ── */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">

            <div className="px-6 py-5 border-b border-slate-100 shrink-0">
              <h2 className="text-lg font-semibold text-slate-900">
                {usuarioEditando ? 'Editar usuario' : 'Nuevo usuario'}
              </h2>
            </div>

            <div className="overflow-y-auto flex-1 px-6 py-5 flex flex-col gap-6">

              {/* Datos personales */}
              <section className="flex flex-col gap-4">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Datos personales</p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-slate-700">Nombre</label>
                    <input type="text" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                      className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Nombre" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-slate-700">Apellidos</label>
                    <input type="text" value={form.apellidos} onChange={(e) => setForm({ ...form, apellidos: e.target.value })}
                      className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Apellidos" />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-slate-700">Correo electrónico</label>
                  <input type="email" value={form.correo} onChange={(e) => setForm({ ...form, correo: e.target.value })}
                    className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="correo@empresa.com" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-slate-700">
                    Contraseña
                    {usuarioEditando && <span className="ml-2 font-normal text-slate-400">— dejar en blanco para no modificar</span>}
                  </label>
                  <div className="relative">
                    <input
                      type={verContrasena ? 'text' : 'password'}
                      value={form.contrasena}
                      onChange={(e) => setForm({ ...form, contrasena: e.target.value })}
                      className="w-full px-3 pr-10 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="••••••••"
                    />
                    <button type="button" onClick={() => setVerContrasena(!verContrasena)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {verContrasena ? <EyeSlash size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
              </section>

              {/* Acceso al sistema */}
              <section className="flex flex-col gap-4">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Acceso al sistema</p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-slate-700">Estado</label>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setForm({ ...form, estado: true })}
                        className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${form.estado ? 'bg-green-100 text-green-700 ring-1 ring-green-300' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                        Activo
                      </button>
                      <button type="button" onClick={() => setForm({ ...form, estado: false })}
                        className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${!form.estado ? 'bg-slate-200 text-slate-700 ring-1 ring-slate-400' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                        Inactivo
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-slate-700">Rol</label>
                    <select value={form.rol} onChange={(e) => setForm({ ...form, rol: e.target.value })}
                      className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                      <option value="">Seleccionar...</option>
                      {ROLES.map((r) => <option key={r}>{r}</option>)}
                    </select>
                  </div>
                </div>
              </section>

              {/* Asignaciones a subdepartamentos */}
              <section className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Asignaciones a subdepartamentos</p>
                  <button type="button" onClick={agregarAsignacion}
                    className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors">
                    <Plus size={13} /> Agregar
                  </button>
                </div>

                {form.asignaciones.length === 0 ? (
                  <div className="border border-dashed border-slate-200 rounded-xl p-5 text-center text-xs text-slate-400">
                    Sin asignaciones. Hacé clic en "Agregar" para añadir una.
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {form.asignaciones.map((a, idx) => (
                      <div key={a.id} className="border border-slate-200 rounded-xl p-4 flex flex-col gap-3 bg-slate-50/60">

                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-slate-500">Asignación {idx + 1}</p>
                          <button type="button" onClick={() => eliminarAsignacion(a.id)}
                            className="p-1 rounded text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                            <X size={13} />
                          </button>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-medium text-slate-600">Subdepartamento</label>
                          <select value={a.subNombre} onChange={(e) => actualizarAsignacion(a.id, 'subNombre', e.target.value)}
                            className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                            <option value="">Seleccionar...</option>
                            {SUBDEPARTAMENTOS_CATALOGO.map((s) => (
                              <option key={s.id} value={s.nombre}>{s.nombre} — {s.departamento}</option>
                            ))}
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-slate-600">Fecha de inicio</label>
                            <input type="date" value={a.fechaInicio}
                              onChange={(e) => actualizarAsignacion(a.id, 'fechaInicio', e.target.value)}
                              className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-slate-600">
                              Fecha de fin
                              <span className="ml-1 font-normal text-slate-400">(vacío = vigente)</span>
                            </label>
                            <input type="date" value={a.fechaFin}
                              onChange={(e) => actualizarAsignacion(a.id, 'fechaFin', e.target.value)}
                              className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white" />
                          </div>
                        </div>

                        <label className="flex items-center gap-2 cursor-pointer w-fit">
                          <input type="checkbox" checked={a.esLider}
                            onChange={(e) => actualizarAsignacion(a.id, 'esLider', e.target.checked)}
                            className="w-4 h-4 accent-blue-600" />
                          <span className="text-sm text-slate-700">Es líder de este subdepartamento</span>
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Jornadas */}
              <section className="flex flex-col gap-3">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Tipos de jornada laboral</p>
                <div className="flex flex-wrap gap-2">
                  {JORNADAS_CATALOGO.map((j) => {
                    const sel = form.jornadas.includes(j.nombre)
                    return (
                      <button key={j.id} type="button" onClick={() => toggleJornada(j.nombre)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${sel ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                        {j.nombre}
                        {j.esExtraordinaria && (
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${sel ? 'bg-white/25 text-white' : 'bg-amber-100 text-amber-700'}`}>EXT</span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </section>

            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 shrink-0">
              <button onClick={() => setModalAbierto(false)} className="px-4 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-100 transition-colors">
                Cancelar
              </button>
              <button onClick={guardar} className="px-4 py-2 rounded-lg text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors">
                {usuarioEditando ? 'Guardar cambios' : 'Crear usuario'}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ── Modal historial de asignaciones ── */}
      {modalHistorial.abierto && modalHistorial.usuario && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">

            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Historial de pertenencia</h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  {modalHistorial.usuario.nombre} {modalHistorial.usuario.apellidos}
                </p>
              </div>
              <button onClick={() => setModalHistorial({ abierto: false, usuario: null })}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 px-6 py-4">
              {(!modalHistorial.usuario.asignaciones || modalHistorial.usuario.asignaciones.length === 0) ? (
                <div className="text-center py-14 text-slate-400 text-sm">
                  Este usuario no tiene asignaciones registradas.
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left text-xs font-medium text-slate-500 pb-3 pr-4">Subdepartamento</th>
                      <th className="text-left text-xs font-medium text-slate-500 pb-3 pr-4">Departamento</th>
                      <th className="text-left text-xs font-medium text-slate-500 pb-3 pr-4">Fecha de ingreso</th>
                      <th className="text-left text-xs font-medium text-slate-500 pb-3 pr-4">Fecha de salida</th>
                      <th className="text-left text-xs font-medium text-slate-500 pb-3">Rol</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {modalHistorial.usuario.asignaciones.map((a) => (
                      <tr key={a.id} className="hover:bg-slate-50/50">
                        <td className="py-3 pr-4">
                          <p className="text-sm font-medium text-slate-900">{a.subNombre}</p>
                        </td>
                        <td className="py-3 pr-4">
                          <p className="text-xs text-slate-500">{a.departamento}</p>
                        </td>
                        <td className="py-3 pr-4">
                          <p className="text-xs text-slate-700">{formatFecha(a.fechaInicio)}</p>
                        </td>
                        <td className="py-3 pr-4">
                          {a.fechaFin ? (
                            <p className="text-xs text-slate-500">{formatFecha(a.fechaFin)}</p>
                          ) : (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Vigente</span>
                          )}
                        </td>
                        <td className="py-3">
                          {a.esLider ? (
                            <span className="flex items-center gap-1 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium w-fit">
                              <Star size={10} weight="fill" /> Líder
                            </span>
                          ) : (
                            <span className="text-xs text-slate-500">Miembro</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
