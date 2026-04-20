import { useState } from 'react'
import {
  Buildings,
  UserCircle,
  CaretDown,
  CaretUp,
  Phone,
  EnvelopeSimple,
  IdentificationCard,
  MagnifyingGlass,
  Plus,
  PencilSimple,
  ToggleLeft,
  ToggleRight,
  X,
} from '@phosphor-icons/react'

const clientesSimulados = [
  {
    id: 1,
    nombre: 'Empresa ABC S.A.',
    identificacion: '3-101-123456',
    correo: 'contacto@empresaabc.com',
    telefono: '+506 2222-3333',
    estado: true,
    contactos: [
      { id: 1, nombre: 'Juan', apellidos: 'Pérez Rodríguez', correo: 'jperez@empresaabc.com', telefono: '+506 8888-1111', puesto: 'Gerente General', estado: true },
      { id: 2, nombre: 'María', apellidos: 'González López', correo: 'mgonzalez@empresaabc.com', telefono: '+506 8888-2222', puesto: 'Coordinadora de TI', estado: true },
    ],
  },
  {
    id: 2,
    nombre: 'Tech Solutions CR',
    identificacion: '3-102-654321',
    correo: 'info@techsolutions.cr',
    telefono: '+506 2333-4444',
    estado: true,
    contactos: [
      { id: 3, nombre: 'Carlos', apellidos: 'Vargas Mora', correo: 'cvargas@techsolutions.cr', telefono: '+506 8777-5555', puesto: 'Director de Operaciones', estado: true },
    ],
  },
  {
    id: 3,
    nombre: 'Consultoría Digital Ltda.',
    identificacion: '3-104-321654',
    correo: 'hola@consuldigital.com',
    telefono: '+506 2555-6666',
    estado: true,
    contactos: [
      { id: 4, nombre: 'Andrea', apellidos: 'Solano Brenes', correo: 'asolano@consuldigital.com', telefono: '+506 8555-7777', puesto: 'Gerente de Proyectos', estado: true },
      { id: 5, nombre: 'Roberto', apellidos: 'Castro Fallas', correo: 'rcastro@consuldigital.com', telefono: '+506 8444-8888', puesto: 'Analista', estado: false },
    ],
  },
  {
    id: 4,
    nombre: 'Grupo Empresarial XYZ',
    identificacion: '3-103-789012',
    correo: 'admin@grupoXYZ.com',
    telefono: '+506 2444-5555',
    estado: false,
    contactos: [],
  },
]

const FORM_CLIENTE_VACIO = { nombre: '', identificacion: '', correo: '', telefono: '', estado: true }
const FORM_CONTACTO_VACIO = { nombre: '', apellidos: '', correo: '', telefono: '', puesto: '', estado: true }

const inputCls = 'w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
const labelCls = 'text-xs font-medium text-slate-600'

function EstadoBadge({ activo }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${activo ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
      {activo ? 'Activo' : 'Inactivo'}
    </span>
  )
}

function ToggleEstado({ activo, onClick }) {
  return (
    <button onClick={onClick} className={`transition-colors ${activo ? 'text-emerald-500 hover:text-emerald-600' : 'text-slate-300 hover:text-slate-400'}`}>
      {activo ? <ToggleRight size={28} weight="fill" /> : <ToggleLeft size={28} />}
    </button>
  )
}

