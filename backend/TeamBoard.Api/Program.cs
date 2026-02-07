using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using TeamBoard.Api.Data;
using TeamBoard.Api.Models;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;


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

app.MapGet("/projects", async (ClaimsPrincipal user, AppDbContext db) =>
{
    var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
    if(string.IsNullOrWhiteSpace(userId))
    return Results.Unauthorized();

    var projects = await db.Projects.Where(p => p.OwnerUserId == userId)
    .OrderByDescending(p => p.CreatedAt)
    .ToListAsync();

    return Results.Ok(projects);
}).RequireAuthorization();

app.MapPost("/projects", async (ClaimsPrincipal user, AppDbContext db, ProjectCreateRequest req) =>
{
    var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
    if (string.IsNullOrWhiteSpace(userId))
    return Results.Unauthorized();

    if (string.IsNullOrWhiteSpace(req.Name))
    return Results.BadRequest("Vennligst skriv inn navn");

    var project = new Project
    {
        Name = req.Name.Trim(),
        OwnerUserId = userId
    };

    db.Projects.Add(project);
    await db.SaveChangesAsync();

    return Results.Created($"/projects/{project.Id}", project);
}).RequireAuthorization();

app.MapGet("/projects/{id:int}", async (int id, ClaimsPrincipal user, AppDbContext db) =>
{
    var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
    if (string.IsNullOrWhiteSpace(userId)) return Results.Unauthorized();

    var project = await db.Projects.FirstOrDefaultAsync(p => p.Id == id && p.OwnerUserId == userId);
    if (project is null) return Results.NotFound();

    return Results.Ok(project);
}).RequireAuthorization();

app.MapDelete("/projects/{id:int}", async (int id, ClaimsPrincipal user, AppDbContext db) =>
{
    var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
    if (string.IsNullOrWhiteSpace(userId))
    return Results.Unauthorized();

    var project = await db.Projects.FirstOrDefaultAsync(p => p.Id == id && p.OwnerUserId == userId);
    if (project is null) return Results.NotFound();

    db.Projects.Remove(project);
    await db.SaveChangesAsync();

    return Results.NoContent();
}).RequireAuthorization();


/// Helse sjekk (åpen)
app.MapGet("/health", () => Results.Ok(new { status = "ok" }));

/// "Kven er eg" (krever auth)
app.MapGet("/me", (ClaimsPrincipal user) =>
{
    return Results.Ok(new
    {
        name = user.Identity?.Name,
        isAuth = user.Identity?.IsAuthenticated
    });
}).RequireAuthorization();

app.Run();

record ProjectCreateRequest(string Name);