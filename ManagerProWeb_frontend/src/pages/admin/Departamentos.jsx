import { useState } from 'react'
import { MagnifyingGlass, Plus, PencilSimple, ToggleLeft, ToggleRight, Buildings, ClockCounterClockwise, Star, X } from '@phosphor-icons/react'

const departamentosSimulados = [
  {
    id: 1, nombre: 'Gerencia', descripcion: 'Dirección general de la empresa', estado: true,
    subdepartamentos: [
      { id: 1, nombre: 'Dirección ejecutiva', descripcion: 'Toma de decisiones estratégicas', estado: true },
    ]
  },
  {
    id: 2, nombre: 'Tecnología', descripcion: 'Desarrollo y mantenimiento de software', estado: true,
    subdepartamentos: [
      { id: 2, nombre: 'Desarrollo web', descripcion: 'Frontend y backend', estado: true },
      { id: 3, nombre: 'QA', descripcion: 'Control de calidad', estado: true },
    ]
  },
  {
    id: 3, nombre: 'Operaciones', descripcion: 'Gestión de proyectos y recursos', estado: true,
    subdepartamentos: [
      { id: 4, nombre: 'Coordinación', descripcion: 'Coordinación de proyectos', estado: true },
      { id: 5, nombre: 'Logística', descripcion: 'Gestión logística', estado: false },
    ]
  },
  {
    id: 4, nombre: 'Atención al cliente', descripcion: 'Soporte y relación con clientes', estado: false,
    subdepartamentos: []
  },
]

const historialesSub = {
  'Dirección ejecutiva': [
    { id: 1, usuario: 'Sofía Barboza', fechaIngreso: '2023-01-01', fechaSalida: null, esLider: true },
  ],
  'Desarrollo web': [
    { id: 2, usuario: 'Armando Núñez', fechaIngreso: '2023-02-01', fechaSalida: null, esLider: false },
    { id: 3, usuario: 'Matías Vargas', fechaIngreso: '2023-03-15', fechaSalida: null, esLider: false },
  ],
  'QA': [
    { id: 4, usuario: 'Mildred Bonilla', fechaIngreso: '2023-09-01', fechaSalida: '2024-03-01', esLider: false },
  ],
  'Coordinación': [
    { id: 5, usuario: 'Mildred Bonilla', fechaIngreso: '2022-06-01', fechaSalida: null, esLider: true },
  ],
  'Logística': [],
}

const formatFecha = (f) => {
  if (!f) return '—'
  const [y, m, d] = f.split('-')
  return `${d}/${m}/${y}`
}

