using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using TeamBoard.Api.Data;

var builder = WebApplication.CreateBuilder(args);

// DB
builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseSqlite(builder.Configuration.GetConnectionString("Default") ?? "Data Source=teamboard.db"));

// Identity + roller + API-endepunkter (/register, /login, ...)
builder.Services.AddIdentityCore<IdentityUser>(opt =>
{
    opt.User.RequireUniqueEmail = true;
})
.AddRoles<IdentityRole>()
.AddEntityFrameworkStores<AppDbContext>()
.AddApiEndpoints();

builder.Services.AddAuthentication()
    .AddBearerToken(IdentityConstants.BearerScheme);

builder.Services.AddAuthorization();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS for Next.js dev server
builder.Services.AddCors(opt =>
{
    opt.AddPolicy("frontend", p =>
        p.WithOrigins("http://localhost:3000")
         .AllowAnyHeader()
         .AllowAnyMethod());
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("frontend");

// Ikke bruk HTTPS redirect nå (du kjører http://localhost:5018)
// app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

// Identity endpoints
app.MapIdentityApi<IdentityUser>();

// Helse-sjekk (åpen)
app.MapGet("/health", () => Results.Ok(new { status = "ok" }));

// "Hvem er jeg" (krever auth)
app.MapGet("/me", (System.Security.Claims.ClaimsPrincipal user) =>
{
    return Results.Ok(new
    {
        name = user.Identity?.Name,
        isAuth = user.Identity?.IsAuthenticated
    });
}).RequireAuthorization();

app.Run();
