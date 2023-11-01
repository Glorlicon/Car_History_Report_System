using Application.DomainServices;
using Application.DTO.CarServiceHistory;
using Application.Interfaces;
using Domain.Entities;
using Infrastructure.Configurations.EmailService;
using Infrastructure.DBContext;
using Infrastructure.InfrastructureServices;
using Infrastructure.Repository;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<ApplicationDBContext>(
                options => options.UseSqlServer(
                    configuration.GetConnectionString("DefaultConnection"),
                    b => {
                        b.MigrationsAssembly(typeof(ApplicationDBContext).Assembly.FullName);
                        b.UseDateOnlyTimeOnly();
                    }
                )
            );
            services.ConfigureIdentity();
            services.ConfigureJWT(configuration);
            services.ConfigureEmailService(configuration);
            services.AddScoped<IIdentityServices, IdentityServices>();
            services.AddScoped<ICarSpecificationRepository, CarSpecificationRepository>();
            services.AddScoped<IUserRepository, UserRepository>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IDataProviderRepository, DataProviderRepository>();
            services.AddScoped<ICarRepository, CarRepository>();
            services.AddScoped<ICarSalesInfoRepository, CarSalesInfoRepository>();
            services.AddScoped<ICarPartRepository, CarPartRepository>();
            services.AddScoped<ICarOwnerHistoryRepository, CarOwnerHistoryRepository>();
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddScoped<IRequestRepository, RequestRepository>();
            services.AddScoped<IRequestServices, RequestServices>();
            services.AddScoped<ICarMaintainanceRepository, CarMaintainanceRepository>();
            services.AddScoped<ICarRecallRepository, CarRecallRepository>();
            services.AddScoped<ICarRecallStatusRepository, CarRecallStatusRepository>();
            services.ConfigureCarHistoryRepository();
            services.AddScoped<IOrderRepository, OrderRepository>();
            services.AddScoped<IOrderOptionRepository, OrderOptionRepository>();
            services.AddScoped<ICsvServices, CsvServices>();
            services.AddScoped<IPaymentServices, VnpayPaymentServices>();
            services.AddScoped<ICarReportRepository, CarReportRepository>();
            return services;
        }

        public static void ConfigureIdentity(this IServiceCollection services)
        {
            var builder = services.AddIdentityCore<User>(o =>
            {
                o.Password.RequireDigit = true;
                o.Password.RequireNonAlphanumeric = true;
                o.Password.RequireLowercase = true;
                o.Password.RequireUppercase = true;
                o.Password.RequiredLength = 8;
                o.User.RequireUniqueEmail = true;
                o.SignIn.RequireConfirmedEmail = true;
                o.Lockout.AllowedForNewUsers = false;
            });

            builder = new IdentityBuilder(builder.UserType, typeof(IdentityRole), builder.Services);
            builder.AddEntityFrameworkStores<ApplicationDBContext>().AddDefaultTokenProviders();
        }

        public static void ConfigureCarHistoryRepository(this IServiceCollection services)
        {
            services.AddScoped<ICarHistoryRepository<CarServiceHistory, CarServiceHistoryParameter>, CarServiceHistoryRepository>();
        }

        public static void ConfigureJWT(this IServiceCollection services, IConfiguration configuration)
        {
            var jwtSettings = configuration.GetSection("JwtSettings");
            var secretKey = Environment.GetEnvironmentVariable("CAR_HISTORY_API_SECRET");
            services.AddAuthentication(opt => {
                opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = jwtSettings.GetSection("validIssuer").Value,
                    ValidAudience = jwtSettings.GetSection("validAudience").Value,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
                };
            });
        }

        public static void ConfigureEmailService(this IServiceCollection services, IConfiguration configuration)
        {
            var emailConfig = configuration
                .GetSection("EmailConfiguration")
                .Get<EmailConfiguration>();
            services.AddSingleton(emailConfig);
            services.AddScoped<IEmailServices, EmailServices>();
        }

    }
}