export default function Departamentos() {
  const [departamentos, setDepartamentos] = useState(departamentosSimulados)
  const [busqueda, setBusqueda] = useState('')
  const [expandido, setExpandido] = useState(null)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [modalTipo, setModalTipo] = useState('departamento') // 'departamento' | 'subdepartamento'
  const [editando, setEditando] = useState(null)
  const [deptoSeleccionado, setDeptoSeleccionado] = useState(null)
  const [form, setForm] = useState({ nombre: '', descripcion: '' })
  const [modalHistorial, setModalHistorial] = useState({ abierto: false, subNombre: '', depto: '' })

  const deptosFiltrados = departamentos.filter((d) =>
    d.nombre.toLowerCase().includes(busqueda.toLowerCase())
  )

  const abrirCrearDepto = () => {
    setModalTipo('departamento')
    setEditando(null)
    setForm({ nombre: '', descripcion: '' })
    setModalAbierto(true)
  }

  const abrirEditarDepto = (d) => {
    setModalTipo('departamento')
    setEditando(d)
    setForm({ nombre: d.nombre, descripcion: d.descripcion })
    setModalAbierto(true)
  }

  const abrirCrearSubdepto = (depto) => {
    setModalTipo('subdepartamento')
    setDeptoSeleccionado(depto)
    setEditando(null)
    setForm({ nombre: '', descripcion: '' })
    setModalAbierto(true)
  }

  const abrirEditarSubdepto = (depto, sub) => {
    setModalTipo('subdepartamento')
    setDeptoSeleccionado(depto)
    setEditando(sub)
    setForm({ nombre: sub.nombre, descripcion: sub.descripcion })
    setModalAbierto(true)
  }

  const toggleEstadoDepto = (id) => {
    setDepartamentos(departamentos.map((d) => d.id === id ? { ...d, estado: !d.estado } : d))
  }

  const toggleEstadoSubdepto = (deptoId, subId) => {
    setDepartamentos(departamentos.map((d) =>
      d.id === deptoId
        ? { ...d, subdepartamentos: d.subdepartamentos.map((s) => s.id === subId ? { ...s, estado: !s.estado } : s) }
        : d
    ))
  }

  const guardar = () => {
    if (!form.nombre) return

    if (modalTipo === 'departamento') {
      if (editando) {
        setDepartamentos(departamentos.map((d) => d.id === editando.id ? { ...d, ...form } : d))
      } else {
        setDepartamentos([...departamentos, { id: Date.now(), ...form, estado: true, subdepartamentos: [] }])
      }
    } else {
      if (editando) {
        setDepartamentos(departamentos.map((d) =>
          d.id === deptoSeleccionado.id
            ? { ...d, subdepartamentos: d.subdepartamentos.map((s) => s.id === editando.id ? { ...s, ...form } : s) }
            : d
        ))
      } else {
        setDepartamentos(departamentos.map((d) =>
          d.id === deptoSeleccionado.id
            ? { ...d, subdepartamentos: [...d.subdepartamentos, { id: Date.now(), ...form, estado: true }] }
            : d
        ))
      }
    }
    setModalAbierto(false)
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Departamentos</h1>
          <p className="text-sm text-slate-500 mt-1">Estructura organizacional de la empresa</p>
        </div>
        <button
          onClick={abrirCrearDepto}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          <Plus size={16} />
          Nuevo departamento
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
              placeholder="Buscar departamento..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Lista */}
        <div className="divide-y divide-slate-100">
          {deptosFiltrados.length === 0 ? (
            <div className="px-6 py-12 text-center text-slate-400 text-sm">
              No se encontraron departamentos.
            </div>
          ) : (
            deptosFiltrados.map((d) => (
              <div key={d.id}>

                {/* Fila departamento */}
                <div className="flex items-center gap-4 px-5 py-4">
                  <div
                    className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 cursor-pointer"
                    onClick={() => setExpandido(expandido === d.id ? null : d.id)}
                  >
                    <Buildings size={18} className="text-blue-600" />
                  </div>

                  <div
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => setExpandido(expandido === d.id ? null : d.id)}
                  >
                    <p className="text-sm font-medium text-slate-900">{d.nombre}</p>
                    <p className="text-xs text-slate-500">{d.descripcion}</p>
                  </div>

                  <div className="hidden sm:block">
                    <span className="text-xs text-slate-400">
                      {d.subdepartamentos.length} subdepartamento(s)
                    </span>
                  </div>

                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium hidden sm:block ${d.estado ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                    {d.estado ? 'Activo' : 'Inactivo'}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => abrirCrearSubdepto(d)}
                      className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      title="Agregar subdepartamento"
                    >
                      <Plus size={15} />
                    </button>
                    <button
                      onClick={() => abrirEditarDepto(d)}
                      className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      title="Editar"
                    >
                      <PencilSimple size={15} />
                    </button>
                    <button
                      onClick={() => toggleEstadoDepto(d.id)}
                      className="p-2 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                      title={d.estado ? 'Inactivar' : 'Activar'}
                    >
                      {d.estado
                        ? <ToggleRight size={18} className="text-green-500" />
                        : <ToggleLeft size={18} />}
                    </button>
                  </div>
                </div>

                {/* Subdepartamentos expandidos */}
                {expandido === d.id && (
                  <div className="bg-slate-50 border-t border-slate-100">
                    {d.subdepartamentos.length === 0 ? (
                      <p className="text-xs text-slate-400 px-14 py-3">Sin subdepartamentos.</p>
                    ) : (
                      d.subdepartamentos.map((s) => (
                        <div key={s.id} className="flex items-center gap-4 px-5 py-3 pl-14 border-b border-slate-100 last:border-0">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-slate-700 font-medium">{s.nombre}</p>
                            <p className="text-xs text-slate-400">{s.descripcion}</p>
                          </div>
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium hidden sm:block ${s.estado ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                            {s.estado ? 'Activo' : 'Inactivo'}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setModalHistorial({ abierto: true, subNombre: s.nombre, depto: d.nombre })}
                              className="p-2 rounded-lg text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition-colors"
                              title="Historial de pertenencia"
                            >
                              <ClockCounterClockwise size={15} />
                            </button>
                            <button
                              onClick={() => abrirEditarSubdepto(d, s)}
                              className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            >
                              <PencilSimple size={15} />
                            </button>
                            <button
                              onClick={() => toggleEstadoSubdepto(d.id, s.id)}
                              className="p-2 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                            >
                              {s.estado
                                ? <ToggleRight size={18} className="text-green-500" />
                                : <ToggleLeft size={18} />}
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100">
          <p className="text-xs text-slate-400">{deptosFiltrados.length} departamento(s) encontrado(s)</p>
        </div>
      </div>

      {/* ── Modal historial de subdepartamento ── */}
      {modalHistorial.abierto && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl max-h-[80vh] flex flex-col">

            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Historial de pertenencia</h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  {modalHistorial.subNombre}
                  <span className="text-slate-400"> · {modalHistorial.depto}</span>
                </p>
              </div>
              <button
                onClick={() => setModalHistorial({ abierto: false, subNombre: '', depto: '' })}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 px-6 py-4">
              {(historialesSub[modalHistorial.subNombre] || []).length === 0 ? (
                <div className="text-center py-14 text-slate-400 text-sm">
                  Sin movimientos registrados para este subdepartamento.
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="text-left text-xs font-medium text-slate-500 pb-3 pr-4">Usuario</th>
                      <th className="text-left text-xs font-medium text-slate-500 pb-3 pr-4">Fecha de ingreso</th>
                      <th className="text-left text-xs font-medium text-slate-500 pb-3 pr-4">Fecha de salida</th>
                      <th className="text-left text-xs font-medium text-slate-500 pb-3">Rol</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {(historialesSub[modalHistorial.subNombre] || []).map((h) => (
                      <tr key={h.id} className="hover:bg-slate-50/50">
                        <td className="py-3 pr-4">
                          <p className="text-sm font-medium text-slate-900">{h.usuario}</p>
                        </td>
                        <td className="py-3 pr-4">
                          <p className="text-xs text-slate-700">{formatFecha(h.fechaIngreso)}</p>
                        </td>
                        <td className="py-3 pr-4">
                          {h.fechaSalida ? (
                            <p className="text-xs text-slate-500">{formatFecha(h.fechaSalida)}</p>
                          ) : (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Vigente</span>
                          )}
                        </td>
                        <td className="py-3">
                          {h.esLider ? (
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

      {/* Modal crear/editar */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="px-6 py-5 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-900">
                {editando
                  ? `Editar ${modalTipo === 'departamento' ? 'departamento' : 'subdepartamento'}`
                  : `Nuevo ${modalTipo === 'departamento' ? 'departamento' : 'subdepartamento'}`}
              </h2>
              {modalTipo === 'subdepartamento' && deptoSeleccionado && (
                <p className="text-xs text-slate-500 mt-1">Departamento: {deptoSeleccionado.nombre}</p>
              )}
            </div>
            <div className="px-6 py-5 flex flex-col gap-4">
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
                <label className="text-xs font-medium text-slate-700">Descripción</label>
                <textarea
                  value={form.descripcion}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  rows={3}
                  className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Descripción opcional"
                />
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
                {editando ? 'Guardar cambios' : 'Crear'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}