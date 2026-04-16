import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Plus,
  PencilSimple,
  CheckCircle,
  Circle,
  CaretDown,
  CaretRight,
  Clock,
  User,
  Paperclip,
  ChatCircle,
  ToggleRight,
  ToggleLeft,
} from '@phosphor-icons/react'

const ordenDetalle = {
  id: 1,
  codigo: 'OS-001',
  nombre: 'Desarrollo plataforma e-commerce',
  cliente: 'Empresa ABC',
  contacto: 'Juan Pérez',
  tipo: 'Proyecto',
  subtipo: null,
  estado: 'En progreso',
  esCobrable: true,
  fechaInicio: '2026-01-15',
  fechaFin: '2026-06-30',
  responsable: 'Sofía Barboza',
  descripcion: 'Desarrollo completo de plataforma e-commerce con módulos de catálogo, carrito, pagos y reportes.',
  progreso: 65,
  fases: [
    {
      id: 1, nombre: 'Fase 1 — Diseño', estado: 'finalizada', esCobrable: true,
      tiempoEstimado: 120, tiempoReal: 118, expandida: true,
      entregables: [
        {
          id: 1, nombre: 'Diseño UI/UX', estado: 'finalizada', esCobrable: true,
          tiempoEstimado: 80, tiempoReal: 82, expandida: true,
          paquetes: [
            {
              id: 1, nombre: 'Wireframes', estado: 'finalizada', esCobrable: true,
              tiempoEstimado: 40, tiempoReal: 38, expandida: false,
              actividades: [
                {
                  id: 1, nombre: 'Wireframes mobile', estado: 'finalizada', esCobrable: true,
                  tiempoEstimado: 20, tiempoReal: 18,
                  tareas: [
                    { id: 1, nombre: 'Pantallas principales', estado: 'finalizada', esCobrable: true, responsable: 'Armando N.', tiempoEstimado: 10, tiempoReal: 9,
                      subtareas: [
                        { id: 1, nombre: 'Login y registro', estado: 'finalizada', esCobrable: true, responsable: 'Armando N.', tiempoEstimado: 5, tiempoReal: 4 },
                        { id: 2, nombre: 'Home y catálogo', estado: 'finalizada', esCobrable: true, responsable: 'Armando N.', tiempoEstimado: 5, tiempoReal: 5 },
                      ]
                    },
                  ]
                },
              ]
            },
          ]
        },
      ]
    },
    {
      id: 2, nombre: 'Fase 2 — Desarrollo', estado: 'en_progreso', esCobrable: true,
      tiempoEstimado: 400, tiempoReal: 180, expandida: false,
      entregables: []
    },
  ]
}

const estadoIcono = (estado) => {
  if (estado === 'finalizada') return <CheckCircle size={16} weight="fill" className="text-green-500 shrink-0" />
  if (estado === 'en_progreso') return <Circle size={16} weight="fill" className="text-blue-400 shrink-0" />
  return <Circle size={16} className="text-slate-300 shrink-0" />
}

const estadoLabel = { finalizada: 'Finalizada', en_progreso: 'En progreso', pendiente: 'Pendiente' }
const estadoClase = {
  finalizada: 'bg-green-100 text-green-700',
  en_progreso: 'bg-blue-100 text-blue-700',
  pendiente: 'bg-slate-100 text-slate-500',
}

