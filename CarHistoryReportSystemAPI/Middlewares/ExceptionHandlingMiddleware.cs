using Application.Common.Models;
using Application.Interfaces;
using CarHistoryReportSystemAPI.Resources;
using Domain.Exceptions;
using Microsoft.Extensions.Localization;
using System.Text.Json;

namespace CarHistoryReportSystemAPI.Middlewares
{
    internal sealed class ExceptionHandlingMiddleware : IMiddleware
    {
        private readonly ILogger<ExceptionHandlingMiddleware> _logger;
        private ILoggerService _loggerService;
        private readonly IStringLocalizer<SharedResources> _sharedLocalizer;
        public ExceptionHandlingMiddleware(ILogger<ExceptionHandlingMiddleware> logger, ILoggerService loggerService, IStringLocalizer<SharedResources> sharedLocalizer)
        {
            _logger = logger;
            _loggerService = loggerService;
            _sharedLocalizer = sharedLocalizer;
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
                var list = _sharedLocalizer.GetAllStrings();
                /*foreach (var er in list)
                {
                    _logger.LogError(er.Name);
                    _logger.LogError(er.Value);
                }
                */
                _loggerService.LogError(e.Message);
                await HandleExceptionAsync(context, e, _sharedLocalizer[e.Message]);
            }
        }
        private static async Task HandleExceptionAsync(HttpContext httpContext, Exception exception, string localizedMessage)
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
                error = new List<string> { localizedMessage }
            };
            await httpContext.Response.WriteAsync(JsonSerializer.Serialize(response));
        }
    }
}
