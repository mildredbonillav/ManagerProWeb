import { createContext, useContext, useState } from 'react'

// ── Datos simulados iniciales ────────────────────────────────────────────────

const solicitudesIniciales = [
  {
    id: 1,
    codigo: 'SS-001',
    clienteId: 1,
    clienteNombre: 'Empresa ABC S.A.',
    contactoNombre: 'Juan Pérez',
    productoId: 1,
    productoNombre: 'ManagerPro',
    modulo: 'Administración',
    submodulo: 'Usuarios',
    accion: 'Ver listado',
    descripcion:
      'Al intentar acceder al listado de usuarios, el sistema muestra un error 500 de forma intermitente. El problema comenzó ayer luego de la actualización realizada por el equipo técnico.',
    motivo: 'Incidencia',
    evidencias: ['captura_error_500.png', 'log_navegador.txt'],
    estado: 'En revisión',
    fechaRegistro: '2026-04-10',
    responsable: 'Sofía Barboza',
    ordenServicioCodigo: null,
    comentarioAdmin:
      'Se está investigando el problema en el servicio de autenticación. Se estima resolución en 48h.',
  },
  {
    id: 2,
    codigo: 'SS-002',
    clienteId: 1,
    clienteNombre: 'Empresa ABC S.A.',
    contactoNombre: 'María González',
    productoId: 1,
    productoNombre: 'ManagerPro',
    modulo: 'Operaciones',
    submodulo: 'Órdenes',
    accion: 'Crear orden',
    descripcion:
      'Se requiere que al momento de crear una orden sea posible adjuntar documentos PDF directamente desde el formulario de creación, sin necesidad de ir a otro módulo.',
    motivo: 'Requerimiento',
    evidencias: [],
    estado: 'Pendiente',
    fechaRegistro: '2026-04-12',
    responsable: null,
    ordenServicioCodigo: null,
    comentarioAdmin: '',
  },
  {
    id: 3,
    codigo: 'SS-003',
    clienteId: 2,
    clienteNombre: 'Tech Solutions CR',
    contactoNombre: 'Carlos Vargas',
    productoId: 2,
    productoNombre: 'BillingApp',
    modulo: 'Facturación',
    submodulo: 'Facturas',
    accion: 'Emitir factura',
    descripcion:
      'El sistema genera un error de validación al emitir facturas con más de 10 líneas de detalle. Afecta directamente a clientes mayoristas con facturas extensas.',
    motivo: 'Incidencia',
    evidencias: ['screenshot_error_validacion.png'],
    estado: 'Convertida',
    fechaRegistro: '2026-04-05',
    responsable: 'Armando Núñez',
    ordenServicioCodigo: 'OS-008',
    comentarioAdmin:
      'Se generó la OS-008 para corrección urgente en el módulo de facturación.',
  },
  {
    id: 4,
    codigo: 'SS-004',
    clienteId: 1,
    clienteNombre: 'Empresa ABC S.A.',
    contactoNombre: 'Juan Pérez',
    productoId: 1,
    productoNombre: 'ManagerPro',
    modulo: 'Dashboard',
    submodulo: 'Principal',
    accion: 'Ver resumen',
    descripcion:
      '¿Es posible incluir en el dashboard el resumen total de horas trabajadas del mes? Sería muy útil para los gerentes de área.',
    motivo: 'Consulta',
    evidencias: [],
    estado: 'Resuelta',
    fechaRegistro: '2026-03-28',
    responsable: 'Mildred Bonilla',
    ordenServicioCodigo: null,
    comentarioAdmin:
      'La funcionalidad ya existe en el módulo de reportes. Se envió documentación de uso al cliente.',
  },
  {
    id: 5,
    codigo: 'SS-005',
    clienteId: 3,
    clienteNombre: 'Consultoría Digital Ltda.',
    contactoNombre: 'Andrea Solano',
    productoId: 1,
    productoNombre: 'ManagerPro',
    modulo: 'Administración',
    submodulo: 'Roles',
    accion: 'Asignar permisos',
    descripcion:
      'Al intentar guardar una nueva configuración de permisos para el rol "Supervisor", el sistema no guarda los cambios y regresa a la pantalla anterior sin mensaje de error.',
    motivo: 'Incidencia',
    evidencias: ['grabacion_pantalla.mp4'],
    estado: 'Pendiente',
    fechaRegistro: '2026-04-17',
    responsable: null,
    ordenServicioCodigo: null,
    comentarioAdmin: '',
  },
]

// ── Contexto ─────────────────────────────────────────────────────────────────

const SoporteContext = createContext(null)

export function SoporteProvider({ children }) {
  const [solicitudes, setSolicitudes] = useState(solicitudesIniciales)

  const agregarSolicitud = (nuevaSolicitud) => {
    const siguiente = solicitudes.length + 1
    const codigo = `SS-${String(siguiente).padStart(3, '0')}`
    setSolicitudes((prev) => [
      ...prev,
      {
        ...nuevaSolicitud,
        id: Date.now(),
        codigo,
        estado: 'Pendiente',
        responsable: null,
        ordenServicioCodigo: null,
        comentarioAdmin: '',
        fechaRegistro: new Date().toISOString().split('T')[0],
      },
    ])
  }

  const actualizarSolicitud = (id, cambios) => {
    setSolicitudes((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...cambios } : s))
    )
  }

  return (
    <SoporteContext.Provider value={{ solicitudes, agregarSolicitud, actualizarSolicitud }}>
      {children}
    </SoporteContext.Provider>
  )
}

export function useSoporte() {
  return useContext(SoporteContext)
}
