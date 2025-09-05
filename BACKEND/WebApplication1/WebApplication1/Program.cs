using WebApplication1.Interfaces;
using WebApplication1.Repositories;
using WebApplication1.Services;

var builder = WebApplication.CreateBuilder(args);

// Define a policy name that will be used later.
var myAllowSpecificOrigins = "_myAllowSpecificOrigins";

// Add and configure the CORS services.
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: myAllowSpecificOrigins,
                      policy =>
                      {
                          // This is the list of frontend URLs that are allowed to make requests to this API.
                          // You must list every Vercel URL that you use.
                          policy.WithOrigins(
                                "https://hotel-management-app-git-main-nikunsaini12s-projects.vercel.app",
                                "https://hotel-management-2m5v322oj-nikunsaini12s-projects.vercel.app"
                               )
                                .AllowAnyHeader() // Allows any HTTP header in the request.
                                .AllowAnyMethod(); // Allows any HTTP method (GET, POST, PUT, DELETE, etc.).
                      });
});


builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Register your repository and service dependencies for the application.
builder.Services.AddScoped<IBookingRepository, BookingRepository>();
builder.Services.AddScoped<IRoomRepository, RoomRepository>();
builder.Services.AddScoped<IMailService, MailService>();


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Use the CORS policy. This must be placed after UseRouting (which is implicit) 
// and before UseAuthorization and MapControllers.
app.UseCors(myAllowSpecificOrigins);

app.UseAuthorization();

app.MapControllers();

app.Run();
