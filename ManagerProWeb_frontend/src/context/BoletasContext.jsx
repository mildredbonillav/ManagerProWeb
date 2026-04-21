import { createContext, useContext, useState } from 'react'

const BoletasContext = createContext(null)
export const useBoletasCtx = () => useContext(BoletasContext)

function calcHoras(inicio, fin) {
  if (!inicio || !fin) return 0
  const [h1, m1] = inicio.split(':').map(Number)
  const [h2, m2] = fin.split(':').map(Number)
  return Math.max(0, Math.round(((h2 * 60 + m2) - (h1 * 60 + m1)) / 60 * 10) / 10)
}

// ─── Datos iniciales ───────────────────────────────────────────────
const subtareasIniciales = [
  { id: 1, codigo: 'SUB-001', os: 'OS-001', osNombre: 'Plataforma e-commerce', tarea: 'Pantallas principales', nombre: 'Login y registro', estimado: 5, real: 4, estado: 'en_progreso', prioridad: 'alta', esCobrable: true },
  { id: 2, codigo: 'SUB-002', os: 'OS-001', osNombre: 'Plataforma e-commerce', tarea: 'Pantallas principales', nombre: 'Home y catálogo', estimado: 5, real: 5, estado: 'finalizada', prioridad: 'media', esCobrable: true },
  { id: 3, codigo: 'SUB-003', os: 'OS-001', osNombre: 'Plataforma e-commerce', tarea: 'Módulo de pagos', nombre: 'Integración pasarela', estimado: 10, real: 2, estado: 'en_progreso', prioridad: 'alta', esCobrable: true },
  { id: 4, codigo: 'SUB-004', os: 'OS-001', osNombre: 'Plataforma e-commerce', tarea: 'Módulo de pagos', nombre: 'Pantalla confirmación', estimado: 4, real: 0, estado: 'pendiente', prioridad: 'media', esCobrable: true },
  { id: 5, codigo: 'SUB-005', os: 'OS-003', osNombre: 'Incremento módulo reportes', tarea: 'Reportes de ventas', nombre: 'Diseño de vistas', estimado: 6, real: 1, estado: 'en_progreso', prioridad: 'baja', esCobrable: false },
  { id: 6, codigo: 'SUB-006', os: 'OS-003', osNombre: 'Incremento módulo reportes', tarea: 'Reportes de ventas', nombre: 'Exportación PDF', estimado: 8, real: 0, estado: 'pendiente', prioridad: 'media', esCobrable: false },
  { id: 7, codigo: 'SUB-007', os: 'OS-001', osNombre: 'Plataforma e-commerce', tarea: 'Módulo de pagos', nombre: 'Manejo de errores de pago', estimado: 3, real: 0, estado: 'pendiente', prioridad: 'alta', esCobrable: true },
]

const boletasIniciales = [
  { id: 1, subtareaId: 1, subtarea: 'Login y registro', orden: 'OS-001', fecha: '2026-04-10', horaInicio: '08:00', horaFin: '12:00', horas: 4, categoria: 'Desarrollo', subcategoria: 'Frontend', tipoLabor: 'Implementación', descripcion: 'Implementación del formulario de login', esCobrable: true, estado: 'registrada' },
  { id: 2, subtareaId: 3, subtarea: 'Integración pasarela', orden: 'OS-001', fecha: '2026-04-10', horaInicio: '13:00', horaFin: '15:00', horas: 2, categoria: 'Desarrollo', subcategoria: 'Backend', tipoLabor: 'API REST', descripcion: 'Configuración inicial de Stripe', esCobrable: true, estado: 'registrada' },
  { id: 3, subtareaId: 5, subtarea: 'Diseño de vistas', orden: 'OS-003', fecha: '2026-04-09', horaInicio: '09:00', horaFin: '11:00', horas: 2, categoria: 'Diseño', subcategoria: 'UI/UX', tipoLabor: 'Prototipado', descripcion: 'Mockups de reportes de ventas', esCobrable: false, estado: 'registrada' },
  { id: 4, subtareaId: 1, subtarea: 'Login y registro', orden: 'OS-001', fecha: '2026-04-08', horaInicio: '08:00', horaFin: '10:00', horas: 2, categoria: 'Desarrollo', subcategoria: 'Frontend', tipoLabor: 'Implementación', descripcion: 'Validaciones del formulario', esCobrable: true, estado: 'registrada' },
  { id: 5, subtareaId: 3, subtarea: 'Integración pasarela', orden: 'OS-001', fecha: '2026-04-07', horaInicio: '10:00', horaFin: '12:00', horas: 2, categoria: 'Desarrollo', subcategoria: 'Backend', tipoLabor: 'API REST', descripcion: 'Webhooks de confirmación', esCobrable: true, estado: 'borrador' },
]

