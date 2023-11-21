using Application.DTO.CarServiceHistory;
using Application.Interfaces;
using Domain.Entities;
using Domain.Enum;
using Infrastructure.DBContext;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Repository
{
    public class CarServiceHistoryRepository : CarHistoryRepository<CarServiceHistory, CarServiceHistoryParameter>, ICarServiceHistoryRepository
    {
        protected ApplicationDBContext repositoryContext;
        public CarServiceHistoryRepository(ApplicationDBContext repositoryContext) : base(repositoryContext)
        {

        }

        public async Task<int?> GetLastCarOdometerByService(string carId, CarServiceType service)
        {
            return await FindByCondition(x => x.CarId == carId && x.Services.HasFlag(service), false)
                        .MaxAsync(x => x.Odometer);
        }

        public async Task<DateOnly?> GetLastDateServicedByService(string carId, CarServiceType service)
        {
            DateTime? lastServicedTime = await FindByCondition(x => x.CarId == carId && x.Services.HasFlag(service), false)
                        .MaxAsync(x => (DateTime?) x.ServiceTime);
            return lastServicedTime is null ? null :  DateOnly.FromDateTime(lastServicedTime.Value);
        }

        public override IQueryable<CarServiceHistory> Sort(IQueryable<CarServiceHistory> query, CarServiceHistoryParameter parameter)
        {
            return query.OrderByDescending(x => x.ReportDate);
        }
    }
}
