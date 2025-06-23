using FinTrack.Server.Mapping;
using Microsoft.EntityFrameworkCore;
using FinTrack.Server.Models;
using FinTrack.Server.Repositories;
using FinTrack.Server.Repositories.Implement;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication.Cookies;
using FinTrack.Server.Middleware;
using System.Text;
using FinTrack.Server.Services;


// using var context = new FinTrackDbContext();

// var seeder = new UserSeeder(context);
// seeder.InsertUser();

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.


builder.Services.AddDbContext<FinTrackDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("FinTrack"), sqlOptions =>
    {
        sqlOptions.EnableRetryOnFailure();
    }));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigins", builder =>
    {
        builder.WithOrigins(
                "https://localhost:3000", 
                "https://fintrack.netlify.app",
                "http://localhost:5131",  // Add HTTP localhost
                "https://localhost:5173", // Add client dev server
                "http://localhost:5173"   // Add HTTP version too
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});


builder.Services.AddScoped<IBudgetRepository, SQLBudgetRepository>();
builder.Services.AddScoped<IBudgetUsageRepository, SQLBudgetUsageRepository>();
builder.Services.AddScoped<ICategoryRepository, SQLCategoryRepository>();
builder.Services.AddScoped<IGoalRepository, SQLGoalRepository>();
builder.Services.AddScoped<IGoalProgressRepository, SQLGoalProgressRepository>();
builder.Services.AddScoped<IReportRepository, SQLReportRepository>();
builder.Services.AddScoped<ITransactionRepository, SQLTransactionRepository>();
builder.Services.AddScoped<IUserRepository, SQLUserRepository>();
builder.Services.AddScoped<ITokenService, TokenService>();


builder.Services.AddScoped(typeof(IFinTrackRepository<>), typeof(FinTrackRepository<>));
builder.Services.AddHttpClient();  

builder.Services.AddAutoMapper(typeof(AutoMapperProfile));

builder.Services.AddMemoryCache();

// Add JWT configuration
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddCookie(options =>
{
    options.Cookie.HttpOnly = true; 
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always; 
    options.Cookie.SameSite = SameSiteMode.None; 
    options.Cookie.IsEssential = true; 
    options.LoginPath = "/api/auth/login"; 
    options.LogoutPath = "/api/auth/logout";
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"] ?? "FinTrack",
        ValidAudience = builder.Configuration["Jwt:Audience"] ?? "FinTrackUsers",
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? "FinTrackDefaultSecretKey12345678901234567890"))
    };
});

builder.Services.AddScoped<ReportGenerationService>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddAutoMapper(typeof(AutoMapperProfile));

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseDefaultFiles();
    app.UseStaticFiles();
}




// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowSpecificOrigins");

app.UseHttpsRedirection();


app.UseMiddleware<FinTrack.Server.Middleware.AuthMiddleware>();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
