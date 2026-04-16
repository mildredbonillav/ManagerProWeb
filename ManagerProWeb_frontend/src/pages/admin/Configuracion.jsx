import { useState } from 'react'
import {
  Gear,
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
} from '@phosphor-icons/react'

const secciones = [
  { id: 'correo', label: 'Correo electrónico', icon: EnvelopeSimple },
  { id: 'jornadas', label: 'Tipos de jornada', icon: Clock },
  { id: 'categorias', label: 'Categorías de labor', icon: Tag },
  { id: 'ambientes', label: 'Tipos de ambiente', icon: Globe },
  { id: 'calendario', label: 'Eventos de calendario', icon: CalendarBlank },
]

const jornadasSimuladas = [
  { id: 1, nombre: 'Jornada ordinaria', descripcion: 'Lunes a viernes 8am-5pm', esExtraordinaria: false, estado: true },
  { id: 2, nombre: 'Jornada mixta', descripcion: 'Lunes a sábado', esExtraordinaria: false, estado: true },
  { id: 3, nombre: 'Horas extra', descripcion: 'Fuera del horario ordinario', esExtraordinaria: true, estado: true },
]

const categoriasSimuladas = [
  {
    id: 1, nombre: 'Desarrollo', estado: true,
    subcategorias: [
      { id: 1, nombre: 'Frontend', estado: true, tipos: [{ id: 1, nombre: 'Diseño UI', estado: true }, { id: 2, nombre: 'Implementación', estado: true }] },
      { id: 2, nombre: 'Backend', estado: true, tipos: [{ id: 3, nombre: 'API REST', estado: true }, { id: 4, nombre: 'Base de datos', estado: false }] },
    ]
  },
  {
    id: 2, nombre: 'Soporte', estado: true,
    subcategorias: [
      { id: 3, nombre: 'Incidencias', estado: true, tipos: [{ id: 5, nombre: 'Nivel 1', estado: true }] },
    ]
  },
]

const ambientesSimulados = [
  { id: 1, nombre: 'Desarrollo', descripcion: 'Ambiente local de desarrollo', estado: true },
  { id: 2, nombre: 'Testing', descripcion: 'Ambiente de pruebas QA', estado: true },
  { id: 3, nombre: 'Producción', descripcion: 'Ambiente productivo del cliente', estado: true },
  { id: 4, nombre: 'Staging', descripcion: 'Pre-producción', estado: true },
]

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

