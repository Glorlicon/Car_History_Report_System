using Application.DomainServices;
using Application.Interfaces;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            services.AddAutoMapper(Assembly.GetExecutingAssembly());
            services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());
            services.AddScoped<IAuthenticationServices, AuthenticationServices>();
            services.AddScoped<ICarSpecificationService, CarSpecificationServices>();
            services.AddScoped<IDataProviderService, DataProviderService>();
            services.AddScoped<ICarServices, CarServices>();
            return services;
        }
    }
}