export default function OrdenDetalle() {
  const navigate = useNavigate()
  const [orden, setOrden] = useState(ordenDetalle)
  const [fases, setFases] = useState(ordenDetalle.fases)
  const [tabActiva, setTabActiva] = useState('estructura')
  const [expandidos, setExpandidos] = useState({ fases: [1], entregables: [1], paquetes: [], actividades: [], tareas: [] })

  const toggle = (nivel, id) => {
    setExpandidos((prev) => ({
      ...prev,
      [nivel]: prev[nivel].includes(id) ? prev[nivel].filter((x) => x !== id) : [...prev[nivel], id]
    }))
  }

  const isOpen = (nivel, id) => expandidos[nivel].includes(id)

  return (
    <div className="flex flex-col gap-6">

      {/* Encabezado */}
      <div>
        <button
          onClick={() => navigate('/ordenes')}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-4 transition-colors"
        >
          <ArrowLeft size={16} /> Volver a órdenes
        </button>

        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-sm font-semibold text-slate-500">{orden.codigo}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 font-medium">{orden.tipo}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium">{orden.estado}</span>
              {!orden.esCobrable && <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">No cobrable</span>}
            </div>
            <h1 className="text-2xl font-bold text-slate-900">{orden.nombre}</h1>
            <p className="text-sm text-slate-500 mt-1">{orden.cliente} · {orden.contacto} · Responsable: {orden.responsable}</p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button className="flex items-center gap-2 border border-slate-200 text-slate-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors">
              <PencilSimple size={15} /> Editar
            </button>
            <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
              <CheckCircle size={15} /> Cerrar orden
            </button>
          </div>
        </div>

        {/* Info rápida */}
        <div className="flex gap-6 mt-4 flex-wrap">
          <div className="text-xs text-slate-500">
            <span className="font-medium text-slate-700">Inicio:</span> {orden.fechaInicio}
          </div>
          <div className="text-xs text-slate-500">
            <span className="font-medium text-slate-700">Fin estimado:</span> {orden.fechaFin}
          </div>
          <div className="text-xs text-slate-500">
            <span className="font-medium text-slate-700">Progreso:</span> {orden.progreso}%
          </div>
          <div className="w-32">
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${orden.progreso}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-200">
        {['estructura', 'bitacora', 'adjuntos'].map((tab) => (
          <button
            key={tab}
            onClick={() => setTabActiva(tab)}
            className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
              tabActiva === tab
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab === 'estructura' ? 'Estructura' : tab === 'bitacora' ? 'Bitácora' : 'Adjuntos'}
          </button>
        ))}
      </div>

      {/* Tab: Estructura */}
      {tabActiva === 'estructura' && (
        <div className="flex flex-col gap-3">
          <div className="flex justify-end">
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors">
              <Plus size={14} /> Nueva fase
            </button>
          </div>

          {fases.map((fase) => (
            <div key={fase.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden">

              {/* Fila fase */}
              <div
                className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => toggle('fases', fase.id)}
              >
                {isOpen('fases', fase.id) ? <CaretDown size={14} className="text-slate-400 shrink-0" /> : <CaretRight size={14} className="text-slate-400 shrink-0" />}
                {estadoIcono(fase.estado)}
                <p className="text-sm font-semibold text-slate-900 flex-1">{fase.nombre}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium hidden sm:block ${estadoClase[fase.estado]}`}>
                  {estadoLabel[fase.estado]}
                </span>
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <Clock size={13} />
                  {fase.tiempoReal}h / {fase.tiempoEstimado}h
                </div>
                <button className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors ml-2">
                  <Plus size={14} />
                </button>
              </div>

              {/* Entregables */}
              {isOpen('fases', fase.id) && (
                <div className="border-t border-slate-100">
                  {fase.entregables.length === 0 ? (
                    <p className="text-xs text-slate-400 px-10 py-3">Sin entregables.</p>
                  ) : (
                    fase.entregables.map((ent) => (
                      <div key={ent.id}>
                        <div
                          className="flex items-center gap-3 px-4 py-3 pl-10 cursor-pointer hover:bg-slate-50 transition-colors border-b border-slate-50"
                          onClick={() => toggle('entregables', ent.id)}
                        >
                          {isOpen('entregables', ent.id) ? <CaretDown size={13} className="text-slate-400 shrink-0" /> : <CaretRight size={13} className="text-slate-400 shrink-0" />}
                          {estadoIcono(ent.estado)}
                          <p className="text-sm font-medium text-slate-800 flex-1">{ent.nombre}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium hidden sm:block ${estadoClase[ent.estado]}`}>
                            {estadoLabel[ent.estado]}
                          </span>
                          <div className="flex items-center gap-1 text-xs text-slate-400">
                            <Clock size={13} />
                            {ent.tiempoReal}h / {ent.tiempoEstimado}h
                          </div>
                          <button className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors ml-2">
                            <Plus size={14} />
                          </button>
                        </div>

                        {/* Paquetes */}
                        {isOpen('entregables', ent.id) && ent.paquetes.map((paq) => (
                          <div key={paq.id}>
                            <div
                              className="flex items-center gap-3 px-4 py-2.5 pl-16 cursor-pointer hover:bg-slate-50 transition-colors border-b border-slate-50"
                              onClick={() => toggle('paquetes', paq.id)}
                            >
                              {isOpen('paquetes', paq.id) ? <CaretDown size={12} className="text-slate-400 shrink-0" /> : <CaretRight size={12} className="text-slate-400 shrink-0" />}
                              {estadoIcono(paq.estado)}
                              <p className="text-sm text-slate-700 flex-1">{paq.nombre}</p>
                              <div className="flex items-center gap-1 text-xs text-slate-400">
                                <Clock size={12} />
                                {paq.tiempoReal}h / {paq.tiempoEstimado}h
                              </div>
                              <button className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors ml-2">
                                <Plus size={13} />
                              </button>
                            </div>

                            {/* Actividades */}
                            {isOpen('paquetes', paq.id) && paq.actividades.map((act) => (
                              <div key={act.id}>
                                <div
                                  className="flex items-center gap-3 px-4 py-2.5 pl-20 cursor-pointer hover:bg-slate-50 transition-colors border-b border-slate-50"
                                  onClick={() => toggle('actividades', act.id)}
                                >
                                  {isOpen('actividades', act.id) ? <CaretDown size={12} className="text-slate-400 shrink-0" /> : <CaretRight size={12} className="text-slate-400 shrink-0" />}
                                  {estadoIcono(act.estado)}
                                  <p className="text-sm text-slate-700 flex-1">{act.nombre}</p>
                                  <div className="flex items-center gap-1 text-xs text-slate-400">
                                    <Clock size={12} />
                                    {act.tiempoReal}h / {act.tiempoEstimado}h
                                  </div>
                                  <button className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors ml-2">
                                    <Plus size={13} />
                                  </button>
                                </div>

                                {/* Tareas */}
                                {isOpen('actividades', act.id) && act.tareas.map((tarea) => (
                                  <div key={tarea.id}>
                                    <div
                                      className="flex items-center gap-3 px-4 py-2.5 pl-24 cursor-pointer hover:bg-slate-50 transition-colors border-b border-slate-50"
                                      onClick={() => toggle('tareas', tarea.id)}
                                    >
                                      {isOpen('tareas', tarea.id) ? <CaretDown size={11} className="text-slate-400 shrink-0" /> : <CaretRight size={11} className="text-slate-400 shrink-0" />}
                                      {estadoIcono(tarea.estado)}
                                      <p className="text-sm text-slate-700 flex-1">{tarea.nombre}</p>
                                      <div className="flex items-center gap-1 text-xs text-slate-400">
                                        <User size={12} /> {tarea.responsable}
                                      </div>
                                      <div className="flex items-center gap-1 text-xs text-slate-400 ml-3">
                                        <Clock size={12} />
                                        {tarea.tiempoReal}h / {tarea.tiempoEstimado}h
                                      </div>
                                      <button className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors ml-2">
                                        <Plus size={12} />
                                      </button>
                                    </div>

                                    {/* Subtareas */}
                                    {isOpen('tareas', tarea.id) && tarea.subtareas.map((sub) => (
                                      <div key={sub.id}
                                        className="flex items-center gap-3 px-4 py-2 pl-28 border-b border-slate-50 hover:bg-slate-50 transition-colors"
                                      >
                                        {estadoIcono(sub.estado)}
                                        <p className="text-xs text-slate-600 flex-1">{sub.nombre}</p>
                                        <div className="flex items-center gap-1 text-xs text-slate-400">
                                          <User size={11} /> {sub.responsable}
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-slate-400 ml-3">
                                          <Clock size={11} />
                                          {sub.tiempoReal}h / {sub.tiempoEstimado}h
                                        </div>
                                        <button className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors ml-2">
                                          <ChatCircle size={13} />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                ))}
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tab: Bitácora */}
      {tabActiva === 'bitacora' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col gap-4">
          <div className="flex justify-end">
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors">
              <Plus size={14} /> Agregar comentario
            </button>
          </div>
          <div className="flex flex-col gap-4">
            {[
              { usuario: 'Sofía Barboza', fecha: '2026-04-08 10:30', comentario: 'Se completó la fase de diseño. Todos los wireframes aprobados por el cliente.' },
              { usuario: 'Armando Núñez', fecha: '2026-04-05 14:15', comentario: 'Iniciamos el desarrollo del módulo de catálogo. Estimamos 3 semanas.' },
            ].map((c, i) => (
              <div key={i} className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 text-xs font-bold text-blue-600">
                  {c.usuario.charAt(0)}
                </div>
                <div className="flex-1 bg-slate-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-slate-900">{c.usuario}</span>
                    <span className="text-xs text-slate-400">{c.fecha}</span>
                  </div>
                  <p className="text-sm text-slate-700">{c.comentario}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Adjuntos */}
      {tabActiva === 'adjuntos' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col gap-4">
          <div className="flex justify-end">
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors">
              <Paperclip size={14} /> Subir archivo
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {[
              { nombre: 'Minuta_kickoff.pdf', descripcion: 'Minuta de reunión inicial', fecha: '2026-01-15' },
              { nombre: 'Wireframes_v2.fig', descripcion: 'Diseños finales aprobados', fecha: '2026-02-20' },
            ].map((a, i) => (
              <div key={i} className="flex items-center gap-3 p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                <Paperclip size={16} className="text-slate-400 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">{a.nombre}</p>
                  <p className="text-xs text-slate-500">{a.descripcion} · {a.fecha}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}