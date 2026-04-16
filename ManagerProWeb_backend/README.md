# ManagerProWeb — Backend (Web API)

API REST en ASP.NET Core 9. No sirve vistas ni HTML — toda la interfaz vive en el frontend React.

## Estructura

```
ManagerProWeb_backend/
├── Controllers/
│   └── InfoController.cs      # Agrega tus controladores aquí
├── Models/
│   └── TDataAccess.cs         # Clase de acceso a SQL Server
├── Properties/
│   └── launchSettings.json
├── appsettings.json            # Cadena de conexión a la BD
├── appsettings.Development.json
├── ManagerProWeb.csproj
└── Program.cs
```

## Cómo correr

### Backend
```bash
dotnet run
```
Abre automáticamente en: http://localhost:5019/swagger

Swagger te permite probar todos los endpoints sin necesitar el frontend.

### Frontend (en otra terminal)
```bash
cd ../manager-pro_frontend
npm install        # solo la primera vez
npm run dev
```
Abre en: http://localhost:5173

## Agregar un nuevo endpoint

Creá un archivo en `Controllers/`, por ejemplo `ProductosController.cs`:

```csharp
using Microsoft.AspNetCore.Mvc;

namespace ManagerProWeb.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductosController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(new[] { "Producto A", "Producto B" });
        }
    }
}
```

Esto queda disponible en: `GET http://localhost:5019/api/productos`

## Cadena de conexión

Editá `appsettings.json` → `ConnectionStrings.Conexion` con tus datos de SQL Server.
Usala en un controlador así:

```csharp
private readonly string _connStr;

public MiController(IConfiguration config)
{
    _connStr = config.GetConnectionString("Conexion")!;
}
```
