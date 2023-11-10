using Application.DomainServices;
using Application.DTO.CarInspectionHistory;
using Application.DTO.CarServiceHistory;
using Application.Interfaces;
using Domain.Entities;
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
            services.AddScoped<ICarPartServices, CarPartServices>();
            services.AddScoped<ICarOwnerHistoryServices, CarOwnerHistoryServices>();
            services.AddScoped<IRequestServices, RequestServices>();
            services.AddScoped<ICarMaintainanceServices, CarMaintainanceServices>();
            services.AddScoped<ICarRecallServices, CarRecallServices>();
            services.ConfigureCarHistoryService();
            services.AddScoped<IOrderServices, OrderServices>();
            services.AddScoped<ICarReportServices, CarReportServices>();
            services.AddScoped<INotificationServices, NotificationServices>();
            return services;
        }

        public static void ConfigureCarHistoryService(this IServiceCollection services)
        {
            services.AddScoped<ICarHistoryServices<CarServiceHistoryResponseDTO,
                                             CarServiceHistoryParameter,
                                             CarServiceHistoryCreateRequestDTO,
                                             CarServiceHistoryUpdateRequestDTO>,
                               CarHistoryServices<CarServiceHistory,
                                             CarServiceHistoryResponseDTO,
                                             CarServiceHistoryParameter,
                                             CarServiceHistoryCreateRequestDTO,
                                             CarServiceHistoryUpdateRequestDTO>>();
            services.AddScoped<ICarHistoryServices<CarInspectionHistoryResponseDTO,
                                             CarInspectionHistoryParameter,
                                             CarInspectionHistoryCreateRequestDTO,
                                             CarInspectionHistoryUpdateRequestDTO>,
                               CarHistoryServices<CarInspectionHistory,
                                             CarInspectionHistoryResponseDTO,
                                             CarInspectionHistoryParameter,
                                             CarInspectionHistoryCreateRequestDTO,
                                             CarInspectionHistoryUpdateRequestDTO>>();
        }
    }
}
