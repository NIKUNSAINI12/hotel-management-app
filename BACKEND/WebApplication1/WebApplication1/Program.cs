using WebApplication1.Interfaces;
using WebApplication1.Repositories;
using WebApplication1.Services;

var builder = WebApplication.CreateBuilder(args);

// Define a specific CORS policy name
var myAllowSpecificOrigins = "_myAllowSpecificOrigins";

// 1. Add services to the container.
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: myAllowSpecificOrigins,
                      policy =>
                      {
                          policy.WithOrigins("http://localhost:4200") // Angular app's origin
                                .AllowAnyHeader()
                                .AllowAnyMethod();
                      });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 2. Register your repository services (AddScoped is generally preferred over AddSingleton for repositories)
builder.Services.AddScoped<IBookingRepository, BookingRepository>();
builder.Services.AddScoped<IRoomRepository, RoomRepository>();
builder.Services.AddScoped<IMailService, MailService>();


var app = builder.Build();

// 3. Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// 4. Use the CORS policy - this must go after UseRouting (which is done implicitly) and before UseAuthorization
app.UseCors(myAllowSpecificOrigins);

app.UseAuthorization();

app.MapControllers();

app.Run();