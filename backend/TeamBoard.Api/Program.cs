using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using TeamBoard.Api.Data;
using TeamBoard.Api.Models;

var builder = WebApplication.CreateBuilder(args);

/// Database
builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseSqlite(builder.Configuration.GetConnectionString("Default") ?? "Data Source=teamboard.db"));

/// Identity + roller + API-endepunkter (/register, /login, ...)
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

/// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

/// CORS for Next.js dev server
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

// app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

/// Identity endpoints
app.MapIdentityApi<IdentityUser>();


/// Todo: Lag prosjekt endpoints her

/// Helse sjekk (åpen)
app.MapGet("/health", () => Results.Ok(new { status = "ok" }));

/// "Kven er eg" (krever auth)
app.MapGet("/me", (System.Security.Claims.ClaimsPrincipal user) =>
{
    return Results.Ok(new
    {
        name = user.Identity?.Name,
        isAuth = user.Identity?.IsAuthenticated
    });
}).RequireAuthorization();

app.Run();
