using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.EntityFrameworkCore;
using MyTestApi.Data;
using MyTestApi.Mappings;
using MyTestApi.Repositories.Implementations;
using MyTestApi.Repositories.Interfaces;
using MyTestApi.Services.Implementations;
using MyTestApi.Services.Interfaces;
using MyTestApi.Middleware;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Serilog;

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .WriteTo.File("logs/log-.txt", rollingInterval:
RollingInterval.Day)
    .Enrich.FromLogContext()
    .MinimumLevel.Debug()
    .CreateLogger();

var builder = WebApplication.CreateBuilder(args);
var key = builder.Configuration["Jwt:Key"];
var issuer = builder.Configuration["Jwt:Issuer"];

// Serilog ayarlarını appsettings.json'dan oku
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .CreateLogger();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options => { options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidIssuer = issuer,
        ValidAudience = builder.Configuration["Jwt:Audience"],
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key!)),
        ClockSkew = TimeSpan.Zero
    };
});

// 1. Veritabanı Bağlantısı
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// 2. Servis ve Repository Kayıtları (Dependency Injection)
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IProductService, ProductService>();

// 3. Controller ve FluentValidation Yapılandırması
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
// Modern FluentValidation kullanımı (Hatalı 'incoming requests' kısmı silindi)
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddValidatorsFromAssemblyContaining<Program>();

// 4. Diğer Araçlar
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddAutoMapper(cfg => cfg.AddProfile<MappingProfile>()); 
builder.Services.AddHttpContextAccessor();
builder.Host.UseSerilog();

var app = builder.Build();

// 5. Middleware Pipeline - THE ORDER IS CRITICAL
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// 1. First, catch any errors in the entire pipeline
app.UseMiddleware<ExceptionMiddleware>();

// 2. Security and Routing
app.UseHttpsRedirection();

app.UseRouting(); // Optional but recommended if using specific routing features

// 3. AUTHENTICATION FIRST: This validates the JWT token
app.UseAuthentication();

// 4. AUTHORIZATION SECOND: This checks if the validated user has access
app.UseAuthorization();

// 5. Finalize the endpoints
app.MapControllers();
app.UseStaticFiles();

app.Run();