export default function Configuracion() {
  const [seccionActiva, setSeccionActiva] = useState('correo')
  const [correoForm, setCorreoForm] = useState({ cuenta: 'notificaciones@businesspro.com', contrasena: '', servidor: 'smtp.gmail.com', puerto: '587' })
  const [correoGuardado, setCorreoGuardado] = useState(false)

  const [jornadas, setJornadas] = useState(jornadasSimuladas)
  const [categorias, setCategorias] = useState(categoriasSimuladas)
  const [ambientes, setAmbientes] = useState(ambientesSimulados)
  const [tiposEvento, setTiposEvento] = useState(tiposEventoSimulados)
  const [eventos, setEventos] = useState(eventosSimulados)

  const [modal, setModal] = useState({ abierto: false, tipo: '', editando: null, extra: null })
  const [form, setForm] = useState({})

  const abrirModal = (tipo, editando = null, extra = null) => {
    setModal({ abierto: true, tipo, editando, extra })
    setForm(editando ? { ...editando } : {})
  }

  const cerrarModal = () => setModal({ abierto: false, tipo: '', editando: null, extra: null })

  const guardarCorreo = () => setCorreoGuardado(true)

  const toggleJornada = (id) => setJornadas(jornadas.map((j) => j.id === id ? { ...j, estado: !j.estado } : j))
  const toggleAmbiente = (id) => setAmbientes(ambientes.map((a) => a.id === id ? { ...a, estado: !a.estado } : a))
  const toggleTipoEvento = (id) => setTiposEvento(tiposEvento.map((t) => t.id === id ? { ...t, estado: !t.estado } : t))
  const toggleEvento = (id) => setEventos(eventos.map((e) => e.id === id ? { ...e, estado: !e.estado } : e))

  const guardarModal = () => {
    if (modal.tipo === 'jornada') {
      if (modal.editando) setJornadas(jornadas.map((j) => j.id === modal.editando.id ? { ...j, ...form } : j))
      else setJornadas([...jornadas, { id: Date.now(), estado: true, ...form }])
    }
    if (modal.tipo === 'ambiente') {
      if (modal.editando) setAmbientes(ambientes.map((a) => a.id === modal.editando.id ? { ...a, ...form } : a))
      else setAmbientes([...ambientes, { id: Date.now(), estado: true, ...form }])
    }
    if (modal.tipo === 'tipoEvento') {
      if (modal.editando) setTiposEvento(tiposEvento.map((t) => t.id === modal.editando.id ? { ...t, ...form } : t))
      else setTiposEvento([...tiposEvento, { id: Date.now(), estado: true, ...form }])
    }
    if (modal.tipo === 'evento') {
      if (modal.editando) setEventos(eventos.map((e) => e.id === modal.editando.id ? { ...e, ...form } : e))
      else setEventos([...eventos, { id: Date.now(), estado: true, ...form }])
    }
    cerrarModal()
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Encabezado */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Configuración</h1>
        <p className="text-sm text-slate-500 mt-1">Parámetros generales del sistema</p>
      </div>

      <div className="flex gap-6">

        {/* Menú lateral de secciones */}
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

        {/* Contenido de la sección */}
        <div className="flex-1">

          {/* Correo */}
          {seccionActiva === 'correo' && (
            <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col gap-5">
              <h2 className="text-base font-semibold text-slate-900">Configuración de correo electrónico</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 col-span-2">
                  <label className="text-xs font-medium text-slate-700">Cuenta emisora</label>
                  <input type="email" value={correoForm.cuenta} onChange={(e) => setCorreoForm({ ...correoForm, cuenta: e.target.value })}
                    className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="flex flex-col gap-1.5 col-span-2">
                  <label className="text-xs font-medium text-slate-700">Contraseña</label>
                  <input type="password" value={correoForm.contrasena} onChange={(e) => setCorreoForm({ ...correoForm, contrasena: e.target.value })}
                    placeholder="••••••••"
                    className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-slate-700">Servidor SMTP</label>
                  <input type="text" value={correoForm.servidor} onChange={(e) => setCorreoForm({ ...correoForm, servidor: e.target.value })}
                    className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-slate-700">Puerto</label>
                  <input type="number" value={correoForm.puerto} onChange={(e) => setCorreoForm({ ...correoForm, puerto: e.target.value })}
                    className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={guardarCorreo}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                  <FloppyDisk size={16} />
                  Guardar configuración
                </button>
                {correoGuardado && <span className="text-xs text-green-600 font-medium">✓ Guardado correctamente</span>}
              </div>
            </div>
          )}

          {/* Jornadas */}
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
                  <div key={j.id} className="flex items-center gap-4 px-5 py-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-slate-900">{j.nombre}</p>
                        {j.esExtraordinaria && (
                          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Extraordinaria</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">{j.descripcion}</p>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${j.estado ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                      {j.estado ? 'Activo' : 'Inactivo'}
                    </span>
                    <div className="flex items-center gap-1">
                      <button onClick={() => abrirModal('jornada', j)} className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                        <PencilSimple size={15} />
                      </button>
                      <button onClick={() => toggleJornada(j.id)} className="p-2 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors">
                        {j.estado ? <ToggleRight size={18} className="text-green-500" /> : <ToggleLeft size={18} />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Categorías */}
          {seccionActiva === 'categorias' && (
            <div className="bg-white rounded-xl border border-slate-200">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <h2 className="text-base font-semibold text-slate-900">Categorías de labor</h2>
              </div>
              <div className="divide-y divide-slate-100">
                {categorias.map((cat) => (
                  <div key={cat.id}>
                    <div className="flex items-center gap-4 px-5 py-4 bg-slate-50">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-900">{cat.nombre}</p>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${cat.estado ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                        {cat.estado ? 'Activo' : 'Inactivo'}
                      </span>
                    </div>
                    {cat.subcategorias.map((sub) => (
                      <div key={sub.id}>
                        <div className="flex items-center gap-4 px-5 py-3 pl-10 border-t border-slate-100">
                          <div className="flex-1">
                            <p className="text-sm text-slate-700 font-medium">{sub.nombre}</p>
                          </div>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${sub.estado ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                            {sub.estado ? 'Activo' : 'Inactivo'}
                          </span>
                        </div>
                        {sub.tipos.map((tipo) => (
                          <div key={tipo.id} className="flex items-center gap-4 px-5 py-2 pl-16 border-t border-slate-50">
                            <div className="flex-1">
                              <p className="text-xs text-slate-600">{tipo.nombre}</p>
                            </div>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${tipo.estado ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                              {tipo.estado ? 'Activo' : 'Inactivo'}
                            </span>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Ambientes */}
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
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${a.estado ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                      {a.estado ? 'Activo' : 'Inactivo'}
                    </span>
                    <div className="flex items-center gap-1">
                      <button onClick={() => abrirModal('ambiente', a)} className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                        <PencilSimple size={15} />
                      </button>
                      <button onClick={() => toggleAmbiente(a.id)} className="p-2 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors">
                        {a.estado ? <ToggleRight size={18} className="text-green-500" /> : <ToggleLeft size={18} />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Calendario */}
          {seccionActiva === 'calendario' && (
            <div className="flex flex-col gap-4">

              {/* Tipos de evento */}
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
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${t.estado ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                        {t.estado ? 'Activo' : 'Inactivo'}
                      </span>
                      <div className="flex items-center gap-1">
                        <button onClick={() => abrirModal('tipoEvento', t)} className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                          <PencilSimple size={15} />
                        </button>
                        <button onClick={() => toggleTipoEvento(t.id)} className="p-2 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors">
                          {t.estado ? <ToggleRight size={18} className="text-green-500" /> : <ToggleLeft size={18} />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Eventos */}
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
                          {e.fecha} · {e.todoElDia ? 'Todo el día' : `${e.horaInicio} - ${e.horaFin}`} · {e.tipo}
                        </p>
                      </div>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${e.estado ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                        {e.estado ? 'Activo' : 'Inactivo'}
                      </span>
                      <div className="flex items-center gap-1">
                        <button onClick={() => abrirModal('evento', e)} className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                          <PencilSimple size={15} />
                        </button>
                        <button onClick={() => toggleEvento(e.id)} className="p-2 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors">
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

      {/* Modal genérico */}
      {modal.abierto && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="px-6 py-5 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-900">
                {modal.editando ? 'Editar' : 'Nuevo'} {modal.tipo === 'jornada' ? 'tipo de jornada' : modal.tipo === 'ambiente' ? 'tipo de ambiente' : modal.tipo === 'tipoEvento' ? 'tipo de evento' : 'evento'}
              </h2>
            </div>
            <div className="px-6 py-5 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-700">Nombre</label>
                <input type="text" value={form.nombre || ''} onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Nombre" />
              </div>

              {(modal.tipo === 'jornada' || modal.tipo === 'ambiente') && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-slate-700">Descripción</label>
                  <input type="text" value={form.descripcion || ''} onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                    className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Descripción" />
                </div>
              )}

              {modal.tipo === 'jornada' && (
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="extraordinaria" checked={form.esExtraordinaria || false}
                    onChange={(e) => setForm({ ...form, esExtraordinaria: e.target.checked })}
                    className="w-4 h-4 accent-blue-600" />
                  <label htmlFor="extraordinaria" className="text-sm text-slate-700">Es jornada extraordinaria</label>
                </div>
              )}

              {modal.tipo === 'evento' && (
                <>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-slate-700">Fecha</label>
                    <input type="date" value={form.fecha || ''} onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                      className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" id="todoElDia" checked={form.todoElDia !== false}
                      onChange={(e) => setForm({ ...form, todoElDia: e.target.checked })}
                      className="w-4 h-4 accent-blue-600" />
                    <label htmlFor="todoElDia" className="text-sm text-slate-700">Todo el día</label>
                  </div>
                  {form.todoElDia === false && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-slate-700">Hora inicio</label>
                        <input type="time" value={form.horaInicio || ''} onChange={(e) => setForm({ ...form, horaInicio: e.target.value })}
                          className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-slate-700">Hora fin</label>
                        <input type="time" value={form.horaFin || ''} onChange={(e) => setForm({ ...form, horaFin: e.target.value })}
                          className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                    </div>
                  )}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-slate-700">Tipo de evento</label>
                    <select value={form.tipo || ''} onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                      className="px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                      <option value="">Seleccionar...</option>
                      {tiposEvento.map((t) => <option key={t.id}>{t.nombre}</option>)}
                    </select>
                  </div>
                </>
              )}
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
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