export default function Clientes() {
  const [clientes, setClientes] = useState(clientesSimulados)
  const [busqueda, setBusqueda] = useState('')
  const [expandidos, setExpandidos] = useState({})
  const [modal, setModal] = useState({ abierto: false, tipo: '', editando: null, clienteId: null })
  const [form, setForm] = useState({})

  const clientesFiltrados = clientes.filter((c) =>
    c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.identificacion.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.correo.toLowerCase().includes(busqueda.toLowerCase())
  )

  const toggleExpandido = (id) => setExpandidos((prev) => ({ ...prev, [id]: !prev[id] }))

  const abrirModalCliente = (cliente = null) => {
    setForm(cliente ? { nombre: cliente.nombre, identificacion: cliente.identificacion, correo: cliente.correo, telefono: cliente.telefono, estado: cliente.estado } : { ...FORM_CLIENTE_VACIO })
    setModal({ abierto: true, tipo: 'cliente', editando: cliente, clienteId: null })
  }

  const abrirModalContacto = (clienteId, contacto = null) => {
    setForm(contacto ? { nombre: contacto.nombre, apellidos: contacto.apellidos, correo: contacto.correo, telefono: contacto.telefono, puesto: contacto.puesto, estado: contacto.estado } : { ...FORM_CONTACTO_VACIO })
    setModal({ abierto: true, tipo: 'contacto', editando: contacto, clienteId })
  }

  const cerrarModal = () => setModal({ abierto: false, tipo: '', editando: null, clienteId: null })

  const guardar = () => {
    if (modal.tipo === 'cliente') {
      if (modal.editando) {
        setClientes(clientes.map((c) => c.id === modal.editando.id ? { ...c, ...form } : c))
      } else {
        setClientes([...clientes, { id: Date.now(), ...form, contactos: [] }])
      }
    } else {
      setClientes(clientes.map((c) => {
        if (c.id !== modal.clienteId) return c
        if (modal.editando) {
          return { ...c, contactos: c.contactos.map((ct) => ct.id === modal.editando.id ? { ...ct, ...form } : ct) }
        } else {
          return { ...c, contactos: [...c.contactos, { id: Date.now(), ...form }] }
        }
      }))
    }
    cerrarModal()
  }

  const toggleEstadoCliente = (id) =>
    setClientes(clientes.map((c) => c.id === id ? { ...c, estado: !c.estado } : c))

  const toggleEstadoContacto = (clienteId, contactoId) =>
    setClientes(clientes.map((c) =>
      c.id === clienteId
        ? { ...c, contactos: c.contactos.map((ct) => ct.id === contactoId ? { ...ct, estado: !ct.estado } : ct) }
        : c
    ))

  const f = (campo, val) => setForm((prev) => ({ ...prev, [campo]: val !== undefined ? val : !prev[campo] }))

  const titulos = { cliente: modal.editando ? 'Editar cliente' : 'Nuevo cliente', contacto: modal.editando ? 'Editar contacto' : 'Nuevo contacto' }

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-6">

      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Clientes</h1>
          <p className="text-slate-500 text-sm mt-0.5">Gestión de clientes y contactos asociados</p>
        </div>
        <button
          onClick={() => abrirModalCliente()}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={16} />
          Nuevo cliente
        </button>
      </div>

      {/* Barra de búsqueda */}
      <div className="relative">
        <MagnifyingGlass size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar por nombre, identificación o correo..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        />
      </div>

      {/* Lista de clientes */}
      <div className="flex flex-col gap-3">
        {clientesFiltrados.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-10 text-center text-slate-400 text-sm">
            No se encontraron clientes.
          </div>
        )}

        {clientesFiltrados.map((cliente) => (
          <div key={cliente.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">

            {/* Fila del cliente */}
            <div className="flex items-center gap-4 px-5 py-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                <Buildings size={20} className="text-blue-500" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-slate-900 text-sm">{cliente.nombre}</span>
                  <EstadoBadge activo={cliente.estado} />
                </div>
                <div className="flex items-center gap-4 mt-1 flex-wrap">
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <IdentificationCard size={12} />
                    {cliente.identificacion}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <EnvelopeSimple size={12} />
                    {cliente.correo}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <Phone size={12} />
                    {cliente.telefono}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-slate-400">
                  {cliente.contactos.length} {cliente.contactos.length === 1 ? 'contacto' : 'contactos'}
                </span>
                <button
                  onClick={() => abrirModalCliente(cliente)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                  title="Editar cliente"
                >
                  <PencilSimple size={15} />
                </button>
                <ToggleEstado activo={cliente.estado} onClick={() => toggleEstadoCliente(cliente.id)} />
                <button
                  onClick={() => toggleExpandido(cliente.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  {expandidos[cliente.id] ? <CaretUp size={15} /> : <CaretDown size={15} />}
                </button>
              </div>
            </div>

            {/* Panel de contactos */}
            {expandidos[cliente.id] && (
              <div className="border-t border-slate-100 bg-slate-50 px-5 py-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
                    Contactos
                  </p>
                  <button
                    onClick={() => abrirModalContacto(cliente.id)}
                    className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <Plus size={13} />
                    Agregar contacto
                  </button>
                </div>

                {cliente.contactos.length === 0 ? (
                  <p className="text-sm text-slate-400 py-2">Sin contactos registrados.</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {cliente.contactos.map((ct) => (
                      <div key={ct.id} className="flex items-center gap-3 bg-white rounded-lg border border-slate-200 px-4 py-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                          <UserCircle size={18} className="text-slate-400" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-medium text-slate-800">{ct.nombre} {ct.apellidos}</span>
                            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{ct.puesto}</span>
                            <EstadoBadge activo={ct.estado} />
                          </div>
                          <div className="flex items-center gap-4 mt-0.5 flex-wrap">
                            <span className="flex items-center gap-1 text-xs text-slate-500">
                              <EnvelopeSimple size={11} />
                              {ct.correo}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-slate-500">
                              <Phone size={11} />
                              {ct.telefono}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => abrirModalContacto(cliente.id, ct)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Editar contacto"
                          >
                            <PencilSimple size={14} />
                          </button>
                          <ToggleEstado activo={ct.estado} onClick={() => toggleEstadoContacto(cliente.id, ct.id)} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      {modal.abierto && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md flex flex-col max-h-[90vh]">

            {/* Header modal */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-900">{titulos[modal.tipo]}</h2>
              <button onClick={cerrarModal} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Cuerpo modal */}
            <div className="overflow-y-auto px-6 py-5 flex flex-col gap-4">

              {modal.tipo === 'cliente' && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className={labelCls}>Nombre de la organización</label>
                    <input className={inputCls} placeholder="Ej: Empresa ABC S.A." value={form.nombre} onChange={(e) => f('nombre', e.target.value)} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className={labelCls}>Identificación</label>
                    <input className={inputCls} placeholder="Ej: 3-101-123456" value={form.identificacion} onChange={(e) => f('identificacion', e.target.value)} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className={labelCls}>Correo electrónico</label>
                    <input type="email" className={inputCls} placeholder="correo@empresa.com" value={form.correo} onChange={(e) => f('correo', e.target.value)} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className={labelCls}>Teléfono</label>
                    <input className={inputCls} placeholder="+506 2222-3333" value={form.telefono} onChange={(e) => f('telefono', e.target.value)} />
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className={labelCls}>Estado</span>
                    <ToggleEstado activo={form.estado} onClick={() => f('estado')} />
                  </div>
                </>
              )}

              {modal.tipo === 'contacto' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1.5">
                      <label className={labelCls}>Nombre</label>
                      <input className={inputCls} placeholder="Juan" value={form.nombre} onChange={(e) => f('nombre', e.target.value)} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className={labelCls}>Apellidos</label>
                      <input className={inputCls} placeholder="Pérez Rodríguez" value={form.apellidos} onChange={(e) => f('apellidos', e.target.value)} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className={labelCls}>Correo electrónico</label>
                    <input type="email" className={inputCls} placeholder="correo@empresa.com" value={form.correo} onChange={(e) => f('correo', e.target.value)} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className={labelCls}>Teléfono</label>
                    <input className={inputCls} placeholder="+506 8888-1111" value={form.telefono} onChange={(e) => f('telefono', e.target.value)} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className={labelCls}>Puesto</label>
                    <input className={inputCls} placeholder="Gerente General" value={form.puesto} onChange={(e) => f('puesto', e.target.value)} />
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className={labelCls}>Estado</span>
                    <ToggleEstado activo={form.estado} onClick={() => f('estado')} />
                  </div>
                </>
              )}

            </div>

            {/* Footer modal */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100">
              <button onClick={cerrarModal} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors">
                Cancelar
              </button>
              <button
                onClick={guardar}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                {modal.editando ? 'Guardar cambios' : 'Crear'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
