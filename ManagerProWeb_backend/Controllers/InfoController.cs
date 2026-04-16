using Microsoft.AspNetCore.Mvc;
using ManagerProWeb.Models;

namespace ManagerProWeb.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InfoController : ControllerBase
    {
        private readonly IConfiguration _config;

        public InfoController(IConfiguration config)
        {
            _config = config;
        }

        [HttpGet]
        public IActionResult Get()
        {
            var data = new
            {
                Application = "ManagerProWeb",
                Message = "API funcionando correctamente",
                TimestampUtc = DateTime.UtcNow,
                ExampleConfig = _config["Example:SomeKey"]
            };

            return Ok(data);
        }
    }
}
