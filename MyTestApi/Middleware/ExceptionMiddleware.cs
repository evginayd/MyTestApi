using System.Net;
using System.Text.Json;

namespace MyTestApi.Middleware 
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;

        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unhandled exception occurred.");

                context.Response.ContentType = "application/json";
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

                // Define the response object
                var response = new
                {
                    StatusCode = context.Response.StatusCode,
                    Message = "Internal Server Error",
                    Error = ex.Message
                };

                var options = new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                };

                // Serialize and write directly inside the catch block
                await context.Response.WriteAsync(JsonSerializer.Serialize(response, options));
            }
        }
    }
}