const solicitudesIncrementoIniciales = [
  {
    id: 1, subtareaId: 3, subtareaNombre: 'Integración pasarela', os: 'OS-001', recurso: 'Sofía Barboza',
    horasAdicionales: 4, causa: 'Complejidad inesperada', justificacion: 'La API de Stripe tiene más endpoints de los estimados inicialmente.',
    boletaData: { fecha: '2026-04-07', horaInicio: '10:00', horaFin: '12:00', horas: 2, categoria: 'Desarrollo', subcategoria: 'Backend', tipoLabor: 'API REST', descripcion: 'Webhooks de confirmación', esCobrable: true },
    estado: 'pendiente', motivoRechazo: '', borradorId: 5, fecha: '2026-04-07',
  },
  {
    id: 2, subtareaId: 5, subtareaNombre: 'Diseño de vistas', os: 'OS-003', recurso: 'Armando Núñez',
    horasAdicionales: 2, causa: 'Cambio en requerimientos', justificacion: 'El cliente solicitó incluir gráficos adicionales no contemplados.',
    boletaData: { fecha: '2026-04-06', horaInicio: '09:00', horaFin: '11:00', horas: 2, categoria: 'Diseño', subcategoria: 'UI/UX', tipoLabor: 'Prototipado', descripcion: 'Gráficos adicionales del cliente', esCobrable: false },
    estado: 'aprobada', motivoRechazo: '', borradorId: null, fecha: '2026-04-06',
  },
]

const solicitudesNuevaTareaIniciales = [
  {
    id: 1, os: 'OS-001', osNombre: 'Plataforma e-commerce', recurso: 'Sofía Barboza',
    nombre: 'Notificaciones por correo', descripcion: 'Implementar envío de correos transaccionales para confirmación de compra y recuperación de contraseña.',
    estimacion: 6, causa: 'Solicitud del cliente', justificacion: 'El cliente requirió agregar notificaciones en la revisión de sprint del 15 de abril.',
    estado: 'pendiente', motivoRechazo: '', fecha: '2026-04-08',
  },
  {
    id: 2, os: 'OS-003', osNombre: 'Incremento módulo reportes', recurso: 'Armando Núñez',
    nombre: 'Exportación a Excel', descripcion: 'Agregar opción de exportar los reportes en formato XLSX con formato condicional.',
    estimacion: 4, causa: 'Mejora identificada', justificacion: 'Muchos usuarios utilizan Excel para análisis posteriores.',
    estado: 'rechazada', motivoRechazo: 'No está dentro del alcance acordado con el cliente para esta fase.', fecha: '2026-04-05',
  },
]

