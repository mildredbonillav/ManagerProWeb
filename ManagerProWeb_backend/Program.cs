var builder = WebApplication.CreateBuilder(args);

// Solo API, sin vistas MVC
builder.Services.AddControllers();

// CORS: permitir el frontend React
var allowReactOrigins = "_allowReactDev";
builder.Services.AddCors(options =>
    options.AddPolicy(name: allowReactOrigins, policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    }));

// Swagger para probar la API sin necesitar el frontend
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseRouting();
app.UseCors(allowReactOrigins);
app.UseAuthorization();
app.MapControllers();

app.Run();
