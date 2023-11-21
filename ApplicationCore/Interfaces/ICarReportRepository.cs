using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface ICarReportRepository : IBaseRepository<CarReport>
    {
        Task<CarReport> GetById(string carId, string userId, DateOnly date, bool trackChange);
        Task<IEnumerable<CarReport>> GetByUserId(string userId, bool trackChange);
    }
}