// ─── Provider ──────────────────────────────────────────────────────
export function BoletasProvider({ children }) {
  const [subtareas, setSubtareas] = useState(subtareasIniciales)
  const [boletas, setBoletas] = useState(boletasIniciales)
  const [solicitudesIncremento, setSolicitudesIncremento] = useState(solicitudesIncrementoIniciales)
  const [solicitudesNuevaTarea, setSolicitudesNuevaTarea] = useState(solicitudesNuevaTareaIniciales)

  const agregarBoleta = (boleta) => {
    setBoletas(prev => [...prev, { ...boleta, id: Date.now() }])
    if (boleta.estado === 'registrada' && boleta.subtareaId) {
      setSubtareas(prev => prev.map(s =>
        s.id === boleta.subtareaId ? { ...s, real: s.real + boleta.horas } : s
      ))
    }
  }

  const finalizarSubtarea = (subtareaId) => {
    setSubtareas(prev => prev.map(s =>
      s.id === subtareaId ? { ...s, estado: 'finalizada' } : s
    ))
  }

  // datos = { subtareaId, subtareaNombre, os, recurso, horasAdicionales, causa, justificacion, boletaForm }
  const agregarSolicitudIncremento = (datos) => {
    const horas = calcHoras(datos.boletaForm.horaInicio, datos.boletaForm.horaFin)
    const borradorId = Date.now()
    const borrador = {
      id: borradorId, subtareaId: datos.subtareaId, subtarea: datos.subtareaNombre,
      orden: datos.os, ...datos.boletaForm, horas, estado: 'borrador',
    }
    setBoletas(prev => [...prev, borrador])

    const nueva = {
      id: borradorId + 1,
      subtareaId: datos.subtareaId, subtareaNombre: datos.subtareaNombre,
      os: datos.os, recurso: datos.recurso,
      horasAdicionales: Number(datos.horasAdicionales),
      causa: datos.causa, justificacion: datos.justificacion,
      boletaData: { ...datos.boletaForm, horas },
      estado: 'pendiente', motivoRechazo: '', borradorId,
      fecha: new Date().toISOString().slice(0, 10),
    }
    setSolicitudesIncremento(prev => [...prev, nueva])
  }

  const aprobarIncremento = (id) => {
    const sol = solicitudesIncremento.find(s => s.id === id)
    if (!sol) return
    setSolicitudesIncremento(prev => prev.map(s => s.id === id ? { ...s, estado: 'aprobada' } : s))
    if (sol.borradorId) {
      setBoletas(prev => prev.map(b => b.id === sol.borradorId ? { ...b, estado: 'registrada' } : b))
      const boleta = boletas.find(b => b.id === sol.borradorId)
      if (boleta) {
        setSubtareas(prev => prev.map(s =>
          s.id === sol.subtareaId
            ? { ...s, real: s.real + boleta.horas, estimado: s.estimado + sol.horasAdicionales }
            : s
        ))
      }
    } else {
      setSubtareas(prev => prev.map(s =>
        s.id === sol.subtareaId ? { ...s, estimado: s.estimado + sol.horasAdicionales } : s
      ))
    }
  }

  const rechazarIncremento = (id, motivo) => {
    setSolicitudesIncremento(prev => prev.map(s => s.id === id ? { ...s, estado: 'rechazada', motivoRechazo: motivo } : s))
  }

  const agregarSolicitudNuevaTarea = (solicitud) => {
    const nueva = { ...solicitud, id: Date.now(), estado: 'pendiente', motivoRechazo: '', fecha: new Date().toISOString().slice(0, 10) }
    setSolicitudesNuevaTarea(prev => [...prev, nueva])
  }

  const aprobarNuevaTarea = (id, datosEditados) => {
    const sol = solicitudesNuevaTarea.find(s => s.id === id)
    if (!sol) return
    const datos = datosEditados || sol
    setSolicitudesNuevaTarea(prev => prev.map(s => s.id === id ? { ...s, ...datos, estado: 'aprobada' } : s))
    const nuevaSub = {
      id: Date.now(),
      codigo: `SUB-${String(subtareas.length + 1).padStart(3, '0')}`,
      os: datos.os, osNombre: datos.osNombre || '',
      tarea: datos.paquete || datos.entregable || datos.fase || datos.nombre,
      nombre: datos.nombre,
      estimado: Number(datos.estimacion), real: 0,
      estado: 'pendiente', prioridad: 'media', esCobrable: true,
    }
    setSubtareas(prev => [...prev, nuevaSub])
  }

  const rechazarNuevaTarea = (id, motivo) => {
    setSolicitudesNuevaTarea(prev => prev.map(s => s.id === id ? { ...s, estado: 'rechazada', motivoRechazo: motivo } : s))
  }

  return (
    <BoletasContext.Provider value={{
      subtareas, boletas, solicitudesIncremento, solicitudesNuevaTarea,
      agregarBoleta, finalizarSubtarea,
      agregarSolicitudIncremento, aprobarIncremento, rechazarIncremento,
      agregarSolicitudNuevaTarea, aprobarNuevaTarea, rechazarNuevaTarea,
    }}>
      {children}
    </BoletasContext.Provider>
  )
}
