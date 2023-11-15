using Application.Common.Models;
using Application.Interfaces;
using Domain.Exceptions;
using System.Text.Json;

namespace CarHistoryReportSystemAPI.Middlewares
{
    internal sealed class ExceptionHandlingMiddleware : IMiddleware
    {
        private readonly ILogger<ExceptionHandlingMiddleware> _logger;
        private ILoggerService _loggerService;
        public ExceptionHandlingMiddleware(ILogger<ExceptionHandlingMiddleware> logger, ILoggerService loggerService)
        {
            _logger = logger;
            _loggerService = loggerService;
        }
        public async Task InvokeAsync(HttpContext context, RequestDelegate next)
        {
            try
            {
                await next(context);
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);
                _loggerService.LogError(e.Message);
                await HandleExceptionAsync(context, e);
            }
        }
        private static async Task HandleExceptionAsync(HttpContext httpContext, Exception exception)
        {
            httpContext.Response.ContentType = "application/json";
            httpContext.Response.StatusCode = exception switch
            {
                BadRequestException => StatusCodes.Status400BadRequest,
                NotFoundException => StatusCodes.Status404NotFound,
                UnauthorizedException => StatusCodes.Status401Unauthorized,
                _ => StatusCodes.Status500InternalServerError
            };
            var response = new ErrorDetails
            {
                Error = new List<string> { exception.Message }
            };
            await httpContext.Response.WriteAsync(JsonSerializer.Serialize(response));
        }
    }
}
