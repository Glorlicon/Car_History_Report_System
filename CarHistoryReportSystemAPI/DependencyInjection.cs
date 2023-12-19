using Application.Interfaces;
using CarHistoryReportSystemAPI.Middlewares;
using CarHistoryReportSystemAPI.Services;
using CarHistoryReportSystemAPI.Utility;
using Domain.Entities;
using Infrastructure.DBContext;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Localization;
using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;
using System.Globalization;
using System.Reflection;

namespace CarHistoryReportSystemAPI
{
    public static class DependencyInjection
    {
        public static void ConfigureSwagger(this IServiceCollection services)
        {
            services.AddDateOnlyTimeOnlyStringConverters();
            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen(options =>
            {
                options.UseDateOnlyTimeOnlyStringConverters();
                /*options.MapType<DateOnly>(() => new OpenApiSchema
                {
                    Type = "string",
                    Format = "date",
                    Example = new OpenApiString("2022-01-01")
                });
                */
                options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    In = ParameterLocation.Header,
                    Description = "Place to add JWT with Bearer",
                    Name = "Authorization",
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer"
                });
                options.AddSecurityRequirement(new OpenApiSecurityRequirement()
                {
                    {
                        new OpenApiSecurityScheme
                        {

                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            },
                            Name = "Bearer"
                        },
                        new List<string>()
                    },
                });
                var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));
            });
        }

        public static void ConfigureCustomServices(this IServiceCollection services)
        {
            services.AddHttpContextAccessor();
            services.AddScoped<ICurrentUserServices, CurrentUserServices>();
            services.AddTransient<ExceptionHandlingMiddleware>();
        }

        public static void AddCustomCsvFormatter(this IMvcBuilder builder)
        {
            builder.AddMvcOptions(config => config.OutputFormatters.Add(new CsvOutputFormatter()));
        }

        public static void ConfigureLocaliazation(this IServiceCollection services)
        {
            services.AddLocalization(options => options.ResourcesPath = "");
            const string defaultCulture = "en-US";
            var supportedCultures = new[]
            {
                new CultureInfo(defaultCulture),
                new CultureInfo("vi-VN")
            };
            services.Configure<RequestLocalizationOptions>(options => {
                options.DefaultRequestCulture = new RequestCulture("vi-VN");
                options.SupportedCultures = supportedCultures;
                options.SupportedUICultures = supportedCultures;
                options.ApplyCurrentCultureToResponseHeaders = true;
            });
        }

    }
}
