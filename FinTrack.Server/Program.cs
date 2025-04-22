using HealthBuddy.Server.Mapping;
using Microsoft.EntityFrameworkCore;
using FinTrack.Server.Models;
using FinTrack.Server.Repositories;
using FinTrack.Server.Repositories.Implement;

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
        builder.WithOrigins("https://localhost:3000", "https://fintrack.netlify.app") // Cho phép cả hai domain
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



builder.Services.AddScoped(typeof(IFinTrackRepository<>), typeof(FinTrackRepository<>));
builder.Services.AddHttpClient();  // Đăng ký IHttpClientFactory

builder.Services.AddAutoMapper(typeof(AutoMapperProfile));

builder.Services.AddMemoryCache();


builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowSpecificOrigins");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
