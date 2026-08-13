using System.Net;
using System.Text.Json;
using AssignmentSystem.Helpers;

namespace AssignmentSystem.Middleware
{
    public class GlobalExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<GlobalExceptionMiddleware> _logger;
        private readonly IWebHostEnvironment _environment;

        public GlobalExceptionMiddleware(
            RequestDelegate next,
            ILogger<GlobalExceptionMiddleware> logger,
            IWebHostEnvironment environment)
        {
            _next = next;
            _logger = logger;
            _environment = environment;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message);

                await HandleExceptionAsync(context, ex);
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception ex)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

            var response = new ApiResponse<object>
            {
                Success = false,
                StatusCode = StatusCodes.Status500InternalServerError,
                Message = "An unexpected error occurred.",

                Errors = _environment.IsDevelopment()
                    ? new List<string>
                    {
                        ex.Message,
                        ex.InnerException?.Message ?? "No Inner Exception"
                    }
                    : new List<string> { "Internal Server Error" }
            };

            var result = new
            {
                response.Success,
                response.StatusCode,
                response.Message,
                response.Data,
                response.Errors,
                Timestamp = DateTime.UtcNow,
                Path = context.Request.Path,
                TraceId = context.TraceIdentifier
            };

            await context.Response.WriteAsync(JsonSerializer.Serialize(result));
        }
    }
}